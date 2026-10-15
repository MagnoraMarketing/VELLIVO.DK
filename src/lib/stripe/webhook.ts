import "server-only";
import type Stripe from "stripe";
import { markOrderPaid, OrderNotFoundError, setStatus, updateOrder, type Order } from "@/lib/data/orders";
import { getStore, StoreConflictError } from "@/lib/store";

export const HANDLED_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
]);

export type WebhookOutcome =
  | "ignored"
  | "duplicate"
  | "paid"
  | "already_paid"
  | "amount_mismatch"
  | "processing"
  | "failed"
  | "expired"
  | "order_not_found";

function customerFrom(session: Stripe.Checkout.Session): Order["customer"] {
  const shipping = session.collected_information?.shipping_details;
  const addr = shipping?.address ?? session.customer_details?.address ?? null;
  return {
    email: session.customer_details?.email ?? null,
    name: shipping?.name ?? session.customer_details?.name ?? null,
    phone: session.customer_details?.phone ?? null,
    address: addr
      ? { line1: addr.line1 ?? null, line2: addr.line2 ?? null, postal_code: addr.postal_code ?? null, city: addr.city ?? null, country: addr.country ?? null }
      : null,
  };
}

const eventPath = (id: string) => `stripe-events/${id.toLowerCase().replace(/[^a-z0-9_]/g, "")}.json`;

/**
 * Behandler en signatur-verificeret Stripe-hændelse idempotent:
 * 1) allerede behandlede hændelser (registreret i stripe-events/) springes over,
 * 2) ordren opdateres med idempotente operationer (markOrderPaid m.fl.),
 * 3) hændelsen registreres som behandlet til sidst – fejler noget undervejs,
 *    svarer vi 500, og Stripe forsøger igen.
 */
export async function processStripeEvent(event: Stripe.Event): Promise<WebhookOutcome> {
  if (!HANDLED_EVENTS.has(event.type)) return "ignored";
  const store = getStore();
  if (await store.getJson(eventPath(event.id))) return "duplicate";

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.order_id ?? session.client_reference_id ?? null;
  const outcome = orderId ? await applyEvent(event.type, session, orderId) : "order_not_found";

  try {
    await store.putJson(
      eventPath(event.id),
      { id: event.id, type: event.type, orderId, outcome, livemode: event.livemode, processedAt: new Date().toISOString() },
      { onlyIfNew: true },
    );
  } catch (err) {
    if (!(err instanceof StoreConflictError)) throw err;
  }
  return outcome;
}

async function applyEvent(type: string, session: Stripe.Checkout.Session, orderId: string): Promise<WebhookOutcome> {
  const markPaid = async (): Promise<WebhookOutcome> => {
    const res = await markOrderPaid(orderId, {
      sessionId: session.id,
      paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null),
      amountTotal: session.amount_total,
      currency: session.currency,
      livemode: session.livemode,
      customer: customerFrom(session),
    });
    return res === "not_found" ? "order_not_found" : res;
  };

  try {
    switch (type) {
      case "checkout.session.completed":
        if (session.payment_status === "paid" || session.payment_status === "no_payment_required") return markPaid();
        // Asynkron betalingsmetode – afvent async_payment_succeeded/failed.
        return updateOrder<WebhookOutcome>(orderId, (o) => {
          if (o.status !== "pending") return { order: null, result: "processing" };
          o.stripeSessionId = session.id;
          o.customer = customerFrom(session);
          return { order: setStatus(o, "processing"), result: "processing" };
        });
      case "checkout.session.async_payment_succeeded":
        return markPaid();
      case "checkout.session.async_payment_failed":
        return updateOrder<WebhookOutcome>(orderId, (o) =>
          o.status === "pending" || o.status === "processing"
            ? { order: setStatus(o, "failed", "Asynkron betaling mislykkedes"), result: "failed" }
            : { order: null, result: "failed" },
        );
      case "checkout.session.expired":
        return updateOrder<WebhookOutcome>(orderId, (o) =>
          o.status === "pending"
            ? { order: setStatus(o, "expired", "Checkout-session udløb eller blev annulleret"), result: "expired" }
            : { order: null, result: "expired" },
        );
      default:
        return "ignored";
    }
  } catch (err) {
    if (err instanceof OrderNotFoundError) return "order_not_found";
    throw err;
  }
}
