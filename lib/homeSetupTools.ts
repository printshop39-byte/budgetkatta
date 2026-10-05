// lib/homeSetupTools.ts — actionable tools for /home-setup: possession
// (snagging) check, contractor-agreement check, material questions and a sample
// payment-milestone pattern. This is general guidance, not legal advice and not a
// price list: material grades/brands and payment splits vary, so every block says
// to confirm in writing with the contractor/designer.
import type { Bi } from '@/lib/homeFinanceContent';

export type CheckItem = { id: string; text: Bi };

export const SNAGGING: CheckItem[] = [
  { id: 'damp', text: { mr: 'भिंती व छतावर ओलावा, तडे किंवा पाझरल्याचे डाग आहेत का?', en: 'Any damp patches, cracks or seepage marks on walls and ceilings?' } },
  { id: 'slope', text: { mr: 'बाथरूम, किचन व बाल्कनीत थोडे पाणी ओतून पाहा — उतार ड्रेनकडे आहे का, पाणी साचते का? खालच्या मजल्याच्या छतावर गळती आहे का?', en: 'Pour a little water in bathrooms, kitchen and balcony — does it slope to the drain, or pool? Any leak into the ceiling below?' } },
  { id: 'tiles', text: { mr: 'लाद्यांवर हलके ठोकून पोकळ आवाज येतो का? तडे किंवा असमान सांधे आहेत का?', en: 'Tap the floor tiles — any hollow sound? Any cracks or uneven joints?' } },
  { id: 'electric', text: { mr: 'सर्व स्विच/सॉकेट चालतात का? अर्थिंग, MCB व AC/गीझरचे पॉइंट योग्य जागी आहेत का? (शक्य असल्यास इलेक्ट्रिशियनकडून तपासा)', en: 'Do all switches and sockets work? Are earthing, MCB and the AC/geyser points correctly placed? (Have an electrician check if possible.)' } },
  { id: 'plumbing', text: { mr: 'नळांचा दाब, सिंक/वॉश बेसिनखाली गळती आणि ड्रेनेज तपासले का?', en: 'Checked tap pressure, leaks under sink/basin and drainage?' } },
  { id: 'doors', text: { mr: 'दारे-खिडक्या नीट उघडतात/बंद होतात का? कुलपे, कडी व फट तपासली का?', en: 'Do doors and windows open/close properly? Locks, latches and gaps checked?' } },
  { id: 'writing', text: { mr: 'सापडलेल्या त्रुटींची यादी (snag list) बिल्डरकडून लेखी स्वीकारून दुरुस्तीची तारीख घेतली का?', en: 'Have the defects found been listed (snag list) and accepted in writing by the builder, with a repair date?' } },
];

export const SNAGGING_NOTE: Bi = {
  mr: 'फर्निचर/इंटिरिअर सुरू करण्यापूर्वी ओलावा व गळतीच्या समस्या सोडवा — नंतर त्या आढळल्यास लाकडी कामाचे नुकसान होऊ शकते.',
  en: 'Sort out damp and leakage before furniture/interior work starts — finding them later can damage woodwork.',
};

export const CONTRACTOR_CHECK: CheckItem[] = [
  { id: 'quote', text: { mr: 'तपशीलवार लेखी कोट व आराखडा मिळाला आहे का?', en: 'Do you have a detailed written quote and layout?' } },
  { id: 'wetply', text: { mr: 'सिंक खालच्या ओलसर भागात पाणी-प्रतिरोधक (water-resistant) प्लायवूड/बोर्ड वापरणार का — ग्रेड बिलावर लेखी?', en: 'Will water-resistant ply/board be used under the sink, with the grade stated in writing?' } },
  { id: 'hardware', text: { mr: 'ड्रॉवर चॅनेल/बिजागऱ्यांचा ब्रँड व वॉरंटी (वर्षे) लेखी आहे का?', en: 'Are the drawer-channel/hinge brand and warranty (years) in writing?' } },
  { id: 'duct', text: { mr: 'चिमणीचा पाईप (duct) बाहेर सोडण्यासाठी भिंतीत सुरक्षित जागा ठरली आहे का?', en: 'Is a safe route for the chimney duct to the outside agreed?' } },
  { id: 'date', text: { mr: 'अंतिम डिलिव्हरीची तारीख व उशिराबद्दलच्या अटी करारात आहेत का?', en: 'Are the final delivery date and delay terms in the agreement?' } },
  { id: 'damage', text: { mr: 'साइटवरील नुकसानीची जबाबदारी कोणाची हे ठरले आहे का?', en: 'Is responsibility for damage on site agreed?' } },
];

export const CONTRACTOR_NOTE: Bi = {
  mr: 'संपूर्ण काम समाधानकारक पूर्ण होईपर्यंत अंतिम १०–१५% रक्कम रोखून ठेवा.',
  en: 'Hold back the final 10–15% until the whole job is completed to your satisfaction.',
};

export type MaterialRow = { area: Bi; ask: Bi; why: Bi; caution: Bi };

