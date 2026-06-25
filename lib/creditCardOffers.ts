// Credit-card offers for the CreditCardOffers section.
//
// Each `href` DEFAULTS to the issuer's OFFICIAL credit-card page — a real,
// working link (so "Check on official site" is always honest). When you obtain a
// referral / affiliate link, set the matching env var (NEXT_PUBLIC_AFF_*_CC, or
// NEXT_PUBLIC_AFF_AU_BANK) to override it. Env var names match the Vercel project.
//
// ⚠️ Joining fee / annual fee / reward figures are INDICATIVE and change
// frequently. They are always shown with the "verify on official site" note
// (card.indicative) and a trailing '*'. Update them as needed.
//
// Figures below reviewed against issuer / aggregator sources (Jun 2026):
//   HDFC Millennia  — joining & renewal ₹1,000, waived on ₹1L spend.
//   SBI SimplyCLICK — annual ₹499, waived on ₹1L spend.
//   Axis MyZone     — joining & annual ₹500; free SonyLIV + dining/movie offers.
//   YES ELITE+      — ₹999 (often LTF via select channels); 12 RP / ₹200 online.
//   BOBCARD Eterna  — ₹2,499 (limited-time LTF); 15 RP / ₹100 + unlimited lounge.
//   Amex SmartEarn  — ₹495, waived on ₹40k spend; 10X at partner merchants.
//   AU LIT          — lifetime free, customisable (quarterly fee per feature).

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
    id: 'axis-myzone',
    name: 'Axis MyZone',
    href: process.env.NEXT_PUBLIC_AFF_AXIS_CC || 'https://www.axisbank.com/retail/cards/credit-card',
    joiningFee: { mr: '₹500*', en: '₹500*' },
    annualFee: { mr: '₹500/वर्ष (खर्चावर माफ)*', en: '₹500/yr (waived on spend)*' },
    reward: { mr: 'मोफत SonyLIV वार्षिक सदस्यता + dining/movie सवलती*', en: 'Free SonyLIV annual + dining/movie offers*' },
    bestFor: { mr: 'मनोरंजन व जेवण', en: 'Entertainment & dining' },
  },
  {
    id: 'yes-elite-plus',
    name: 'YES Bank ELITE+',
    href: process.env.NEXT_PUBLIC_AFF_YES_CC || 'https://www.yesbank.in/personal-banking/yes-individual/cards/credit-cards',
    joiningFee: { mr: '₹999 (निवडक चॅनेलवर मोफत)*', en: '₹999 (free via select channels)*' },
    annualFee: { mr: '₹999/वर्ष (खर्चावर माफ)*', en: '₹999/yr (waived on spend)*' },
    reward: { mr: 'ऑनलाइन ₹200 वर 12 Reward Points*', en: '12 reward points per ₹200 online*' },
    bestFor: { mr: 'रिवॉर्ड्स', en: 'Rewards' },
  },
  {
    id: 'bobcard-eterna',
    name: 'BOBCARD Eterna',
    href: process.env.NEXT_PUBLIC_AFF_BOB_CC || 'https://www.bobcard.co.in',
    joiningFee: { mr: '₹2,499 (मर्यादित काळ मोफत)*', en: '₹2,499 (limited-time free)*' },
    annualFee: { mr: '₹2,499/वर्ष (₹2.5L खर्चावर माफ)*', en: '₹2,499/yr (waived on ₹2.5L)*' },
    reward: { mr: '₹100 वर 15 Reward Points + unlimited lounge*', en: '15 reward points per ₹100 + unlimited lounge*' },
    bestFor: { mr: 'प्रवास व lounge', en: 'Travel & lounge' },
  },
  {
    id: 'amex-smartearn',
    name: 'Amex SmartEarn',
    href: process.env.NEXT_PUBLIC_AFF_AMEX_CC || 'https://www.americanexpress.com/in/credit-cards/smart-earn-credit-card/',
    joiningFee: { mr: '₹495*', en: '₹495*' },
    annualFee: { mr: '₹495/वर्ष (₹40k खर्चावर माफ)*', en: '₹495/yr (waived on ₹40k)*' },
    reward: { mr: 'Amazon/Flipkart/Uber partners वर 10X पर्यंत*', en: 'Up to 10X at Amazon/Flipkart/Uber partners*' },
    bestFor: { mr: 'ऑनलाइन खर्च', en: 'Online spends' },
  },
  {
    id: 'au-lit',
    name: 'AU LIT',
    href: process.env.NEXT_PUBLIC_AFF_AU_BANK || 'https://www.aubank.in/personal-banking/credit-cards',
    joiningFee: { mr: '₹0 (आजीवन मोफत)*', en: '₹0 (lifetime free)*' },
    annualFee: { mr: '₹0 (फीचर्सनुसार त्रैमासिक शुल्क)*', en: '₹0 (quarterly fee per features)*' },
    reward: { mr: 'निवडक फीचर्सवर 10X पर्यंत rewards/cashback*', en: 'Up to 10X on chosen features*' },
    bestFor: { mr: 'कस्टमाइझ करण्यायोग्य', en: 'Customisable' },
  },
];
