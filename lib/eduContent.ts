// lib/eduContent.ts — localized (mr/en) educational content for /rates,
// /credit-score and /cards. Kept central so components stay copy-free.
import type { Bi } from '@/types';

export interface InfoCard {
  icon: string;
  title: Bi;
  lines: Bi[];
}

// ── /rates — gold / silver / repo educational cards ─────────────────────────
export const marketCards: InfoCard[] = [
  {
    icon: '🥇',
    title: { mr: 'सोने दर', en: 'Gold Rate' },
    lines: [
      {
        mr: 'सोने-चांदीचे दर शहरानुसार बदलू शकतात. अंतिम दरासाठी अधिकृत स्रोत किंवा स्थानिक विक्रेत्याकडे तपासा.',
        en: 'Gold and silver rates can vary city to city. Check an official source or your local dealer for the final rate.',
      },
    ],
  },
  {
    icon: '🥈',
    title: { mr: 'चांदी दर', en: 'Silver Rate' },
    lines: [
      {
        mr: 'सोने-चांदीचे दर शहरानुसार बदलू शकतात. अंतिम दरासाठी अधिकृत स्रोत किंवा स्थानिक विक्रेत्याकडे तपासा.',
        en: 'Gold and silver rates can vary city to city. Check an official source or your local dealer for the final rate.',
      },
    ],
  },
  {
    icon: '🏦',
    title: { mr: 'रेपो दर', en: 'Repo Rate' },
    lines: [
      { mr: 'RBI चा रेपो दर कर्जाच्या व्याजदरांवर परिणाम करतो.', en: "The RBI's repo rate influences loan interest rates." },
      { mr: 'अधिकृत आकड्यांसाठी RBI संकेतस्थळ पाहा.', en: 'Refer to the RBI website for official figures.' },
    ],
  },
];

// ── /credit-score ────────────────────────────────────────────────────────────
export const creditScore = {
  whatIs: {
    title: { mr: 'क्रेडिट स्कोअर म्हणजे काय?', en: 'What is a credit score?' } as Bi,
    body: {
      mr: 'क्रेडिट स्कोअर हा ३०० ते ९०० दरम्यानचा आकडा आहे जो तुमची कर्ज परतफेडीची सवय दर्शवतो. जास्त स्कोअर म्हणजे चांगली विश्वासार्हता.',
      en: 'A credit score is a number between 300 and 900 that reflects your loan repayment habits. A higher score means better creditworthiness.',
    } as Bi,
  },
  whyMatters: {
    title: { mr: 'याचे महत्त्व का?', en: 'Why does it matter?' } as Bi,
    body: {
      mr: 'चांगला स्कोअर असल्यास कर्ज लवकर मंजूर होते आणि व्याजदर कमी मिळतो. कमी स्कोअरमुळे अर्ज नाकारला जाऊ शकतो.',
      en: 'A good score means faster loan approvals and lower interest rates. A low score can lead to your application being rejected.',
    } as Bi,
  },
  improve: {
    title: { mr: 'स्कोअर कसा सुधारावा?', en: 'How can you improve your score?' } as Bi,
    points: [
      { mr: 'EMI व क्रेडिट कार्ड बिल वेळेवर भरा.', en: 'Pay your EMIs and credit card bills on time.' },
      { mr: 'क्रेडिट मर्यादेचा ३०% पेक्षा कमी वापर करा.', en: 'Use less than 30% of your credit limit.' },
      { mr: 'एकाच वेळी अनेक कर्ज अर्ज टाळा.', en: 'Avoid applying for multiple loans at the same time.' },
      { mr: 'जुनी चांगली खाती चालू ठेवा.', en: 'Keep older, well-maintained accounts active.' },
    ] as Bi[],
  },
  note: {
    mr: 'टीप: आम्ही तुमचा CIBIL स्कोअर तपासत नाही. हे केवळ शैक्षणिक मार्गदर्शन आहे.',
    en: 'Note: We do not check your CIBIL score. This is purely educational guidance.',
  } as Bi,
};

