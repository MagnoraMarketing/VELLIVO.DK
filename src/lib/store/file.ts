import "server-only";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { assertSafePath, StoreConflictError, type PutOptions, type StoreAdapter, type StoredDoc } from "@/lib/store/types";

/**
 * Lokal fil-lagring i ./.data – KUN til udvikling. Bruges automatisk, når
 * BLOB_READ_WRITE_TOKEN ikke er sat og NODE_ENV ikke er "production".
 */
export class FileStore implements StoreAdapter {
  readonly kind = "file" as const;
  constructor(private root = join(process.cwd(), ".data")) {}

  private abs(path: string) {
    assertSafePath(path);
    return join(this.root, path);
  }

  async getJson<T>(path: string): Promise<StoredDoc<T> | null> {
    try {
      const body = await readFile(this.abs(path), "utf8");
      return { data: JSON.parse(body) as T, etag: createHash("sha1").update(body).digest("hex") };
    } catch {
      return null;
    }
  }

  async putJson<T>(path: string, data: T, opts: PutOptions = {}): Promise<string> {
    const current = await this.getJson(path);
    if (opts.onlyIfNew && current) throw new StoreConflictError(path);
    if (opts.ifMatch !== undefined && current?.etag !== opts.ifMatch) throw new StoreConflictError(path);
    const body = JSON.stringify(data, null, 2);
    await mkdir(dirname(this.abs(path)), { recursive: true });
    await writeFile(this.abs(path), body, "utf8");
    return createHash("sha1").update(body).digest("hex");
  }

  async list(prefix: string): Promise<string[]> {
    const out: string[] = [];
    const walk = async (dir: string) => {
      let entries;
      try {
        entries = await readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const e of entries) {
        const p = join(dir, e.name);
        if (e.isDirectory()) await walk(p);
        else out.push(relative(this.root, p).split("\\").join("/"));
      }
    };
    await walk(this.root);
    return out.filter((p) => p.startsWith(prefix)).sort();
  }

}
