// Demat / investing-app offers for the BrokerOffers section.
//
// Each `href` DEFAULTS to the broker's OFFICIAL website — a real, working link
// (so "Check on official site" is always honest). When you obtain a referral /
// affiliate link, set the matching env var (NEXT_PUBLIC_AFF_*) to override it.
//
// ⚠️ Account-opening fee / AMC / brokerage figures are INDICATIVE and change
// frequently. They are always shown with the "verify on official site" note
// (broker.indicative) and a trailing '*'. Update them as needed.

type Bi = { mr: string; en: string };

export interface BrokerOffer {
  id: string;
  name: string;
  href: string;
  feeOpen: Bi;
  amc: Bi;
  brokerage: Bi;
  benefit: Bi;
}

export const brokerOffers: BrokerOffer[] = [
  {
    id: 'zerodha',
    name: 'Zerodha',
    href: process.env.NEXT_PUBLIC_AFF_ZERODHA || 'https://zerodha.com',
    feeOpen: { mr: '₹0 (ऑनलाइन)', en: '₹0 (online)' },
    amc: { mr: '₹300/वर्ष*', en: '₹300/yr*' },
    brokerage: { mr: 'इक्विटी डिलिव्हरी ₹0; इंट्राडे ₹20/ऑर्डर*', en: 'Equity delivery ₹0; intraday ₹20/order*' },
    benefit: { mr: 'भारतातील आघाडीचा discount broker', en: "India's leading discount broker" },
  },
  {
    id: 'upstox',
    name: 'Upstox',
    href: process.env.NEXT_PUBLIC_AFF_UPSTOX || 'https://upstox.com',
    feeOpen: { mr: '₹0', en: '₹0' },
    amc: { mr: '₹0–₹150/वर्ष*', en: '₹0–₹150/yr*' },
    brokerage: { mr: 'इंट्राडे/F&O ₹20/ऑर्डर*', en: 'Intraday/F&O ₹20/order*' },
    benefit: { mr: 'जलद, सोपा ट्रेडिंग app', en: 'Fast, simple trading app' },
  },
  {
    id: 'angelone',
    name: 'Angel One',
    href: process.env.NEXT_PUBLIC_AFF_ANGELONE || 'https://www.angelone.in',
    feeOpen: { mr: '₹0', en: '₹0' },
    amc: { mr: '₹0 पहिले वर्ष (अटी लागू)*', en: '₹0 first year (T&C)*' },
    brokerage: { mr: 'फ्लॅट ₹20/ऑर्डर*', en: 'Flat ₹20/order*' },
    benefit: { mr: 'रिसर्च व सल्ला सुविधा', en: 'Research & advisory features' },
  },
  {
    id: 'groww',
    name: 'Groww',
    href: process.env.NEXT_PUBLIC_AFF_GROWW || 'https://groww.in',
    feeOpen: { mr: '₹0', en: '₹0' },
    amc: { mr: '₹0*', en: '₹0*' },
    brokerage: { mr: 'इक्विटी डिलिव्हरी ₹20 किंवा 0.1%*', en: 'Equity delivery ₹20 or 0.1%*' },
    benefit: { mr: 'स्टॉक्स + म्युच्युअल फंड एकत्र', en: 'Stocks + mutual funds together' },
  },
];
