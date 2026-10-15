export interface StoredDoc<T> {
  data: T;
  etag: string;
}

export interface PutOptions {
  /** Skriv kun, hvis dokumentets nuværende ETag matcher (optimistisk låsning). */
  ifMatch?: string;
  /** Skriv kun, hvis dokumentet ikke findes i forvejen. */
  onlyIfNew?: boolean;
}

/** Fælles interface for dokumentlageret (Vercel Blob i produktion). */
export interface StoreAdapter {
  readonly kind: "vercel-blob" | "file" | "memory";
  getJson<T>(path: string): Promise<StoredDoc<T> | null>;
  putJson<T>(path: string, data: T, opts?: PutOptions): Promise<string>;
  list(prefix: string): Promise<string[]>;
}

/** Kastes når en betinget skrivning fejler (ETag ændret eller dokument findes allerede). */
export class StoreConflictError extends Error {
  constructor(path: string) {
    super(`Konflikt ved skrivning af ${path}`);
    this.name = "StoreConflictError";
  }
}

export class StoreUnavailableError extends Error {
  constructor() {
    super("Datalageret er ikke konfigureret (BLOB_READ_WRITE_TOKEN mangler).");
    this.name = "StoreUnavailableError";
  }
}

/** Kun sikre stinavne: små bogstaver, tal, bindestreg, underscore, punktum og skråstreg. */
export function assertSafePath(path: string): void {
  if (!/^[a-z0-9][a-z0-9/_.-]{0,250}$/.test(path) || path.includes("..")) {
    throw new Error(`Ugyldig sti: ${path}`);
  }
}
