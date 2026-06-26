// lib/schemes.ts — bilingual (mr/en) data for the Women + Student loan pages
// (/loans/women, /loans/students). Content lives here (like lib/loanDetails.ts)
// so the pages stay thin renderers. Each finder is a tiny rule-based quiz:
// every answer "boosts" one or more scheme ids, and the result lists the
// schemes worth checking, ranked by how many answers pointed to them.
import type { Bi } from '@/types';

export type SchemeAudience = 'women' | 'student';

export interface Scheme {
  id: string;
  audience: SchemeAudience;
  icon: string; // Icon registry key (see components/shared/Icon.tsx)
  name: Bi; // योजना
  forWhom: Bi; // कोणासाठी
  amount: Bi; // ठळक रक्कम / आकडा (badge)
  detail: Bi; // 1–2 ओळींचे सोपे मार्गदर्शन
  badge?: Bi; // optional highlight, e.g. "नवीन 2024" / "Trending"
}

// A segment-specific perk/benefit block (e.g. women home-loan perks, 80E).
export interface Perk {
  icon: string;
  title: Bi;
  detail: Bi;
}

// ── महिलांसाठी कर्ज व व्यवसाय योजना ──────────────────────────────
export const womenSchemes: Scheme[] = [
  {
    id: 'standup',
    audience: 'women',
    icon: 'rocket',
    name: { mr: 'Stand-Up India', en: 'Stand-Up India' },
    forWhom: { mr: 'महिला उद्योजक व SC/ST उद्योजक', en: 'Women entrepreneurs & SC/ST entrepreneurs' },
    amount: { mr: '₹10 लाख – ₹1 कोटी', en: '₹10 lakh – ₹1 crore' },
    detail: {
      mr: 'नवीन (greenfield) उद्योगासाठी ₹10 लाख ते ₹1 कोटी बँक कर्ज. प्रत्येक बँक शाखेत किमान एक महिला अर्जदाराला कर्ज देण्याचे उद्दिष्ट.',
      en: 'Bank loans of ₹10 lakh–₹1 crore for a greenfield enterprise, aimed at women and SC/ST first-time entrepreneurs.',
    },
  },
  {
    id: 'mudra',
    audience: 'women',
    icon: 'store',
    name: { mr: 'मुद्रा लोन (PMMY)', en: 'Mudra Loan (PMMY)' },
    forWhom: { mr: 'छोटे व्यवसाय, दुकान, सेवा व उत्पादन', en: 'Small businesses, shops, services & manufacturing' },
    amount: { mr: '₹50,000 – ₹20 लाख', en: '₹50,000 – ₹20 lakh' },
    detail: {
      mr: 'बिगर-शेती सूक्ष्म उद्योगांसाठी शिशू / किशोर / तरुण टप्प्यांत micro-credit. अनेक बँका महिलांना प्राधान्य व सवलतीचा दर देतात.',
      en: 'Micro-credit for non-farm micro enterprises in Shishu / Kishor / Tarun tiers; many banks give women priority and a concessional rate.',
    },
  },
  {
    id: 'mahila-udyam-nidhi',
    audience: 'women',
    icon: 'bank',
    name: { mr: 'महिला उद्यम निधी (SIDBI)', en: 'Mahila Udyam Nidhi (SIDBI)' },
    forWhom: { mr: 'महिलांचा छोटा/लघु उद्योग', en: "Women's small-scale enterprises" },
    amount: { mr: '₹10 लाखांपर्यंत', en: 'Up to ₹10 lakh' },
    detail: {
      mr: 'महिलांच्या लघु उद्योग उभारणीसाठी SIDBI ची soft-loan योजना — परतफेडीस सवलतीची मुदत मिळते.',
      en: "SIDBI's soft-loan scheme to help women set up small-scale units, with a relaxed repayment period.",
    },
  },
  {
    id: 'annapurna',
    audience: 'women',
    icon: 'food',
    name: { mr: 'अन्नपूर्णा योजना', en: 'Annapurna Scheme' },
    forWhom: { mr: 'खाद्य / केटरिंग व्यवसाय करणाऱ्या महिला', en: 'Women in food / catering businesses' },
    amount: { mr: '₹50,000 पर्यंत', en: 'Up to ₹50,000' },
    detail: {
      mr: 'अन्न-केटरिंग व्यवसायासाठी भांडी, उपकरणे व खेळत्या भांडवलासाठी छोटे कर्ज.',
      en: 'A small loan for food/catering ventures — utensils, equipment and working capital.',
    },
  },
  {
    id: 'bank-women',
    audience: 'women',
    icon: 'business',
    name: { mr: 'बँक-विशेष महिला योजना', en: 'Bank-specific women schemes' },
    forWhom: { mr: 'महिला उद्योजक (बँकेनुसार)', en: 'Women entrepreneurs (varies by bank)' },
    amount: { mr: 'Cent Kalyani / Udyogini / Dena Shakti', en: 'Cent Kalyani / Udyogini / Dena Shakti' },
    detail: {
      mr: 'विविध बँकांच्या महिला-केंद्रित योजना — Cent Kalyani, Udyogini, Dena Shakti — अनेकदा विनातारण व सवलतीच्या दराने.',
      en: 'Women-focused schemes across banks — Cent Kalyani, Udyogini, Dena Shakti — often collateral-free and at concessional rates.',
    },
  },
  {
    id: 'mavim',
    audience: 'women',
    icon: 'handshake',
    name: { mr: 'MAVIM / बचत गट (SHG)', en: 'MAVIM / SHG support' },
    forWhom: { mr: 'महाराष्ट्रातील महिला बचत गट', en: "Maharashtra's women self-help groups" },
    amount: { mr: 'गट कर्ज + market linkage', en: 'Group credit + market linkage' },
    detail: {
      mr: 'MAVIM (महिला आर्थिक विकास महामंडळ) — महाराष्ट्र राज्यस्तरीय; बचत गट, market linkage व सक्षमीकरणासाठी काम करते.',
      en: "MAVIM (Mahila Arthik Vikas Mahamandal) is Maharashtra's state body for SHGs, market linkage and empowerment.",
    },
  },
  {
    id: 'pmegp',
    audience: 'women',
    icon: 'factory',
    name: { mr: 'PMEGP', en: 'PMEGP' },
    forWhom: { mr: 'नवीन सूक्ष्म-उद्योग सुरू करणारे', en: 'Those starting a new micro-enterprise' },
    amount: { mr: 'महिलांना 35% subsidy', en: '35% subsidy for women' },
    detail: {
      mr: 'नवीन सूक्ष्म-उद्योगांसाठी credit-linked subsidy. महिला अर्जदारांना 35% पर्यंत margin-money अनुदान (general पेक्षा जास्त).',
      en: 'Credit-linked subsidy for new micro-enterprises; women get up to 35% margin-money subsidy (higher than general).',
    },
  },
  {
    id: 'mahila-samridhi',
    audience: 'women',
    icon: 'money',
    name: { mr: 'महिला समृद्धी योजना (महाराष्ट्र)', en: 'Mahila Samridhi Yojana (Maharashtra)' },
    forWhom: { mr: 'चर्मकार समाजातील आर्थिकदृष्ट्या कमजोर महिला', en: 'Economically weaker women of the Charmakar community' },
    amount: { mr: '₹25,000 – ₹50,000', en: '₹25,000 – ₹50,000' },
    detail: {
      mr: 'पात्र महिलांना स्वयंरोजगारासाठी ₹25,000 ते ₹50,000 कमी व्याजदराचे (साधारण 4% p.a.) कर्ज.',
      en: 'A low-interest loan (about 4% p.a.) of ₹25,000–₹50,000 for self-employment for eligible women.',
    },
  },
];

