import { describe, expect, it } from "vitest";
import { products as catalog } from "@/data/catalog";
import type { Campaign, Product, ShippingSettings } from "@/lib/catalog/types";
import { describeCartError, effectivePrice, priceCart, shippingFor } from "@/lib/pricing";

const shipping: ShippingSettings = { flatRateOre: 4900, freeThresholdOre: 50000, label: "Levering" };
const published = (p: Product, stock = 5): Product => ({ ...p, status: "published", stock });
const lumbar = published(catalog[0]);
// Fast testpris, så fragtgrænsen kan testes uafhængigt af katalogets priser.
const scalp = { ...published(catalog[3]), priceOre: 29900 };
const now = new Date("2026-10-15T12:00:00Z");

const campaign = (over: Partial<Campaign> = {}): Campaign => ({
  id: "c1",
  name: "Efterår",
  discountPercent: 10,
  startsAt: "2026-10-01T00:00:00Z",
  endsAt: "2026-10-31T00:00:00Z",
  active: true,
  productIds: null,
  ...over,
});

describe("fragt", () => {
  it("opkræver fragt under grænsen og giver gratis fragt over", () => {
    expect(shippingFor(29900, shipping)).toBe(4900);
    expect(shippingFor(50000, shipping)).toBe(0);
    expect(shippingFor(0, shipping)).toBe(0);
    expect(shippingFor(99900, { ...shipping, freeThresholdOre: null })).toBe(4900);
  });
});

describe("kampagner", () => {
  it("anvender aktiv kampagne og runder til hele kroner", () => {
    const p = effectivePrice(lumbar, [campaign()], now);
    expect(p.priceOre).toBe(80900); // 899 * 0.9 = 809,10 -> 809
    expect(p.regularPriceOre).toBe(89900);
    expect(p.campaign?.id).toBe("c1");
  });

  it("ignorerer inaktive, fremtidige og udløbne kampagner", () => {
    expect(effectivePrice(lumbar, [campaign({ active: false })], now).campaign).toBeNull();
    expect(effectivePrice(lumbar, [campaign({ startsAt: "2026-11-01T00:00:00Z" })], now).campaign).toBeNull();
    expect(effectivePrice(lumbar, [campaign({ endsAt: "2026-10-10T00:00:00Z" })], now).campaign).toBeNull();
  });

  it("gælder kun valgte produkter", () => {
    const c = campaign({ productIds: [scalp.id] });
    expect(effectivePrice(lumbar, [c], now).campaign).toBeNull();
    expect(effectivePrice(scalp, [c], now).campaign).not.toBeNull();
  });

  it("viser kun før-pris, når laveste 30-dages pris er kendt", () => {
    expect(effectivePrice(lumbar, [campaign()], now).referencePriceOre).toBeNull();
    const withHistory = { ...lumbar, lowestPrice30dOre: 89900 };
    expect(effectivePrice(withHistory, [campaign()], now).referencePriceOre).toBe(89900);
  });

  it("vælger den største rabat ved flere kampagner", () => {
    const p = effectivePrice(lumbar, [campaign(), campaign({ id: "c2", discountPercent: 15 })], now);
    expect(p.campaign?.id).toBe("c2");
  });
});

describe("priceCart (autoritativ kurvberegning)", () => {
  it("beregner subtotal, fragt, total og moms", () => {
    const r = priceCart([{ slug: "oejenmassager-smart", quantity: 1 }], [lumbar, scalp], [], shipping, now);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.totals.subtotalOre).toBe(29900);
    expect(r.totals.shippingOre).toBe(4900);
    expect(r.totals.totalOre).toBe(34800);
    expect(r.totals.vatOre).toBe(6960);
  });

  it("giver gratis fragt over grænsen", () => {
    const r = priceCart([{ slug: "laendemassager", quantity: 1 }], [lumbar], [], shipping, now);
    expect(r.ok && r.totals.shippingOre).toBe(0);
  });

  it("slår dubletter sammen og kontrollerer samlet lager", () => {
    const r = priceCart(
      [
        { slug: "laendemassager", quantity: 3 },
        { slug: "laendemassager", quantity: 3 },
      ],
      [lumbar],
      [],
      shipping,
      now,
    );
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors[0]).toMatchObject({ code: "insufficient_stock", available: 5 });
  });

  it("afviser kladder, ukendte produkter og ugyldige antal", () => {
    const draft = { ...lumbar, status: "draft" as const };
    const r = priceCart(
      [
        { slug: "laendemassager", quantity: 1 },
        { slug: "findes-ikke", quantity: 1 },
        { slug: "oejenmassager-smart", quantity: 0 },
      ],
      [draft, scalp],
      [],
      shipping,
      now,
    );
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.map((e) => e.code).sort()).toEqual(["invalid_quantity", "not_for_sale", "unknown_product"]);
  });

  it("afviser tom kurv og antal over maksimum", () => {
    expect(priceCart([], [lumbar], [], shipping, now).ok).toBe(false);
    const r = priceCart([{ slug: "laendemassager", quantity: 11 }], [published(lumbar, 50)], [], shipping, now);
    expect(r.ok).toBe(false);
  });

  it("udsolgt-besked er forståelig", () => {
    expect(describeCartError({ code: "insufficient_stock", slug: "x", name: "Vellivo Eye", available: 0 })).toMatch(/udsolgt/);
  });
});
