// lib/lenders.ts — "घरकर्ज देणाऱ्या संस्था": a GENERAL list of banks and housing
// finance companies that offer home loans. It is NOT a list of project
// approvals: being listed here does not mean the institution has approved any
// specific RERA project. Project-wise approval must be verified from each
// lender's own approved-project list.
import type { Bi } from '@/lib/homeFinanceContent';

export type LenderGroup = { id: 'public' | 'private' | 'hfc'; title: Bi; names: string[] };

export const LENDER_GROUPS: LenderGroup[] = [
  {
    id: 'public',
    title: { mr: 'सरकारी बँका', en: 'Public-sector banks' },
    names: [
      'State Bank of India',
      'Bank of Baroda',
      'Punjab National Bank',
      'Bank of Maharashtra',
      'Canara Bank',
      'Union Bank of India',
      'Bank of India',
      'Indian Bank',
      'Central Bank of India',
    ],
  },
  {
    id: 'private',
    title: { mr: 'खासगी बँका', en: 'Private-sector banks' },
    names: ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'IDFC FIRST Bank', 'Federal Bank', 'IndusInd Bank'],
  },
  {
    id: 'hfc',
    title: { mr: 'हाउसिंग फायनान्स कंपन्या / वित्तसंस्था', en: 'Housing finance companies / NBFCs' },
    names: [
      'LIC Housing Finance',
      'PNB Housing Finance',
      'Bajaj Housing Finance',
      'Tata Capital Housing Finance',
      'Can Fin Homes',
      'Aavas Financiers',
      'Home First Finance',
      'IIFL Home Finance',
    ],
  },
];

export const LENDERS_COPY = {
  title: { mr: 'घरकर्ज देणाऱ्या संस्था', en: 'Home-loan lenders' } as Bi,
  note: {
    mr: 'ही सर्वसाधारण यादी आहे. यातील प्रत्येक संस्थेने एखादा विशिष्ट RERA प्रकल्प मंजूर केला आहे, असा याचा अर्थ नाही. प्रकल्पाला कोणत्या बँकेची मंजुरी आहे ते त्या बँकेच्या अधिकृत project list मधून स्वतंत्रपणे तपासा.',
    en: 'This is a general list. It does not mean any of these lenders has approved a specific RERA project. Verify project approval separately from the lender own approved-project list.',
  } as Bi,
  rbi: {
    mr: 'बँकांची अधिकृत नावे RBI च्या यादीत पाहा. वित्तसंस्थांची स्थिती RBI च्या नोंदणीकृत NBFC / HFC यादीत तपासता येते.',
    en: 'See official bank names on the RBI list; check an NBFC/HFC status on RBI registered-NBFC lists.',
  } as Bi,
  rbiUrl: 'https://m.rbi.org.in/scripts/Banklinks.aspx',
};