// महिला गृहकर्ज विशेष फायदे (home-loan perks for women buyers).
export const womenHomeLoanPerks: Perk[] = [
  {
    icon: 'home',
    title: { mr: 'Stamp Duty 1% सूट (महाराष्ट्र)', en: '1% stamp-duty concession (Maharashtra)' },
    detail: {
      mr: 'महाराष्ट्रात मालमत्ता फक्त महिलेच्या नावे असल्यास stamp duty मध्ये 1% सवलत (6% ऐवजी 5%) — मोठी बचत.',
      en: 'In Maharashtra, if the property is in a woman’s name, stamp duty is cut by 1% (5% instead of 6%) — a big saving.',
    },
  },
  {
    icon: 'down',
    title: { mr: 'कमी व्याजदर', en: 'Lower interest rate' },
    detail: {
      mr: 'SBI, HDFC सारख्या बँका महिला अर्जदार/सह-अर्जदाराला साधारण 0.05% कमी व्याजदर देतात.',
      en: 'Banks like SBI and HDFC typically offer about 0.05% lower interest to a woman applicant/co-applicant.',
    },
  },
  {
    icon: 'receipt',
    title: { mr: 'वेगळी करसवलत', en: 'Separate tax benefits' },
    detail: {
      mr: 'संयुक्त मालकी (joint ownership) घेतल्यास दोघांनाही 80C व 24(b) अंतर्गत स्वतंत्र करसवलत मिळू शकते.',
      en: 'With joint ownership, both co-owners can claim 80C and 24(b) tax benefits separately.',
    },
  },
];

