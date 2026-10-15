import { NextResponse } from "next/server";
import { defaultShipping } from "@/data/catalog";
import { buildSessionParams, CheckoutError, checkoutRequestSchema, priceCartOnServer } from "@/lib/checkout";
import { createOrder, updateOrder } from "@/lib/data/orders";
import { isStoreWritable, isStripeConfigured } from "@/lib/env";
import { getStripe } from "@/lib/stripe/client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isStripeConfigured() || !isStoreWritable()) {
    return NextResponse.json({ error: "Betaling er ikke aktiveret endnu. Prøv igen senere." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørgsel." }, { status: 400 });
  }

  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    const termsIssue = parsed.error.issues.some((i) => i.path[0] === "acceptTerms");
    return NextResponse.json(
      { error: termsIssue ? "Du skal acceptere handelsbetingelserne." : "Kurven indeholder ugyldige data." },
      { status: 400 },
    );
  }

  try {
    const totals = await priceCartOnServer(parsed.data);
    const order = await createOrder(totals);
    const session = await getStripe().checkout.sessions.create(buildSessionParams(order.id, totals, defaultShipping.label), {
      idempotencyKey: `checkout-${order.id}`,
    });
    await updateOrder(order.id, (o) => {
      o.stripeSessionId = session.id;
      return { order: o, result: null };
    });
    if (!session.url) throw new CheckoutError("Stripe returnerede ingen betalingsside.", 502);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof CheckoutError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error("[checkout] uventet fejl", err);
    return NextResponse.json({ error: "Betalingen kunne ikke startes. Prøv igen om lidt." }, { status: 500 });
  }
}
