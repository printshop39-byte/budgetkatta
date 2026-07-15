// lib/homeFinanceContent.ts
// ────────────────────────────────────────────────────────────────────────────
// Bilingual copy + structured data for the narrowed home-finance homepage
// (Buy/Build/Transfer, Property Tools, Home Insurance, Official Sources).
// Kept out of the components so wording can be reviewed/edited centrally
// (mirrors lib/healthCheckContent.ts). Marathi-first.
//
// SCOPE RULES encoded here:
//  • Tools link ONLY to working existing routes; anything not built yet is
//    `status: 'coming'` with NO href (never links to a nonexistent route).
//  • Home-insurance content is educational only — no "best" claims, no lead
//    capture, no affiliate links in this phase.
//  • Official sources show org + direct URL + last-verified date; we never
//    claim affiliation with any of them.
// ────────────────────────────────────────────────────────────────────────────
import type { Language } from '@/types';

export type Bi = { mr: string; en: string };
export const pick = (b: Bi, lang: Language) => (lang === 'mr' ? b.mr : b.en);

/** Last date the official links / rate-context notes were manually verified. */
export const LAST_VERIFIED = '2026-07-14';

// ── Buy a Home / Build a Home / Transfer Loan ───────────────────────────────
export type PathChoice = {
  id: 'buy' | 'build' | 'transfer';
  title: Bi;
  tagline: Bi;
  points: { mr: string[]; en: string[] };
  /** CTA target — only set when it points to a real, working route/anchor. */
  href?: string;
  cta: Bi;
};

export const PATH_CHOICES: PathChoice[] = [
  {
    id: 'buy',
    title: { mr: 'घर घ्यायचे आहे', en: 'Buy a Home' },
    tagline: {
      mr: 'तयार घर किंवा फ्लॅट खरेदीचे सुरक्षित बजेट समजून घ्या.',
      en: 'Understand a safe budget for buying a ready home or flat.',
    },
    points: {
      mr: [
        'सुरक्षित property budget',
        'Down-payment मधील तफावत',
        'EMI परवडणारी क्षमता',
        'एकूण खरेदी खर्च',
      ],
      en: [
        'Safe property budget',
        'Down-payment gap',
        'EMI affordability',
        'Total purchase cost',
      ],
    },
    href: '/loans/home-loan',
    cta: { mr: 'गृहकर्ज माहिती पाहा', en: 'See home-loan info' },
  },
  {
    id: 'build',
    title: { mr: 'घर बांधायचे आहे', en: 'Build a Home' },
    tagline: {
      mr: 'प्लॉट घेऊन किंवा स्वतःच्या प्लॉटवर बांधकामाचे नियोजन करा.',
      en: 'Plan buying a plot and building, or building on your own plot.',
    },
    points: {
      mr: [
        'प्लॉट व बांधकाम वित्त',
        'बांधकाम-बजेट अंदाज',
        'स्वतःचा वाटा (own contribution)',
        'टप्प्याटप्प्याने कर्ज माहिती',
      ],
      en: [
        'Plot & construction finance',
        'Construction-budget estimate',
        'Own contribution',
        'Stage-wise loan information',
      ],
    },
    // No dedicated plot/construction route yet — anchors to the tools section.
    href: '/#property-tools',
    cta: { mr: 'साधने पाहा', en: 'View tools' },
  },
  {
    id: 'transfer',
    title: { mr: 'गृहकर्ज ट्रान्सफर करायचे आहे', en: 'Transfer Home Loan' },
    tagline: {
      mr: 'सध्याच्या गृहकर्जावर व्याज वाचवण्याची शक्यता तपासा.',
      en: 'Check whether transferring your existing home loan could save interest.',
    },
    points: {
      mr: [
        'सध्याच्या कर्जाचे तपशील',
        'अंदाजे व्याज-फरक',
        'Break-even कालावधी',
        'ट्रान्सफरशी संबंधित शुल्क',
      ],
      en: [
        'Current loan details',
        'Estimated interest difference',
        'Break-even period',
        'Transfer-related charges',
      ],
    },
    // Balance-transfer tool not built yet — anchors to the tools section.
    href: '/#property-tools',
    cta: { mr: 'साधने पाहा', en: 'View tools' },
  },
];

