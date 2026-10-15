import { randomBytes } from "node:crypto";

/** Sorterbart id: tidsstempel + tilfældig del, fx 20261015T120102-a1b2c3d4. */
export function sortableId(now = new Date()): string {
  const ts = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "");
  return `${ts.toLowerCase()}-${randomBytes(4).toString("hex")}`;
}

export function shortId(): string {
  return randomBytes(6).toString("hex");
}
