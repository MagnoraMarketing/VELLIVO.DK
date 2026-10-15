import { describe, expect, it } from "vitest";
import { buildSessionParams, checkoutRequestSchema } from "@/lib/checkout";

describe("checkout-validering", () => {
  it("kræver accept af handelsbetingelser", () => {
    expect(checkoutRequestSchema.safeParse({ items: [{ slug: "laendemassager", quantity: 1 }] }).success).toBe(false);
    expect(
      checkoutRequestSchema.safeParse({ items: [{ slug: "laendemassager", quantity: 1 }], acceptTerms: true }).success,
    ).toBe(true);
  });

  it("ignorerer/afviser klientpriser og ugyldige værdier", () => {
    const withPrice = checkoutRequestSchema.safeParse({
      items: [{ slug: "laendemassager", quantity: 1, priceOre: 1 }],
      acceptTerms: true,
    });
    expect(withPrice.success && "priceOre" in withPrice.data.items[0]).toBe(false);
    expect(checkoutRequestSchema.safeParse({ items: [{ slug: "../x", quantity: 1 }], acceptTerms: true }).success).toBe(false);
    expect(checkoutRequestSchema.safeParse({ items: [{ slug: "a", quantity: 1.5 }], acceptTerms: true }).success).toBe(false);
    expect(checkoutRequestSchema.safeParse({ items: [], acceptTerms: true }).success).toBe(false);
  });

  it("bygger en Stripe-session i DKK med serverberegnede beløb", () => {
    const params = buildSessionParams(
      "order-1",
      {
        lines: [
          { productId: "p1", slug: "laendemassager", sku: "VEL-LUMBAR-01", name: "Vellivo Lumbar", quantity: 2, unitPriceOre: 89900, lineTotalOre: 179800, campaignId: null },
        ],
        subtotalOre: 179800,
        shippingOre: 0,
        totalOre: 179800,
        vatOre: 35960,
      },
      "Levering i Danmark",
    );
    expect(params.mode).toBe("payment");
    expect(params.currency).toBe("dkk");
    expect(params.metadata).toEqual({ order_id: "order-1" });
    expect(params.line_items?.[0].price_data?.unit_amount).toBe(89900);
    expect(params.shipping_address_collection?.allowed_countries).toEqual(["DK"]);
    expect(params.success_url).toContain("{CHECKOUT_SESSION_ID}");
  });
});
