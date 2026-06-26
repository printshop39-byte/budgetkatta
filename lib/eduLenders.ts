// lib/eduLenders.ts — education-loan lenders for the comparison widget on
// /loans/students (Credila vs Avanse vs InCred vs SBI).
//
// Each `href` DEFAULTS to the lender's OFFICIAL website — a real, working link
// (so "Apply" is always honest). When you obtain a referral / affiliate link
// (e.g. via Cuelinks, INRDeals or the lender's own DSA/partner programme), set
// the matching env var (NEXT_PUBLIC_AFF_LENDER_*) to override it and earn the
// commission.
//
// ⚠️ Interest-rate / amount figures are INDICATIVE and change frequently. They
// are shown with a trailing '*' and the "verify on official site" note. Update
// EDU_LENDERS_UPDATED whenever you re-check them.
import type { Bi } from '@/types';

export const EDU_LENDERS_UPDATED = '26 June 2026';

// Single aggregator affiliate link (e.g. Paisabazaar / BankBazaar) that covers
// SBI + many private lenders under ONE referral URL. When set, it powers the
// "compare all" CTA and acts as the fallback for any lender that doesn't yet
// have its own direct affiliate link. Recommended first step for a new site.
export const EDU_AGGREGATOR_LINK = process.env.NEXT_PUBLIC_AFF_EDU_AGGREGATOR || '';

export interface EduLender {
  id: string;
  name: string;
  href: string;
  rate: Bi; // व्याजदर श्रेणी
  maxAmount: Bi; // कमाल रक्कम
  collateral: Bi; // तारण
  highlight: Bi; // ठळक वैशिष्ट्य
}

export const eduLenders: EduLender[] = [
  {
    id: 'credila',
    name: 'HDFC Credila',
    href: process.env.NEXT_PUBLIC_AFF_LENDER_CREDILA || EDU_AGGREGATOR_LINK || 'https://www.credila.com',
    rate: { mr: '~10.5% – 12.5%*', en: '~10.5% – 12.5%*' },
    maxAmount: { mr: 'गरजेनुसार (no cap)*', en: 'Need-based (no cap)*' },
    collateral: { mr: 'मोठ्या रकमेसाठी आवश्यक', en: 'For larger amounts' },
    highlight: { mr: 'परदेशी शिक्षणासाठी विशेषज्ञ', en: 'Specialist for abroad study' },
  },
  {
    id: 'avanse',
    name: 'Avanse',
    href: process.env.NEXT_PUBLIC_AFF_LENDER_AVANSE || EDU_AGGREGATOR_LINK || 'https://www.avanse.com',
    rate: { mr: '~11% – 14%*', en: '~11% – 14%*' },
    maxAmount: { mr: '₹75 लाखांपर्यंत*', en: 'Up to ₹75 lakh*' },
    collateral: { mr: 'रकमेनुसार', en: 'Amount-dependent' },
    highlight: { mr: 'जलद प्रोसेसिंग', en: 'Fast processing' },
  },
  {
    id: 'incred',
    name: 'InCred',
    href: process.env.NEXT_PUBLIC_AFF_LENDER_INCRED || EDU_AGGREGATOR_LINK || 'https://www.incred.com',
    rate: { mr: '~11% – 14%*', en: '~11% – 14%*' },
    maxAmount: { mr: '₹60 लाखांपर्यंत*', en: 'Up to ₹60 lakh*' },
    collateral: { mr: 'विनातारण पर्याय', en: 'Collateral-free option' },
    highlight: { mr: 'लवचिक परतफेड', en: 'Flexible repayment' },
  },
  {
    id: 'sbi-edu',
    name: 'SBI Global Ed-Vantage',
    href:
      process.env.NEXT_PUBLIC_AFF_LENDER_SBI_EDU ||
      EDU_AGGREGATOR_LINK ||
      'https://sbi.co.in/web/personal-banking/loans/education-loans',
    rate: { mr: '~10.15%*', en: '~10.15%*' },
    maxAmount: { mr: '₹1.5 कोटींपर्यंत*', en: 'Up to ₹1.5 crore*' },
    collateral: { mr: 'आवश्यक', en: 'Required' },
    highlight: { mr: 'सरकारी बँक, कमी दर', en: 'PSU bank, low rate' },
  },
];
