// Credit-card offers for the CreditCardOffers section.
//
// Each `href` DEFAULTS to the issuer's OFFICIAL credit-card page — a real,
// working link (so "Check on official site" is always honest). When you obtain a
// referral / affiliate link, set the matching env var (NEXT_PUBLIC_AFF_CC_*) to
// override it.
//
// ⚠️ Joining fee / annual fee / reward figures are INDICATIVE and change
// frequently. They are always shown with the "verify on official site" note
// (card.indicative) and a trailing '*'. Update them as needed.
//
// Figures below reviewed against issuer / aggregator sources (Jun 2026):
//   HDFC Millennia  — joining & renewal ₹1,000, waived on ₹1L annual spend;
//                     5% cashback on 10 brands, 1% on others.
//   SBI SimplyCLICK — annual ₹499, waived on ₹1L spend; 10X on partner brands,
//                     5X on other online spends.
//   Flipkart Axis   — joining & annual ₹500, waived on ₹3.5L spend; 5% Flipkart,
//                     7.5% Myntra cashback.
//   Axis MyZone     — joining & annual ₹500, waived on spend milestone; free
//                     SonyLIV annual subscription + dining / movie / travel offers.

// Date the figures below were last reviewed. Update this whenever you verify /
// change the charges so the UI can show users how fresh the data is.
export const CREDIT_CARD_OFFERS_UPDATED = '25 June 2026';

type Bi = { mr: string; en: string };

export interface CreditCardOffer {
  id: string;
  name: string;
  href: string;
  joiningFee: Bi;
  annualFee: Bi;
  reward: Bi;
  bestFor: Bi;
}

export const creditCardOffers: CreditCardOffer[] = [
  {
    id: 'hdfc-millennia',
    name: 'HDFC Millennia',
    href: process.env.NEXT_PUBLIC_AFF_HDFC_CC || 'https://www.hdfcbank.com/personal/pay/cards/credit-cards',
    joiningFee: { mr: '₹1,000*', en: '₹1,000*' },
    annualFee: { mr: '₹1,000/वर्ष (₹1L खर्चावर माफ)*', en: '₹1,000/yr (waived on ₹1L spend)*' },
    reward: { mr: '10 ब्रँड्सवर 5% cashback, इतरांवर 1%*', en: '5% cashback on 10 brands, 1% on others*' },
    bestFor: { mr: 'ऑनलाइन शॉपिंग', en: 'Online shopping' },
  },
  {
    id: 'sbi-simplyclick',
    name: 'SBI SimplyCLICK',
    href: process.env.NEXT_PUBLIC_AFF_SBI_CC || 'https://www.sbicard.com',
    joiningFee: { mr: '₹499*', en: '₹499*' },
    annualFee: { mr: '₹499/वर्ष (₹1L खर्चावर माफ)*', en: '₹499/yr (waived on ₹1L spend)*' },
    reward: { mr: 'Partner brands वर 10X, इतर ऑनलाइनवर 5X रिवॉर्ड्स*', en: '10X on partner brands, 5X on other online*' },
    bestFor: { mr: 'ऑनलाइन खर्च', en: 'Online spends' },
  },
  {
    id: 'axis-flipkart',
    name: 'Axis Flipkart',
    href: process.env.NEXT_PUBLIC_AFF_CC_AXIS || 'https://www.axisbank.com/retail/cards/credit-card',
    joiningFee: { mr: '₹500*', en: '₹500*' },
    annualFee: { mr: '₹500/वर्ष (₹3.5L खर्चावर माफ)*', en: '₹500/yr (waived on ₹3.5L spend)*' },
    reward: { mr: 'Flipkart 5%, Myntra 7.5% cashback*', en: '5% on Flipkart, 7.5% on Myntra*' },
    bestFor: { mr: 'Flipkart / Myntra खरेदी', en: 'Flipkart & Myntra' },
  },
  {
    id: 'axis-myzone',
    name: 'Axis MyZone',
    href: process.env.NEXT_PUBLIC_AFF_AXIS_CC || 'https://www.axisbank.com/retail/cards/credit-card',
    joiningFee: { mr: '₹500*', en: '₹500*' },
    annualFee: { mr: '₹500/वर्ष (खर्चावर माफ)*', en: '₹500/yr (waived on spend)*' },
    reward: { mr: 'मोफत SonyLIV वार्षिक सदस्यता + dining/movie सवलती*', en: 'Free SonyLIV annual + dining/movie offers*' },
    bestFor: { mr: 'मनोरंजन व जेवण', en: 'Entertainment & dining' },
  },
];