// ── Property-focused tools ──────────────────────────────────────────────────
// status: 'available' → an interactive tool at a real working route (href required).
// status: 'guide'     → educational content only (not a calculator/comparison), real route.
// status: 'coming'    → not built yet; NO href, shown as "Coming next".
export type ToolStatus = 'available' | 'guide' | 'coming';
export type PropertyTool = {
  id: string;
  label: Bi;
  desc: Bi;
  status: ToolStatus;
  href?: string;
};

export const PROPERTY_TOOLS: PropertyTool[] = [
  {
    id: 'home-loan-emi',
    label: { mr: 'गृहकर्ज EMI कॅल्क्युलेटर', en: 'Home Loan EMI Calculator' },
    desc: { mr: 'मासिक हप्ता व एकूण व्याज मोजा.', en: 'Monthly instalment & total interest.' },
    status: 'available',
    href: '/loans#loan-calc',
  },
  {
    id: 'home-loan-eligibility',
    label: { mr: 'गृहकर्ज पात्रता', en: 'Home Loan Eligibility' },
    desc: { mr: 'उत्पन्नानुसार अंदाजे कर्ज मर्यादा.', en: 'Approx. loan limit from your income.' },
    status: 'coming',
  },
  {
    id: 'safe-property-budget',
    label: { mr: 'सुरक्षित Property Budget', en: 'Safe Property Budget' },
    desc: { mr: 'तुम्हाला परवडणारे घराचे बजेट.', en: 'The home budget you can afford.' },
    status: 'coming',
  },
  {
    id: 'down-payment-planner',
    label: { mr: 'Down-Payment नियोजक', en: 'Down-Payment Planner' },
    desc: { mr: 'किती रक्कम आधी साठवावी.', en: 'How much to save upfront.' },
    status: 'coming',
  },
  {
    id: 'plot-construction-loan',
    label: { mr: 'प्लॉट + बांधकाम कर्ज', en: 'Plot + Construction Loan' },
    desc: { mr: 'प्लॉट व बांधकामासाठी वित्त.', en: 'Finance for plot & construction.' },
    status: 'coming',
  },
  {
    id: 'construction-finance',
    label: { mr: 'बांधकाम वित्त', en: 'Home Construction Finance' },
    desc: { mr: 'टप्प्याटप्प्याने बांधकाम खर्च.', en: 'Stage-wise construction costs.' },
    status: 'coming',
  },
  {
    id: 'balance-transfer',
    label: { mr: 'गृहकर्ज Balance Transfer', en: 'Home Loan Balance Transfer' },
    desc: { mr: 'व्याज-फरक व break-even तपासा.', en: 'Interest difference & break-even.' },
    status: 'coming',
  },
  {
    id: 'stamp-duty',
    label: { mr: 'Stamp Duty व नोंदणी अंदाज', en: 'Stamp Duty & Registration' },
    desc: { mr: 'महाराष्ट्रातील अंदाजे खर्च.', en: 'Estimated cost in Maharashtra.' },
    status: 'coming',
  },
  {
    id: 'home-insurance',
    label: { mr: 'गृह विमा मार्गदर्शक', en: 'Home Insurance' },
    desc: { mr: 'घर व मालमत्ता विमा समजून घ्या (शैक्षणिक).', en: 'Understand home & property cover (educational).' },
    status: 'guide',
    href: '/#home-insurance',
  },
  {
    id: 'property-documents',
    label: { mr: 'मालमत्ता कागदपत्र यादी', en: 'Property Document Checklist' },
    desc: { mr: 'गृहकर्जासाठी लागणारी कागदपत्रे.', en: 'Documents needed for a home loan.' },
    status: 'available',
    href: '/documents',
  },
];