// ── विद्यार्थ्यांसाठी Education Loan + Scholarship ────────────────
export const studentSchemes: Scheme[] = [
  {
    id: 'vidyalaxmi',
    audience: 'student',
    icon: 'education',
    name: { mr: 'PM विद्यालक्ष्मी', en: 'PM Vidyalaxmi' },
    forWhom: { mr: 'गुणवंत विद्यार्थी, उच्च शिक्षण', en: 'Meritorious students, higher education' },
    amount: { mr: '₹10 लाख, विनातारण', en: '₹10 lakh, collateral-free' },
    badge: { mr: 'नवीन 2024', en: 'New 2024' },
    detail: {
      mr: 'गुणवंत विद्यार्थ्यांना ₹10 लाखांपर्यंत collateral-free व guarantor-free कर्ज; सरकार 75% पर्यंत हमी (guarantee) देते.',
      en: 'Up to ₹10 lakh collateral-free, guarantor-free loan for meritorious students, with up to 75% government credit guarantee.',
    },
  },
  {
    id: 'vidya-lakshmi-portal',
    audience: 'student',
    icon: 'global',
    name: { mr: 'Vidya Lakshmi Portal', en: 'Vidya Lakshmi Portal' },
    forWhom: { mr: 'सर्व education loan अर्जदार', en: 'All education-loan applicants' },
    amount: { mr: 'Single-window apply', en: 'Single-window apply' },
    detail: {
      mr: 'एकाच portal वरून अनेक बँकांना education loan अर्ज — एकदा भरा, अनेक बँकांकडे पाठवा व स्थिती ट्रॅक करा.',
      en: 'Apply to multiple banks for an education loan from one portal — fill once, send to many banks and track status.',
    },
  },
  {
    id: 'csis',
    audience: 'student',
    icon: 'down',
    name: { mr: 'CSIS (व्याज अनुदान)', en: 'CSIS (interest subsidy)' },
    forWhom: { mr: 'कुटुंब उत्पन्न < ₹4.5 लाख', en: 'Family income < ₹4.5 lakh' },
    amount: { mr: 'Moratorium मध्ये 100% व्याज', en: '100% interest during moratorium' },
    detail: {
      mr: 'कुटुंबाचे उत्पन्न ₹4.5 लाखांपेक्षा कमी असल्यास IBA education loan च्या moratorium कालावधीतील संपूर्ण व्याज सरकार भरते.',
      en: 'If family income is below ₹4.5 lakh, the government pays the full interest during the moratorium of an IBA education loan.',
    },
  },
  {
    id: 'panjabrao',
    audience: 'student',
    icon: 'home',
    name: { mr: 'डॉ. पंजाबराव देशमुख वसतिगृह योजना', en: 'Dr. Panjabrao Deshmukh Vasatigrah Yojana' },
    forWhom: { mr: 'महाराष्ट्रातील बाहेरगावी शिकणारे विद्यार्थी', en: 'Maharashtra students studying away from home' },
    amount: { mr: 'निर्वाह भत्ता', en: 'Maintenance allowance' },
    detail: {
      mr: 'महाराष्ट्र राज्य योजना — बाहेरगावी राहून शिकणाऱ्या विद्यार्थ्यांना hostel/निर्वाह खर्चासाठी भत्ता.',
      en: 'A Maharashtra state scheme giving a hostel/maintenance allowance to students studying away from their hometown.',
    },
  },
  {
    id: 'jansamarth',
    audience: 'student',
    icon: 'desktop',
    name: { mr: 'JanSamarth Education Loan', en: 'JanSamarth Education Loan' },
    forWhom: { mr: 'सरकारी credit-linked योजनांसाठी', en: 'Government-sponsored credit-linked schemes' },
    amount: { mr: 'One-stop portal', en: 'One-stop portal' },
    detail: {
      mr: 'सरकारी योजनांसाठी एकच portal — eligibility तपासा, online अर्ज करा व lender मंजुरी एकाच ठिकाणी.',
      en: 'A one-stop portal for government schemes — check eligibility, apply online and track lender approval in one place.',
    },
  },
  {
    id: 'mahadbt',
    audience: 'student',
    icon: 'certificate',
    name: { mr: 'MahaDBT Scholarship', en: 'MahaDBT Scholarship' },
    forWhom: { mr: 'महाराष्ट्रातील विद्यार्थी', en: 'Maharashtra students' },
    amount: { mr: 'Scholarship + freeship', en: 'Scholarship + freeship' },
    detail: {
      mr: 'महाराष्ट्रातील विद्यार्थ्यांसाठी scholarship व freeship योजना एकाच portal वर. अर्ज शैक्षणिक वर्षानुसार सुरू होतात.',
      en: 'Scholarship and freeship schemes for Maharashtra students on one portal; applications open each academic year.',
    },
  },
  {
    id: 'ambedkar',
    audience: 'student',
    icon: 'travel',
    name: { mr: 'डॉ. आंबेडकर / परदेशी शिक्षण मदत', en: 'Dr. Ambedkar / Abroad education support' },
    forWhom: { mr: 'OBC/EBC विद्यार्थी, परदेशी शिक्षण', en: 'OBC/EBC students, education abroad' },
    amount: { mr: 'व्याज अनुदान', en: 'Interest subsidy' },
    detail: {
      mr: 'परदेशातील उच्च शिक्षणासाठी OBC/EBC विद्यार्थ्यांना education loan वर व्याज अनुदान.',
      en: 'An interest subsidy on education loans for OBC/EBC students pursuing higher studies abroad.',
    },
  },
];

