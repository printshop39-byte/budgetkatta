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
  /** 'range' = both ends stated; 'from' = only a starting ("onwards") rate. Never a personal offer. */
  rateKind: 'range' | 'from';
  /** Date/regime qualifier the bank attaches to the rate, if any. */
  rateNote?: Bi;
  /** Where the fee text was read, when it differs from sourceUrl. */
  feeSourceUrl?: string;
  sourceUrl: string;
  /** ISO date this entry was read from the source. */
  verifiedOn: string;
};

export const BANK_RATES: BankRate[] = [
  {
    id: 'bom',
    rateKind: 'range',
    rateNote: { mr: 'फ्लोटिंग, RLLR 8.30% शी जोडलेला', en: 'Floating, linked to RLLR 8.30%' },
    feeSourceUrl: 'https://bankofmaharashtra.bank.in/service-charges',
    bank: 'Bank of Maharashtra',
    rateMin: 7.25,
    rateMax: 9.9,
    fee: {
      mr: 'कर्जाच्या रकमेच्या 0.25% + लागू GST; कमाल ₹25,000. 31.12.2025 पर्यंतची माफीची नोंद कालबाह्य आहे; सध्याची माफी गृहीत धरलेली नाही.',
      en: '0.25% of the loan amount + applicable GST; maximum ₹25,000. The waiver notice through 31.12.2025 has expired; no current waiver is assumed.',
    },
    maxTenureYears: 30,
    terms: {
      mr: 'Maha Super Housing Loan, फ्लोटिंग (RLLR 8.30%). CIBIL 800+ पगारदार 7.25% ते CIBIL 600 खाली बिगर-पगारदार 9.90%. 0.05% व्याज सवलत फक्त CIBIL 725 खालील स्लॅबसाठी; 725 किंवा अधिक CIBIL ला सवलत नाही. 30 वर्षे किंवा वय 75 पर्यंत; प्रीपेमेंट/पार्ट-पेमेंट शुल्क नाही.',
      en: 'Maha Super Housing Loan, floating (RLLR 8.30%). 7.25% for CIBIL 800+ salaried up to 9.90% for CIBIL below 600 non-salaried. The 0.05% interest concession applies only below CIBIL 725; no concession for CIBIL 725 or above. Up to 30 years or age 75; no prepayment/part-payment charges.',
    },
    sourceUrl: 'https://bankofmaharashtra.bank.in/retail-interest-rates',
    verifiedOn: '2026-10-10',
  },
  {
    id: 'sbi',
    rateKind: 'from',
    rateNote: { mr: '01.04.2026 पासून लागू', en: 'Effective 01.04.2026' },
    bank: 'State Bank of India',
    rateMin: 7.25,
    rateMax: null,
    fee: {
      mr: 'कर्जाच्या 0.35% (पगारदार: किमान ₹5,000, कमाल ₹15,000; इतर: कमाल ₹18,000) + GST. बँकेच्या पानावर 50% सवलत व निवडक प्रकरणांत 100% माफी नमूद (अटी लागू).',
      en: '0.35% of the loan (salaried: min ₹5,000, max ₹15,000; non-salaried: max ₹18,000) + GST. Page also states a 50% concession and 100% waiver in selected cases (T&C apply).',
    },
    maxTenureYears: null,
    terms: {
      mr: 'दर "7.25% पासून" (01.04.2026 पासून, अटी लागू). CIBIL व कर्ज रकमेनुसार स्लॅब — तपशीलवार दर तक्ता पानावर वाचता आला नाही.',
      en: 'Rate is "7.25% onwards" w.e.f. 01.04.2026 (T&C apply). Slabs depend on credit score and loan amount — the detailed rate table was not readable on the page.',
    },
    sourceUrl: 'https://sbi.bank.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/home-loans-interest-rates-current',
    verifiedOn: '2026-10-04',
  },
  {
    id: 'hdfc',
    rateKind: 'range',
    rateNote: { mr: 'Policy Repo Rate शी जोडलेला', en: 'Linked to the Policy Repo Rate' },
    bank: 'HDFC Bank',
    rateMin: 8,
    rateMax: 13.45,
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
    verifiedOn: '2026-10-10',
  },
  {
    id: 'icici',
    rateKind: 'from',
    rateNote: {
      mr: '7.55% फक्त pre-approved कर्जासाठी (digital platform, bureau score नुसार). सामान्य दर 8.50% पासून — रक्कम व प्रोफाइलनुसार 9.80% पर्यंत. पानावर दर 31.10.2026 पर्यंत वैध असे नमूद — सध्याची स्थिती बँकेकडून तपासा.',
      en: '7.55% is only for pre-approved loans (digital platform, subject to bureau score). Standard rates start at 8.50% — up to 9.80% by amount and profile. The page states the rates are valid through 31.10.2026 — confirm the current position with the bank.',
    },
    bank: 'ICICI Bank',
    rateMin: 7.55,
    rateMax: null,
    fee: { mr: 'कर्जाच्या 0.5% + लागू कर.', en: '0.5% of the loan amount + applicable taxes.' },
    maxTenureYears: 30,
    terms: {
      mr: 'Pre-approved कर्जाला digital platform द्वारे 7.55% पासून (अटी व bureau score लागू); हा दर सर्व अर्जदारांसाठी नाही. 30 वर्षांपर्यंत.',
      en: 'Pre-approved loans through the digital platform start at 7.55% (terms and bureau score apply); this is not a rate for all applicants. Up to 30 years.',
    },
    sourceUrl: 'https://www.icici.bank.in/personal-banking/loans/home-loan/interest-rates',
    verifiedOn: '2026-10-10',
  },
  {
    id: 'bob',
    rateKind: 'from',
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

/** Banks to add once their official page yields readable figures (none right now). */
export const BANKS_PENDING: { bank: string; sourceUrl: string }[] = [];

export const BANK_NOTE: Bi = {
  mr: 'भारतातील (महाराष्ट्रासाठी उपयुक्त) गृहकर्ज संस्थांची तुलना. दर बदलू शकतात. “पासून” दर म्हणजे सुरुवातीचा दर — तुमचा वैयक्तिक मंजूर दर नव्हे. वरील आकडे बँकेच्या अधिकृत पानावर दिसलेले आहेत; तुमचा प्रत्यक्ष दर CIBIL, उत्पन्न व कर्ज रकमेनुसार ठरतो. अर्जापूर्वी बँकेकडून खात्री करा.',
  en: 'Comparison of home-loan lenders in India (useful for Maharashtra). Rates change. A "from" rate is a starting rate, not your personal approved rate. Figures are as shown on each bank official page; your actual rate depends on credit score, income and loan size. Confirm with the bank before applying.',
};

/** Shown directly under the rate cards. */
export const BANK_DISCLAIMER: Bi = {
  mr: 'वरील दर बँकेच्या नियमांनुसार बदलत असतात. हे अंतिम किंवा बंधनकारक दर म्हणून ग्राह्य धरू नका. अर्ज करण्यापूर्वी बँकेकडून चालू दर व अटी तपासा.',
  en: 'The rates above change as per each bank rules. Do not treat them as final or binding rates. Check the current rate and terms with the bank before applying.',
};

export function formatRateRange(min: number | null, max: number | null): string {
  const f = (n: number) => n.toFixed(2);
  if (min === null && max === null) return '—';
  if (max === null) return `${f(min as number)}% +`;
  if (min === null) return `≤ ${f(max)}%`;
  return `${f(min)}% – ${f(max)}%`;
}
