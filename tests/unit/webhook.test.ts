import Stripe from "stripe";
import { beforeEach, describe, expect, it } from "vitest";
import { products } from "@/data/catalog";
import { getSoldCounts } from "@/lib/data/inventory";
import { createOrder, getOrder } from "@/lib/data/orders";
import { setStoreForTests } from "@/lib/store";
import { MemoryStore } from "@/lib/store/memory";
import { processStripeEvent } from "@/lib/stripe/webhook";

const stripe = new Stripe("sk_test_dummy");
const SECRET = "whsec_test_secret";
const product = products[3]; // Vellivo Eye Smart – alwaysInStock

let orderId: string;
let store: MemoryStore;

function sessionEvent(id: string, type: string, session: Partial<Stripe.Checkout.Session> = {}): Stripe.Event {
  return {
    id,
    type,
    livemode: false,
    object: "event",
    data: {
      object: {
        id: "cs_test_1",
        object: "checkout.session",
        amount_total: 34800,
        currency: "dkk",
        payment_status: "paid",
        payment_intent: "pi_1",
        livemode: false,
        metadata: { order_id: orderId },
        client_reference_id: orderId,
        customer_details: { email: "kunde@example.dk", name: "Test Kunde", phone: null, address: null },
        collected_information: null,
        ...session,
      },
    },
  } as unknown as Stripe.Event;
}

beforeEach(async () => {
  store = new MemoryStore();
  setStoreForTests(store);
  const order = await createOrder({
    lines: [{ productId: product.id, slug: product.slug, sku: product.sku, name: product.name, quantity: 2, unitPriceOre: 14950, lineTotalOre: 29900, campaignId: null }],
    subtotalOre: 29900,
    shippingOre: 4900,
    totalOre: 34800,
    vatOre: 6960,
  });
  orderId = order.id;
});

const status = async () => (await getOrder(orderId))!.order.status;
const sold = async () => (await getSoldCounts([product.id])).get(product.id);

describe("Stripe webhook-signatur", () => {
  it("accepterer en korrekt signeret payload", async () => {
    const payload = JSON.stringify({ id: "evt_sig", object: "event", type: "checkout.session.completed", data: { object: {} } });
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret: SECRET });
    const event = await stripe.webhooks.constructEventAsync(payload, header, SECRET);
    expect(event.id).toBe("evt_sig");
  });

  it("afviser forkert hemmelighed og manipuleret payload", async () => {
    const payload = JSON.stringify({ id: "evt_sig", object: "event" });
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret: SECRET });
    await expect(stripe.webhooks.constructEventAsync(payload, header, "whsec_forkert")).rejects.toThrow();
    await expect(stripe.webhooks.constructEventAsync(payload.replace("evt_sig", "evt_x"), header, SECRET)).rejects.toThrow();
  });
});

describe("processStripeEvent", () => {
  it("markerer ordren betalt og registrerer salget på lageret", async () => {
    expect(await processStripeEvent(sessionEvent("evt_1", "checkout.session.completed"))).toBe("paid");
    expect(await status()).toBe("paid");
    expect(await sold()).toBe(2);
    const order = (await getOrder(orderId))!.order;
    expect(order.customer?.email).toBe("kunde@example.dk");
    expect(order.paidAt).not.toBeNull();
  });

  it("markerer ikke lagerproblem for produkter uden lagerbegrænsning", async () => {
    await processStripeEvent(sessionEvent("evt_1", "checkout.session.completed"));
    const order = (await getOrder(orderId))!.order;
    expect(product.alwaysInStock).toBe(true);
    expect(order.needsAttention).toBe(false);
  });

  it("er idempotent ved gentagne webhooks", async () => {
    const ev = sessionEvent("evt_1", "checkout.session.completed");
    await processStripeEvent(ev);
    expect(await processStripeEvent(ev)).toBe("duplicate");
    expect(await processStripeEvent(sessionEvent("evt_2", "checkout.session.async_payment_succeeded"))).toBe("already_paid");
    expect(await sold()).toBe(2);
  });

  it("markerer ikke betalt ved asynkron betaling, der endnu ikke er gennemført", async () => {
    expect(await processStripeEvent(sessionEvent("evt_3", "checkout.session.completed", { payment_status: "unpaid" }))).toBe("processing");
    expect(await status()).toBe("processing");
    expect(await sold()).toBe(0);
  });

  it("håndterer mislykket asynkron betaling", async () => {
    await processStripeEvent(sessionEvent("evt_3", "checkout.session.completed", { payment_status: "unpaid" }));
    expect(await processStripeEvent(sessionEvent("evt_4", "checkout.session.async_payment_failed"))).toBe("failed");
    expect(await status()).toBe("failed");
  });

  it("markerer udløbne/annullerede sessioner", async () => {
    expect(await processStripeEvent(sessionEvent("evt_5", "checkout.session.expired", { payment_status: "unpaid" }))).toBe("expired");
    expect(await status()).toBe("expired");
  });

  it("sender ordren til manuel kontrol ved beløbsafvigelse og trækker ikke lager", async () => {
    expect(await processStripeEvent(sessionEvent("evt_6", "checkout.session.completed", { amount_total: 100 }))).toBe("amount_mismatch");
    expect(await status()).toBe("needs_review");
    expect(await sold()).toBe(0);
  });

  it("håndterer ukendte ordrer og irrelevante hændelser", async () => {
    orderId = "20991231t000000-deadbeef";
    expect(await processStripeEvent(sessionEvent("evt_7", "checkout.session.completed"))).toBe("order_not_found");
    expect(await processStripeEvent({ id: "evt_8", type: "customer.created", data: { object: {} } } as unknown as Stripe.Event)).toBe("ignored");
  });
});