// ── Home & property insurance (educational only) ────────────────────────────
export const HOME_INSURANCE = {
  eyebrow: { mr: 'गृह व मालमत्ता विमा', en: 'Home & property insurance' } as Bi,
  title: {
    mr: 'तुमचे घर व मालमत्तेचे संरक्षण समजून घ्या',
    en: 'Understand how to protect your home & property',
  } as Bi,
  intro: {
    mr: 'फक्त घर व मालमत्तेशी संबंधित विमा — शैक्षणिक माहिती. कोणतीही पॉलिसी "सर्वोत्तम" म्हणून सुचवली जात नाही आणि या टप्प्यात कोणतीही माहिती गोळा केली जात नाही.',
    en: 'Only home- and property-related cover — for education. No policy is called "best", and no information is collected in this phase.',
  } as Bi,
  // What kinds of home cover exist.
  types: [
    {
      title: { mr: 'इमारत / गृह-संरचना विमा', en: 'Building / home-structure insurance' } as Bi,
      desc: {
        mr: 'घराच्या भिंती, छप्पर व मूळ बांधकामाचे आग, नैसर्गिक आपत्ती इ. पासून संरक्षण.',
        en: 'Covers walls, roof and core structure against fire, natural events, etc.',
      } as Bi,
    },
    {
      title: { mr: 'घरातील सामान (contents) विमा', en: 'Home contents insurance' } as Bi,
      desc: {
        mr: 'घरातील वस्तू, उपकरणे व सामानाचे नुकसान/चोरीपासून संरक्षण.',
        en: 'Covers belongings, appliances and household items against loss/theft.',
      } as Bi,
    },
    {
      title: { mr: 'कर्ज-संलग्न गृह विमा', en: 'Lender-linked home-loan insurance' } as Bi,
      desc: {
        mr: 'गृहकर्जासोबत दिला जाणारा विमा — तो कर्ज-संरक्षण आहे की मालमत्ता-विमा हे तपासा.',
        en: 'Cover offered alongside a home loan — check if it protects the loan or the property.',
      } as Bi,
    },
  ],
  // Home insurance vs home-loan protection.
  vsTitle: { mr: 'गृह विमा वि. गृहकर्ज-संरक्षण', en: 'Home insurance vs home-loan protection' } as Bi,
  vsHomeInsurance: {
    mr: 'गृह विमा तुमच्या घराचे/मालमत्तेचे भौतिक नुकसानापासून संरक्षण करतो.',
    en: 'Home insurance protects your house/property against physical damage.',
  } as Bi,
  vsLoanProtection: {
    mr: 'गृहकर्ज-संरक्षण (loan protection) कर्जदाराच्या मृत्यू/अपंगत्वात उर्वरित कर्ज फेडण्यास मदत करते — ते मालमत्ता-विमा नाही.',
    en: 'Loan protection helps repay the outstanding loan on the borrower’s death/disability — it is not property cover.',
  } as Bi,
  // Three checklists.
  coverage: {
    title: { mr: 'संरक्षण चेकलिस्ट', en: 'Coverage checklist' } as Bi,
    items: {
      mr: [
        'इमारत-संरचना कव्हर केली आहे का?',
        'घरातील सामान कव्हर आहे का?',
        'आग, पूर, भूकंप कव्हर आहे का?',
        'भाड्याने राहणे (alternate accommodation) कव्हर आहे का?',
        'विमा रक्कम (sum insured) पुरेशी आहे का?',
      ],
      en: [
        'Is the building structure covered?',
        'Are home contents covered?',
        'Are fire, flood and earthquake covered?',
        'Is alternate accommodation covered?',
        'Is the sum insured adequate?',
      ],
    },
  },
  exclusions: {
    title: { mr: 'वगळलेल्या बाबी (exclusions)', en: 'Exclusions checklist' } as Bi,
    items: {
      mr: [
        'जाणीवपूर्वक किंवा निष्काळजीपणामुळे झालेले नुकसान',
        'सामान्य झीज (wear and tear)',
        'बेकायदेशीर बांधकाम',
        'युद्ध / अणु-जोखीम',
        'पॉलिसीत स्पष्टपणे वगळलेल्या बाबी',
      ],
      en: [
        'Wilful or negligent damage',
        'Normal wear and tear',
        'Unauthorised construction',
        'War / nuclear risks',
        'Anything explicitly excluded in the policy',
      ],
    },
  },
  claims: {
    title: { mr: 'दावा (claim) कागदपत्रे', en: 'Claims-document checklist' } as Bi,
    items: {
      mr: [
        'पॉलिसी क्रमांक व तपशील',
        'नुकसानीचे फोटो / पुरावा',
        'FIR (चोरी/आग असल्यास)',
        'दुरुस्तीचे अंदाजपत्रक / बिले',
        'मालकीचा पुरावा',
      ],
      en: [
        'Policy number & details',
        'Photos / proof of damage',
        'FIR (for theft / fire)',
        'Repair estimates / bills',
        'Proof of ownership',
      ],
    },
  },
  disclaimer: {
    mr: 'BudgetKatta हे IRDAI-नोंदणीकृत विमा मध्यस्थ नाही. वरील माहिती केवळ शैक्षणिक आहे — विमा सल्ला किंवा कोट नाही. खरेदीपूर्वी IRDAI-नोंदणीकृत विमा कंपनी/मध्यस्थाकडे पॉलिसी अटी तपासा.',
    en: 'BudgetKatta is not an IRDAI-registered insurance intermediary. The above is educational only — not insurance advice or a quote. Verify policy terms with an IRDAI-registered insurer/intermediary before buying.',
  } as Bi,
};

