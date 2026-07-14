// lib/healthCheckContent.ts — bilingual copy + option sets for the readiness
// check. INTERIM NAMING (2026-07): the underlying engine is still the generic
// personal-finance health engine (income/expenses/EMI/savings/protection), so
// its output is labelled "Financial Readiness for a Home Goal" — NOT a completed
// "Home Finance Readiness Score" and NOT a property-specific eligibility report.
// Kept out of the component so wording can be reviewed/edited centrally.
import type { Language } from '@/types';
import type { DistrictTier } from '@/lib/healthScore';

export type Bi = { mr: string; en: string };
export const pick = (b: Bi, lang: Language) => (lang === 'mr' ? b.mr : b.en);

export const AGE_OPTIONS: { value: string; label: Bi }[] = [
  { value: '18-24', label: { mr: '१८–२४', en: '18–24' } },
  { value: '25-34', label: { mr: '२५–३४', en: '25–34' } },
  { value: '35-44', label: { mr: '३५–४४', en: '35–44' } },
  { value: '45-54', label: { mr: '४५–५४', en: '45–54' } },
  { value: '55+', label: { mr: '५५+', en: '55+' } },
];

// City tier drives the recommended health-cover benchmark. Kept simple &
// self-declared — the user picks the description that fits.
export const CITY_TIER_OPTIONS: { value: DistrictTier; label: Bi }[] = [
  { value: 'metro', label: { mr: 'मुंबई / पुणे (महानगर)', en: 'Mumbai / Pune (metro)' } },
  { value: 'tier2', label: { mr: 'जिल्ह्याचे मोठे शहर', en: 'Larger district city' } },
  { value: 'tier3', label: { mr: 'गाव / छोटे शहर', en: 'Town / village' } },
];

export const TIMELINE_OPTIONS: { value: number; label: Bi }[] = [
  { value: 1, label: { mr: '१ वर्षाच्या आत', en: 'Within 1 year' } },
  { value: 3, label: { mr: '१–३ वर्षे', en: '1–3 years' } },
  { value: 5, label: { mr: '३–५ वर्षे', en: '3–5 years' } },
  { value: 10, label: { mr: '५–१० वर्षे', en: '5–10 years' } },
  { value: 15, label: { mr: '१० वर्षांपेक्षा जास्त', en: '10+ years' } },
];

export const GOAL_OPTIONS: { value: string; label: Bi }[] = [
  { value: 'emergency', label: { mr: 'आपत्कालीन निधी तयार करणे', en: 'Build an emergency fund' } },
  { value: 'debt', label: { mr: 'कर्जमुक्त होणे', en: 'Get out of debt' } },
  { value: 'home', label: { mr: 'घर खरेदी', en: 'Buy a home' } },
  { value: 'education', label: { mr: 'शिक्षण / मुलांचे शिक्षण', en: 'Education (self / children)' } },
  { value: 'retirement', label: { mr: 'निवृत्तीचे नियोजन', en: 'Retirement planning' } },
  { value: 'wealth', label: { mr: 'संपत्ती वाढवणे', en: 'Grow long-term wealth' } },
];

// Top-level flow copy.
export const HC = {
  eyebrow: { mr: 'घराच्या ध्येयासाठी आर्थिक तयारी', en: 'Financial Readiness for a Home Goal' } as Bi,
  title: {
    mr: 'घराच्या ध्येयासाठी तुमची आर्थिक तयारी तपासा',
    en: 'Check your financial readiness for a home goal',
  } as Bi,
  intro: {
    mr: 'उत्पन्न, खर्च व बचतीची माहिती भरा — सुमारे २ मिनिटांत तुमचा स्कोअर आणि पुढील कृती मिळवा. कार्ड, OTP किंवा पासवर्ड लागत नाही.',
    en: 'Enter income, expenses and savings — get your score and next action in about 2 minutes. No card, OTP or password needed.',
  } as Bi,
  trust: [
    { mr: 'कार्ड आवश्यक नाही', en: 'No card required' },
    { mr: 'OTP किंवा पासवर्ड विचारत नाही', en: 'We never ask for OTPs or passwords' },
    { mr: 'तुमच्या संमतीशिवाय माहिती share केली जात नाही', en: 'Your data is not shared without your consent' },
  ] as Bi[],
  back: { mr: 'मागे', en: 'Back' } as Bi,
  next: { mr: 'पुढे', en: 'Continue' } as Bi,
  skip: { mr: 'हे वगळा', en: 'Skip this' } as Bi,
  seeResult: { mr: 'माझा स्कोअर पाहा', en: 'See my score' } as Bi,
  stepOf: { mr: 'पायरी', en: 'Step' } as Bi,
  of: { mr: 'पैकी', en: 'of' } as Bi,
  perMonth: { mr: 'दरमहा', en: 'per month' } as Bi,
  optional: { mr: 'पर्यायी', en: 'optional' } as Bi,
  whyLabel: { mr: 'हे का विचारतो?', en: 'Why we ask' } as Bi,
  rupees: { mr: '₹ (रुपये)', en: '₹ (rupees)' } as Bi,
  required: { mr: 'ही माहिती आवश्यक आहे', en: 'This information is required' } as Bi,
};

