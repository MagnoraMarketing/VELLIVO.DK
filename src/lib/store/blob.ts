import "server-only";
import { BlobPreconditionFailedError, get, list, put } from "@vercel/blob";
import { assertSafePath, StoreConflictError, type PutOptions, type StoreAdapter, type StoredDoc } from "@/lib/store/types";

/**
 * Vercel Blob (privat store). Alle data – også kundeoplysninger i ordrer – ligger
 * i en PRIVAT store og kan kun læses af serveren med BLOB_READ_WRITE_TOKEN.
 * Læsninger går uden om CDN-cachen (useCache: false), så lager og ordrestatus
 * altid er aktuelle, og skrivninger bruger ETag (ifMatch) mod samtidige ændringer.
 */
export class VercelBlobStore implements StoreAdapter {
  readonly kind = "vercel-blob" as const;
  constructor(private token: string) {}

  async getJson<T>(path: string): Promise<StoredDoc<T> | null> {
    assertSafePath(path);
    const res = await get(path, { access: "private", useCache: false, token: this.token });
    if (!res || res.statusCode !== 200) return null;
    const text = await new Response(res.stream).text();
    return { data: JSON.parse(text) as T, etag: res.blob.etag };
  }

  async putJson<T>(path: string, data: T, opts: PutOptions = {}): Promise<string> {
    assertSafePath(path);
    try {
      const res = await put(path, JSON.stringify(data), {
        access: "private",
        token: this.token,
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: !opts.onlyIfNew,
        ...(opts.ifMatch ? { ifMatch: opts.ifMatch } : {}),
      });
      return res.etag;
    } catch (err) {
      if (err instanceof BlobPreconditionFailedError) throw new StoreConflictError(path);
      if (opts.onlyIfNew && err instanceof Error && /already exists/i.test(err.message)) throw new StoreConflictError(path);
      throw err;
    }
  }

  async list(prefix: string): Promise<string[]> {
    const out: string[] = [];
    let cursor: string | undefined;
    do {
      const res = await list({ prefix, cursor, limit: 1000, token: this.token });
      out.push(...res.blobs.map((b) => b.pathname));
      cursor = res.hasMore ? res.cursor : undefined;
    } while (cursor);
    return out.sort();
  }

}