// ── Official information sources ─────────────────────────────────────────────
export type OfficialSource = {
  org: Bi;
  what: Bi;
  url: string;
  verified: string;
};

// Each URL is a SPECIFIC relevant official page (not a generic org homepage),
// verified live on LAST_VERIFIED. Re-check these on each content review.
export const OFFICIAL_SOURCES: OfficialSource[] = [
  {
    org: { mr: 'RBI (रिझर्व्ह बँक) — सामान्य नागरिकांसाठी', en: 'RBI — For the Common Person' },
    what: { mr: 'कर्जदार हक्क व ग्राहक संरक्षण', en: 'Borrower rights & consumer protection' },
    url: 'https://www.rbi.org.in/commonperson/English/Scripts/Home.aspx',
    verified: LAST_VERIFIED,
  },
  {
    org: { mr: 'National Housing Bank (NHB) — पर्यवेक्षण', en: 'National Housing Bank (NHB) — Supervision' },
    what: { mr: 'गृहवित्त कंपन्यांचे नियमन', en: 'Housing-finance company regulation' },
    url: 'https://www.nhb.org.in/supervision/',
    verified: LAST_VERIFIED,
  },
  {
    org: { mr: 'MahaRERA — प्रकल्प शोध', en: 'MahaRERA — Project search' },
    what: { mr: 'नोंदणीकृत प्रकल्प तपासा', en: 'Verify registered projects' },
    url: 'https://maharera.maharashtra.gov.in/projects-search-result',
    verified: LAST_VERIFIED,
  },
  {
    org: { mr: 'नोंदणी व मुद्रांक (IGR महाराष्ट्र)', en: 'Registration & Stamps (IGR Maharashtra)' },
    what: { mr: 'Stamp duty व नोंदणी विभाग', en: 'Stamp duty & registration department' },
    url: 'https://igrmaharashtra.gov.in',
    verified: LAST_VERIFIED,
  },
  {
    org: { mr: 'IRDAI — पॉलिसीधारक शिक्षण', en: 'IRDAI — Policyholder education' },
    what: { mr: 'मालमत्ता/गृह विमा ग्राहक माहिती', en: 'Property/home insurance consumer info' },
    url: 'https://policyholder.gov.in',
    verified: LAST_VERIFIED,
  },
];

