import { describe, expect, it } from "vitest";
import { formatDkk, netFromGross, vatIncluded } from "@/lib/money";

describe("moms og formattering", () => {
  it("beregner momsandelen af en pris inkl. 25 % moms", () => {
    expect(vatIncluded(89900)).toBe(17980); // 899 kr. -> 179,80 kr. moms
    expect(netFromGross(89900)).toBe(71920);
    expect(vatIncluded(12500)).toBe(2500);
  });

  it("formaterer beløb i DKK", () => {
    expect(formatDkk(89900).replace(/\s/g, " ")).toMatch(/899/);
    expect(formatDkk(89900)).toMatch(/kr/);
    expect(formatDkk(4950)).toMatch(/49,50/);
  });
});
