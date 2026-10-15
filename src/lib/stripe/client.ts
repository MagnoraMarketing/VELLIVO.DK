import "server-only";
import Stripe from "stripe";
import { stripeEnv } from "@/lib/env";

let client: Stripe | null = null;

/** Stripe-klient. Test/live afgøres af nøglen (sk_test_ / sk_live_). */
export function getStripe(): Stripe {
  if (!client) {
    client = new Stripe(stripeEnv().STRIPE_SECRET_KEY, {
      appInfo: { name: "vellivo.dk" },
      maxNetworkRetries: 2,
    });
  }
  return client;
}