export const OFFICIAL_SOURCES_COPY = {
  eyebrow: { mr: 'अधिकृत माहिती स्रोत', en: 'Official information sources' } as Bi,
  title: {
    mr: 'नेहमी अधिकृत स्रोतांवर तपशील तपासा',
    en: 'Always verify details with official sources',
  } as Bi,
  verifiedLabel: { mr: 'शेवटची पडताळणी', en: 'Last verified' } as Bi,
  visit: { mr: 'अधिकृत साइट उघडा', en: 'Open official site' } as Bi,
  disclaimer: {
    mr: 'BudgetKatta हे RBI, NHB, MahaRERA, IGR महाराष्ट्र किंवा IRDAI यांच्याशी संलग्न नाही आणि त्यांचे प्रतिनिधित्व करत नाही. वरील दुवे केवळ सोयीसाठी दिले आहेत; येथील सर्व आकडे शैक्षणिक अंदाज आहेत — अंतिम तपशील संबंधित अधिकृत स्रोतावर तपासा.',
    en: 'BudgetKatta is not affiliated with or representing RBI, NHB, MahaRERA, IGR Maharashtra or IRDAI. These links are for convenience only; all figures here are educational estimates — verify final details on the relevant official source.',
  } as Bi,
};

// ── Buy/Build/Transfer section heading ──────────────────────────────────────
export const PATHS_COPY = {
  eyebrow: { mr: 'तुमचा मार्ग निवडा', en: 'Choose your path' } as Bi,
  title: {
    mr: 'घर घ्या, बांधा किंवा कर्ज ट्रान्सफर करा',
    en: 'Buy, build or transfer — pick your path',
  } as Bi,
  comingNext: { mr: 'लवकरच', en: 'Coming next' } as Bi,
};

// ── Focused home-finance FAQs (homepage) ────────────────────────────────────
// Replaces the old generic SIP/FD/50-30-20 FAQs. The homepage FAQ JSON-LD is
// built from THIS same list so structured data matches the visible content.
// Rate-sensitive answers avoid final figures and point to official sources with
// the last-verified date (LAST_VERIFIED).
export const HOME_FAQ_COPY = {
  eyebrow: { mr: 'प्रश्नोत्तरे', en: 'FAQs' } as Bi,
  title: {
    mr: 'घर-वित्त व मालमत्तेबाबत वारंवार विचारले जाणारे प्रश्न',
    en: 'Home-finance & property — frequently asked questions',
  } as Bi,
};

