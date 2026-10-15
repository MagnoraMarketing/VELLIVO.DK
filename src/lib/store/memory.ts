import { assertSafePath, StoreConflictError, type PutOptions, type StoreAdapter, type StoredDoc } from "@/lib/store/types";

/** In-memory lager til tests. */
export class MemoryStore implements StoreAdapter {
  readonly kind = "memory" as const;
  private docs = new Map<string, { body: string; etag: string }>();
  private counter = 0;

  async getJson<T>(path: string): Promise<StoredDoc<T> | null> {
    const d = this.docs.get(path);
    return d ? { data: JSON.parse(d.body) as T, etag: d.etag } : null;
  }

  async putJson<T>(path: string, data: T, opts: PutOptions = {}): Promise<string> {
    assertSafePath(path);
    const existing = this.docs.get(path);
    if (opts.onlyIfNew && existing) throw new StoreConflictError(path);
    if (opts.ifMatch !== undefined && existing?.etag !== opts.ifMatch) throw new StoreConflictError(path);
    const etag = `"m${++this.counter}"`;
    this.docs.set(path, { body: JSON.stringify(data), etag });
    return etag;
  }

  async list(prefix: string): Promise<string[]> {
    return [...this.docs.keys()].filter((k) => k.startsWith(prefix)).sort();
  }

}
