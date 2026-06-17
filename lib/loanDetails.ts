// lib/loanDetails.ts — localized (mr/en) guidance per loan type for /loans.
import type { Bi } from '@/types';
import type { ProductType } from '@/lib/documentChecklists';

export type LoanType = 'home' | 'personal' | 'business' | 'vehicle' | 'education' | 'gold';

export interface LoanDetail {
  type: LoanType;
  icon: string;
  labelKey: string; // existing i18n key (loan.home, etc.)
  product: ProductType; // for the document checklist
  eligibility: Bi[];
  who: Bi;
  mistakes: Bi[];
}

export const loanDetails: Record<LoanType, LoanDetail> = {
  home: {
    type: 'home',
    icon: '🏠',
    labelKey: 'loan.home',
    product: 'HOME_LOAN',
    eligibility: [
      { mr: 'स्थिर उत्पन्न व चांगला क्रेडिट स्कोअर', en: 'Stable income and a good credit score' },
      { mr: 'वय साधारण २१–६५ वर्षे', en: 'Age roughly 21–65 years' },
    ],
    who: { mr: 'घर खरेदी किंवा बांधकामासाठी दीर्घ मुदतीचे कर्ज हवे असणाऱ्यांसाठी.', en: 'For those who need a long-tenure loan to buy or build a home.' },
    mistakes: [
      { mr: 'फक्त EMI पाहणे, एकूण व्याज दुर्लक्षित करणे.', en: 'Looking only at the EMI and ignoring the total interest.' },
      { mr: 'प्रोसेसिंग शुल्क व छुपे खर्च न तपासणे.', en: 'Not checking processing fees and hidden charges.' },
    ],
  },
  personal: {
    type: 'personal',
    icon: '💸',
    labelKey: 'loan.personal',
    product: 'PERSONAL_LOAN',
    eligibility: [
      { mr: 'नियमित उत्पन्न (नोकरी/व्यवसाय)', en: 'Regular income (salaried or business)' },
      { mr: 'चांगला क्रेडिट स्कोअर असल्यास कमी दर', en: 'Lower rate if you have a good credit score' },
    ],
    who: { mr: 'तातडीच्या गरजेसाठी विनातारण कर्ज हवे असणाऱ्यांसाठी.', en: 'For those who need a quick, collateral-free loan for urgent needs.' },
    mistakes: [
      { mr: 'गरजेपेक्षा जास्त रक्कम घेणे.', en: 'Borrowing more than you actually need.' },
      { mr: 'उच्च व्याजदराची तुलना न करणे.', en: 'Not comparing high interest rates across lenders.' },
    ],
  },
  business: {
    type: 'business',
    icon: '🏢',
    labelKey: 'loan.business',
    product: 'BUSINESS_LOAN',
    eligibility: [
      { mr: 'व्यवसाय नोंदणी व किमान उलाढाल', en: 'Business registration and minimum turnover' },
      { mr: 'ITR व GST (लागू असल्यास)', en: 'ITR and GST (if applicable)' },
    ],
    who: { mr: 'व्यवसाय वाढवण्यासाठी किंवा खेळत्या भांडवलासाठी.', en: 'For growing your business or for working capital needs.' },
    mistakes: [
      { mr: 'रोख प्रवाह न पाहता कर्ज घेणे.', en: 'Taking a loan without reviewing your cash flow.' },
      { mr: 'कागदपत्रे अपूर्ण ठेवणे.', en: 'Leaving documents incomplete.' },
    ],
  },
  vehicle: {
    type: 'vehicle',
    icon: '🚗',
    labelKey: 'loan.vehicle',
    product: 'VEHICLE_LOAN',
    eligibility: [
      { mr: 'स्थिर उत्पन्न व वाहन कोटेशन', en: 'Stable income and a vehicle quotation' },
      { mr: 'डाउन पेमेंट क्षमता', en: 'Ability to make a down payment' },
    ],
    who: { mr: 'नवीन किंवा वापरलेले वाहन घेणाऱ्यांसाठी.', en: 'For those buying a new or used vehicle.' },
    mistakes: [
      { mr: 'ऑन-रोड किमतीचे संपूर्ण कर्ज गृहीत धरणे.', en: 'Assuming the full on-road price will be financed.' },
      { mr: 'विमा व देखभाल खर्च विसरणे.', en: 'Forgetting insurance and maintenance costs.' },
    ],
  },
  education: {
    type: 'education',
    icon: '🎓',
    labelKey: 'loan.education',
    product: 'EDUCATION_LOAN',
    eligibility: [
      { mr: 'मान्यताप्राप्त संस्थेत प्रवेश', en: 'Admission to a recognised institution' },
      { mr: 'सह-अर्जदार (पालक) उत्पन्न', en: 'Co-applicant (parent) income' },
    ],
    who: { mr: 'उच्च शिक्षणासाठी निधी हवा असणाऱ्या विद्यार्थ्यांसाठी.', en: 'For students who need funding for higher education.' },
    mistakes: [
      { mr: 'मोरॅटोरियम कालावधी न समजणे.', en: 'Not understanding the moratorium period.' },
      { mr: 'कर सवलत (80E) दुर्लक्षित करणे.', en: 'Ignoring the tax benefit available under 80E.' },
    ],
  },
  gold: {
    type: 'gold',
    icon: '🪙',
    labelKey: 'loan.gold',
    product: 'GOLD_LOAN',
    eligibility: [
      { mr: 'स्वतःचे सोने (दागिने/नाणी)', en: 'Your own gold (jewellery or coins)' },
      { mr: 'किमान KYC कागदपत्रे', en: 'Basic KYC documents' },
    ],
    who: { mr: 'सोने तारण ठेवून जलद, विनातपासणी कर्ज हवे असणाऱ्यांसाठी.', en: 'For those who want a quick loan against gold with minimal checks.' },
    mistakes: [
      { mr: 'जास्त व्याजदर व कमी मुदत दुर्लक्षित करणे.', en: 'Ignoring the higher interest rate and shorter tenure.' },
      { mr: 'परतफेड न झाल्यास सोने जप्तीचा धोका.', en: 'Risk of gold being seized if repayment is missed.' },
    ],
  },
};

export const loanOrder: LoanType[] = ['home', 'personal', 'business', 'vehicle', 'education', 'gold'];
