export type ProductStatus = "draft" | "published" | "archived";

export interface ProductImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductSpec {
  label: string;
  /** `null` betyder, at oplysningen endnu ikke er verificeret hos leverandøren. */
  value: string | null;
}

export interface ProductFeature {
  title: string;
  text: string;
}

export interface ProductFaq {
  q: string;
  a: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  categorySlug: string;
  status: ProductStatus;
  /** Salgspris inkl. 25 % moms, i øre. */
  priceOre: number;
  /** Laveste pris de seneste 30 dage før en eventuel kampagne (prismærkningsreglerne). */
  lowestPrice30dOre: number | null;
  /**
   * I src/data/catalog.ts: modtaget antal på lager i alt (øges ved genopfyldning).
   * Efter indlæsning via repository: tilgængeligt antal (modtaget − solgt).
   */
  stock: number;
  tagline: string;
  shortDescription: string;
  description: string[];
  features: ProductFeature[];
  specs: ProductSpec[];
  usage: string[];
  inBox: string[] | null;
  safety: string[];
  faq: ProductFaq[];
  seoTitle: string;
  seoDescription: string;
  images: ProductImage[];
  supplierUrl: string | null;
  supplierModel: string | null;
  /** Liste over oplysninger, der mangler før produktet kan udgives. */
  missingData: string[];
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
}

export interface Campaign {
  id: string;
  name: string;
  discountPercent: number;
  startsAt: string;
  endsAt: string | null;
  active: boolean;
  /** `null` = gælder alle produkter. */
  productIds: string[] | null;
}

export interface ShippingSettings {
  /** Fragt inkl. moms i øre. */
  flatRateOre: number;
  /** Gratis fragt fra dette beløb (inkl. moms). `null` = aldrig gratis. */
  freeThresholdOre: number | null;
  label: string;
}
