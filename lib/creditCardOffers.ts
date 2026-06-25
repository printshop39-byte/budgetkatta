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
    href: process.env.NEXT_PUBLIC_AFF_CC_HDFC || 'https://www.hdfcbank.com/personal/pay/cards/credit-cards',
    joiningFee: { mr: '₹500*', en: '₹500*' },
    annualFee: { mr: '₹500/वर्ष (खर्चावर माफ)*', en: '₹500/yr (waived on spend)*' },
    reward: { mr: 'निवडक merchants वर 5% cashback*', en: '5% cashback on select merchants*' },
    bestFor: { mr: 'ऑनलाइन शॉपिंग', en: 'Online shopping' },
  },
  {
    id: 'sbi-simplyclick',
    name: 'SBI SimplyCLICK',
    href: process.env.NEXT_PUBLIC_AFF_CC_SBI || 'https://www.sbicard.com',
    joiningFee: { mr: '₹499*', en: '₹499*' },
    annualFee: { mr: '₹499/वर्ष (खर्चावर माफ)*', en: '₹499/yr (waived on spend)*' },
    reward: { mr: 'ऑनलाइन खर्चावर 10X रिवॉर्ड्स*', en: '10X rewards on online spends*' },
    bestFor: { mr: 'ऑनलाइन खर्च', en: 'Online spends' },
  },
  {
    id: 'axis-flipkart',
    name: 'Axis Flipkart',
    href: process.env.NEXT_PUBLIC_AFF_CC_AXIS || 'https://www.axisbank.com/retail/cards/credit-card',
    joiningFee: { mr: '₹500*', en: '₹500*' },
    annualFee: { mr: '₹500/वर्ष*', en: '₹500/yr*' },
    reward: { mr: 'Flipkart वर 5% cashback*', en: '5% cashback on Flipkart*' },
    bestFor: { mr: 'Flipkart खरेदी', en: 'Flipkart shoppers' },
  },
  {
    id: 'amazonpay-icici',
    name: 'Amazon Pay ICICI',
    href: process.env.NEXT_PUBLIC_AFF_CC_ICICI || 'https://www.icicibank.com/personal-banking/cards/credit-card',
    joiningFee: { mr: '₹0 (आजीवन मोफत)*', en: '₹0 (lifetime free)*' },
    annualFee: { mr: '₹0*', en: '₹0*' },
    reward: { mr: 'Amazon वर 5% पर्यंत परतावा (Prime)*', en: 'Up to 5% back on Amazon (Prime)*' },
    bestFor: { mr: 'Amazon खरेदी', en: 'Amazon shoppers' },
  },
];
