import { describe, expect, it } from "vitest";
import { campaigns } from "@/data/campaigns";
import { categories, products } from "@/data/catalog";
import { guides } from "@/data/guides";

/**
 * Kvalitetsporte for kataloget. Kører i `npm test` (og dermed før deploy),
 * så et produkt ikke ved en fejl kan udgives med manglende oplysninger.
 */
describe("produktkatalog", () => {
  it("har unikke id'er, slugs og SKU'er", () => {
    for (const key of ["id", "slug", "sku"] as const) {
      expect(new Set(products.map((p) => p[key])).size).toBe(products.length);
    }
  });

  it("refererer kun til eksisterende kategorier", () => {
    for (const p of products) expect(categories.map((c) => c.slug)).toContain(p.categorySlug);
  });

  it("har gyldige priser og SEO-felter", () => {
    for (const p of products) {
      expect(p.priceOre).toBeGreaterThan(0);
      expect(p.priceOre % 100).toBe(0);
      expect(p.seoTitle.length).toBeLessThanOrEqual(60);
      expect(p.seoDescription.length).toBeLessThanOrEqual(160);
      expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("udgivne produkter har billeder, leverandørmodel og lagerstatus", () => {
    // Ejeren har besluttet at udgive, selvom dele af `missingData` (CE-dokumenter,
    // brugsanvisning) endnu ikke er indhentet. Disse minimumskrav gælder stadig.
    for (const p of products.filter((x) => x.status === "published")) {
      expect(p.images.length, `${p.name}: mindst ét billede`).toBeGreaterThan(0);
      expect(p.supplierModel, `${p.name}: leverandørens model`).not.toBeNull();
      expect(p.alwaysInStock || p.stock > 0, `${p.name}: skal have lager eller alwaysInStock`).toBe(true);
      for (const img of p.images) {
        expect(
          img.url.startsWith("/produkter/") || img.url.startsWith("https://assets.laicms.com/"),
          `${p.name}: billeder skal ligge i public/produkter/ eller på leverandørens CDN (tilladt i next.config.ts)`,
        ).toBe(true);
        expect(img.alt.length).toBeGreaterThan(5);
      }
    }
  });

  it("indeholder ingen helbredspåstande", () => {
    const forbidden = /\b(helbred(er|e)|kurer(er|e)|behandler (smerter|sygdom)|fjerner smerter|garanteret smertelindring|lindrer smerter)\b/i;
    for (const p of products) {
      const text = [p.tagline, p.shortDescription, ...p.description, ...p.features.map((f) => f.text), ...p.faq.map((f) => f.a)].join(" ");
      expect(text, p.name).not.toMatch(forbidden);
    }
    for (const g of guides) {
      const text = g.sections.flatMap((s) => [...s.paragraphs, ...(s.bullets ?? [])]).join(" ");
      expect(text, g.slug).not.toMatch(forbidden);
    }
  });

  it("kampagner har gyldige rabatter og perioder", () => {
    for (const c of campaigns) {
      expect(c.discountPercent).toBeGreaterThan(0);
      expect(c.discountPercent).toBeLessThan(91);
      if (c.endsAt) expect(new Date(c.endsAt).getTime()).toBeGreaterThan(new Date(c.startsAt).getTime());
    }
  });
});