// Result-page copy.
export const RC = {
  eyebrow: { mr: 'तुमचा निकाल', en: 'Your result' } as Bi,
  scoreLabel: { mr: 'घराच्या ध्येयासाठी आर्थिक तयारी', en: 'Financial Readiness for a Home Goal' } as Bi,
  outOf: { mr: 'पैकी', en: 'out of' } as Bi,
  confidence: { mr: 'विश्वास पातळी', en: 'Confidence' } as Bi,
  confidenceLevels: {
    low: { mr: 'कमी', en: 'Low' } as Bi,
    medium: { mr: 'मध्यम', en: 'Medium' } as Bi,
    high: { mr: 'उच्च', en: 'High' } as Bi,
  },
  confidenceHint: {
    mr: 'अधिक माहिती भरल्यास स्कोअर अधिक अचूक होतो.',
    en: 'Add more details to make your score more accurate.',
  } as Bi,
  breakdown: { mr: 'तुमचा स्कोअर का?', en: 'Why this score?' } as Bi,
  priority: { mr: 'सर्वात महत्त्वाची गोष्ट', en: 'Your top priority' } as Bi,
  firstAction: { mr: 'पहिली कृती', en: 'First action' } as Bi,
  openCalculator: { mr: 'संबंधित कॅल्क्युलेटर उघडा', en: 'Open the related calculator' } as Bi,
  revise: { mr: 'उत्तरे बदला', en: 'Revise my answers' } as Bi,
  statusGood: { mr: 'चांगले', en: 'Good' } as Bi,
  statusAttention: { mr: 'लक्ष द्या', en: 'Needs attention' } as Bi,
  statusUrgent: { mr: 'तातडीचे', en: 'Urgent' } as Bi,
  points: { mr: 'गुण', en: 'pts' } as Bi,
  upside: { mr: 'शक्य वाढ', en: 'possible gain' } as Bi,
  // ₹99 upsell (structure only in P0 — the paid report ships in a later phase).
  planTitle: {
    mr: 'माझा संपूर्ण 90-दिवसांचा Money Plan मिळवा',
    en: 'Get my complete 90-day Money Plan',
  } as Bi,
  planSub: {
    mr: '३०/६०/९० दिवसांची कृती योजना, संरक्षण चेकलिस्ट व स्कोअर सुधारणा सिम्युलेशन — ₹९९ एकवेळ.',
    en: 'A 30/60/90-day action plan, protection checklist and score-improvement simulation — ₹99 one-time.',
  } as Bi,
  planCta: { mr: '₹९९ — लवकरच', en: '₹99 — Coming soon' } as Bi,
  planNote: {
    mr: 'पेमेंट अद्याप सुरू झालेले नाही. तयार झाल्यावर सुरक्षित पेमेंट व सर्व्हर-पडताळणीसह उपलब्ध होईल.',
    en: 'Payments are not live yet. It will launch with secure, server-verified checkout.',
  } as Bi,
  disclaimer: {
    mr: 'हा तुमच्या सध्याच्या उत्पन्न, खर्च, EMI, बचत आणि आर्थिक संरक्षणावर आधारित प्राथमिक शैक्षणिक अंदाज आहे. हा property-specific eligibility report, CIBIL score किंवा loan sanction नाही.',
    en: 'This is a preliminary educational estimate based on your current income, expenses, EMIs, savings and financial protection. It is not a property-specific eligibility report, CIBIL score or loan sanction.',
  } as Bi,
  educationalBadge: { mr: 'शैक्षणिक अंदाज', en: 'Educational estimate' } as Bi,
};
