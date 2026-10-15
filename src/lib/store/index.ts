import "server-only";
import { allowLocalStore, isBlobConfigured } from "@/lib/env";
import { VercelBlobStore } from "@/lib/store/blob";
import { FileStore } from "@/lib/store/file";
import { StoreUnavailableError, type StoreAdapter } from "@/lib/store/types";

let override: StoreAdapter | null = null;
let cached: StoreAdapter | null = null;

/** Bruges af tests til at indsætte et in-memory lager. */
export function setStoreForTests(store: StoreAdapter | null) {
  override = store;
}

export function getStore(): StoreAdapter {
  if (override) return override;
  if (cached) return cached;
  if (isBlobConfigured()) {
    cached = new VercelBlobStore(process.env.BLOB_READ_WRITE_TOKEN!);
  } else if (allowLocalStore()) {
    cached = new FileStore();
  } else {
    throw new StoreUnavailableError();
  }
  return cached;
}

/** Returnerer null i stedet for at kaste, når der ikke er et lager (bruges til læsning med fallback). */
export function tryGetStore(): StoreAdapter | null {
  try {
    return getStore();
  } catch {
    return null;
  }
}

export { StoreConflictError, StoreUnavailableError } from "@/lib/store/types";
