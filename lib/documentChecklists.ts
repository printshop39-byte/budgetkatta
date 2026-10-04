// lib/documentChecklists.ts
// Central, localized (mr/en) document-checklist data. Composed from reusable
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
  | 'SIP'
  // Home-finance scenarios (blueprint section 6)
  | 'HOME_BUY'
  | 'HOME_BUILD'
  | 'PROPERTY_LOAN'
  | 'LOAN_TRANSFER';

export type ProfileType = 'SALARIED' | 'BUSINESS' | 'STUDENT' | 'SENIOR' | 'NRI' | 'CO_APPLICANT';

export const productOptions: { value: ProductType; label: Bi }[] = [
  { value: 'FD', label: { mr: 'मुदत ठेव (FD)', en: 'Fixed Deposit (FD)' } },
  { value: 'HOME_LOAN', label: { mr: 'गृहकर्ज', en: 'Home Loan' } },
  { value: 'PERSONAL_LOAN', label: { mr: 'वैयक्तिक कर्ज', en: 'Personal Loan' } },
  { value: 'BUSINESS_LOAN', label: { mr: 'व्यवसाय कर्ज', en: 'Business Loan' } },
  { value: 'VEHICLE_LOAN', label: { mr: 'वाहन कर्ज', en: 'Vehicle Loan' } },
  { value: 'EDUCATION_LOAN', label: { mr: 'शैक्षणिक कर्ज', en: 'Education Loan' } },
  { value: 'GOLD_LOAN', label: { mr: 'गोल्ड लोन', en: 'Gold Loan' } },
  { value: 'HEALTH_INSURANCE', label: { mr: 'आरोग्य विमा', en: 'Health Insurance' } },
  { value: 'TERM_INSURANCE', label: { mr: 'टर्म विमा', en: 'Term Insurance' } },
  { value: 'SIP', label: { mr: 'SIP / म्युच्युअल फंड', en: 'SIP / Mutual Fund' } },
];

export const profileOptions: { value: ProfileType; label: Bi }[] = [
  { value: 'SALARIED', label: { mr: 'नोकरीदार', en: 'Salaried' } },
  { value: 'BUSINESS', label: { mr: 'व्यवसायिक', en: 'Business Owner' } },
  { value: 'STUDENT', label: { mr: 'विद्यार्थी', en: 'Student' } },
  { value: 'SENIOR', label: { mr: 'ज्येष्ठ नागरिक', en: 'Senior Citizen' } },
  { value: 'NRI', label: { mr: 'NRI', en: 'NRI' } },
];

/** Home-finance scenarios shown on /documents (blueprint section 6). */
export const homeProductOptions: { value: ProductType; label: Bi }[] = [
  { value: 'HOME_BUY', label: { mr: 'घर खरेदी', en: 'Buying a home' } },
  { value: 'HOME_BUILD', label: { mr: 'घर बांधकाम', en: 'Building a home' } },
  { value: 'PROPERTY_LOAN', label: { mr: 'Property Loan (मालमत्तेवरील कर्ज)', en: 'Property Loan (against property)' } },
  { value: 'LOAN_TRANSFER', label: { mr: 'Loan Transfer (कर्ज हस्तांतरण)', en: 'Loan Transfer' } },
];

export const homeProfileOptions: { value: ProfileType; label: Bi }[] = [
  { value: 'SALARIED', label: { mr: 'पगारदार अर्जदार', en: 'Salaried applicant' } },
  { value: 'BUSINESS', label: { mr: 'व्यवसाय करणारा अर्जदार', en: 'Business / self-employed applicant' } },
  { value: 'CO_APPLICANT', label: { mr: 'सह-अर्जदार', en: 'Co-applicant' } },
];

export const categoryLabel: Record<DocCategory, Bi> = {
  KYC: { mr: 'ओळख (KYC)', en: 'Identity (KYC)' },
  INCOME: { mr: 'उत्पन्न पुरावा', en: 'Income Proof' },
  PRODUCT: { mr: 'उत्पादनासाठी', en: 'Product-specific' },
  OTHER: { mr: 'इतर', en: 'Other' },
};