// विद्यार्थी कर्ज प्रकार (loan-type split table).
export interface LoanTypeRow {
  type: Bi;
  range: Bi;
  collateral: Bi;
  banks: Bi;
}
export const studentLoanTypes: LoanTypeRow[] = [
  {
    type: { mr: 'देशांतर्गत (लहान)', en: 'India (small)' },
    range: { mr: '₹4 लाखांपर्यंत', en: 'Up to ₹4 lakh' },
    collateral: { mr: 'नाही', en: 'None' },
    banks: { mr: 'SBI, BoB, Canara', en: 'SBI, BoB, Canara' },
  },
  {
    type: { mr: 'देशांतर्गत (मोठे)', en: 'India (large)' },
    range: { mr: '₹4 – ₹7.5 लाख', en: '₹4 – ₹7.5 lakh' },
    collateral: { mr: 'third-party guarantor', en: 'Third-party guarantor' },
    banks: { mr: 'SBI, PSB बँका', en: 'SBI, PSB banks' },
  },
  {
    type: { mr: 'Premium संस्था (IIT/IIM/AIIMS)', en: 'Premium institutes (IIT/IIM/AIIMS)' },
    range: { mr: '₹40 लाखांपर्यंत', en: 'Up to ₹40 lakh' },
    collateral: { mr: 'नाही (listed असल्यास)', en: 'None (if institute listed)' },
    banks: { mr: 'SBI Scholar', en: 'SBI Scholar' },
  },
  {
    type: { mr: 'परदेशी शिक्षण', en: 'Abroad' },
    range: { mr: '₹20 लाख – ₹1.5 कोटी', en: '₹20 lakh – ₹1.5 crore' },
    collateral: { mr: 'property collateral', en: 'Property collateral' },
    banks: { mr: 'Credila, Avanse, InCred, SBI', en: 'Credila, Avanse, InCred, SBI' },
  },
  {
    type: { mr: 'Skill / ITI', en: 'Skill / ITI' },
    range: { mr: '₹5,000 – ₹1.5 लाख', en: '₹5,000 – ₹1.5 lakh' },
    collateral: { mr: 'नाही', en: 'None' },
    banks: { mr: 'PSB Skill Loan', en: 'PSB Skill Loan' },
  },
];

