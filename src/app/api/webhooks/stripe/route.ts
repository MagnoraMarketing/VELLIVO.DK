import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { isStoreWritable, stripeEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe/client";
import { processStripeEvent } from "@/lib/stripe/webhook";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let secret: string;
  try {
    secret = stripeEnv().STRIPE_WEBHOOK_SECRET;
  } catch {
    return NextResponse.json({ error: "Webhook er ikke konfigureret" }, { status: 503 });
  }
  if (!isStoreWritable()) {
    return NextResponse.json({ error: "Datalager er ikke konfigureret" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Mangler Stripe-signatur" }, { status: 400 });

  // Signaturen beregnes over den rå body – den må ikke parses først.
  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Ugyldig signatur" }, { status: 400 });
  }

  try {
    const outcome = await processStripeEvent(event);
    return NextResponse.json({ received: true, outcome });
  } catch (err) {
    console.error("[stripe-webhook] behandling fejlede", event.id, err);
    return NextResponse.json({ error: "Behandling fejlede" }, { status: 500 });
  }
}
