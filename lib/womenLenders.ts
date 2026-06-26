// lib/womenLenders.ts — business-loan lenders for women entrepreneurs, shown in
// the comparison widget on /loans/women (Bajaj Finserv / Tata Capital /
// Lendingkart). These are commercial NBFC business loans (the affiliate-earning
// part) and complement the government schemes (Mudra, Stand-Up India, etc.).
//
// Each `href` resolves: per-lender env link -> aggregator link (e.g. Paisabazaar
// business loan) -> the lender's official site. Set the env vars when you obtain
// real referral links (see .env.example).
import type { Lender } from '@/components/schemes/LenderComparison';

export const WOMEN_LENDERS_UPDATED = '26 June 2026';

// Single aggregator referral link (Paisabazaar / BankBazaar business loan)
// covering many lenders under one URL. Powers the "compare all" CTA.
export const WOMEN_AGGREGATOR_LINK = process.env.NEXT_PUBLIC_AFF_WOMEN_AGGREGATOR || '';

export const womenLenders: Lender[] = [
  {
    id: 'bajaj',
    name: 'Bajaj Finserv',
    href: process.env.NEXT_PUBLIC_AFF_LENDER_BAJAJ || WOMEN_AGGREGATOR_LINK || 'https://www.bajajfinserv.in/business-loan',
    rate: { mr: '~14% – 26%*', en: '~14% – 26%*' },
    maxAmount: { mr: '₹80 लाखांपर्यंत*', en: 'Up to ₹80 lakh*' },
    collateral: { mr: 'विनातारण', en: 'Collateral-free' },
    highlight: { mr: 'जलद मंजुरी', en: 'Fast approval' },
  },
  {
    id: 'tatacap',
    name: 'Tata Capital',
    href: process.env.NEXT_PUBLIC_AFF_LENDER_TATACAP || WOMEN_AGGREGATOR_LINK || 'https://www.tatacapital.com/business-loan.html',
    rate: { mr: '~12% – 25%*', en: '~12% – 25%*' },
    maxAmount: { mr: '₹75 लाखांपर्यंत*', en: 'Up to ₹75 lakh*' },
    collateral: { mr: 'विनातारण', en: 'Collateral-free' },
    highlight: { mr: 'लवचिक मुदत', en: 'Flexible tenure' },
  },
  {
    id: 'lendingkart',
    name: 'Lendingkart',
    href: process.env.NEXT_PUBLIC_AFF_LENDER_LENDINGKART || WOMEN_AGGREGATOR_LINK || 'https://www.lendingkart.com',
    rate: { mr: 'दरमहा ~1.5% पासून*', en: 'From ~1.5%/month*' },
    maxAmount: { mr: '₹2 कोटींपर्यंत*', en: 'Up to ₹2 crore*' },
    collateral: { mr: 'विनातारण', en: 'Collateral-free' },
    highlight: { mr: 'MSME साठी जलद', en: 'Fast for MSMEs' },
  },
];
