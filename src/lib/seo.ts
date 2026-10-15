import type { Metadata } from "next";
import { absoluteUrl, site } from "@/config/site";
import type { Product } from "@/lib/catalog/types";
import type { EffectivePrice } from "@/lib/pricing";

export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  images,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  images?: { url: string; alt: string }[];
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url: path, siteName: site.name, locale: site.locale, type: "website", images },
  };
}

export function organizationJsonLd() {
  const c = site.company;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: c.legalName ?? site.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.svg"),
    ...(c.email ? { email: c.email } : {}),
    ...(c.phone ? { telephone: c.phone } : {}),
    ...(c.cvr ? { vatID: `DK${c.cvr}` } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.href) })),
  };
}

/**
 * Product + Offer schema. Udelades for kladder, så strukturerede data altid
 * afspejler et produkt, der faktisk kan købes til den viste pris. Ingen
 * AggregateRating/Review, da der ikke findes verificerede anmeldelser.
 */
export function productJsonLd(product: Product, price: EffectivePrice) {
  if (product.status !== "published") return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: site.name },
    url: absoluteUrl(`/produkter/${product.slug}`),
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/produkter/${product.slug}`),
      priceCurrency: "DKK",
      price: (price.priceOre / 100).toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: site.company.legalName ?? site.name },
    },
  };
}