// ── Document atoms ──────────────────────────────────────────────────────────
const D = {
  aadhaar: { name: { mr: 'आधार कार्ड', en: 'Aadhaar Card' }, explanation: { mr: 'ओळख आणि पत्ता पडताळणीसाठी.', en: 'For identity and address verification.' }, category: 'KYC', requirement: 'required' },
  pan: { name: { mr: 'पॅन कार्ड', en: 'PAN Card' }, explanation: { mr: 'कर आणि आर्थिक ओळखीसाठी.', en: 'For tax and financial identification.' }, category: 'KYC', requirement: 'required' },
  photo: { name: { mr: 'पासपोर्ट आकाराचा फोटो', en: 'Passport-size Photo' }, explanation: { mr: 'अर्जासोबत ओळखीसाठी.', en: 'For identification with the application.' }, category: 'KYC', requirement: 'required' },
  address: { name: { mr: 'पत्ता पुरावा', en: 'Address Proof' }, explanation: { mr: 'वीज बिल, भाडेकरार किंवा पासबुक चालते.', en: 'Electricity bill, rent agreement or passbook is accepted.' }, category: 'KYC', requirement: 'sometimes' },

  salarySlip: { name: { mr: 'पगार स्लिप (३ महिने)', en: 'Salary Slip (3 months)' }, explanation: { mr: 'उत्पन्न व परतफेड क्षमता तपासण्यासाठी.', en: 'To check income and repayment capacity.' }, category: 'INCOME', requirement: 'required' },
  bankStatement: { name: { mr: 'बँक स्टेटमेंट (६ महिने)', en: 'Bank Statement (6 months)' }, explanation: { mr: 'व्यवहार व उत्पन्नाचा अंदाज घेण्यासाठी.', en: 'To assess transactions and income.' }, category: 'INCOME', requirement: 'required' },
  form16: { name: { mr: 'फॉर्म 16', en: 'Form 16' }, explanation: { mr: 'पगारदारांचे उत्पन्न प्रमाण.', en: 'Income proof for salaried individuals.' }, category: 'INCOME', requirement: 'sometimes' },
  itr: { name: { mr: 'ITR (२ वर्षे)', en: 'ITR (2 years)' }, explanation: { mr: 'व्यावसायिक/स्वयंरोजगार उत्पन्न प्रमाण.', en: 'Income proof for business owners and self-employed.' }, category: 'INCOME', requirement: 'required' },
  gst: { name: { mr: 'GST नोंदणी', en: 'GST Registration' }, explanation: { mr: 'व्यवसाय असल्यास लागू.', en: 'Applicable if you run a business.' }, category: 'INCOME', requirement: 'sometimes' },
  currentAccount: { name: { mr: 'चालू खाते स्टेटमेंट', en: 'Current Account Statement' }, explanation: { mr: 'व्यवसायाचे व्यवहार दाखवण्यासाठी.', en: 'To show business transactions.' }, category: 'INCOME', requirement: 'required' },
  coApplicant: { name: { mr: 'सह-अर्जदार उत्पन्न पुरावा', en: 'Co-applicant Income Proof' }, explanation: { mr: 'विद्यार्थी किंवा कमी उत्पन्न असल्यास.', en: 'Required for students or applicants with low income.' }, category: 'INCOME', requirement: 'required' },
  pension: { name: { mr: 'पेन्शन पुरावा / बँक स्टेटमेंट', en: 'Pension Proof / Bank Statement' }, explanation: { mr: 'ज्येष्ठ नागरिकांचे उत्पन्न दाखवण्यासाठी.', en: 'To show income for senior citizens.' }, category: 'INCOME', requirement: 'required' },
  passportVisa: { name: { mr: 'पासपोर्ट व व्हिसा', en: 'Passport and Visa' }, explanation: { mr: 'NRI ओळख व स्थितीसाठी.', en: 'For NRI identity and status.' }, category: 'INCOME', requirement: 'required' },
  nreNro: { name: { mr: 'NRE/NRO खाते स्टेटमेंट', en: 'NRE/NRO Account Statement' }, explanation: { mr: 'NRI व्यवहार पुरावा.', en: 'Proof of NRI transactions.' }, category: 'INCOME', requirement: 'required' },
  overseasIncome: { name: { mr: 'परदेशी उत्पन्न पुरावा', en: 'Overseas Income Proof' }, explanation: { mr: 'परदेशातील पगार/उत्पन्न असल्यास.', en: 'If you have salary or income from abroad.' }, category: 'INCOME', requirement: 'sometimes' },

  bankAccount: { name: { mr: 'बँक खाते', en: 'Bank Account' }, explanation: { mr: 'रक्कम जमा व परताव्यासाठी.', en: 'For deposits and payouts.' }, category: 'PRODUCT', requirement: 'required' },
  seniorProof: { name: { mr: 'ज्येष्ठ नागरिक पुरावा', en: 'Senior Citizen Proof' }, explanation: { mr: 'जास्त व्याजदर मिळवण्यासाठी.', en: 'To get the higher interest rate.' }, category: 'PRODUCT', requirement: 'sometimes' },
  nominee: { name: { mr: 'वारसदार (nominee) माहिती', en: 'Nominee Details' }, explanation: { mr: 'लाभार्थी निश्चित करण्यासाठी.', en: 'To designate a beneficiary.' }, category: 'PRODUCT', requirement: 'required' },
  kycStatus: { name: { mr: 'KYC स्थिती', en: 'KYC Status' }, explanation: { mr: 'गुंतवणूक सुरू करण्यासाठी अनिवार्य.', en: 'Mandatory to start investing.' }, category: 'PRODUCT', requirement: 'required' },
  vehicleQuote: { name: { mr: 'वाहन कोटेशन', en: 'Vehicle Quotation' }, explanation: { mr: 'कर्ज रक्कम ठरवण्यासाठी.', en: 'To determine the loan amount.' }, category: 'PRODUCT', requirement: 'required' },
  rcUsed: { name: { mr: 'RC (वापरलेले वाहन असल्यास)', en: 'RC (for used vehicles)' }, explanation: { mr: 'वाहन मालकी पडताळणीसाठी.', en: 'To verify vehicle ownership.' }, category: 'PRODUCT', requirement: 'sometimes' },
  insuranceCopy: { name: { mr: 'विमा प्रत (लागू असल्यास)', en: 'Insurance Copy (if applicable)' }, explanation: { mr: 'वाहन विमा पडताळणीसाठी.', en: 'To verify vehicle insurance.' }, category: 'PRODUCT', requirement: 'sometimes' },
  admission: { name: { mr: 'प्रवेश पत्र', en: 'Admission Letter' }, explanation: { mr: 'अभ्यासक्रम प्रवेश पुष्टीसाठी.', en: 'To confirm enrolment in the course.' }, category: 'PRODUCT', requirement: 'required' },
  feeStructure: { name: { mr: 'शुल्क रचना', en: 'Fee Structure' }, explanation: { mr: 'कर्ज रक्कम ठरवण्यासाठी.', en: 'To determine the loan amount.' }, category: 'PRODUCT', requirement: 'required' },
  academic: { name: { mr: 'शैक्षणिक कागदपत्रे', en: 'Academic Documents' }, explanation: { mr: 'मागील गुणपत्रिका/प्रमाणपत्रे.', en: 'Previous mark sheets and certificates.' }, category: 'PRODUCT', requirement: 'required' },
  businessProof: { name: { mr: 'व्यवसाय पुरावा', en: 'Business Proof' }, explanation: { mr: 'नोंदणी/परवाना/उद्यम प्रमाण.', en: 'Registration, licence or Udyam certificate.' }, category: 'PRODUCT', requirement: 'required' },
  property: { name: { mr: 'मालमत्ता कागदपत्रे', en: 'Property Documents' }, explanation: { mr: 'गृहकर्जासाठी तारण म्हणून.', en: 'As collateral for the home loan.' }, category: 'PRODUCT', requirement: 'required' },
  goldDeclaration: { name: { mr: 'सोने मालकी घोषणा (आवश्यक असल्यास)', en: 'Gold Ownership Declaration (if needed)' }, explanation: { mr: 'काही ठिकाणी मालकी जाहीर करावी लागते.', en: 'Some lenders require an ownership declaration.' }, category: 'PRODUCT', requirement: 'sometimes' },
  branchCheck: { name: { mr: 'शाखा स्तरावर सोने तपासणी', en: 'Gold Appraisal at Branch' }, explanation: { mr: 'सोन्याचे मूल्य शाखेत तपासले जाते.', en: "The gold's value is appraised at the branch." }, category: 'OTHER', requirement: 'sometimes' },
  coApplicantKyc: { name: { mr: 'सह-अर्जदाराचे KYC (आधार, पॅन, फोटो)', en: 'Co-applicant KYC (Aadhaar, PAN, photo)' }, explanation: { mr: 'सह-अर्जदाराची ओळख पडताळण्यासाठी.', en: 'To verify the co-applicant identity.' }, category: 'KYC', requirement: 'required' },
  coApplicantIncome: { name: { mr: 'सह-अर्जदाराचा उत्पन्न पुरावा', en: 'Co-applicant income proof' }, explanation: { mr: 'पगार स्लिप किंवा ITR + बँक स्टेटमेंट — एकत्रित पात्रता वाढवण्यासाठी.', en: 'Salary slips or ITR + bank statement, to add to combined eligibility.' }, category: 'INCOME', requirement: 'required' },
  coApplicantRelation: { name: { mr: 'सह-अर्जदाराशी नाते दर्शवणारा पुरावा', en: 'Proof of relationship to co-applicant' }, explanation: { mr: 'बँका सहसा जवळच्या नातेवाईकांनाच सह-अर्जदार मानतात; नियम बँकेनुसार.', en: 'Banks usually accept close relatives as co-applicants; rules vary by bank.' }, category: 'OTHER', requirement: 'sometimes' },
  agreement: { name: { mr: 'विक्री करार / Allotment Letter', en: 'Agreement for sale / Allotment letter' }, explanation: { mr: 'खरेदीची किंमत व अटी सिद्ध करण्यासाठी.', en: 'To prove the price and terms of the purchase.' }, category: 'PRODUCT', requirement: 'required' },
  reraProof: { name: { mr: 'RERA नोंदणी क्रमांक (नवीन प्रकल्पासाठी)', en: 'RERA registration number (new projects)' }, explanation: { mr: 'प्रकल्प नोंदणीकृत आहे हे बँक तपासते.', en: 'The bank checks the project is registered.' }, category: 'PRODUCT', requirement: 'sometimes' },
  titleDocs: { name: { mr: 'मालकी हक्काची कागदपत्रे (Title documents)', en: 'Title documents' }, explanation: { mr: 'विक्रेत्याला मालमत्ता विकण्याचा हक्क आहे हे तपासण्यासाठी.', en: 'To check the seller has the right to sell.' }, category: 'PRODUCT', requirement: 'required' },
  societyNoc: { name: { mr: 'सोसायटी NOC / Share certificate', en: 'Society NOC / share certificate' }, explanation: { mr: 'पुनर्विक्रीच्या घरासाठी सोसायटीची संमती.', en: 'Society consent for resale homes.' }, category: 'PRODUCT', requirement: 'sometimes' },
  plotOwnership: { name: { mr: 'प्लॉट मालकीचा पुरावा (७/१२ / प्रॉपर्टी कार्ड)', en: 'Plot ownership proof (7/12 / property card)' }, explanation: { mr: 'बांधकामासाठी जमीन तुमची असल्याचे सिद्ध करण्यासाठी.', en: 'To show the land you build on is yours.' }, category: 'PRODUCT', requirement: 'required' },
  buildingPlan: { name: { mr: 'मंजूर बांधकाम आराखडा', en: 'Sanctioned building plan' }, explanation: { mr: 'स्थानिक प्राधिकरणाने बांधकामास परवानगी दिल्याचा पुरावा.', en: 'Proof the local authority approved the construction.' }, category: 'PRODUCT', requirement: 'required' },
  costEstimate: { name: { mr: 'बांधकाम खर्चाचा अंदाज (अभियंता/आर्किटेक्ट)', en: 'Construction cost estimate (engineer/architect)' }, explanation: { mr: 'किती कर्ज लागेल व टप्प्याटप्प्याने कसे द्यायचे हे ठरवण्यासाठी.', en: 'To decide the loan amount and stage-wise release.' }, category: 'PRODUCT', requirement: 'required' },
  propertyTax: { name: { mr: 'मालमत्ता कर पावती', en: 'Property tax receipt' }, explanation: { mr: 'थकबाकी नाही हे दाखवण्यासाठी.', en: 'To show there are no dues.' }, category: 'PRODUCT', requirement: 'sometimes' },
  valuation: { name: { mr: 'मालमत्ता मूल्यांकन (बँक करते)', en: 'Property valuation (done by the bank)' }, explanation: { mr: 'कर्ज किती मिळेल हे मालमत्तेच्या मूल्यावरून ठरते; मूल्यांकन बँक करवून घेते.', en: 'The loan limit depends on property value; the bank arranges the valuation.' }, category: 'OTHER', requirement: 'sometimes' },
  loanStatement: { name: { mr: 'सध्याच्या कर्जाचे स्टेटमेंट (उर्वरित रक्कम)', en: 'Existing loan statement (outstanding)' }, explanation: { mr: 'किती कर्ज हलवायचे आहे ते कळण्यासाठी.', en: 'To know how much is to be moved.' }, category: 'PRODUCT', requirement: 'required' },
  sanctionLetter: { name: { mr: 'सध्याचे मंजुरी पत्र व कर्ज करार', en: 'Existing sanction letter and loan agreement' }, explanation: { mr: 'सध्याचा दर, कालावधी व प्रीपेमेंट अटी तपासण्यासाठी.', en: 'To check the current rate, tenure and prepayment terms.' }, category: 'PRODUCT', requirement: 'required' },
  foreclosure: { name: { mr: 'सध्याच्या बँकेचे Foreclosure पत्र', en: 'Foreclosure letter from current bank' }, explanation: { mr: 'कर्ज बंद करण्यासाठी लागणारी रक्कम दाखवते.', en: 'Shows the amount needed to close the loan.' }, category: 'PRODUCT', requirement: 'required' },
  originalDocs: { name: { mr: 'सध्याच्या बँकेकडील मूळ मालमत्ता कागदपत्रांची यादी', en: 'List of original property documents held by current bank' }, explanation: { mr: 'नवीन बँकेकडे ती हस्तांतरित करण्यासाठी.', en: 'So they can be handed over to the new bank.' }, category: 'PRODUCT', requirement: 'required' },
  ageProof: { name: { mr: 'वय पुरावा', en: 'Age Proof' }, explanation: { mr: 'प्रीमियम व पात्रतेसाठी.', en: 'For premium calculation and eligibility.' }, category: 'PRODUCT', requirement: 'required' },
  medicalHistory: { name: { mr: 'वैद्यकीय इतिहास', en: 'Medical History' }, explanation: { mr: 'वयानुसार तपासणी लागू शकते.', en: 'A medical check-up may apply based on age.' }, category: 'PRODUCT', requirement: 'sometimes' },
  existingPolicy: { name: { mr: 'सध्याची पॉलिसी माहिती (असल्यास)', en: 'Existing Policy Details (if any)' }, explanation: { mr: 'एकूण कव्हर ठरवण्यासाठी.', en: 'To determine total cover.' }, category: 'OTHER', requirement: 'sometimes' },
} satisfies Record<string, DocItem>;

