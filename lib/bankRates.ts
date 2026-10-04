// lib/bankRates.ts — home-loan bank comparison (blueprint §7).
//
// DATA RULE: figures are copied from the bank's OWN official page only, with the
// page URL and the date we read it. A field the page did not state is `null`
// and renders as "check with bank" — never guessed or filled from aggregators.
// Rates change; the UI always shows source + verifiedOn + terms.
import type { Bi } from '@/lib/homeFinanceContent';

export type BankRate = {
  id: string;
  bank: string;
  /** Advertised rate range, % p.a. `null` = not stated on the official page. */
  rateMin: number | null;
  rateMax: number | null;
  /** Fee text as the bank states it. */
  fee: Bi | null;
  maxTenureYears: number | null;
  /** Terms / eligibility qualifiers stated by the bank. */
  terms: Bi;
  sourceUrl: string;
  /** ISO date this entry was read from the source. */
  verifiedOn: string;
};

export const BANK_RATES: BankRate[] = [
  {
    id: 'hdfc',
    bank: 'HDFC Bank',
    rateMin: 7.75,
    rateMax: 13.2,
    fee: {
      mr: 'पगारदार/व्यावसायिक: कर्जाच्या 0.50% पर्यंत किंवा ₹4,000 (जे जास्त) + कर. इतर स्वयंरोजगारित: 1.50% पर्यंत किंवा ₹5,000.',
      en: 'Salaried/professionals: up to 0.50% or ₹4,000 (higher) + taxes. Other self-employed: up to 1.50% or ₹5,000.',
    },
    maxTenureYears: 30,
    terms: {
      mr: 'दर Policy Repo Rate शी जोडलेला (+2.50% ते +7.95%). कमाल कर्ज ₹10 कोटी; ₹30 लाखांपर्यंत 90%, ₹30–75 लाख 80%, त्यावर 75% मालमत्ता किंमत.',
      en: 'Linked to the Policy Repo Rate (+2.50% to +7.95%). Max loan ₹10 crore; 90% of cost up to ₹30L, 80% for ₹30–75L, 75% above.',
    },
    sourceUrl: 'https://homeloans.hdfc.bank.in/housing-loans/home-loans',
    verifiedOn: '2026-10-04',
  },
  {
    id: 'icici',
    bank: 'ICICI Bank',
    rateMin: 8.5,
    rateMax: null,
    fee: { mr: 'कर्जाच्या 2% पर्यंत + कर.', en: 'Up to 2% of the loan amount + taxes.' },
    maxTenureYears: 30,
    terms: {
      mr: 'दर "8.50% पासून" — कमाल दर पानावर नमूद नाही. कालावधी पात्रतेनुसार 30 वर्षांपर्यंत.',
      en: 'Rate is "from 8.50%" — no maximum stated on the page. Tenure up to 30 years based on eligibility.',
    },
    sourceUrl: 'https://www.icici.bank.in/personal-banking/loans/home-loan',
    verifiedOn: '2026-10-04',
  },
  {
    id: 'bob',
    bank: 'Bank of Baroda',
    rateMin: 7.2,
    rateMax: null,
    fee: null,
    maxTenureYears: 30,
    terms: {
      mr: 'दर "7.20% पासून" (पानावरील बॅनर). कमाल कर्ज ₹20 कोटी. शुल्क पानावर नमूद नाही.',
      en: 'Rate is "starting at 7.20%" (page banner). Max loan ₹20 crore. Fee not stated on the page.',
    },
    sourceUrl: 'https://bankofbaroda.bank.in/personal-banking/loans/home-loan',
    verifiedOn: '2026-10-04',
  },
];

/** Banks to add once their official page yields readable figures. */
export const BANKS_PENDING: { bank: string; sourceUrl: string }[] = [
  { bank: 'State Bank of India', sourceUrl: 'https://homeloans.sbi.bank.in/' },
  { bank: 'Bank of Maharashtra', sourceUrl: 'https://bankofmaharashtra.bank.in/' },
];

export const BANK_NOTE: Bi = {
  mr: 'दर बदलू शकतात. वरील आकडे बँकेच्या अधिकृत पानावर दिसलेले आहेत; तुमचा प्रत्यक्ष दर CIBIL, उत्पन्न व कर्ज रकमेनुसार ठरतो. अर्जापूर्वी बँकेकडून खात्री करा.',
  en: 'Rates change. Figures are as shown on each bank official page; your actual rate depends on credit score, income and loan size. Confirm with the bank before applying.',
};

export function formatRateRange(min: number | null, max: number | null): string {
  if (min === null && max === null) return '—';
  if (max === null) return `${min}% +`;
  if (min === null) return `≤ ${max}%`;
  return `${min}% – ${max}%`;
}
