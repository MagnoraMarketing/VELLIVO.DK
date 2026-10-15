/**
 * Central konfiguration for Vellivo.
 *
 * Felter med værdien `null` er oplysninger, som virksomheden endnu ikke har
 * leveret. De vises på siden som tydeligt markerede pladsholdere og må ikke
 * udfyldes med opdigtede værdier. Se docs/missing-information.md.
 */
export const site = {
  name: "Vellivo",
  domain: "vellivo.dk",
  tagline: "Vellivo – mere velvære i hverdagen.",
  altTagline: "Smarte løsninger til din daglige velvære.",
  description:
    "Vellivo er en dansk webshop med massageapparater og wellness-produkter til hjemmet. Tydelige priser i DKK inkl. moms og ærlig produktinformation.",
  locale: "da_DK",
  currency: "DKK",
  company: {
    legalName: null as string | null,
    cvr: null as string | null,
    address: null as string | null,
    returnAddress: null as string | null,
    email: null as string | null,
    phone: null as string | null,
    /** Stilling/rolle for den importøransvarlige i EU (navn + adresse kræves på produkt/emballage). */
    importer: null as string | null,
  },
  /** Oplysninger som kræver virksomhedens beslutning, før de kan vises som endelige vilkår. */
  terms: {
    deliveryTime: null as string | null,
    carrier: null as string | null,
    /** Lovpligtig minimum er 14 dage. Længere frist er et frivilligt valg. */
    withdrawalDays: 14,
    /** Lovpligtig reklamationsret i Danmark er 2 år. */
    complaintYears: 2,
    warranty: null as string | null,
  },
} as const;

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://vellivo.dk";
  return raw.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/"): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export const mainNav = [
  { href: "/", label: "Forside" },
  { href: "/shop", label: "Shop" },
  { href: "/kategori/ryg-og-laend", label: "Ryg og lænd" },
  { href: "/kategori/nakke-og-skuldre", label: "Nakke og skuldre" },
  { href: "/kategori/oejne-og-haender", label: "Øjne og hænder" },
  { href: "/om-vellivo", label: "Om Vellivo" },
  { href: "/kontakt", label: "Kontakt" },
] as const;