// ── /insurance — insurance types ────────────────────────────────────────────
export interface InsuranceType {
  id: string;
  icon: string;
  label: Bi;
  whatIs: Bi;
  who: Bi;
  benefits: Bi[];
  check: Bi[];
}

export const insuranceTypes: InsuranceType[] = [
  {
    id: 'term',
    icon: '🛡️',
    label: { mr: 'टर्म विमा', en: 'Term Insurance' },
    whatIs: {
      mr: 'ठरलेल्या मुदतीसाठी मोठे जीवन कव्हर, कमी प्रीमियममध्ये.',
      en: 'Large life cover for a fixed term, at a low premium.',
    },
    who: { mr: 'कुटुंबाचा आधार असणाऱ्या कमावत्या व्यक्तींसाठी.', en: 'For earning members who are the financial support of their family.' },
    benefits: [
      { mr: 'कमी प्रीमियममध्ये मोठे कव्हर', en: 'Large cover at a low premium' },
      { mr: 'कुटुंबाला आर्थिक सुरक्षा', en: 'Financial security for your family' },
    ],
    check: [
      { mr: 'क्लेम सेटलमेंट रेशो तपासा', en: 'Check the claim settlement ratio' },
      { mr: 'कव्हर रक्कम पुरेशी आहे का?', en: 'Is the cover amount enough?' },
    ],
  },
  {
    id: 'health',
    icon: '🏥',
    label: { mr: 'आरोग्य / मेडिक्लेम', en: 'Health / Mediclaim' },
    whatIs: {
      mr: 'रुग्णालयाचा खर्च भरून काढणारा विमा.',
      en: 'Insurance that covers hospital expenses.',
    },
    who: { mr: 'प्रत्येक व्यक्ती व कुटुंबासाठी आवश्यक.', en: 'Essential for every individual and family.' },
    benefits: [
      { mr: 'कॅशलेस उपचार सुविधा', en: 'Cashless treatment facility' },
      { mr: 'कर सवलत (80D)', en: 'Tax benefit under Section 80D' },
    ],
    check: [
      { mr: 'रूम रेंट मर्यादा व को-पे', en: 'Room rent limit and co-pay' },
      { mr: 'वेटिंग पीरियड व नेटवर्क हॉस्पिटल', en: 'Waiting period and network hospitals' },
    ],
  },
  {
    id: 'moneyback',
    icon: '💵',
    label: { mr: 'मनी बॅक', en: 'Money Back' },
    whatIs: {
      mr: 'ठराविक काळाने परतावा देणारी विमा योजना.',
      en: 'An insurance plan that pays out returns at fixed intervals.',
    },
    who: { mr: 'विमा व नियमित परतावा दोन्ही हवे असणाऱ्यांसाठी.', en: 'For those who want both insurance and regular payouts.' },
    benefits: [
      { mr: 'मुदतीत टप्प्याटप्प्याने परतावा', en: 'Staggered payouts during the policy term' },
      { mr: 'जीवन कव्हरसह बचत', en: 'Savings combined with life cover' },
    ],
    check: [
      { mr: 'परताव्याचा दर कमी असू शकतो', en: 'The rate of return can be lower' },
      { mr: 'टर्म + SIP पर्यायाशी तुलना करा', en: 'Compare against a Term + SIP alternative' },
    ],
  },
  {
    id: 'child',
    icon: '🧒',
    label: { mr: 'चाइल्ड प्लॅन', en: 'Child Plan' },
    whatIs: {
      mr: 'मुलांच्या शिक्षण व भविष्यासाठी बचत + विमा.',
      en: "Savings plus insurance for your child's education and future.",
    },
    who: { mr: 'मुलांच्या भविष्याचे नियोजन करणाऱ्या पालकांसाठी.', en: "For parents planning their child's future." },
    benefits: [
      { mr: 'शिक्षणासाठी निधी उभारणी', en: 'Builds a fund for education' },
      { mr: 'पालकाच्या अनुपस्थितीतही सुरक्षा', en: 'Protection even in the absence of the parent' },
    ],
    check: [
      { mr: 'लॉक-इन कालावधी तपासा', en: 'Check the lock-in period' },
      { mr: 'शुल्क व परतावा समजून घ्या', en: 'Understand the charges and returns' },
    ],
  },
  {
    id: 'cyber',
    icon: '🔐',
    label: { mr: 'सायबर विमा', en: 'Cyber Insurance' },
    whatIs: {
      mr: 'ऑनलाइन फसवणूक व सायबर नुकसानापासून संरक्षण.',
      en: 'Protection against online fraud and cyber losses.',
    },
    who: { mr: 'ऑनलाइन व्यवहार करणाऱ्या प्रत्येकासाठी उपयुक्त.', en: 'Useful for everyone who transacts online.' },
    benefits: [
      { mr: 'ऑनलाइन फसवणूक नुकसान भरपाई', en: 'Compensation for online fraud losses' },
      { mr: 'डेटा चोरी व ओळख चोरी कव्हर', en: 'Cover for data theft and identity theft' },
    ],
    check: [
      { mr: 'कोणते धोके कव्हर होतात?', en: 'Which risks are covered?' },
      { mr: 'क्लेमसाठी लागणारे पुरावे', en: 'Evidence required for a claim' },
    ],
  },
  {
    id: 'vehicle_all',
    icon: '🚗',
    label: { mr: 'सर्व प्रकार वाहन विमा', en: 'All-Type Vehicle Insurance' },
    whatIs: {
      mr: 'दुचाकी, चारचाकी आणि व्यावसायिक वाहनांसाठी संपूर्ण विमा संरक्षण.',
      en: 'Complete insurance cover for 2-wheelers, 4-wheelers and commercial vehicles.',
    },
    who: { mr: 'कोणतेही वाहन असणाऱ्या प्रत्येक मालकासाठी.', en: 'For every owner of any vehicle.' },
    benefits: [
      { mr: 'अपघात, चोरी व तृतीय-पक्ष नुकसान कव्हर', en: 'Covers accident, theft and third-party damage' },
      { mr: 'कॅशलेस गॅरेज नेटवर्क', en: 'Cashless garage network' },
    ],
    check: [
      { mr: 'IDV (वाहनाचे विमा मूल्य) तपासा', en: 'Check the IDV (Insured Declared Value)' },
      { mr: 'झिरो-डेप ॲड-ऑन उपलब्ध आहे का?', en: 'Is a zero-depreciation add-on available?' },
    ],
  },
  {
    id: 'property',
    icon: '🏠',
    label: { mr: 'मालमत्ता व पूर विमा', en: 'Property & Flood Insurance' },
    whatIs: {
      mr: 'घर, दुकान आणि पुरामुळे होणाऱ्या नुकसानीपासून संरक्षण.',
      en: 'Protection for home, shop and flood-related damage.',
    },
    who: { mr: 'घरमालक, दुकानदार व मालमत्ताधारकांसाठी.', en: 'For homeowners, shopkeepers and property owners.' },
    benefits: [
      { mr: 'नैसर्गिक आपत्ती व आगीपासून संरक्षण', en: 'Cover against natural disasters and fire' },
      { mr: 'पूर व पाण्यामुळे होणारे नुकसान कव्हर', en: 'Covers flood and water damage' },
    ],
    check: [
      { mr: 'पूर कव्हर समाविष्ट आहे का?', en: 'Is flood cover included?' },
      { mr: 'घराची रचना व सामान दोन्ही कव्हर?', en: 'Are both structure and contents covered?' },
    ],
  },
  {
    id: 'machinery',
    icon: '⚙️',
    label: { mr: 'यंत्रसामग्री बिघाड विमा', en: 'Machinery Breakdown' },
    whatIs: {
      mr: 'औद्योगिक यंत्रे व उपकरणांच्या अचानक बिघाडासाठी विमा.',
      en: 'Insurance for the sudden breakdown of industrial machinery and equipment.',
    },
    who: { mr: 'कारखाने, उद्योग व उपकरणधारकांसाठी.', en: 'For factories, industries and equipment owners.' },
    benefits: [
      { mr: 'दुरुस्ती व बदली खर्च कव्हर', en: 'Covers repair and replacement costs' },
      { mr: 'उत्पादन थांबल्याचे नुकसान कमी', en: 'Reduces losses from production downtime' },
    ],
    check: [
      { mr: 'कोणती यंत्रे कव्हर होतात?', en: 'Which machines are covered?' },
      { mr: 'देखभाल अटी तपासा', en: 'Check the maintenance conditions' },
    ],
  },
  {
    id: 'travel',
    icon: '✈️',
    label: { mr: 'प्रवास विमा', en: 'Travel Insurance' },
    whatIs: {
      mr: 'देशांतर्गत व आंतरराष्ट्रीय प्रवासातील जोखमींपासून संरक्षण.',
      en: 'Protection against risks during domestic and international travel.',
    },
    who: { mr: 'वारंवार किंवा परदेशी प्रवास करणाऱ्यांसाठी.', en: 'For frequent or overseas travellers.' },
    benefits: [
      { mr: 'वैद्यकीय आणीबाणी व सामान हरवल्याचे कव्हर', en: 'Covers medical emergencies and lost baggage' },
      { mr: 'फ्लाइट रद्द/विलंब भरपाई', en: 'Compensation for flight cancellation/delay' },
    ],
    check: [
      { mr: 'कव्हरचा भौगोलिक विस्तार तपासा', en: 'Check the geographical scope of cover' },
      { mr: 'आधीच्या आजारांचा समावेश आहे का?', en: 'Are pre-existing conditions included?' },
    ],
  },
];

