import { describe, expect, it } from "vitest";
import { calculate, emptyInputs, type CalculatorInputs } from "@/lib/pricing-calculator";

const base: CalculatorInputs = {
  ...emptyInputs,
  purchasePrice: 30,
  exchangeRate: 7,
  freightFromSupplier: 20,
  insurance: 0,
  dutyPercent: 0,
  otherImportCosts: 0,
  packaging: 10,
  warehouseHandling: 10,
  shippingToCustomer: 40,
  shippingChargedInclVat: 0,
  paymentFeePercent: 1.5,
  paymentFeeFixed: 1.8,
  adCostPerOrder: 150,
  returnsPercent: 3,
  salesPriceInclVat: 899,
  vatRegistered: true,
  competitorPrice: 999,
};

describe("prisberegner", () => {
  it("markerer manglende input og er ufuldstændig", () => {
    const r = calculate(emptyInputs);
    expect(r.complete).toBe(false);
    expect(r.missing).toContain("Indkøbspris");
  });

  it("beregner dækningsbidrag for momsregistreret virksomhed", () => {
    const r = calculate(base);
    expect(r.complete).toBe(true);
    expect(r.customsValue).toBe(230);
    expect(r.importVatIsCost).toBe(false);
    expect(r.landedCost).toBe(230);
    expect(r.revenueExVat).toBe(719.2);
    expect(r.outputVat).toBe(179.8);
    expect(r.paymentFee).toBeCloseTo(899 * 0.015 + 1.8, 2);
    expect(r.returnsCost).toBeCloseTo(719.2 * 0.03, 2);
    const expectedContribution = 719.2 - (230 + 10 + 10 + 40 + (899 * 0.015 + 1.8) + 719.2 * 0.03);
    expect(r.contribution).toBeCloseTo(expectedContribution, 1);
    expect(r.contributionAfterAds).toBeCloseTo(expectedContribution - 150, 1);
    expect(r.maxAdCost).toBeCloseTo(expectedContribution, 1);
    expect(r.competitorDiff).toBe(-100);
    expect(r.competitorDiffPercent).toBeCloseTo(-10.01, 1);
  });

  it("break-even-prisen giver nul i bidrag efter annoncering", () => {
    const r = calculate(base);
    expect(r.breakEvenPriceInclVat).not.toBeNull();
    const atBreakEven = calculate({ ...base, salesPriceInclVat: r.breakEvenPriceInclVat });
    expect(Math.abs(atBreakEven.contributionAfterAds)).toBeLessThan(0.05);
  });

  it("medregner importmoms som omkostning, når virksomheden ikke er momsregistreret", () => {
    const r = calculate({ ...base, vatRegistered: false, dutyPercent: 2.7 });
    expect(r.importVatIsCost).toBe(true);
    expect(r.duty).toBeCloseTo(230 * 0.027, 2);
    expect(r.importVat).toBeCloseTo((230 + 230 * 0.027) * 0.25, 2);
    expect(r.revenueExVat).toBe(899);
    expect(r.outputVat).toBe(0);
  });

  it("break-even inkluderer fragt opkrævet hos kunden", () => {
    const r = calculate({ ...base, shippingChargedInclVat: 49 });
    const atBreakEven = calculate({ ...base, shippingChargedInclVat: 49, salesPriceInclVat: r.breakEvenPriceInclVat });
    expect(Math.abs(atBreakEven.contributionAfterAds)).toBeLessThan(0.05);
  });
});
