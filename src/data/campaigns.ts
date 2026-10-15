import type { Campaign } from "@/lib/catalog/types";

/**
 * Kampagner. Tilføj en kampagne her (via GitHub) – Vercel deployer automatisk.
 *
 * Prismærkningsreglerne: Når en rabat vises med "før-pris", skal før-prisen være
 * den laveste pris i de seneste 30 dage. Sæt derfor `lowestPrice30dOre` på
 * produktet i catalog.ts, hvis en overstreget før-pris skal vises. Uden den
 * vises kun kampagnemærket og den aktuelle pris.
 *
 * Eksempel:
 * {
 *   id: "efteraar-2026",
 *   name: "Efterårstilbud",
 *   discountPercent: 10,
 *   startsAt: "2026-11-01T00:00:00+01:00",
 *   endsAt: "2026-11-15T23:59:59+01:00",
 *   active: true,
 *   productIds: null, // null = alle produkter, ellers fx ["20000000-0000-4000-8000-000000000003"]
 * }
 */
export const campaigns: Campaign[] = [];
