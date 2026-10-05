// lib/propertyDocs.ts — property-title documents by property type. Banks verify
// the property (title, approvals) as closely as the applicant, so the generic
// KYC/income list alone is not enough. Wording is deliberately hedged: the exact
// list and look-back period vary by bank and lawyer, so every tab tells the user
// to confirm with the bank.
import type { Bi } from '@/lib/homeFinanceContent';

export type PropertyType = 'new' | 'ready' | 'resale' | 'plot';

export type PropertyDoc = { title: Bi; why: Bi; requirement: 'required' | 'ifApplicable' };

export const PROPERTY_TYPES: { id: PropertyType; label: Bi }[] = [
  { id: 'new', label: { mr: 'नवीन फ्लॅट (MahaRERA)', en: 'New flat (MahaRERA)' } },
  { id: 'ready', label: { mr: 'तयार ताबा फ्लॅट', en: 'Ready-possession flat' } },
  { id: 'resale', label: { mr: 'रिसेल / जुने घर', en: 'Resale / older home' } },
  { id: 'plot', label: { mr: 'NA प्लॉट + बांधकाम', en: 'NA plot + construction' } },
];

export const PROPERTY_DOCS: Record<PropertyType, PropertyDoc[]> = {
  new: [
    { title: { mr: 'MahaRERA नोंदणी क्रमांक', en: 'MahaRERA registration number' }, why: { mr: 'प्रकल्प नोंदणीकृत आहे का हे बँक तपासते. तुम्हीही पोर्टलवर तपासा.', en: 'The bank checks the project is registered; check it on the portal yourself too.' }, requirement: 'required' },
    { title: { mr: 'Allotment Letter / Agreement for Sale', en: 'Allotment letter / Agreement for sale' }, why: { mr: 'किंमत, पेमेंट टप्पे व ताब्याच्या अटी सिद्ध करण्यासाठी.', en: 'Proves price, payment stages and possession terms.' }, requirement: 'required' },
    { title: { mr: 'मंजूर लेआउट व इमारत नकाशा (Sanctioned Plan)', en: 'Sanctioned layout and building plan' }, why: { mr: 'नगररचना/महानगरपालिकेने बांधकामास मंजुरी दिल्याचा पुरावा.', en: 'Proof the planning authority/municipal body approved the construction.' }, requirement: 'required' },
    { title: { mr: 'Commencement Certificate (CC / जोते दाखला)', en: 'Commencement Certificate (CC)' }, why: { mr: 'बांधकाम सुरू करण्याची अधिकृत परवानगी.', en: 'Official permission to start construction.' }, requirement: 'required' },
    { title: { mr: 'बिल्डरकडे भरलेल्या रकमेच्या पावत्या / Demand Letters', en: 'Payment receipts / demand letters to the builder' }, why: { mr: 'तुमचा स्वतःचा वाटा आणि कर्जाचे टप्पे ठरवण्यासाठी.', en: 'To fix your own contribution and the loan release stages.' }, requirement: 'required' },
  ],
  ready: [
    { title: { mr: 'Occupancy Certificate (OC / भोगवटा दाखला) किंवा Completion Certificate', en: 'Occupancy Certificate (OC) or Completion Certificate' }, why: { mr: 'इमारत पूर्ण होऊन राहण्यास योग्य असल्याचा अधिकृत दाखला.', en: 'Official proof the building is complete and fit for occupation.' }, requirement: 'required' },
    { title: { mr: 'नोंदणीकृत खरेदीखत / Agreement', en: 'Registered sale deed / agreement' }, why: { mr: 'मालकी हस्तांतरणाचा दस्त.', en: 'The document that transfers ownership.' }, requirement: 'required' },
    { title: { mr: 'सोसायटी स्थापनेचे कागद / Share Certificate', en: 'Society formation papers / share certificate' }, why: { mr: 'सोसायटी स्थापन झाली असल्यास सभासदत्वासाठी.', en: 'For membership once the society is formed.' }, requirement: 'ifApplicable' },
    { title: { mr: 'मालमत्ता कर व मेंटेनन्स थकबाकी नसल्याचा पुरावा', en: 'Proof of no property-tax / maintenance dues' }, why: { mr: 'जुनी थकबाकी तुमच्यावर येऊ नये म्हणून.', en: 'So old dues do not pass to you.' }, requirement: 'ifApplicable' },
  ],
  resale: [
    { title: { mr: 'मूळ साखळी दस्त (Chain of Title Deeds)', en: 'Chain of title deeds' }, why: { mr: 'मालकी कोणाकडून कोणाकडे आली याची सलग साखळी दाखवते.', en: 'Shows the unbroken chain of ownership.' }, requirement: 'required' },
    { title: { mr: 'वकिलाचा Title Search Report', en: 'Lawyer title search report' }, why: { mr: 'मालकी स्पष्ट आहे आणि वाद/बोजा नाही हे तपासते. किती वर्षांचा सर्च लागतो ते बँकेनुसार ठरते.', en: 'Checks the title is clear with no disputes or encumbrances. The look-back period depends on the bank.' }, requirement: 'required' },
    { title: { mr: 'सोसायटी NOC व Share Certificate', en: 'Society NOC and share certificate' }, why: { mr: 'विक्री व गहाणास सोसायटीची संमती.', en: 'Society consent for the sale and mortgage.' }, requirement: 'required' },
    { title: { mr: 'Occupancy Certificate (OC)', en: 'Occupancy Certificate (OC)' }, why: { mr: 'इमारत अधिकृतपणे वापरास योग्य असल्याचा पुरावा.', en: 'Proof the building is officially fit for use.' }, requirement: 'required' },
    { title: { mr: 'विक्रेत्याचे सध्याचे कर्ज असल्यास Foreclosure पत्र', en: 'Seller foreclosure letter if a loan exists' }, why: { mr: 'जुने कर्ज फेडून मालमत्ता मोकळी होईल हे दाखवते.', en: 'Shows the old loan will be cleared and the property freed.' }, requirement: 'ifApplicable' },
    { title: { mr: 'मालमत्ता कर व मेंटेनन्स पावत्या', en: 'Property tax and maintenance receipts' }, why: { mr: 'थकबाकी नसल्याचा पुरावा.', en: 'Proof there are no dues.' }, requirement: 'required' },
  ],
  plot: [
    { title: { mr: 'बिनशेती (NA) आदेश', en: 'Non-agricultural (NA) order' }, why: { mr: 'जमीन निवासी वापरासाठी मंजूर असल्याचा आदेश.', en: 'Order permitting the land for residential use.' }, requirement: 'required' },
    { title: { mr: '७/१२ उतारा व फेरफार नोंदी', en: '7/12 extract and mutation entries' }, why: { mr: 'जमिनीचे मालक व हक्कनोंदी अद्ययावत आहेत का ते दाखवते.', en: 'Shows current owners and rights records.' }, requirement: 'required' },
    { title: { mr: 'मोजणी नकाशा (भूमी अभिलेख)', en: 'Survey / measurement map (land records)' }, why: { mr: 'क्षेत्र व हद्द निश्चित करण्यासाठी (लागू असल्यास).', en: 'To fix area and boundaries (where applicable).' }, requirement: 'ifApplicable' },
    { title: { mr: 'मंजूर बांधकाम आराखडा (UDCPR 2020 नुसार)', en: 'Sanctioned building plan (as per UDCPR 2020)' }, why: { mr: 'स्थानिक विकास नियमांनुसार बांधकामास मंजुरी.', en: 'Approval to build under the local development rules.' }, requirement: 'required' },
    { title: { mr: 'आर्किटेक्ट/अभियंता यांचा खर्च अंदाज', en: 'Architect/engineer cost estimate' }, why: { mr: 'किती कर्ज लागेल व टप्प्याटप्प्याने कसे द्यायचे हे ठरवण्यासाठी.', en: 'To decide the loan amount and stage-wise release.' }, requirement: 'required' },
    { title: { mr: 'मालकी हक्काची कागदपत्रे (Title Documents)', en: 'Title documents' }, why: { mr: 'प्लॉट तुमचा आहे आणि बोजा नाही हे दाखवते.', en: 'Shows the plot is yours and unencumbered.' }, requirement: 'required' },
  ],
};

export const PROPERTY_DOCS_COPY = {
  title: { mr: 'मालमत्ता प्रकारानुसार कागदपत्रे', en: 'Documents by property type' } as Bi,
  intro: {
    mr: 'बँक अर्जदाराइतकीच मालमत्ता तपासते. तुमच्या मालमत्तेचा प्रकार निवडा.',
    en: 'Banks verify the property as closely as the applicant. Pick your property type.',
  } as Bi,
  note: {
    mr: 'अंतिम यादी बँक व त्यांच्या वकिलानुसार बदलू शकते — अर्जापूर्वी बँकेकडून खात्री करा.',
    en: 'The final list varies by bank and its lawyer — confirm with the bank before applying.',
  } as Bi,
  required: { mr: 'आवश्यक', en: 'Required' } as Bi,
  ifApplicable: { mr: 'लागू असल्यास', en: 'If applicable' } as Bi,
};
