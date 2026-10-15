/**
 * Prisberegner til adminområdet. Alle beløb er i DKK pr. solgt enhed.
 *
 * Moms:
 * - Er virksomheden momsregistreret, er importmomsen fradragsberettiget og
 *   derfor ikke en omkostning. Salgsmomsen (25 %) trækkes ud af salgsprisen.
 *   Omkostninger skal i så fald indtastes EKSKL. moms.
 * - Er virksomheden ikke momsregistreret, er importmomsen en reel omkostning,
 *   og der afregnes ingen salgsmoms. Omkostninger indtastes INKL. moms.
 *
 * Beregningen er vejledende og erstatter ikke rådgivning fra revisor.
 */

export const VAT_RATE = 0.25;

export interface CalculatorInputs {
  /** Indkøbspris pr. enhed i leverandørens valuta. */
  purchasePrice: number | null;
  /** Valutakurs: DKK pr. 1 enhed af leverandørens valuta (1 hvis DKK). */
  exchangeRate: number | null;
  supplierCurrency: string;
  freightFromSupplier: number | null;
  insurance: number | null;
  /** Told i procent af toldværdien (CIF). */
  dutyPercent: number | null;
  otherImportCosts: number | null;
  packaging: number | null;
  warehouseHandling: number | null;
  /** Virksomhedens omkostning til fragt til kunden. */
  shippingToCustomer: number | null;
  /** Fragt som kunden betaler (inkl. moms). 0 ved gratis fragt. */
  shippingChargedInclVat: number;
  paymentFeePercent: number | null;
  paymentFeeFixed: number | null;
  adCostPerOrder: number | null;
  /** Forventede retur- og reklamationsomkostninger i procent af omsætningen ekskl. moms. */
  returnsPercent: number | null;
  salesPriceInclVat: number | null;
  vatRegistered: boolean;
  competitorPrice: number | null;
}

export const REQUIRED_FIELDS: { key: keyof CalculatorInputs; label: string }[] = [
  { key: "purchasePrice", label: "Indkøbspris" },
  { key: "exchangeRate", label: "Valutakurs" },
  { key: "freightFromSupplier", label: "Fragt fra leverandør" },
  { key: "insurance", label: "Forsikring" },
  { key: "dutyPercent", label: "Told" },
  { key: "otherImportCosts", label: "Øvrige importomkostninger" },
  { key: "packaging", label: "Emballage" },
  { key: "warehouseHandling", label: "Lager og håndtering" },
  { key: "shippingToCustomer", label: "Fragt til kunden" },
  { key: "paymentFeePercent", label: "Betalingsgebyr (%)" },
  { key: "paymentFeeFixed", label: "Betalingsgebyr (fast)" },
  { key: "adCostPerOrder", label: "Annonceringsomkostning pr. ordre" },
  { key: "returnsPercent", label: "Retur og reklamation" },
  { key: "salesPriceInclVat", label: "Salgspris inkl. moms" },
];

export interface CalculatorResult {
  complete: boolean;
  missing: string[];
  customsValue: number;
  duty: number;
  importVat: number;
  importVatIsCost: boolean;
  landedCost: number;
  revenueExVat: number;
  outputVat: number;
  paymentFee: number;
  returnsCost: number;
  /** Samlede variable omkostninger ekskl. annoncering. */
  variableCosts: number;
  /** Samlede variable omkostninger inkl. annoncering. */
  variableCostsInclAds: number;
  contribution: number;
  contributionMarginPercent: number | null;
  contributionAfterAds: number;
  /** Salgspris inkl. moms, hvor bidraget efter annoncering er 0. */
  breakEvenPriceInclVat: number | null;
  /** Maksimal annonceringsomkostning pr. ordre før nulresultat. */
  maxAdCost: number;
  competitorDiff: number | null;
  competitorDiffPercent: number | null;
}

const n = (v: number | null | undefined) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const round2 = (v: number) => Math.round(v * 100) / 100;