// ── /cards ─────────────────────────────────────────────────────────────────
export const cardsContent = {
  credit: {
    title: { mr: 'Credit card म्हणजे काय?', en: 'What is a Credit Card?' } as Bi,
    body: {
      mr: 'क्रेडिट कार्ड म्हणजे बँकेकडून उधार घेऊन आधी खर्च करणे आणि नंतर ठरलेल्या तारखेला परतफेड करणे.',
      en: 'A credit card lets you borrow from the bank to spend now and repay by a fixed due date.',
    } as Bi,
  },
  debit: {
    title: { mr: 'Debit card म्हणजे काय?', en: 'What is a Debit Card?' } as Bi,
    body: {
      mr: 'डेबिट कार्ड तुमच्या स्वतःच्या बँक खात्यातून पैसे थेट वजा करते. उधार नसते.',
      en: 'A debit card directly deducts money from your own bank account. There is no borrowing involved.',
    } as Bi,
  },
  whoFor: {
    title: { mr: 'कोणासाठी कोणता कार्ड?', en: 'Which card is for whom?' } as Bi,
    points: [
      { mr: 'शिस्तबद्ध खर्च व रिवॉर्ड हवे असल्यास — क्रेडिट कार्ड.', en: 'If you want disciplined spending and rewards — Credit Card.' },
      { mr: 'फक्त स्वतःचे पैसे वापरायचे असल्यास — डेबिट कार्ड.', en: 'If you only want to use your own money — Debit Card.' },
    ] as Bi[],
  },
  docs: {
    title: { mr: 'आवश्यक कागदपत्रे', en: 'Required Documents' } as Bi,
    points: [
      { mr: 'पॅन, आधार व पत्ता पुरावा', en: 'PAN, Aadhaar and address proof' },
      { mr: 'उत्पन्न पुरावा (क्रेडिट कार्डसाठी)', en: 'Income proof (for credit cards)' },
    ] as Bi[],
  },
  fees: {
    title: { mr: 'कोणते शुल्क तपासावे', en: 'Which fees to check' } as Bi,
    points: [
      { mr: 'वार्षिक शुल्क व जॉइनिंग फी', en: 'Annual fee and joining fee' },
      { mr: 'उशिरा भरल्यास दंड व व्याज', en: 'Late payment penalty and interest' },
    ] as Bi[],
  },
  rewards: {
    title: { mr: 'रिवॉर्ड पॉइंट्स', en: 'Reward Points' } as Bi,
    body: {
      mr: 'खर्चावर मिळणारे पॉइंट्स कॅशबॅक, सवलत किंवा गिफ्टमध्ये वापरता येतात. अटी तपासा.',
      en: 'Points earned on spends can be redeemed as cashback, discounts or gifts. Always check the terms.',
    } as Bi,
  },
};