export const MATERIALS: MaterialRow[] = [
  {
    area: { mr: 'किचन ओटा / सिंक खालचा भाग', en: 'Kitchen sink base / wet areas' },
    ask: { mr: 'पाणी-प्रतिरोधक प्लाय (उदा. BWR/BWP ग्रेड)', en: 'Water-resistant ply (e.g. BWR/BWP grade)' },
    why: { mr: 'ओलाव्याने फुगण्याचा धोका कमी.', en: 'Lower risk of swelling in moisture.' },
    caution: { mr: 'साधा पार्टिकल बोर्ड किंवा कमी दर्जाचा MDF ओलाव्यात फुगू शकतो.', en: 'Plain particle board or low-grade MDF can swell when wet.' },
  },
  {
    area: { mr: 'वॉर्डरोब / कपाट', en: 'Wardrobes' },
    ask: { mr: 'चांगल्या दर्जाचा प्लाय/बोर्ड (उदा. MR ग्रेड commercial ply) — जाडी लेखी', en: 'Good-quality ply/board (e.g. MR-grade commercial ply) — thickness in writing' },
    why: { mr: 'मजबुती व वजन पेलण्यासाठी.', en: 'For strength and load.' },
    caution: { mr: 'खूप पातळ/हलका बोर्ड कालांतराने वाकू शकतो.', en: 'Very thin or light board may sag over time.' },
  },
  {
    area: { mr: 'शटर / कप्प्यांचे फिनिश', en: 'Shutter / carcass finish' },
    ask: { mr: 'Laminate किंवा Acrylic — ब्रँड व जाडी लेखी', en: 'Laminate or acrylic — brand and thickness in writing' },
    why: { mr: 'स्क्रॅच-प्रतिरोध व स्वच्छता सोपी.', en: 'Scratch resistance and easy cleaning.' },
    caution: { mr: 'जाडी/ब्रँड न सांगणारे अस्पष्ट कोट टाळा.', en: 'Avoid vague quotes that do not state thickness/brand.' },
  },
];

export const MATERIALS_NOTE: Bi = {
  mr: 'हे सर्वसाधारण मार्गदर्शन आहे. साहित्याचे ग्रेड, ब्रँड व जाडी बिलासह लेखी घ्या आणि तुमच्या डिझायनर/कंत्राटदाराशी खात्री करा.',
  en: 'General guidance only. Get material grade, brand and thickness in writing with the bill, and confirm with your designer/contractor.',
};

export const PAYMENT_STAGES: { pct: number; label: Bi }[] = [
  { pct: 10, label: { mr: 'डिझाइन व करार अंतिम झाल्यावर', en: 'When design and agreement are final' } },
  { pct: 40, label: { mr: 'प्लायवूड व हार्डवेअर प्रत्यक्ष घरात आल्यावर', en: 'When plywood and hardware reach the site' } },
  { pct: 35, label: { mr: 'कपाटे/किचनची चौकट (carcass) पूर्ण झाल्यावर', en: 'When carcass / framing is complete' } },
  { pct: 15, label: { mr: 'फिनिशिंग, हँडल्स व अंतिम ताबा — समाधान झाल्यावर', en: 'On finishing, handles and final handover — once satisfied' } },
];

export const PAYMENT_NOTE: Bi = {
  mr: 'हा सुचवलेला नमुना आहे — टप्पे व टक्केवारी वाटाघाटीने ठरवता येतात. प्रत्येक टप्पा व पावती लेखी ठेवा आणि कामाच्या प्रगतीशिवाय आगाऊ मोठी रक्कम देऊ नका.',
  en: 'A sample pattern — stages and percentages can be negotiated. Keep every stage and receipt in writing, and avoid large advances ahead of progress.',
};

export const TOOLS_COPY = {
  title: { mr: 'कृतीसाठी साधने — कंत्राटदाराकडे घेऊन जा', en: 'Tools to act on — take these to your contractor' } as Bi,
  snagTitle: { mr: 'ताबा घेताना तपासणी (Snagging)', en: 'Possession check (snagging)' } as Bi,
  contractTitle: { mr: 'कंत्राटदाराशी करार करण्यापूर्वी', en: 'Before you sign with the contractor' } as Bi,
  materialTitle: { mr: 'साहित्य: काय विचारायचे', en: 'Materials: what to ask for' } as Bi,
  paymentTitle: { mr: 'पैसे देण्याचे टप्पे (सुचवलेला नमुना)', en: 'Payment stages (sample pattern)' } as Bi,
  done: { mr: 'पूर्ण', en: 'done' } as Bi,
  reset: { mr: 'रीसेट', en: 'Reset' } as Bi,
  colArea: { mr: 'भाग', en: 'Area' } as Bi,
  colAsk: { mr: 'काय विचारायचे', en: 'Ask for' } as Bi,
  colWhy: { mr: 'का', en: 'Why' } as Bi,
  colCaution: { mr: 'सावध राहा', en: 'Watch out' } as Bi,
};