export function calculate(input: CalculatorInputs): CalculatorResult {
  const missing = REQUIRED_FIELDS.filter((f) => input[f.key] === null || input[f.key] === undefined).map((f) => f.label);

  const vatFactor = input.vatRegistered ? 1 + VAT_RATE : 1;
  const price = n(input.salesPriceInclVat);
  const shippingCharged = n(input.shippingChargedInclVat);

  const customsValue = n(input.purchasePrice) * n(input.exchangeRate) + n(input.freightFromSupplier) + n(input.insurance);
  const duty = customsValue * (n(input.dutyPercent) / 100);
  const importVat = (customsValue + duty + n(input.otherImportCosts)) * VAT_RATE;
  const importVatIsCost = !input.vatRegistered;
  const landedCost = customsValue + duty + n(input.otherImportCosts) + (importVatIsCost ? importVat : 0);

  const grossRevenue = price + shippingCharged;
  const revenueExVat = grossRevenue / vatFactor;
  const outputVat = grossRevenue - revenueExVat;

  const feePct = n(input.paymentFeePercent) / 100;
  const paymentFee = grossRevenue * feePct + n(input.paymentFeeFixed);
  const returnsPct = n(input.returnsPercent) / 100;
  const returnsCost = revenueExVat * returnsPct;

  const fixedCosts = landedCost + n(input.packaging) + n(input.warehouseHandling) + n(input.shippingToCustomer);
  const variableCosts = fixedCosts + paymentFee + returnsCost;
  const ads = n(input.adCostPerOrder);
  const contribution = revenueExVat - variableCosts;
  const contributionAfterAds = contribution - ads;

  // Løs P i: (P+S)/v·(1−r) − (P+S)·f − fast gebyr − faste omkostninger − annoncering = 0
  const denominator = (1 - returnsPct) / vatFactor - feePct;
  const breakEvenGross =
    denominator > 0 ? (fixedCosts + ads + n(input.paymentFeeFixed)) / denominator : null;
  const breakEvenPriceInclVat = breakEvenGross === null ? null : Math.max(0, breakEvenGross - shippingCharged);

  const competitor = input.competitorPrice;
  const competitorDiff = competitor && price ? price - competitor : null;

  return {
    complete: missing.length === 0,
    missing,
    customsValue: round2(customsValue),
    duty: round2(duty),
    importVat: round2(importVat),
    importVatIsCost,
    landedCost: round2(landedCost),
    revenueExVat: round2(revenueExVat),
    outputVat: round2(outputVat),
    paymentFee: round2(paymentFee),
    returnsCost: round2(returnsCost),
    variableCosts: round2(variableCosts),
    variableCostsInclAds: round2(variableCosts + ads),
    contribution: round2(contribution),
    contributionMarginPercent: revenueExVat > 0 ? round2((contribution / revenueExVat) * 100) : null,
    contributionAfterAds: round2(contributionAfterAds),
    breakEvenPriceInclVat: breakEvenPriceInclVat === null ? null : round2(breakEvenPriceInclVat),
    maxAdCost: round2(Math.max(0, contribution)),
    competitorDiff: competitorDiff === null ? null : round2(competitorDiff),
    competitorDiffPercent: competitorDiff === null || !competitor ? null : round2((competitorDiff / competitor) * 100),
  };
}

export const emptyInputs: CalculatorInputs = {
  purchasePrice: null,
  exchangeRate: null,
  supplierCurrency: "USD",
  freightFromSupplier: null,
  insurance: null,
  dutyPercent: null,
  otherImportCosts: null,
  packaging: null,
  warehouseHandling: null,
  shippingToCustomer: null,
  shippingChargedInclVat: 0,
  paymentFeePercent: null,
  paymentFeeFixed: null,
  adCostPerOrder: null,
  returnsPercent: null,
  salesPriceInclVat: null,
  vatRegistered: true,
  competitorPrice: null,
};
