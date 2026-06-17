// lib/documentChecklists.ts
// Central, localized (mr/hi) document-checklist data. Composed from reusable
// document "atoms" by product + applicant profile. Used by /documents and the
// per-product document sections (FD, Loans, SIP, Insurance).

import type { Bi } from '@/types';

export type DocCategory = 'KYC' | 'INCOME' | 'PRODUCT' | 'OTHER';
export type DocRequirement = 'required' | 'sometimes';

export interface DocItem {
  name: Bi;
  explanation: Bi;
  category: DocCategory;
  requirement: DocRequirement;
}

export type ProductType =
  | 'FD'
  | 'HOME_LOAN'
  | 'PERSONAL_LOAN'
  | 'BUSINESS_LOAN'
  | 'VEHICLE_LOAN'
  | 'EDUCATION_LOAN'
  | 'GOLD_LOAN'
  | 'HEALTH_INSURANCE'
  | 'TERM_INSURANCE'
  | 'SIP';

export type ProfileType = 'SALARIED' | 'BUSINESS' | 'STUDENT' | 'SENIOR' | 'NRI';

export const productOptions: { value: ProductType; label: Bi }[] = [
  { value: 'FD', label: { mr: 'मुदत ठेव (FD)', hi: 'सावधि जमा (FD)' } },
  { value: 'HOME_LOAN', label: { mr: 'गृहकर्ज', hi: 'होम लोन' } },
  { value: 'PERSONAL_LOAN', label: { mr: 'वैयक्तिक कर्ज', hi: 'पर्सनल लोन' } },
  { value: 'BUSINESS_LOAN', label: { mr: 'व्यवसाय कर्ज', hi: 'बिजनेस लोन' } },
  { value: 'VEHICLE_LOAN', label: { mr: 'वाहन कर्ज', hi: 'वाहन लोन' } },
  { value: 'EDUCATION_LOAN', label: { mr: 'शैक्षणिक कर्ज', hi: 'एजुकेशन लोन' } },
  { value: 'GOLD_LOAN', label: { mr: 'गोल्ड लोन', hi: 'गोल्ड लोन' } },
  { value: 'HEALTH_INSURANCE', label: { mr: 'आरोग्य विमा', hi: 'स्वास्थ्य बीमा' } },
  { value: 'TERM_INSURANCE', label: { mr: 'टर्म विमा', hi: 'टर्म बीमा' } },
  { value: 'SIP', label: { mr: 'SIP / म्युच्युअल फंड', hi: 'SIP / म्यूचुअल फंड' } },
];

export const profileOptions: { value: ProfileType; label: Bi }[] = [
  { value: 'SALARIED', label: { mr: 'नोकरीदार', hi: 'नौकरीपेशा' } },
  { value: 'BUSINESS', label: { mr: 'व्यवसायिक', hi: 'व्यवसायी' } },
  { value: 'STUDENT', label: { mr: 'विद्यार्थी', hi: 'विद्यार्थी' } },
  { value: 'SENIOR', label: { mr: 'ज्येष्ठ नागरिक', hi: 'वरिष्ठ नागरिक' } },
  { value: 'NRI', label: { mr: 'NRI', hi: 'NRI' } },
];

export const categoryLabel: Record<DocCategory, Bi> = {
  KYC: { mr: 'ओळख (KYC)', hi: 'पहचान (KYC)' },
  INCOME: { mr: 'उत्पन्न पुरावा', hi: 'आय प्रमाण' },
  PRODUCT: { mr: 'उत्पादनासाठी', hi: 'उत्पाद के लिए' },
  OTHER: { mr: 'इतर', hi: 'अन्य' },
};

