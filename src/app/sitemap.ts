import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { categories, products } from "@/data/catalog";
import { guides } from "@/data/guides";

/** Kun indekserbare sider: kladder (noindex) udelades, indtil de udgives. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "/",
    "/shop",
    "/guides",
    "/om-vellivo",
    "/kontakt",
    "/faq",
    "/levering",
    "/retur-og-fortrydelsesret",
    "/handelsbetingelser",
    "/privatlivspolitik",
    "/cookiepolitik",
  ];
  return [
    ...staticPages.map((p) => ({ url: absoluteUrl(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.5 })),
    ...categories.map((c) => ({ url: absoluteUrl(`/kategori/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products
      .filter((p) => p.status === "published")
      .map((p) => ({ url: absoluteUrl(`/produkter/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...guides.map((g) => ({ url: absoluteUrl(`/guides/${g.slug}`), lastModified: g.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
