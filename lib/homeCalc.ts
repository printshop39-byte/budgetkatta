// lib/homeCalc.ts — pure estimate helpers for the home-finance calculators.
// Every function returns an ESTIMATE only; none of this is a bank's eligibility
// or sanction decision. Inputs that vary by bank/state (FOIR, stamp duty, fees)
// are always parameters so the UI can expose them for the user to edit.
import { calculateEMI } from '@/lib/calculators';

const clamp0 = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

/** Present value of `emi` paid monthly — i.e. the loan that EMI can service. */
export function principalFromEMI(emi: number, annualRate: number, months: number): number {
  const e = clamp0(emi);
  const n = clamp0(months);
  if (e === 0 || n === 0) return 0;
  const r = annualRate / 1200;
  if (r === 0) return Math.round(e * n);
  return Math.round((e * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)));
}

export type EligibilityInput = {
  monthlyIncome: number;
  existingEmi: number;
  annualRate: number;
  tenureMonths: number;
  /** Share of income a lender may allow towards all EMIs (indicative; banks differ). */
  foir: number;
};

export function estimateEligibility(i: EligibilityInput) {
  const maxTotalEmi = clamp0(i.monthlyIncome) * clamp0(i.foir);
  const affordableEmi = Math.max(0, Math.round(maxTotalEmi - clamp0(i.existingEmi)));
  return {
    affordableEmi,
    loanAmount: principalFromEMI(affordableEmi, i.annualRate, i.tenureMonths),
  };
}

export type DownPaymentInput = { propertyPrice: number; marginPercent: number };

/** Own contribution (margin) vs. loan for a given property price. */
export function estimateDownPayment({ propertyPrice, marginPercent }: DownPaymentInput) {
  const price = clamp0(propertyPrice);
  const pct = Math.min(100, clamp0(marginPercent));
  const downPayment = Math.round((price * pct) / 100);
  return { downPayment, loanNeeded: price - downPayment };
}

export type PurchaseCostInput = {
  propertyPrice: number;
  stampDutyPercent: number;
  registrationPercent: number;
  /** Registration fee cap in ₹ (0 = no cap). */
  registrationCap: number;
  gstPercent: number;
  otherCosts: number;
};

/** Upfront cost of buying, on top of the loan — all rates user-editable. */
export function estimatePurchaseCost(i: PurchaseCostInput) {
  const price = clamp0(i.propertyPrice);
  const stampDuty = Math.round((price * clamp0(i.stampDutyPercent)) / 100);
  const rawReg = Math.round((price * clamp0(i.registrationPercent)) / 100);
  const registration = i.registrationCap > 0 ? Math.min(rawReg, i.registrationCap) : rawReg;
  const gst = Math.round((price * clamp0(i.gstPercent)) / 100);
  const other = clamp0(i.otherCosts);
  const extra = stampDuty + registration + gst + other;
  return { stampDuty, registration, gst, other, extra, total: price + extra };
}

export type TransferInput = {
  outstanding: number;
  currentRate: number;
  newRate: number;
  remainingMonths: number;
  /** Total one-time cost of moving: processing, legal, prepayment/foreclosure etc. */
  switchingCost: number;
};

/** Compare staying vs. moving the remaining balance at a new rate, same tenure. */
export function compareTransfer(i: TransferInput) {
  const months = clamp0(i.remainingMonths) || 1;
  const cur = calculateEMI(clamp0(i.outstanding), i.currentRate, months);
  const nxt = calculateEMI(clamp0(i.outstanding), i.newRate, months);
  const emiSaving = cur.emi - nxt.emi;
  const interestSaving = cur.totalInterest - nxt.totalInterest;
  const netSaving = interestSaving - clamp0(i.switchingCost);
  const breakEvenMonths = emiSaving > 0 ? Math.ceil(clamp0(i.switchingCost) / emiSaving) : null;
  return { current: cur, next: nxt, emiSaving, interestSaving, netSaving, breakEvenMonths };
}

export type SetupTier = 'basic' | 'medium' | 'full';

/**
 * Planning split of a home-setup budget. The shares are a rule-of-thumb to start
 * a conversation with vendors — not market prices — and are shown as guidance,
 * not a quote.
 */
export const SETUP_SPLIT: Record<SetupTier, { key: string; share: number }[]> = {
  basic: [
    { key: 'kitchen', share: 25 },
    { key: 'furniture', share: 40 },
    { key: 'appliances', share: 20 },
    { key: 'setup', share: 10 },
    { key: 'buffer', share: 5 },
  ],
  medium: [
    { key: 'kitchen', share: 25 },
    { key: 'furniture', share: 30 },
    { key: 'interior', share: 25 },
    { key: 'appliances', share: 10 },
    { key: 'setup', share: 5 },
    { key: 'buffer', share: 5 },
  ],
  full: [
    { key: 'kitchen', share: 20 },
    { key: 'furniture', share: 25 },
    { key: 'interior', share: 35 },
    { key: 'appliances', share: 8 },
    { key: 'setup', share: 5 },
    { key: 'buffer', share: 7 },
  ],
};

export function splitSetupBudget(total: number, tier: SetupTier) {
  const t = clamp0(total);
  return SETUP_SPLIT[tier].map((row) => ({ key: row.key, share: row.share, amount: Math.round((t * row.share) / 100) }));
}