export const HOME_FAQ: { q: Bi; a: Bi }[] = [
  {
    q: { mr: 'अंदाजे गृहकर्ज affordability कशी काढली जाते?', en: 'How is estimated home-loan affordability calculated?' },
    a: {
      mr: 'मासिक उत्पन्न, सध्याचे EMI आणि एक सुरक्षित EMI-ते-उत्पन्न प्रमाण, तसेच कर्ज कालावधी व व्याजदर यावरून affordability चा अंदाज लावला जातो. आमचे EMI कॅल्क्युलेटर तुम्ही भरलेल्या रकमेचा हप्ता दाखवते; अंतिम पात्र रक्कम बँक ठरवते.',
      en: 'It is estimated from your monthly income, existing EMIs and a comfortable EMI-to-income ratio, together with the loan tenure and interest rate. Our EMI calculator shows the instalment for the amount you enter; the final eligible amount is decided by the lender.',
    },
  },
  {
    q: { mr: 'BudgetKatta चा तयारी-स्कोअर हा CIBIL score आहे का?', en: 'Is the BudgetKatta readiness score a CIBIL score?' },
    a: {
      mr: 'नाही. तयारी-अंदाज हा फक्त तुम्ही भरलेल्या माहितीवर (उत्पन्न, खर्च, EMI, बचत, संरक्षण) आधारित प्राथमिक शैक्षणिक आकडा आहे. हा CIBIL/credit score नाही आणि कोणत्याही credit bureau कडून घेतलेला नाही.',
      en: 'No. The readiness estimate is a preliminary educational number based only on the details you enter (income, expenses, EMIs, savings, protection). It is not a CIBIL/credit score and is not fetched from any credit bureau.',
    },
  },
  {
    q: { mr: 'BudgetKatta loan approval ची हमी देते का?', en: 'Does BudgetKatta guarantee loan approval?' },
    a: {
      mr: 'नाही. BudgetKatta हे शैक्षणिक व्यासपीठ आहे — बँक किंवा एजंट नाही. ते अर्ज प्रक्रिया करत नाही, कर्ज मंजूर करत नाही किंवा sanction ची हमी देत नाही. मंजुरी फक्त बँक ठरवते.',
      en: 'No. BudgetKatta is an educational platform, not a lender or agent. It does not process applications, approve loans or guarantee sanction. Approval is decided solely by the lender.',
    },
  },
  {
    q: { mr: 'किती down payment लागू शकते?', en: 'How much down payment may be required?' },
    a: {
      mr: `नियामक (RBI/NHB) गृहकर्ज मालमत्तेच्या मूल्यापैकी किती भाग देऊ शकते यावर मर्यादा घालतात, त्यामुळे उरलेली रक्कम तुमचा स्वतःचा वाटा (down payment) असते. नेमकी रक्कम मालमत्ता-मूल्य व बँकेच्या धोरणावर अवलंबून असते — बँक व अधिकृत RBI/NHB पानांवर तपासा (शेवटची पडताळणी ${LAST_VERIFIED}).`,
      en: `Regulators (RBI/NHB) cap how much of a property’s value a home loan can cover, so the balance is your own contribution (down payment). The exact amount depends on the property value and the lender’s policy — confirm it with the lender and the official RBI/NHB pages (last verified ${LAST_VERIFIED}).`,
    },
  },
  {
    q: { mr: 'मालमत्तेच्या किमतीपासून वेगळे कोणते खर्च असतात?', en: 'Which costs are separate from the property price?' },
    a: {
      mr: 'मालमत्तेच्या किमतीशिवाय — stamp duty व नोंदणी, GST (बांधकामाधीन मालमत्तेवर), कर्ज प्रक्रिया शुल्क, कायदेशीर/valuation शुल्क आणि खरेदीनंतरचा आपत्कालीन निधी यासाठीही बजेट ठेवा. Stamp duty व नोंदणी दर IGR महाराष्ट्र ठरवते.',
      en: 'Beyond the property price, budget for stamp duty & registration, GST (on under-construction property), loan processing fees, legal/valuation charges, and a post-purchase emergency reserve. Stamp duty & registration rates are set by IGR Maharashtra.',
    },
  },
  {
    q: { mr: 'गृह विमा आणि गृहकर्ज-संरक्षण यात काय फरक आहे?', en: 'What is the difference between home insurance and home-loan protection?' },
    a: {
      mr: 'गृह विमा घराचे/मालमत्तेचे (संरचना व/किंवा सामान) भौतिक नुकसानापासून संरक्षण करतो. गृहकर्ज-संरक्षण कर्जदाराच्या मृत्यू/अपंगत्वात उर्वरित कर्ज फेडण्यास मदत करते — ते मालमत्तेला कव्हर करत नाही.',
      en: 'Home insurance protects the physical house/property (structure and/or contents) against damage. Home-loan protection helps repay the outstanding loan if the borrower dies or is disabled — it does not cover the property itself.',
    },
  },
  {
    q: { mr: 'प्लॉट किंवा बांधकाम कर्ज सामान्य घर-खरेदी कर्जापेक्षा वेगळे असू शकते का?', en: 'Can a plot or construction loan differ from a normal home-purchase loan?' },
    a: {
      mr: 'होय. प्लॉट-खरेदी व बांधकाम/self-build कर्जे — पात्र loan-to-value, वितरण (बांधकामासाठी अनेकदा टप्प्याटप्प्याने), कालावधी व कागदपत्रे यामध्ये तयार-घर खरेदी कर्जापेक्षा वेगळी असू शकतात. तपशील बँकेकडे तपासा.',
      en: 'Yes. Plot-purchase and construction/self-build loans can differ in eligible loan-to-value, disbursement (often stage-wise for construction), tenure and documentation compared with a ready-home purchase loan. Confirm specifics with the lender.',
    },
  },
  {
    q: { mr: 'व्याजदर व शुल्क अंतिम आहेत का?', en: 'Are the interest rates and charges final?' },
    a: {
      mr: `नाही. व्याजदर व शुल्क बँकेनुसार बदलतात आणि वेळोवेळी बदलतात; येथे दाखवलेले काहीही अंतिम कोट नाही. सध्याचे आकडे नेहमी बँकेच्या अधिकृत पानावर व नियामकाच्या साइटवर (RBI/NHB) तपासा. या साइटवरील आकडे शैक्षणिक आहेत (शेवटची पडताळणी ${LAST_VERIFIED}).`,
      en: `No. Interest rates and charges vary by lender and change over time; nothing shown here is a final quote. Always confirm current figures on the lender’s official page and the regulator’s site (RBI/NHB). Figures on this site are educational (last verified ${LAST_VERIFIED}).`,
    },
  },
  {
    q: { mr: 'BudgetKatta माझी आर्थिक माहिती share करते का?', en: 'Does BudgetKatta share my financial information?' },
    a: {
      mr: 'तयारी-तपासणी तुमच्या browser मध्ये चालते — नाव, OTP, कार्ड किंवा पासवर्ड लागत नाही. तुमची आर्थिक माहिती विकली जात नाही आणि तुमच्या स्पष्ट संमतीशिवाय कोणत्याही भागीदाराला दिली जात नाही. अधिक माहितीसाठी गोपनीयता धोरण पाहा.',
      en: 'The readiness check runs in your browser and needs no name, OTP, card or password. Your financial inputs are not sold, and are not shared with any partner without your explicit consent. See our Privacy Policy for details.',
    },
  },
  {
    q: { mr: 'अधिकृत मालमत्ता व बँक माहिती कुठे तपासावी?', en: 'Where should I verify official property and lender information?' },
    a: {
      mr: 'प्रकल्प MahaRERA वर, stamp duty व नोंदणी IGR महाराष्ट्रावर, कर्ज/ग्राहक नियम RBI व NHB वर, आणि विमा IRDAI च्या policyholder portal वर तपासा. शेवटच्या-पडताळणी तारखेसह दुवे वरील ‘अधिकृत माहिती स्रोत’ विभागात आहेत.',
      en: 'Verify projects with MahaRERA, stamp duty & registration with IGR Maharashtra, lending/consumer rules with RBI and NHB, and insurance with IRDAI’s policyholder portal. Links with last-verified dates are in the ‘Official information sources’ section above.',
    },
  },
];

// ── Property tools section heading ──────────────────────────────────────────
export const TOOLS_COPY = {
  eyebrow: { mr: 'मालमत्ता-केंद्रित साधने', en: 'Property-focused tools' } as Bi,
  title: {
    mr: 'घर व मालमत्ता नियोजनाची साधने',
    en: 'Tools for home & property planning',
  } as Bi,
  subtitle: {
    mr: 'उपलब्ध साधने आताच वापरा; उर्वरित लवकरच येत आहेत.',
    en: 'Use the available tools now; the rest are coming next.',
  } as Bi,
  available: { mr: 'उपलब्ध', en: 'Available' } as Bi,
  guide: { mr: 'शैक्षणिक मार्गदर्शक', en: 'Educational Guide' } as Bi,
  comingNext: { mr: 'लवकरच', en: 'Coming next' } as Bi,
  open: { mr: 'उघडा', en: 'Open' } as Bi,
  read: { mr: 'वाचा', en: 'Read' } as Bi,
};
