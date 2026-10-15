import "server-only";
import { cache } from "react";
import { campaigns as codeCampaigns } from "@/data/campaigns";
import { categories as codeCategories, defaultShipping, products as codeProducts } from "@/data/catalog";
import type { Campaign, Category, Product, ShippingSettings } from "@/lib/catalog/types";
import { getSoldCounts } from "@/lib/data/inventory";

/** Tilgængeligt antal for produkter uden lagerbegrænsning. Vises aldrig for kunden. */
export const UNLIMITED_STOCK = 9999;

/**
 * Kataloget kommer fra koden (src/data). Det eneste dynamiske er lagerstatus,
 * som beregnes som modtaget antal minus solgte enheder registreret i Vercel Blob.
 * Arkiverede produkter vises aldrig.
 */

/** Indlæser produkter med aktuelt tilgængeligt lager (ingen cache – bruges ved checkout). */
export async function loadProductsWithStock(): Promise<Product[]> {
  const visible = codeProducts.filter((p) => p.status !== "archived");
  let sold = new Map<string, number>();
  try {
    sold = await getSoldCounts(visible.filter((p) => p.status === "published").map((p) => p.id));
  } catch (err) {
    console.error("[lager] kunne ikke læse solgte enheder – viser modtaget antal", err);
  }
  return visible.map((p) => ({
    ...p,
    stock: p.alwaysInStock ? UNLIMITED_STOCK : Math.max(0, p.stock - (sold.get(p.id) ?? 0)),
  }));
}

export const getProducts = cache(loadProductsWithStock);

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
});

export const getCategories = cache(async (): Promise<Category[]> => [...codeCategories].sort((a, b) => a.sortOrder - b.sortOrder));

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
});

export const getActiveCampaigns = cache(async (): Promise<Campaign[]> => codeCampaigns.filter((c) => c.active));

export const getShippingSettings = cache(async (): Promise<ShippingSettings> => defaultShipping);

/** Statisk liste over alle (ikke-arkiverede) produkter – til generateStaticParams og sitemap. */
export function getCatalogProducts(): Product[] {
  return codeProducts.filter((p) => p.status !== "archived");
}
