import { describe, expect, it } from "vitest";
import { applySale } from "@/lib/data/inventory";
import { setStoreForTests } from "@/lib/store";
import { MemoryStore } from "@/lib/store/memory";
import { StoreConflictError } from "@/lib/store/types";

describe("datalager", () => {
  it("afviser skrivning med forældet ETag og dubletter", async () => {
    const s = new MemoryStore();
    const etag = await s.putJson("x/a.json", { v: 1 });
    await s.putJson("x/a.json", { v: 2 }, { ifMatch: etag });
    await expect(s.putJson("x/a.json", { v: 3 }, { ifMatch: etag })).rejects.toBeInstanceOf(StoreConflictError);
    await expect(s.putJson("x/a.json", { v: 4 }, { onlyIfNew: true })).rejects.toBeInstanceOf(StoreConflictError);
    expect((await s.getJson<{ v: number }>("x/a.json"))?.data.v).toBe(2);
  });

  it("afviser usikre stier", async () => {
    await expect(new MemoryStore().putJson("../etc/passwd", {})).rejects.toThrow(/Ugyldig sti/);
  });

  it("registrerer samtidige salg korrekt og kun én gang pr. ordre", async () => {
    setStoreForTests(new MemoryStore());
    const results = await Promise.all([
      applySale("p1", "o1", 1, 10),
      applySale("p1", "o2", 2, 10),
      applySale("p1", "o3", 3, 10),
      applySale("p1", "o1", 1, 10),
    ]);
    expect(results.filter((r) => r === "already")).toHaveLength(1);
    expect(await applySale("p1", "o4", 5, 10)).toBe("insufficient");
  });
});