// ── Document atoms ──────────────────────────────────────────────────────────
const D = {
  aadhaar: { name: { mr: 'आधार कार्ड', hi: 'आधार कार्ड' }, explanation: { mr: 'ओळख आणि पत्ता पडताळणीसाठी.', hi: 'पहचान और पते की पुष्टि के लिए।' }, category: 'KYC', requirement: 'required' },
  pan: { name: { mr: 'पॅन कार्ड', hi: 'पैन कार्ड' }, explanation: { mr: 'कर आणि आर्थिक ओळखीसाठी.', hi: 'कर और वित्तीय पहचान के लिए।' }, category: 'KYC', requirement: 'required' },
  photo: { name: { mr: 'पासपोर्ट आकाराचा फोटो', hi: 'पासपोर्ट साइज फोटो' }, explanation: { mr: 'अर्जासोबत ओळखीसाठी.', hi: 'आवेदन के साथ पहचान के लिए।' }, category: 'KYC', requirement: 'required' },
  address: { name: { mr: 'पत्ता पुरावा', hi: 'पते का प्रमाण' }, explanation: { mr: 'वीज बिल, भाडेकरार किंवा पासबुक चालते.', hi: 'बिजली बिल, किरायानामा या पासबुक चलेगा।' }, category: 'KYC', requirement: 'sometimes' },

  salarySlip: { name: { mr: 'पगार स्लिप (३ महिने)', hi: 'सैलरी स्लिप (3 महीने)' }, explanation: { mr: 'उत्पन्न व परतफेड क्षमता तपासण्यासाठी.', hi: 'आय और चुकौती क्षमता जांचने के लिए।' }, category: 'INCOME', requirement: 'required' },
  bankStatement: { name: { mr: 'बँक स्टेटमेंट (६ महिने)', hi: 'बैंक स्टेटमेंट (6 महीने)' }, explanation: { mr: 'व्यवहार व उत्पन्नाचा अंदाज घेण्यासाठी.', hi: 'लेन-देन और आय का अनुमान लगाने के लिए।' }, category: 'INCOME', requirement: 'required' },
  form16: { name: { mr: 'फॉर्म 16', hi: 'फॉर्म 16' }, explanation: { mr: 'पगारदारांचे उत्पन्न प्रमाण.', hi: 'वेतनभोगी की आय का प्रमाण।' }, category: 'INCOME', requirement: 'sometimes' },
  itr: { name: { mr: 'ITR (२ वर्षे)', hi: 'ITR (2 वर्ष)' }, explanation: { mr: 'व्यावसायिक/स्वयंरोजगार उत्पन्न प्रमाण.', hi: 'व्यावसायिक/स्वरोजगार आय का प्रमाण।' }, category: 'INCOME', requirement: 'required' },
  gst: { name: { mr: 'GST नोंदणी', hi: 'GST पंजीकरण' }, explanation: { mr: 'व्यवसाय असल्यास लागू.', hi: 'व्यवसाय होने पर लागू।' }, category: 'INCOME', requirement: 'sometimes' },
  currentAccount: { name: { mr: 'चालू खाते स्टेटमेंट', hi: 'चालू खाता स्टेटमेंट' }, explanation: { mr: 'व्यवसायाचे व्यवहार दाखवण्यासाठी.', hi: 'व्यवसाय के लेन-देन दिखाने के लिए।' }, category: 'INCOME', requirement: 'required' },
  coApplicant: { name: { mr: 'सह-अर्जदार उत्पन्न पुरावा', hi: 'सह-आवेदक आय प्रमाण' }, explanation: { mr: 'विद्यार्थी किंवा कमी उत्पन्न असल्यास.', hi: 'विद्यार्थी या कम आय होने पर।' }, category: 'INCOME', requirement: 'required' },
  pension: { name: { mr: 'पेन्शन पुरावा / बँक स्टेटमेंट', hi: 'पेंशन प्रमाण / बैंक स्टेटमेंट' }, explanation: { mr: 'ज्येष्ठ नागरिकांचे उत्पन्न दाखवण्यासाठी.', hi: 'वरिष्ठ नागरिक की आय दिखाने के लिए।' }, category: 'INCOME', requirement: 'required' },
  passportVisa: { name: { mr: 'पासपोर्ट व व्हिसा', hi: 'पासपोर्ट व वीज़ा' }, explanation: { mr: 'NRI ओळख व स्थितीसाठी.', hi: 'NRI पहचान व स्थिति के लिए।' }, category: 'INCOME', requirement: 'required' },
  nreNro: { name: { mr: 'NRE/NRO खाते स्टेटमेंट', hi: 'NRE/NRO खाता स्टेटमेंट' }, explanation: { mr: 'NRI व्यवहार पुरावा.', hi: 'NRI लेन-देन प्रमाण।' }, category: 'INCOME', requirement: 'required' },
  overseasIncome: { name: { mr: 'परदेशी उत्पन्न पुरावा', hi: 'विदेशी आय प्रमाण' }, explanation: { mr: 'परदेशातील पगार/उत्पन्न असल्यास.', hi: 'विदेश में वेतन/आय होने पर।' }, category: 'INCOME', requirement: 'sometimes' },

  bankAccount: { name: { mr: 'बँक खाते', hi: 'बैंक खाता' }, explanation: { mr: 'रक्कम जमा व परताव्यासाठी.', hi: 'राशि जमा और वापसी के लिए।' }, category: 'PRODUCT', requirement: 'required' },
  seniorProof: { name: { mr: 'ज्येष्ठ नागरिक पुरावा', hi: 'वरिष्ठ नागरिक प्रमाण' }, explanation: { mr: 'जास्त व्याजदर मिळवण्यासाठी.', hi: 'अधिक ब्याज दर पाने के लिए।' }, category: 'PRODUCT', requirement: 'sometimes' },
  nominee: { name: { mr: 'वारसदार (nominee) माहिती', hi: 'नॉमिनी जानकारी' }, explanation: { mr: 'लाभार्थी निश्चित करण्यासाठी.', hi: 'लाभार्थी तय करने के लिए।' }, category: 'PRODUCT', requirement: 'required' },
  kycStatus: { name: { mr: 'KYC स्थिती', hi: 'KYC स्थिति' }, explanation: { mr: 'गुंतवणूक सुरू करण्यासाठी अनिवार्य.', hi: 'निवेश शुरू करने के लिए अनिवार्य।' }, category: 'PRODUCT', requirement: 'required' },
  vehicleQuote: { name: { mr: 'वाहन कोटेशन', hi: 'वाहन कोटेशन' }, explanation: { mr: 'कर्ज रक्कम ठरवण्यासाठी.', hi: 'लोन राशि तय करने के लिए।' }, category: 'PRODUCT', requirement: 'required' },
  rcUsed: { name: { mr: 'RC (वापरलेले वाहन असल्यास)', hi: 'RC (पुराना वाहन होने पर)' }, explanation: { mr: 'वाहन मालकी पडताळणीसाठी.', hi: 'वाहन स्वामित्व सत्यापन के लिए।' }, category: 'PRODUCT', requirement: 'sometimes' },
  insuranceCopy: { name: { mr: 'विमा प्रत (लागू असल्यास)', hi: 'बीमा कॉपी (लागू होने पर)' }, explanation: { mr: 'वाहन विमा पडताळणीसाठी.', hi: 'वाहन बीमा सत्यापन के लिए।' }, category: 'PRODUCT', requirement: 'sometimes' },
  admission: { name: { mr: 'प्रवेश पत्र', hi: 'एडमिशन लेटर' }, explanation: { mr: 'अभ्यासक्रम प्रवेश पुष्टीसाठी.', hi: 'कोर्स में प्रवेश की पुष्टि के लिए।' }, category: 'PRODUCT', requirement: 'required' },
  feeStructure: { name: { mr: 'शुल्क रचना', hi: 'फीस संरचना' }, explanation: { mr: 'कर्ज रक्कम ठरवण्यासाठी.', hi: 'लोन राशि तय करने के लिए।' }, category: 'PRODUCT', requirement: 'required' },
  academic: { name: { mr: 'शैक्षणिक कागदपत्रे', hi: 'शैक्षणिक दस्तावेज़' }, explanation: { mr: 'मागील गुणपत्रिका/प्रमाणपत्रे.', hi: 'पिछली मार्कशीट/प्रमाणपत्र।' }, category: 'PRODUCT', requirement: 'required' },
  businessProof: { name: { mr: 'व्यवसाय पुरावा', hi: 'व्यवसाय प्रमाण' }, explanation: { mr: 'नोंदणी/परवाना/उद्यम प्रमाण.', hi: 'पंजीकरण/लाइसेंस/उद्यम प्रमाण।' }, category: 'PRODUCT', requirement: 'required' },
  property: { name: { mr: 'मालमत्ता कागदपत्रे', hi: 'संपत्ति दस्तावेज़' }, explanation: { mr: 'गृहकर्जासाठी तारण म्हणून.', hi: 'होम लोन के लिए गिरवी के रूप में।' }, category: 'PRODUCT', requirement: 'required' },
  goldDeclaration: { name: { mr: 'सोने मालकी घोषणा (आवश्यक असल्यास)', hi: 'सोना स्वामित्व घोषणा (आवश्यक होने पर)' }, explanation: { mr: 'काही ठिकाणी मालकी जाहीर करावी लागते.', hi: 'कुछ जगह स्वामित्व घोषित करना होता है।' }, category: 'PRODUCT', requirement: 'sometimes' },
  branchCheck: { name: { mr: 'शाखा स्तरावर सोने तपासणी', hi: 'शाखा स्तर पर सोना जांच' }, explanation: { mr: 'सोन्याचे मूल्य शाखेत तपासले जाते.', hi: 'सोने का मूल्य शाखा में जांचा जाता है।' }, category: 'OTHER', requirement: 'sometimes' },
  ageProof: { name: { mr: 'वय पुरावा', hi: 'आयु प्रमाण' }, explanation: { mr: 'प्रीमियम व पात्रतेसाठी.', hi: 'प्रीमियम व पात्रता के लिए।' }, category: 'PRODUCT', requirement: 'required' },
  medicalHistory: { name: { mr: 'वैद्यकीय इतिहास', hi: 'मेडिकल हिस्ट्री' }, explanation: { mr: 'वयानुसार तपासणी लागू शकते.', hi: 'उम्र के अनुसार जांच लागू हो सकती है।' }, category: 'PRODUCT', requirement: 'sometimes' },
  existingPolicy: { name: { mr: 'सध्याची पॉलिसी माहिती (असल्यास)', hi: 'मौजूदा पॉलिसी जानकारी (हो तो)' }, explanation: { mr: 'एकूण कव्हर ठरवण्यासाठी.', hi: 'कुल कवर तय करने के लिए।' }, category: 'OTHER', requirement: 'sometimes' },
} satisfies Record<string, DocItem>;

