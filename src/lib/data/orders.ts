import "server-only";
import type { CartTotals } from "@/lib/pricing";
import { sortableId } from "@/lib/data/ids";
import { products as catalog } from "@/data/catalog";
import { applySale } from "@/lib/data/inventory";
import { getStore, StoreConflictError } from "@/lib/store";

export type OrderStatus =
  | "pending" // Checkout-session oprettet, afventer betaling
  | "processing" // Asynkron betalingsmetode afventer bekræftelse
  | "paid" // Betaling bekræftet via verificeret Stripe-webhook
  | "failed"
  | "expired"
  | "cancelled"
  | "refunded"
  | "needs_review"; // Beløb stemmer ikke e.l.

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  unitPriceOre: number;
  quantity: number;
  lineTotalOre: number;
  campaignId: string | null;
}

export interface Address {
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
}

export interface Order {
  id: string;
  /** Kundevendt ordrenummer, fx VL-7K3F9Q. */
  number: string;
  status: OrderStatus;
  currency: "dkk";
  items: OrderItem[];
  subtotalOre: number;
  shippingOre: number;
  totalOre: number;
  vatOre: number;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  livemode: boolean | null;
  customer: { email: string | null; name: string | null; phone: string | null; address: Address | null } | null;
  termsAcceptedAt: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  needsAttention: boolean;
  attentionReason: string | null;
  adminNote: string | null;
  history: { at: string; status: OrderStatus; note?: string }[];
}

const path = (id: string) => `orders/${id}.json`;
const ORDER_ID = /^[0-9t]{15}-[0-9a-f]{8}$/;

export function isValidOrderId(id: string): boolean {
  return ORDER_ID.test(id);
}

function orderNumber(id: string): string {
  return `VL-${id.slice(-8).toUpperCase()}`;
}

export async function createOrder(totals: CartTotals, now = new Date()): Promise<Order> {
  const id = sortableId(now);
  const at = now.toISOString();
  const order: Order = {
    id,
    number: orderNumber(id),
    status: "pending",
    currency: "dkk",
    items: totals.lines.map((l) => ({
      productId: l.productId,
      productName: l.name,
      sku: l.sku,
      unitPriceOre: l.unitPriceOre,
      quantity: l.quantity,
      lineTotalOre: l.lineTotalOre,
      campaignId: l.campaignId,
    })),
    subtotalOre: totals.subtotalOre,
    shippingOre: totals.shippingOre,
    totalOre: totals.totalOre,
    vatOre: totals.vatOre,
    stripeSessionId: null,
    stripePaymentIntentId: null,
    livemode: null,
    customer: null,
    termsAcceptedAt: at,
    createdAt: at,
    updatedAt: at,
    paidAt: null,
    needsAttention: false,
    attentionReason: null,
    adminNote: null,
    history: [{ at, status: "pending" }],
  };
  await getStore().putJson(path(id), order, { onlyIfNew: true });
  return order;
}

export async function getOrder(id: string): Promise<{ order: Order; etag: string } | null> {
  if (!isValidOrderId(id)) return null;
  const doc = await getStore().getJson<Order>(path(id));
  return doc ? { order: doc.data, etag: doc.etag } : null;
}

export async function listOrders(limit = 200): Promise<Order[]> {
  const store = getStore();
  const paths = (await store.list("orders/")).filter((p) => p.endsWith(".json")).reverse().slice(0, limit);
  const docs = await Promise.all(paths.map((p) => store.getJson<Order>(p)));
  return docs.filter((d) => d !== null).map((d) => d.data);
}

/** Opdaterer en ordre med ETag-kontrol og genforsøg. `mutate` returnerer null for "ingen ændring". */
export async function updateOrder<T>(id: string, mutate: (o: Order) => { order: Order | null; result: T }): Promise<T> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const loaded = await getOrder(id);
    if (!loaded) throw new OrderNotFoundError(id);
    const { order, result } = mutate(structuredClone(loaded.order));
    if (!order) return result;
    order.updatedAt = new Date().toISOString();
    try {
      await getStore().putJson(path(id), order, { ifMatch: loaded.etag });
      return result;
    } catch (err) {
      if (!(err instanceof StoreConflictError)) throw err;
      await new Promise((r) => setTimeout(r, 40 * (attempt + 1)));
    }
  }
  throw new Error(`Ordre ${id} kunne ikke opdateres pga. samtidige ændringer`);
}

export class OrderNotFoundError extends Error {
  constructor(id: string) {
    super(`Ordre ${id} findes ikke`);
  }
}

export function setStatus(o: Order, status: OrderStatus, note?: string): Order {
  o.status = status;
  o.history = [...o.history, { at: new Date().toISOString(), status, ...(note ? { note } : {}) }];
  return o;
}

export interface PaymentConfirmation {
  sessionId: string;
  paymentIntentId: string | null;
  amountTotal: number | null;
  currency: string | null;
  livemode: boolean;
  customer: Order["customer"];
}

export type MarkPaidResult = "paid" | "already_paid" | "amount_mismatch" | "not_found";

/**
 * Markerer en ordre betalt – idempotent:
 * - beløb, valuta og session kontrolleres mod ordren,
 * - lageret trækkes pr. produkt præcis én gang (applySale er idempotent),
 * - ordren sættes til "paid" til sidst, så et afbrudt forløb kan genoptages af Stripes genforsøg.
 */
export async function markOrderPaid(orderId: string, p: PaymentConfirmation): Promise<MarkPaidResult> {
  const loaded = await getOrder(orderId);
  if (!loaded) return "not_found";
  const order = loaded.order;
  if (order.status === "paid") return "already_paid";

  const mismatch =
    p.amountTotal !== order.totalOre ||
    (p.currency ?? "").toLowerCase() !== "dkk" ||
    (order.stripeSessionId !== null && order.stripeSessionId !== p.sessionId);
  if (mismatch) {
    await updateOrder(orderId, (o) => {
      if (o.status === "needs_review") return { order: null, result: null };
      o.needsAttention = true;
      o.attentionReason = `Beløb/session stemmer ikke: forventet ${o.totalOre} øre, modtaget ${p.amountTotal} ${p.currency}`;
      o.customer = p.customer;
      return { order: setStatus(o, "needs_review"), result: null };
    });
    return "amount_mismatch";
  }

  const shortages: string[] = [];
  for (const item of order.items) {
    const received = catalog.find((c) => c.id === item.productId)?.stock ?? 0;
    const res = await applySale(item.productId, orderId, item.quantity, received);
    if (res === "insufficient") shortages.push(item.productName);
  }

  return updateOrder<MarkPaidResult>(orderId, (o) => {
    if (o.status === "paid") return { order: null, result: "already_paid" };
    o.stripeSessionId = p.sessionId;
    o.stripePaymentIntentId = p.paymentIntentId;
    o.livemode = p.livemode;
    o.customer = p.customer;
    o.paidAt = new Date().toISOString();
    if (shortages.length) {
      o.needsAttention = true;
      o.attentionReason = `Utilstrækkeligt lager ved betaling: ${shortages.join(", ")}`;
    }
    return { order: setStatus(o, "paid"), result: "paid" };
  });
}
