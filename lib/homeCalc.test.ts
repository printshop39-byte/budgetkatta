import { describe, it, expect } from 'vitest';
import {
  principalFromEMI,
  estimateEligibility,
  estimateDownPayment,
  estimatePurchaseCost,
  compareTransfer,
  splitSetupBudget,
  SETUP_SPLIT,
  amortizationByYear,
} from './homeCalc';
import { calculateEMI } from './calculators';

describe('principalFromEMI', () => {
  it('inverts calculateEMI (round trip within rounding)', () => {
    const { emi } = calculateEMI(5_000_000, 8.5, 240);
    expect(Math.abs(principalFromEMI(emi, 8.5, 240) - 5_000_000)).toBeLessThan(2_000);
  });
  it('handles zero rate and zero/invalid input', () => {
    expect(principalFromEMI(1000, 0, 12)).toBe(12_000);
    expect(principalFromEMI(0, 8, 120)).toBe(0);
    expect(principalFromEMI(NaN, 8, 120)).toBe(0);
  });
});

describe('estimateEligibility', () => {
  it('subtracts existing EMIs from the FOIR cap', () => {
    const r = estimateEligibility({ monthlyIncome: 100_000, existingEmi: 10_000, annualRate: 8.5, tenureMonths: 240, foir: 0.5 });
    expect(r.affordableEmi).toBe(40_000);
    expect(r.loanAmount).toBeGreaterThan(0);
  });
  it('never goes negative when existing EMIs exceed the cap', () => {
    const r = estimateEligibility({ monthlyIncome: 50_000, existingEmi: 40_000, annualRate: 9, tenureMonths: 120, foir: 0.5 });
    expect(r).toEqual({ affordableEmi: 0, loanAmount: 0 });
  });
});

describe('estimateDownPayment', () => {
  it('splits price into margin and loan', () => {
    expect(estimateDownPayment({ propertyPrice: 5_000_000, marginPercent: 20 })).toEqual({ downPayment: 1_000_000, loanNeeded: 4_000_000 });
  });
  it('clamps margin to 0-100', () => {
    expect(estimateDownPayment({ propertyPrice: 100, marginPercent: 150 }).loanNeeded).toBe(0);
    expect(estimateDownPayment({ propertyPrice: 100, marginPercent: -5 }).downPayment).toBe(0);
  });
});

describe('estimatePurchaseCost', () => {
  const base = { propertyPrice: 5_000_000, stampDutyPercent: 6, registrationPercent: 1, registrationCap: 30_000, gstPercent: 0, otherCosts: 50_000 };
  it('applies the registration cap', () => {
    const r = estimatePurchaseCost(base);
    expect(r.stampDuty).toBe(300_000);
    expect(r.registration).toBe(30_000);
    expect(r.total).toBe(5_000_000 + 300_000 + 30_000 + 50_000);
  });
  it('treats cap 0 as no cap', () => {
    expect(estimatePurchaseCost({ ...base, registrationCap: 0 }).registration).toBe(50_000);
  });
});

describe('compareTransfer', () => {
  it('reports savings and break-even when the new rate is lower', () => {
    const r = compareTransfer({ outstanding: 4_000_000, currentRate: 9.5, newRate: 8.5, remainingMonths: 180, switchingCost: 30_000 });
    expect(r.emiSaving).toBeGreaterThan(0);
    expect(r.interestSaving).toBeGreaterThan(30_000);
    expect(r.netSaving).toBe(r.interestSaving - 30_000);
    expect(r.breakEvenMonths).toBeGreaterThan(0);
  });
  it('has no break-even when the new rate is not lower', () => {
    const r = compareTransfer({ outstanding: 4_000_000, currentRate: 8.5, newRate: 9, remainingMonths: 180, switchingCost: 10_000 });
    expect(r.breakEvenMonths).toBeNull();
    expect(r.netSaving).toBeLessThan(0);
  });
});

describe('splitSetupBudget', () => {
  it('every tier shares sum to 100', () => {
    for (const tier of Object.keys(SETUP_SPLIT) as (keyof typeof SETUP_SPLIT)[]) {
      expect(SETUP_SPLIT[tier].reduce((s, r) => s + r.share, 0)).toBe(100);
    }
  });
  it('amounts add up to the budget', () => {
    const sum = splitSetupBudget(1_000_000, 'medium').reduce((s, r) => s + r.amount, 0);
    expect(sum).toBe(1_000_000);
  });
});

describe('amortizationByYear', () => {
  it('principal sums to the loan and the balance reaches zero', () => {
    const rows = amortizationByYear(4_000_000, 8.75, 240);
    expect(rows).toHaveLength(20);
    const sum = rows.reduce((t, r) => t + r.principal, 0);
    expect(Math.abs(sum - 4_000_000)).toBeLessThan(40); // per-year rounding only
    expect(rows[rows.length - 1].balance).toBe(0);
  });
  it('interest share falls over time', () => {
    const rows = amortizationByYear(4_000_000, 8.75, 240);
    expect(rows[0].interest).toBeGreaterThan(rows[rows.length - 1].interest);
  });
  it('total interest agrees with calculateEMI within rounding', () => {
    const rows = amortizationByYear(4_000_000, 8.75, 240);
    const interest = rows.reduce((t, r) => t + r.interest, 0);
    expect(Math.abs(interest - calculateEMI(4_000_000, 8.75, 240).totalInterest)).toBeLessThan(5_000);
  });
  it('handles empty input and part-year tenures', () => {
    expect(amortizationByYear(0, 8, 120)).toEqual([]);
    expect(amortizationByYear(100_000, 8, 18)).toHaveLength(2);
  });
});