function income(profile: ProfileType): DocItem[] {
  switch (profile) {
    case 'SALARIED': return [D.salarySlip, D.bankStatement, D.form16];
    case 'BUSINESS': return [D.itr, D.currentAccount, D.gst];
    case 'STUDENT': return [D.coApplicant, { ...D.bankStatement, requirement: 'sometimes' }];
    case 'SENIOR': return [D.pension];
    case 'NRI': return [D.passportVisa, D.nreNro, D.overseasIncome];
    case 'CO_APPLICANT': return [D.coApplicantIncome, D.coApplicantRelation];
  }
}

const KYC: DocItem[] = [D.aadhaar, D.pan, D.photo, D.address];

/** KYC + income for the chosen applicant, then the scenario's own documents. */
function homeSet(profile: ProfileType, scenarioDocs: DocItem[]): DocItem[] {
  const base = profile === 'CO_APPLICANT' ? [D.coApplicantKyc] : KYC;
  return [...base, ...income(profile), ...scenarioDocs];
}

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
    case 'HOME_BUY':
      return homeSet(profile, [D.agreement, D.reraProof, D.titleDocs, D.societyNoc, D.valuation]);
    case 'HOME_BUILD':
      return homeSet(profile, [D.plotOwnership, D.buildingPlan, D.costEstimate, D.titleDocs, D.valuation]);
    case 'PROPERTY_LOAN':
      return homeSet(profile, [D.titleDocs, D.propertyTax, D.valuation]);
    case 'LOAN_TRANSFER':
      return homeSet(profile, [D.loanStatement, D.sanctionLetter, D.foreclosure, D.originalDocs, D.titleDocs]);
    case 'GOLD_LOAN':
      return [...KYC, D.goldDeclaration, D.branchCheck];
  }
}

/** Compact lists for the per-product page document sections. */
export const fdDocuments: DocItem[] = [D.pan, D.aadhaar, D.bankAccount, D.seniorProof];
export const sipDocuments: DocItem[] = [D.pan, D.aadhaar, D.bankAccount, D.nominee, D.kycStatus];
export const insuranceDocuments: DocItem[] = [D.ageProof, D.aadhaar, D.medicalHistory, D.nominee, D.existingPolicy];
