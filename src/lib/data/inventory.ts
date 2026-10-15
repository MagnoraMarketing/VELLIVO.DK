import "server-only";
import { getStore, StoreConflictError, tryGetStore } from "@/lib/store";

/**
 * Lagerstyring uden database:
 * - "Modtaget antal" pr. produkt står i koden (src/data/catalog.ts → `stock`)
 *   og øges via GitHub ved genopfyldning.
 * - Solgte enheder tælles her i Vercel Blob – idempotent pr. ordre.
 * - Tilgængeligt lager = modtaget − solgt.
 */

export interface InventoryDoc {
  productId: string;
  sold: number;
  /** Ordre-id'er, der allerede er trukket fra lageret (sikrer idempotens). */
  appliedOrders: string[];
  updatedAt: string;
}

const path = (productId: string) => `inventory/${productId}.json`;

export async function getSoldCounts(productIds: string[]): Promise<Map<string, number>> {
  const store = tryGetStore();
  const out = new Map<string, number>();
  if (!store) return out;
  const docs = await Promise.all(productIds.map((id) => store.getJson<InventoryDoc>(path(id))));
  docs.forEach((d, i) => out.set(productIds[i], d?.data.sold ?? 0));
  return out;
}

/**
 * Registrerer et salg præcis én gang pr. ordre og produkt. Skrivningen er
 * betinget af dokumentets ETag, så samtidige webhooks ikke overskriver hinanden.
 */
export async function applySale(
  productId: string,
  orderId: string,
  quantity: number,
  received: number,
): Promise<"applied" | "already" | "insufficient"> {
  const store = getStore();
  for (let attempt = 0; attempt < 6; attempt++) {
    const doc = await store.getJson<InventoryDoc>(path(productId));
    const current: InventoryDoc = doc?.data ?? { productId, sold: 0, appliedOrders: [], updatedAt: "" };
    if (current.appliedOrders.includes(orderId)) return "already";
    const insufficient = received - current.sold < quantity;
    const next: InventoryDoc = {
      productId,
      sold: current.sold + quantity,
      appliedOrders: [...current.appliedOrders, orderId].slice(-1000),
      updatedAt: new Date().toISOString(),
    };
    try {
      await store.putJson(path(productId), next, doc ? { ifMatch: doc.etag } : { onlyIfNew: true });
      return insufficient ? "insufficient" : "applied";
    } catch (err) {
      if (!(err instanceof StoreConflictError)) throw err;
      await new Promise((r) => setTimeout(r, 40 * (attempt + 1) + Math.random() * 40));
    }
  }
  throw new Error(`Lager for ${productId} kunne ikke opdateres pga. samtidige ændringer`);
}