// 80E व इतर विद्यार्थी फायदे.
export const studentPerks: Perk[] = [
  {
    icon: 'receipt',
    title: { mr: 'कलम 80E करसवलत', en: 'Section 80E tax benefit' },
    detail: {
      mr: 'education loan च्या व्याजावर पूर्ण करसवलत — वरची मर्यादा नाही, परतफेड सुरू झाल्यापासून 8 वर्षांपर्यंत.',
      en: 'Full tax deduction on education-loan interest — no upper limit, for up to 8 years from when repayment starts.',
    },
  },
];

// ── Finder (सोपी eligibility quiz) ───────────────────────────────
export interface FinderOption {
  label: Bi;
  boosts: string[]; // scheme ids this answer points to
}
export interface FinderQuestion {
  q: Bi;
  options: FinderOption[];
}

export const womenFinder: FinderQuestion[] = [
  {
    q: { mr: 'तुम्ही व्यवसाय नवीन सुरू करणार की सध्याचा वाढवणार?', en: 'Are you starting a new business or growing an existing one?' },
    options: [
      { label: { mr: 'नवीन व्यवसाय सुरू करणार', en: 'Starting a new business' }, boosts: ['pmegp', 'standup', 'mudra'] },
      { label: { mr: 'सध्याचा व्यवसाय वाढवणार', en: 'Growing an existing business' }, boosts: ['mudra', 'mahila-udyam-nidhi'] },
    ],
  },
  {
    q: { mr: 'व्यवसायाचा प्रकार कोणता?', en: 'What type of business?' },
    options: [
      { label: { mr: 'खाद्य / केटरिंग', en: 'Food / catering' }, boosts: ['annapurna', 'mudra'] },
      { label: { mr: 'दुकान / सेवा / इतर', en: 'Shop / service / other' }, boosts: ['mudra', 'bank-women'] },
    ],
  },
  {
    q: { mr: 'अंदाजे किती रक्कम हवी आहे?', en: 'Roughly how much funding do you need?' },
    options: [
      { label: { mr: '₹50,000 – ₹5 लाख', en: '₹50,000 – ₹5 lakh' }, boosts: ['mudra', 'mahila-samridhi', 'annapurna'] },
      { label: { mr: '₹5 – ₹10 लाख', en: '₹5 – ₹10 lakh' }, boosts: ['mudra', 'pmegp', 'mahila-udyam-nidhi'] },
      { label: { mr: '₹10 लाख – ₹1 कोटी', en: '₹10 lakh – ₹1 crore' }, boosts: ['standup'] },
    ],
  },
  {
    q: { mr: 'तुम्ही बचत गटात (SHG) आहात का?', en: 'Are you part of a self-help group (SHG)?' },
    options: [
      { label: { mr: 'होय', en: 'Yes' }, boosts: ['mavim'] },
      { label: { mr: 'नाही', en: 'No' }, boosts: [] },
    ],
  },
  {
    q: { mr: 'तुमचा प्रवर्ग कोणता?', en: 'Which category do you belong to?' },
    options: [
      { label: { mr: 'General / OBC', en: 'General / OBC' }, boosts: ['bank-women'] },
      { label: { mr: 'SC / ST', en: 'SC / ST' }, boosts: ['standup'] },
      { label: { mr: 'चर्मकार समाज / आर्थिकदृष्ट्या कमजोर', en: 'Charmakar community / economically weaker' }, boosts: ['mahila-samridhi'] },
    ],
  },
];

