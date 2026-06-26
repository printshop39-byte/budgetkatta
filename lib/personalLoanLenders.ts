// lib/personalLoanLenders.ts — "personal loan for education" lenders, shown on
// /loans/students/personal-loan. When a direct education loan isn't approved,
// a personal loan can fund fees/laptop/coaching — and these NBFC personal-loan
// campaigns are the most affiliate-available (Paisabazaar / Ruloans / BankBazaar
// via Cuelinks). Each href resolves: per-lender env -> aggregator -> official.
import type { Lender } from '@/components/schemes/LenderComparison';

export const PL_LENDERS_UPDATED = '26 June 2026';

// Single aggregator referral link (Paisabazaar / Ruloans / BankBazaar personal
// loan) covering many lenders under one URL — powers the "compare all" CTA.
export const PL_AGGREGATOR_LINK = process.env.NEXT_PUBLIC_AFF_PL_AGGREGATOR || '';

export const personalLoanLenders: Lender[] = [
  {
    id: 'bajaj-pl',
    name: 'Bajaj Finserv',
    href: process.env.NEXT_PUBLIC_AFF_LENDER_BAJAJ_PL || PL_AGGREGATOR_LINK || 'https://www.bajajfinserv.in/personal-loan',
    rate: { mr: '~11% – 31%*', en: '~11% – 31%*' },
    maxAmount: { mr: '₹40 लाखांपर्यंत*', en: 'Up to ₹40 lakh*' },
    collateral: { mr: 'विनातारण', en: 'Collateral-free' },
    highlight: { mr: 'जलद वितरण', en: 'Fast disbursal' },
  },
  {
    id: 'tatacap-pl',
    name: 'Tata Capital',
    href: process.env.NEXT_PUBLIC_AFF_LENDER_TATACAP_PL || PL_AGGREGATOR_LINK || 'https://www.tatacapital.com/personal-loan.html',
    rate: { mr: '~10.99% पासून*', en: 'From ~10.99%*' },
    maxAmount: { mr: '₹35 लाखांपर्यंत*', en: 'Up to ₹35 lakh*' },
    collateral: { mr: 'विनातारण', en: 'Collateral-free' },
    highlight: { mr: 'लवचिक मुदत', en: 'Flexible tenure' },
  },
  {
    id: 'moneyview-pl',
    name: 'Money View',
    href: process.env.NEXT_PUBLIC_AFF_LENDER_MONEYVIEW || PL_AGGREGATOR_LINK || 'https://moneyview.in/personal-loan',
    rate: { mr: '~16% पासून*', en: 'From ~16%*' },
    maxAmount: { mr: '₹10 लाखांपर्यंत*', en: 'Up to ₹10 lakh*' },
    collateral: { mr: 'विनातारण', en: 'Collateral-free' },
    highlight: { mr: 'कमी क्रेडिट स्कोअरही चालतो', en: 'Works with lower credit scores' },
  },
];
