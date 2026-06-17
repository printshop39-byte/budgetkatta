// types/index.ts — shared TypeScript interfaces

export type Language = 'mr' | 'en';

/** Bilingual string — localized content kept centrally in lib/ data modules. */
export type Bi = { mr: string; en: string };

export type LeadModule = 'FD' | 'LOAN' | 'SIP' | 'INSURANCE' | 'GENERAL' | 'CONTACT';

export interface LeadPayload {
  userName?: string;
  phone?: string;
  email?: string;
  city?: string;
  selectedLanguage: Language;
  interestedModule: LeadModule;
  selectedProduct?: string;
  userQuery?: string;
  sourcePage: string;
  timestamp: string;
}

export interface FDRateRow {
  tenureLabel: string;
  tenureMonths: number;
  regularRate: number;
  seniorRate: number;
}

export interface FDRate {
  id: string;
  bankName: string;
  bankType: 'govt' | 'private' | 'cooperative';
  logo?: string;
  rates: FDRateRow[];
}

export interface LoanProduct {
  id: string;
  bankName: string;
  loanType: 'home' | 'personal' | 'vehicle' | 'business' | 'education' | 'gold';
  roiMin: number;
  roiMax: number;
  processingFee: string;
  maxTenureMonths: number;
  collateralRequired: boolean;
  maxAmount: number;
  features: string[];
}

export interface SIPFund {
  id: string;
  fundName: string;
  category: string;
  return3y: number;
  return5y: number;
  risk: 'low' | 'medium' | 'high';
}

export interface InsurancePlan {
  id: string;
  company: string;
  planName: string;
  insuranceType: 'health' | 'life' | 'vehicle';
  annualPremium: number;
  features: string[];
}

export interface CompareItem {
  id: string;
  name: string;
  data: string[];
}