export const studentFinder: FinderQuestion[] = [
  {
    q: { mr: 'शिक्षण कुठे घ्यायचे आहे?', en: 'Where will you study?' },
    options: [
      { label: { mr: 'भारतात', en: 'In India' }, boosts: ['vidyalaxmi', 'jansamarth', 'csis', 'mahadbt'] },
      { label: { mr: 'परदेशात', en: 'Abroad' }, boosts: ['ambedkar', 'jansamarth', 'vidya-lakshmi-portal'] },
    ],
  },
  {
    q: { mr: 'तुम्हाला काय हवे आहे?', en: 'What are you looking for?' },
    options: [
      { label: { mr: 'फक्त कर्ज (loan)', en: 'Loan only' }, boosts: ['vidyalaxmi', 'jansamarth', 'vidya-lakshmi-portal'] },
      { label: { mr: 'फक्त scholarship', en: 'Scholarship only' }, boosts: ['mahadbt'] },
      { label: { mr: 'दोन्ही', en: 'Both' }, boosts: ['vidyalaxmi', 'jansamarth', 'mahadbt'] },
    ],
  },
  {
    q: { mr: 'कुटुंबाचे वार्षिक उत्पन्न?', en: 'Family annual income?' },
    options: [
      { label: { mr: '₹4.5 लाखांपेक्षा कमी', en: 'Below ₹4.5 lakh' }, boosts: ['csis', 'mahadbt', 'ambedkar'] },
      { label: { mr: 'मध्यम किंवा जास्त', en: 'Medium or higher' }, boosts: ['vidyalaxmi'] },
    ],
  },
  {
    q: { mr: 'तुम्ही महाराष्ट्राचे रहिवासी आहात का?', en: 'Are you a Maharashtra resident?' },
    options: [
      { label: { mr: 'होय', en: 'Yes' }, boosts: ['mahadbt', 'panjabrao'] },
      { label: { mr: 'नाही', en: 'No' }, boosts: [] },
    ],
  },
  {
    q: { mr: 'तुमचा प्रवर्ग कोणता?', en: 'Which category do you belong to?' },
    options: [
      { label: { mr: 'General', en: 'General' }, boosts: ['vidyalaxmi'] },
      { label: { mr: 'SC / ST / OBC / EBC / अल्पसंख्याक', en: 'SC / ST / OBC / EBC / Minority' }, boosts: ['ambedkar', 'mahadbt', 'csis'] },
    ],
  },
];

/**
 * Tally the boosts from a set of chosen options (one per question) and return
 * the matching schemes, ranked by how many answers pointed to each. Always
 * returns at least one scheme so the result is never empty.
 */
export function rankSchemes(schemes: Scheme[], chosen: FinderOption[]): Scheme[] {
  const score = new Map<string, number>();
  for (const opt of chosen) {
    for (const id of opt.boosts) score.set(id, (score.get(id) ?? 0) + 1);
  }
  const ranked = schemes
    .filter((s) => (score.get(s.id) ?? 0) > 0)
    .sort((a, b) => (score.get(b.id) ?? 0) - (score.get(a.id) ?? 0));
  // Fallback: if nothing matched, show the first scheme as a starting point.
  return ranked.length ? ranked : schemes.slice(0, 1);
}
