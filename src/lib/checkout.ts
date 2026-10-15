import "server-only";
import type Stripe from "stripe";
import { z } from "zod";
import { absoluteUrl } from "@/config/site";
import { campaigns } from "@/data/campaigns";
import { defaultShipping } from "@/data/catalog";
import { loadProductsWithStock } from "@/lib/catalog/repository";
import { describeCartError, MAX_LINES, MAX_QUANTITY_PER_LINE, priceCart, type CartTotals } from "@/lib/pricing";

export const checkoutRequestSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]{1,80}$/),
        quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_LINE),
      }),
    )
    .min(1)
    .max(MAX_LINES),
  acceptTerms: z.literal(true, { error: "Du skal acceptere handelsbetingelserne." }),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export class CheckoutError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

/** Beregner kurven på serveren ud fra katalog, kampagner og aktuelt lager. Klientpriser bruges aldrig. */
export async function priceCartOnServer(req: CheckoutRequest): Promise<CartTotals> {
  const products = await loadProductsWithStock();
  const result = priceCart(req.items, products, campaigns, defaultShipping);
  if (!result.ok) throw new CheckoutError(result.errors.map(describeCartError).join(" "), 409);
  return result.totals;
}

export function buildSessionParams(orderId: string, totals: CartTotals, shippingLabel: string): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    locale: "da",
    currency: "dkk",
    client_reference_id: orderId,
    metadata: { order_id: orderId },
    payment_intent_data: { metadata: { order_id: orderId } },
    line_items: totals.lines.map((l) => ({
      quantity: l.quantity,
      price_data: {
        currency: "dkk",
        unit_amount: l.unitPriceOre,
        tax_behavior: "inclusive",
        product_data: { name: l.name, metadata: { sku: l.sku, product_id: l.productId } },
      },
    })),
    shipping_address_collection: { allowed_countries: ["DK"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: totals.shippingOre === 0 ? `${shippingLabel} (gratis)` : shippingLabel,
          fixed_amount: { amount: totals.shippingOre, currency: "dkk" },
          tax_behavior: "inclusive",
        },
      },
    ],
    phone_number_collection: { enabled: true },
    billing_address_collection: "auto",
    // Sessionen udløber efter 30 minutter (Stripes minimum).
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    success_url: `${absoluteUrl("/ordre/bekraeftelse")}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${absoluteUrl("/ordre/annulleret")}?ordre=${orderId}`,
  };
}