function income(profile: ProfileType): DocItem[] {
  switch (profile) {
    case 'SALARIED': return [D.salarySlip, D.bankStatement, D.form16];
    case 'BUSINESS': return [D.itr, D.currentAccount, D.gst];
    case 'STUDENT': return [D.coApplicant, { ...D.bankStatement, requirement: 'sometimes' }];
    case 'SENIOR': return [D.pension];
    case 'NRI': return [D.passportVisa, D.nreNro, D.overseasIncome];
  }
}

const KYC: DocItem[] = [D.aadhaar, D.pan, D.photo, D.address];

/** Compose the document checklist for a product + applicant profile. */
export function getDocuments(product: ProductType, profile: ProfileType): DocItem[] {
  switch (product) {
    case 'FD':
      return [...KYC, D.bankAccount, ...(profile === 'SENIOR' ? [D.seniorProof] : [])];
    case 'SIP':
      return [...KYC, D.bankAccount, D.kycStatus, D.nominee];
    case 'HEALTH_INSURANCE':
      return [...KYC, D.ageProof, D.nominee, D.medicalHistory, D.existingPolicy];
    case 'TERM_INSURANCE':
      return [...KYC, D.ageProof, ...income(profile), D.nominee, D.medicalHistory, D.existingPolicy];
    case 'HOME_LOAN':
      return [...KYC, ...income(profile), D.property];
    case 'PERSONAL_LOAN':
      return [...KYC, ...income(profile)];
    case 'BUSINESS_LOAN':
      return [...KYC, D.itr, { ...D.gst, requirement: 'required' }, D.businessProof, D.currentAccount];
    case 'VEHICLE_LOAN':
      return [...KYC, ...income(profile), D.vehicleQuote, D.rcUsed, D.insuranceCopy];
    case 'EDUCATION_LOAN':
      return [...KYC, D.admission, D.feeStructure, D.academic, D.coApplicant];
    case 'GOLD_LOAN':
      return [...KYC, D.goldDeclaration, D.branchCheck];
  }
}

/** Compact lists for the per-product page document sections. */
export const fdDocuments: DocItem[] = [D.pan, D.aadhaar, D.bankAccount, D.seniorProof];
export const sipDocuments: DocItem[] = [D.pan, D.aadhaar, D.bankAccount, D.nominee, D.kycStatus];
export const insuranceDocuments: DocItem[] = [D.ageProof, D.aadhaar, D.medicalHistory, D.nominee, D.existingPolicy];
