// lib/calculators.ts — pure calculation helpers

/** FD Maturity Calculator (quarterly compounding) */
export function calculateFDMaturity(
  principal: number,
  annualRate: number,
  tenureYears: number,
  isSeniorCitizen: boolean = false
): { maturityAmount: number; totalInterest: number } {
  const rate = isSeniorCitizen ? annualRate + 0.5 : annualRate;
  const n = 4; // quarterly compounding
  const r = rate / 100;
  const maturityAmount = principal * Math.pow(1 + r / n, n * tenureYears);
  return {
    maturityAmount: Math.round(maturityAmount),
    totalInterest: Math.round(maturityAmount - principal),
  };
}

/** EMI Calculator */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): { emi: number; totalInterest: number; totalAmount: number } {
  const monthlyRate = annualRate / (12 * 100);
  // Guard against zero-rate division
  const emi =
    monthlyRate === 0
      ? principal / tenureMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  const totalAmount = Math.round(emi * tenureMonths);
  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalAmount - principal),
    totalAmount,
  };
}

/** SIP Calculator */
export function calculateSIP(
  monthlyInvestment: number,
  annualReturnRate: number,
  tenureYears: number
): { invested: number; estimatedReturns: number; maturityValue: number } {
  const monthlyRate = annualReturnRate / (12 * 100);
  const months = tenureYears * 12;
  const maturityValue =
    monthlyRate === 0
      ? monthlyInvestment * months
      : monthlyInvestment *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate);
  const invested = monthlyInvestment * months;
  return {
    invested,
    estimatedReturns: Math.round(maturityValue - invested),
    maturityValue: Math.round(maturityValue),
  };
}

/** Insurance Premium Estimator — simplified range */
export function estimateInsurancePremium(
  age: number,
  coverAmount: number,
  insuranceType: 'health' | 'life' | 'vehicle',
  policyTerm: number
): { minPremium: number; maxPremium: number; suggestedCover: number; riskNote: string } {
  let basePer1Lakh = 300;
  const covers = coverAmount / 100000;

  if (insuranceType === 'health') {
    basePer1Lakh = age < 30 ? 250 : age < 45 ? 400 : age < 55 ? 700 : 1100;
  } else if (insuranceType === 'life') {
    basePer1Lakh = age < 30 ? 80 : age < 40 ? 140 : age < 50 ? 250 : 450;
  } else {
    basePer1Lakh = 180;
  }

  const base = basePer1Lakh * covers;
  return {
    minPremium: Math.round(base * 0.85),
    maxPremium: Math.round(base * 1.25),
    suggestedCover: Math.round(coverAmount * 1.2),
    riskNote:
      age > 45 ? 'Medical tests may be required.' : 'Standard coverage terms apply.',
  };
}

/** Format currency — Indian style */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
