import type { Campaign, Product, ShippingSettings } from "@/lib/catalog/types";
import { vatIncluded } from "@/lib/money";

export const MAX_QUANTITY_PER_LINE = 10;
export const MAX_LINES = 20;

export interface EffectivePrice {
  priceOre: number;
  /** Normalpris, hvis en kampagne er aktiv. */
  regularPriceOre: number;
  /** Den pris, der må vises som "før-pris" (laveste pris seneste 30 dage). */
  referencePriceOre: number | null;
  campaign: Pick<Campaign, "id" | "name" | "discountPercent"> | null;
}

export function isCampaignActive(c: Campaign, now: Date): boolean {
  if (!c.active) return false;
  if (new Date(c.startsAt) > now) return false;
  if (c.endsAt && new Date(c.endsAt) <= now) return false;
  return c.discountPercent > 0 && c.discountPercent < 100;
}

/** Finder den bedste aktive kampagne for et produkt og beregner prisen (rundet til hele kroner). */
export function effectivePrice(
  product: Pick<Product, "id" | "priceOre" | "lowestPrice30dOre">,
  campaigns: Campaign[],
  now = new Date(),
): EffectivePrice {
  const applicable = campaigns.filter(
    (c) => isCampaignActive(c, now) && (c.productIds === null || c.productIds.includes(product.id)),
  );
  const best = applicable.sort((a, b) => b.discountPercent - a.discountPercent)[0];
  if (!best) {
    return { priceOre: product.priceOre, regularPriceOre: product.priceOre, referencePriceOre: null, campaign: null };
  }
  const discounted = Math.round((product.priceOre * (100 - best.discountPercent)) / 100 / 100) * 100;
  const reference = product.lowestPrice30dOre ?? null;
  return {
    priceOre: Math.max(100, discounted),
    regularPriceOre: product.priceOre,
    // Før-pris må kun vises, hvis den er den laveste pris i de seneste 30 dage.
    referencePriceOre: reference !== null && reference > discounted ? reference : null,
    campaign: { id: best.id, name: best.name, discountPercent: best.discountPercent },
  };
}

export interface CartLineInput {
  slug: string;
  quantity: number;
}

export interface PricedLine {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  quantity: number;
  unitPriceOre: number;
  lineTotalOre: number;
  campaignId: string | null;
}

export interface CartTotals {
  lines: PricedLine[];
  subtotalOre: number;
  shippingOre: number;
  totalOre: number;
  vatOre: number;
}

export function shippingFor(subtotalOre: number, settings: ShippingSettings): number {
  if (subtotalOre <= 0) return 0;
  if (settings.freeThresholdOre !== null && subtotalOre >= settings.freeThresholdOre) return 0;
  return settings.flatRateOre;
}

export type CartValidationError =
  | { code: "empty" }
  | { code: "too_many_lines" }
  | { code: "invalid_quantity"; slug: string }
  | { code: "unknown_product"; slug: string }
  | { code: "not_for_sale"; slug: string; name: string }
  | { code: "insufficient_stock"; slug: string; name: string; available: number };

/**
 * Autoritativ prisberegning. Bruges både til visning og på serveren ved checkout.
 * Klientens priser indgår aldrig – kun slug og antal.
 */
export function priceCart(
  input: CartLineInput[],
  products: Product[],
  campaigns: Campaign[],
  shipping: ShippingSettings,
  now = new Date(),
): { ok: true; totals: CartTotals } | { ok: false; errors: CartValidationError[] } {
  const errors: CartValidationError[] = [];
  if (input.length === 0) return { ok: false, errors: [{ code: "empty" }] };
  if (input.length > MAX_LINES) return { ok: false, errors: [{ code: "too_many_lines" }] };

  // Slå dubletter sammen, så samme produkt ikke kan omgå lagerkontrollen.
  const merged = new Map<string, number>();
  for (const line of input) {
    if (!Number.isInteger(line.quantity) || line.quantity < 1) {
      errors.push({ code: "invalid_quantity", slug: line.slug });
      continue;
    }
    merged.set(line.slug, (merged.get(line.slug) ?? 0) + line.quantity);
  }

  const lines: PricedLine[] = [];
  for (const [slug, quantity] of merged) {
    if (quantity > MAX_QUANTITY_PER_LINE) {
      errors.push({ code: "invalid_quantity", slug });
      continue;
    }
    const product = products.find((p) => p.slug === slug);
    if (!product) {
      errors.push({ code: "unknown_product", slug });
      continue;
    }
    if (product.status !== "published") {
      errors.push({ code: "not_for_sale", slug, name: product.name });
      continue;
    }
    if (product.stock < quantity) {
      errors.push({ code: "insufficient_stock", slug, name: product.name, available: product.stock });
      continue;
    }
    const price = effectivePrice(product, campaigns, now);
    lines.push({
      productId: product.id,
      slug,
      sku: product.sku,
      name: product.name,
      quantity,
      unitPriceOre: price.priceOre,
      lineTotalOre: price.priceOre * quantity,
      campaignId: price.campaign?.id ?? null,
    });
  }

  if (errors.length > 0) return { ok: false, errors };

  const subtotalOre = lines.reduce((sum, l) => sum + l.lineTotalOre, 0);
  const shippingOre = shippingFor(subtotalOre, shipping);
  const totalOre = subtotalOre + shippingOre;
  return { ok: true, totals: { lines, subtotalOre, shippingOre, totalOre, vatOre: vatIncluded(totalOre) } };
}

export function describeCartError(e: CartValidationError): string {
  switch (e.code) {
    case "empty":
      return "Kurven er tom.";
    case "too_many_lines":
      return `Kurven kan højst indeholde ${MAX_LINES} forskellige produkter.`;
    case "invalid_quantity":
      return `Ugyldigt antal (1–${MAX_QUANTITY_PER_LINE} stk. pr. produkt).`;
    case "unknown_product":
      return "Et produkt i kurven findes ikke længere.";
    case "not_for_sale":
      return `${e.name} kan ikke købes endnu.`;
    case "insufficient_stock":
      return e.available > 0
        ? `Der er kun ${e.available} stk. af ${e.name} på lager.`
        : `${e.name} er desværre udsolgt.`;
  }
}
