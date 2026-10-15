/**
 * Prisberegner (dækningsbidrag, break-even, maks. annonceringsomkostning).
 * Brug: npm run prisberegner -- prisberegning/eksempel-laendemassager.json
 */
import { readFileSync } from "node:fs";
import { calculate, emptyInputs, type CalculatorInputs } from "../src/lib/pricing-calculator.ts";

const file = process.argv[2];
if (!file) {
  console.error("Angiv en JSON-fil, fx: npm run prisberegner -- prisberegning/eksempel-laendemassager.json");
  process.exit(1);
}
const raw = JSON.parse(readFileSync(file, "utf8")) as Partial<CalculatorInputs> & { produkt?: string };
const input: CalculatorInputs = { ...emptyInputs, ...raw };
const r = calculate(input);
const kr = (v: number | null) => (v === null ? "–" : `${v.toLocaleString("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr.`);
const pct = (v: number | null) => (v === null ? "–" : `${v.toLocaleString("da-DK", { maximumFractionDigits: 1 })} %`);

console.log(`\nPrisberegning: ${raw.produkt ?? file}`);
console.log(`Momsregistreret: ${input.vatRegistered ? "ja (importmoms fradragsberettiget)" : "nej (importmoms er en omkostning)"}`);
if (!r.complete) {
  console.log(`\n⚠  IKKE VERIFICERET – manglende input: ${r.missing.join(", ")}`);
  console.log("   Tallene nedenfor er ufuldstændige og må ikke bruges som avance.\n");
}
const rows: [string, string][] = [
  ["Salgspris inkl. moms", kr(input.salesPriceInclVat)],
  ["Omsætning ekskl. moms", kr(r.revenueExVat)],
  ["Salgsmoms", kr(r.outputVat)],
  ["Toldværdi (CIF)", kr(r.customsValue)],
  ["Told", kr(r.duty)],
  [`Importmoms${r.importVatIsCost ? " (omkostning)" : " (fradrag)"}`, kr(r.importVat)],
  ["Landed cost", kr(r.landedCost)],
  ["Betalingsgebyr", kr(r.paymentFee)],
  ["Retur/reklamation", kr(r.returnsCost)],
  ["Variable omkostninger ekskl. annoncering", kr(r.variableCosts)],
  ["Variable omkostninger inkl. annoncering", kr(r.variableCostsInclAds)],
  ["Dækningsbidrag pr. ordre", kr(r.contribution)],
  ["Dækningsgrad", pct(r.contributionMarginPercent)],
  ["Bidrag efter annoncering", kr(r.contributionAfterAds)],
  ["Break-even-pris inkl. moms", kr(r.breakEvenPriceInclVat)],
  ["Maks. annonceringsomkostning", kr(r.maxAdCost)],
  ["Prisforskel til konkurrent", r.competitorDiff === null ? "–" : `${kr(r.competitorDiff)} (${pct(r.competitorDiffPercent)})`],
];
// Uden komplette input vises kun moms og konkurrentforskel – aldrig en "avance".
const safe = new Set(["Salgspris inkl. moms", "Omsætning ekskl. moms", "Salgsmoms", "Prisforskel til konkurrent"]);
const w = Math.max(...rows.map(([k]) => k.length));
for (const [k, v] of rows) console.log(`${k.padEnd(w)}  ${r.complete || safe.has(k) ? v : "ikke verificeret"}`);
console.log("");
