// lib/loanDetails.ts — localized (mr/hi) guidance per loan type for /loans.
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
      { mr: 'स्थिर उत्पन्न व चांगला क्रेडिट स्कोअर', hi: 'स्थिर आय व अच्छा क्रेडिट स्कोर' },
      { mr: 'वय साधारण २१–६५ वर्षे', hi: 'उम्र लगभग 21–65 वर्ष' },
    ],
    who: { mr: 'घर खरेदी किंवा बांधकामासाठी दीर्घ मुदतीचे कर्ज हवे असणाऱ्यांसाठी.', hi: 'घर खरीदने या बनाने के लिए लंबी अवधि का लोन चाहने वालों के लिए।' },
    mistakes: [
      { mr: 'फक्त EMI पाहणे, एकूण व्याज दुर्लक्षित करणे.', hi: 'सिर्फ EMI देखना, कुल ब्याज को अनदेखा करना।' },
      { mr: 'प्रोसेसिंग शुल्क व छुपे खर्च न तपासणे.', hi: 'प्रोसेसिंग शुल्क व छुपे खर्च न जांचना।' },
    ],
  },
  personal: {
    type: 'personal',
    icon: '💸',
    labelKey: 'loan.personal',
    product: 'PERSONAL_LOAN',
    eligibility: [
      { mr: 'नियमित उत्पन्न (नोकरी/व्यवसाय)', hi: 'नियमित आय (नौकरी/व्यवसाय)' },
      { mr: 'चांगला क्रेडिट स्कोअर असल्यास कमी दर', hi: 'अच्छा क्रेडिट स्कोर होने पर कम दर' },
    ],
    who: { mr: 'तातडीच्या गरजेसाठी विनातारण कर्ज हवे असणाऱ्यांसाठी.', hi: 'तुरंत ज़रूरत के लिए बिना गिरवी लोन चाहने वालों के लिए।' },
    mistakes: [
      { mr: 'गरजेपेक्षा जास्त रक्कम घेणे.', hi: 'ज़रूरत से ज़्यादा राशि लेना।' },
      { mr: 'उच्च व्याजदराची तुलना न करणे.', hi: 'ऊंची ब्याज दर की तुलना न करना।' },
    ],
  },
  business: {
    type: 'business',
    icon: '🏢',
    labelKey: 'loan.business',
    product: 'BUSINESS_LOAN',
    eligibility: [
      { mr: 'व्यवसाय नोंदणी व किमान उलाढाल', hi: 'व्यवसाय पंजीकरण व न्यूनतम टर्नओवर' },
      { mr: 'ITR व GST (लागू असल्यास)', hi: 'ITR व GST (लागू होने पर)' },
    ],
    who: { mr: 'व्यवसाय वाढवण्यासाठी किंवा खेळत्या भांडवलासाठी.', hi: 'व्यवसाय बढ़ाने या कार्यशील पूंजी के लिए।' },
    mistakes: [
      { mr: 'रोख प्रवाह न पाहता कर्ज घेणे.', hi: 'कैश-फ्लो देखे बिना लोन लेना।' },
      { mr: 'कागदपत्रे अपूर्ण ठेवणे.', hi: 'दस्तावेज़ अधूरे रखना।' },
    ],
  },
  vehicle: {
    type: 'vehicle',
    icon: '🚗',
    labelKey: 'loan.vehicle',
    product: 'VEHICLE_LOAN',
    eligibility: [
      { mr: 'स्थिर उत्पन्न व वाहन कोटेशन', hi: 'स्थिर आय व वाहन कोटेशन' },
      { mr: 'डाउन पेमेंट क्षमता', hi: 'डाउन पेमेंट क्षमता' },
    ],
    who: { mr: 'नवीन किंवा वापरलेले वाहन घेणाऱ्यांसाठी.', hi: 'नया या पुराना वाहन खरीदने वालों के लिए।' },
    mistakes: [
      { mr: 'ऑन-रोड किमतीचे संपूर्ण कर्ज गृहीत धरणे.', hi: 'ऑन-रोड कीमत का पूरा लोन मान लेना।' },
      { mr: 'विमा व देखभाल खर्च विसरणे.', hi: 'बीमा व रखरखाव खर्च भूल जाना।' },
    ],
  },
  education: {
    type: 'education',
    icon: '🎓',
    labelKey: 'loan.education',
    product: 'EDUCATION_LOAN',
    eligibility: [
      { mr: 'मान्यताप्राप्त संस्थेत प्रवेश', hi: 'मान्यता प्राप्त संस्थान में प्रवेश' },
      { mr: 'सह-अर्जदार (पालक) उत्पन्न', hi: 'सह-आवेदक (अभिभावक) आय' },
    ],
    who: { mr: 'उच्च शिक्षणासाठी निधी हवा असणाऱ्या विद्यार्थ्यांसाठी.', hi: 'उच्च शिक्षा के लिए फंड चाहने वाले विद्यार्थियों के लिए।' },
    mistakes: [
      { mr: 'मोरॅटोरियम कालावधी न समजणे.', hi: 'मोरेटोरियम अवधि न समझना।' },
      { mr: 'कर सवलत (80E) दुर्लक्षित करणे.', hi: 'कर छूट (80E) को अनदेखा करना।' },
    ],
  },
  gold: {
    type: 'gold',
    icon: '🪙',
    labelKey: 'loan.gold',
    product: 'GOLD_LOAN',
    eligibility: [
      { mr: 'स्वतःचे सोने (दागिने/नाणी)', hi: 'अपना सोना (आभूषण/सिक्के)' },
      { mr: 'किमान KYC कागदपत्रे', hi: 'न्यूनतम KYC दस्तावेज़' },
    ],
    who: { mr: 'सोने तारण ठेवून जलद, विनातपासणी कर्ज हवे असणाऱ्यांसाठी.', hi: 'सोना गिरवी रख जल्दी, बिना ज़्यादा जांच लोन चाहने वालों के लिए।' },
    mistakes: [
      { mr: 'जास्त व्याजदर व कमी मुदत दुर्लक्षित करणे.', hi: 'ऊंची ब्याज दर व कम अवधि को अनदेखा करना।' },
      { mr: 'परतफेड न झाल्यास सोने जप्तीचा धोका.', hi: 'चुकौती न होने पर सोना ज़ब्ती का जोखिम।' },
    ],
  },
};

export const loanOrder: LoanType[] = ['home', 'personal', 'business', 'vehicle', 'education', 'gold'];
