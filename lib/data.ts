// lib/data.ts — static seed data used until MongoDB is connected.
// Rates are illustrative samples for demo only — not live financial data.

import type { FDRate, LoanProduct, SIPFund, InsurancePlan } from '@/types';

export const fdRates: FDRate[] = [
  {
    id: 'sbi',
    bankName: 'State Bank of India',
    bankType: 'govt',
    rates: [
      { tenureLabel: '1 year', tenureMonths: 12, regularRate: 6.8, seniorRate: 7.3 },
      { tenureLabel: '3 years', tenureMonths: 36, regularRate: 6.75, seniorRate: 7.25 },
      { tenureLabel: '5 years', tenureMonths: 60, regularRate: 6.5, seniorRate: 7.5 },
    ],
  },
  {
    id: 'hdfc',
    bankName: 'HDFC Bank',
    bankType: 'private',
    rates: [
      { tenureLabel: '1 year', tenureMonths: 12, regularRate: 6.6, seniorRate: 7.1 },
      { tenureLabel: '3 years', tenureMonths: 36, regularRate: 7.0, seniorRate: 7.5 },
      { tenureLabel: '5 years', tenureMonths: 60, regularRate: 7.0, seniorRate: 7.5 },
    ],
  },
  {
    id: 'icici',
    bankName: 'ICICI Bank',
    bankType: 'private',
    rates: [
      { tenureLabel: '1 year', tenureMonths: 12, regularRate: 6.7, seniorRate: 7.2 },
      { tenureLabel: '3 years', tenureMonths: 36, regularRate: 7.0, seniorRate: 7.5 },
      { tenureLabel: '5 years', tenureMonths: 60, regularRate: 6.9, seniorRate: 7.4 },
    ],
  },
  {
    id: 'bob',
    bankName: 'Bank of Baroda',
    bankType: 'govt',
    rates: [
      { tenureLabel: '1 year', tenureMonths: 12, regularRate: 6.85, seniorRate: 7.35 },
      { tenureLabel: '3 years', tenureMonths: 36, regularRate: 7.15, seniorRate: 7.65 },
      { tenureLabel: '5 years', tenureMonths: 60, regularRate: 6.5, seniorRate: 7.4 },
    ],
  },
  {
    id: 'kotak',
    bankName: 'Kotak Mahindra Bank',
    bankType: 'private',
    rates: [
      { tenureLabel: '1 year', tenureMonths: 12, regularRate: 7.1, seniorRate: 7.6 },
      { tenureLabel: '3 years', tenureMonths: 36, regularRate: 7.0, seniorRate: 7.5 },
      { tenureLabel: '5 years', tenureMonths: 60, regularRate: 6.2, seniorRate: 6.7 },
    ],
  },
];

export const loanProducts: LoanProduct[] = [
  {
    id: 'sbi-home',
    bankName: 'State Bank of India',
    loanType: 'home',
    roiMin: 8.5,
    roiMax: 9.65,
    processingFee: '0.35% (max ₹10,000)',
    maxTenureMonths: 360,
    collateralRequired: true,
    maxAmount: 50000000,
    features: ['No prepayment charges', 'Women borrower concession'],
  },
  {
    id: 'hdfc-home',
    bankName: 'HDFC Bank',
    loanType: 'home',
    roiMin: 8.6,
    roiMax: 9.8,
    processingFee: 'Up to 0.5%',
    maxTenureMonths: 360,
    collateralRequired: true,
    maxAmount: 100000000,
    features: ['Balance transfer', 'Top-up loan'],
  },
  {
    id: 'icici-personal',
    bankName: 'ICICI Bank',
    loanType: 'personal',
    roiMin: 10.5,
    roiMax: 16.0,
    processingFee: 'Up to 2.5%',
    maxTenureMonths: 72,
    collateralRequired: false,
    maxAmount: 2500000,
    features: ['Instant approval', 'Flexible tenure'],
  },
  {
    id: 'axis-vehicle',
    bankName: 'Axis Bank',
    loanType: 'vehicle',
    roiMin: 9.1,
    roiMax: 12.0,
    processingFee: 'Up to 1%',
    maxTenureMonths: 84,
    collateralRequired: true,
    maxAmount: 5000000,
    features: ['Up to 100% on-road funding', 'Quick disbursal'],
  },
  {
    id: 'bob-education',
    bankName: 'Bank of Baroda',
    loanType: 'education',
    roiMin: 8.15,
    roiMax: 10.6,
    processingFee: 'Nil up to ₹7.5L',
    maxTenureMonths: 180,
    collateralRequired: false,
    maxAmount: 15000000,
    features: ['Moratorium period', 'Tax benefit u/s 80E'],
  },
  {
    id: 'muthoot-gold',
    bankName: 'Muthoot Finance',
    loanType: 'gold',
    roiMin: 9.0,
    roiMax: 22.0,
    processingFee: 'Up to 1%',
    maxTenureMonths: 36,
    collateralRequired: true,
    maxAmount: 5000000,
    features: ['Disbursal in minutes', 'Loan against gold ornaments'],
  },
  {
    id: 'hdfc-gold',
    bankName: 'HDFC Bank',
    loanType: 'gold',
    roiMin: 8.5,
    roiMax: 16.0,
    processingFee: 'Up to 1%',
    maxTenureMonths: 24,
    collateralRequired: true,
    maxAmount: 4000000,
    features: ['Flexible repayment', 'High per-gram value'],
  },
];

export const sipFunds: SIPFund[] = [
  { id: 'f1', fundName: 'Nippon India Small Cap', category: 'Small Cap', return3y: 28.4, return5y: 31.2, risk: 'high' },
  { id: 'f2', fundName: 'Parag Parikh Flexi Cap', category: 'Flexi Cap', return3y: 21.6, return5y: 24.8, risk: 'medium' },
  { id: 'f3', fundName: 'HDFC Balanced Advantage', category: 'Hybrid', return3y: 18.2, return5y: 17.5, risk: 'medium' },
  { id: 'f4', fundName: 'ICICI Pru Bluechip', category: 'Large Cap', return3y: 17.9, return5y: 18.6, risk: 'low' },
  { id: 'f5', fundName: 'Quant Mid Cap', category: 'Mid Cap', return3y: 26.1, return5y: 29.0, risk: 'high' },
];

export const insurancePlans: InsurancePlan[] = [
  { id: 'i1', company: 'HDFC Ergo', planName: 'Optima Secure', insuranceType: 'health', annualPremium: 11500, features: ['No room rent cap', '2x cover'] },
  { id: 'i2', company: 'Star Health', planName: 'Comprehensive', insuranceType: 'health', annualPremium: 13200, features: ['Maternity cover', 'Restore benefit'] },
  { id: 'i3', company: 'LIC', planName: 'Jeevan Anand', insuranceType: 'life', annualPremium: 24000, features: ['Guaranteed bonus', 'Whole life cover'] },
  { id: 'i4', company: 'Max Life', planName: 'Smart Secure Plus', insuranceType: 'life', annualPremium: 9800, features: ['Term cover', 'Return of premium'] },
  { id: 'i5', company: 'ICICI Lombard', planName: 'Motor Shield', insuranceType: 'vehicle', annualPremium: 8500, features: ['Zero depreciation', 'Roadside assistance'] },
];
