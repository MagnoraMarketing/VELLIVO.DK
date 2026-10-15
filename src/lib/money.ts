/** Alle beløb håndteres internt i øre (heltal) for at undgå afrundingsfejl. */

export const DANISH_VAT_RATE = 0.25;

const formatter = new Intl.NumberFormat("da-DK", {
  style: "currency",
  currency: "DKK",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatDkk(ore: number): string {
  // Vis hele kroner uden decimaler, ellers to decimaler.
  const kroner = ore / 100;
  if (Number.isInteger(kroner)) {
    return formatter.format(kroner).replace(/,00/, "");
  }
  return new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK", minimumFractionDigits: 2 }).format(kroner);
}

export function kronerToOre(kroner: number): number {
  return Math.round(kroner * 100);
}

/** Momsandelen af et beløb inkl. moms (25 % moms = 20 % af bruttobeløbet). */
export function vatIncluded(grossOre: number, rate = DANISH_VAT_RATE): number {
  return Math.round(grossOre - grossOre / (1 + rate));
}

export function netFromGross(grossOre: number, rate = DANISH_VAT_RATE): number {
  return grossOre - vatIncluded(grossOre, rate);
}
