// lib/homeSetupContent.ts — Kitchen, Furniture, Home Setup & Interior guidance
// (blueprint §4). Educational checklists only: NO prices, brands or vendor
// claims. Cost planning goes through the budget split in lib/homeCalc.ts.
import type { Bi } from '@/lib/homeFinanceContent';

export const SETUP_LABELS: Record<string, Bi> = {
  kitchen: { mr: 'Kitchen', en: 'Kitchen' },
  furniture: { mr: 'Furniture', en: 'Furniture' },
  interior: { mr: 'Interior (पॉलिश, सिलिंग, पार्टिशन)', en: 'Interior (finishes, ceiling, partitions)' },
  appliances: { mr: 'उपकरणे', en: 'Appliances' },
  setup: { mr: 'पंखे, लाईट, पडदे, गॅस इ.', en: 'Fans, lights, curtains, gas, etc.' },
  buffer: { mr: 'राखीव निधी', en: 'Contingency buffer' },
};

export type SetupSection = {
  id: 'kitchen' | 'furniture' | 'setup' | 'interior';
  title: Bi;
  intro: Bi;
  blocks: { heading: Bi; items: { mr: string[]; en: string[] } }[];
};

export const SETUP_SECTIONS: SetupSection[] = [
  {
    id: 'kitchen',
    title: { mr: 'Kitchen', en: 'Kitchen' },
    intro: {
      mr: 'मूलभूत किंवा Modular — आधी गरज ठरवा, मग पर्याय पाहा.',
      en: 'Basic or modular — decide the need first, then compare options.',
    },
    blocks: [
      {
        heading: { mr: 'पर्याय', en: 'Options' },
        items: {
          mr: ['मूलभूत: ओटा, सिंक, खालचे कप्पे', 'Modular: कॅबिनेट, ड्रॉवर, चिमणी, हॉब यांसह नियोजित आराखडा'],
          en: ['Basic: platform, sink, lower storage', 'Modular: cabinets, drawers, chimney, hob with a planned layout'],
        },
      },
      {
        heading: { mr: 'कामात काय समाविष्ट आहे ते विचारा', en: 'Ask what is included' },
        items: {
          mr: ['कॅबिनेटचे साहित्य (प्लाय / MDF इ.) व जाडी', 'हार्डवेअर (बिजागऱ्या, चॅनेल) कोणते', 'काउंटरटॉप, टाइल व प्लंबिंग/इलेक्ट्रिक कामे', 'वॉरंटी व डिलिव्हरी/बसवणीचा कालावधी'],
          en: ['Cabinet material (ply / MDF etc.) and thickness', 'Hardware (hinges, channels) used', 'Countertop, tiles, plumbing and electrical work', 'Warranty and delivery/installation time'],
        },
      },
      {
        heading: { mr: 'काम सुरू करण्यापूर्वी', en: 'Before work starts' },
        items: {
          mr: ['भिंती व जागेची अचूक मापे घ्या', 'गॅस, पाणी व वीज बिंदूंची जागा निश्चित करा', 'लेखी कोट व आराखडा घ्या'],
          en: ['Take exact wall and space measurements', 'Fix gas, water and power point locations', 'Get a written quote and layout'],
        },
      },
    ],
  },
  {
    id: 'furniture',
    title: { mr: 'Furniture', en: 'Furniture' },
    intro: {
      mr: 'आधी आवश्यक वस्तू घ्या; बाकी हळूहळू.',
      en: 'Buy the essentials first; the rest can come later.',
    },
    blocks: [
      {
        heading: { mr: 'आधी घ्यायच्या', en: 'Buy first' },
        items: {
          mr: ['Bedroom: पलंग, गादी, कपाट', 'Living: बसण्याची सोय, टीव्ही/स्टोरेज', 'Dining: टेबल व खुर्च्या (गरज असल्यास)'],
          en: ['Bedroom: bed, mattress, wardrobe', 'Living: seating, TV/storage unit', 'Dining: table and chairs (if needed)'],
        },
      },
      {
        heading: { mr: 'नंतर घेता येतील', en: 'Can wait' },
        items: {
          mr: ['सजावटीचे शेल्फ, कन्सोल', 'अतिरिक्त बसण्याची सोय', 'डेकोर वस्तू'],
          en: ['Decorative shelves, console', 'Extra seating', 'Décor items'],
        },
      },
      {
        heading: { mr: 'माप घेण्याची checklist', en: 'Measuring checklist' },
        items: {
          mr: ['दरवाज्याची रुंदी/उंची (वस्तू आत जाईल का)', 'लिफ्ट व जिन्याची मापे', 'भिंत ते भिंत लांबी-रुंदी', 'खिडकी, स्विच बोर्ड व AC पॉइंटची जागा'],
          en: ['Door width/height (will it fit through)', 'Lift and staircase dimensions', 'Wall-to-wall length and width', 'Window, switchboard and AC point positions'],
        },
      },
    ],
  },
  {
    id: 'setup',
    title: { mr: 'Home Setup', en: 'Home Setup' },
    intro: {
      mr: 'घरात राहायला जाण्यापूर्वीची यादी.',
      en: 'Your checklist before moving in.',
    },
    blocks: [
      {
        heading: { mr: 'गरजा', en: 'Essentials' },
        items: {
          mr: ['पंखे व लाईट', 'पडदे / ब्लाइंड्स', 'गॅस कनेक्शन', 'वॉटर प्युरिफायर, गीझर', 'फ्रीज, वॉशिंग मशीन व इतर उपकरणे'],
          en: ['Fans and lights', 'Curtains / blinds', 'Gas connection', 'Water purifier, geyser', 'Fridge, washing machine and other appliances'],
        },
      },
      {
        heading: { mr: 'घरात जाण्यापूर्वी', en: 'Before moving in' },
        items: {
          mr: ['वीज व पाणी जोडणी चालू आहे का तपासा', 'सोसायटी NOC व मेंटेनन्स माहिती घ्या', 'पत्ता बदल (आधार, बँक, गॅस) यादी करा', 'सुरक्षा: दारांची कुलपे व स्मोक/गॅस सुरक्षा तपासा'],
          en: ['Check electricity and water are connected', 'Get society NOC and maintenance details', 'List address changes (Aadhaar, bank, gas)', 'Safety: door locks and smoke/gas safety checks'],
        },
      },
      {
        heading: { mr: 'सुरुवातीचा खर्च मोजण्यासाठी', en: 'To total the start-up cost' },
        items: {
          mr: ['वरील प्रत्येक वस्तूसाठी २–३ कोट घ्या', 'एकूण रकमेवर राखीव निधी ठेवा', 'खालील बजेट कॅल्क्युलेटर वापरा'],
          en: ['Get 2–3 quotes for each item above', 'Keep a contingency on the total', 'Use the budget calculator below'],
        },
      },
    ],
  },
  {
    id: 'interior',
    title: { mr: 'Interior', en: 'Interior' },
    intro: {
      mr: 'घराच्या आकारानुसार साधे, मध्यम किंवा विस्तृत नियोजन.',
      en: 'Plan basic, medium or full depending on the size of your home.',
    },
    blocks: [
      {
        heading: { mr: 'बजेट पर्याय', en: 'Budget levels' },
        items: {
          mr: ['साधे: फक्त गरजेची कामे (रंग, किचन, मूलभूत फर्निचर)', 'मध्यम: कपाट, टीव्ही युनिट, सिलिंग/लाईटिंगसह', 'विस्तृत: संपूर्ण नियोजित interior, पार्टिशन व फिनिशिंग'],
          en: ['Basic: only essentials (paint, kitchen, basic furniture)', 'Medium: adds wardrobes, TV unit, ceiling/lighting', 'Full: complete planned interior, partitions and finishes'],
        },
      },
      {
        heading: { mr: 'कंत्राटदाराला विचारायचे प्रश्न', en: 'Questions for the contractor' },
        items: {
          mr: ['कामाचा तपशीलवार लेखी कोट आहे का', 'साहित्याचे ब्रँड/ग्रेड काय', 'पैसे किती टप्प्यांत व कधी द्यायचे', 'वेळापत्रक व उशीर झाल्यास काय', 'वॉरंटी व काम झाल्यानंतरची सेवा', 'मागील कामाचे फोटो/संदर्भ पाहता येतील का'],
          en: ['Is there a detailed written quote', 'Which material brands/grades', 'How many payment stages and when', 'Timeline and what happens on delay', 'Warranty and after-service', 'Can I see photos/references of past work'],
        },
      },
      {
        heading: { mr: 'काम सुरू करण्यापूर्वी तपासायची यादी', en: 'Pre-start checklist' },
        items: {
          mr: ['सोसायटीची परवानगी (काम व वेळ)', 'अंतिम आराखडा व मापे मान्य', 'सर्व पेमेंट्सची लेखी नोंद', 'राखीव निधी बाजूला ठेवला'],
          en: ['Society permission (work and hours)', 'Final plan and measurements signed off', 'All payments recorded in writing', 'Contingency set aside'],
        },
      },
    ],
  },
];

export const SETUP_PAGE = {
  title: { mr: 'Kitchen, Furniture आणि Interior', en: 'Kitchen, Furniture & Interior' } as Bi,
  badge: { mr: 'Home Setup & Interior Planner', en: 'Home Setup & Interior Planner' } as Bi,
  headline: { mr: 'घर झाले, आता', en: 'Home is yours, now' } as Bi,
  headlineAccent: { mr: 'बजेटमध्ये सजवा सुंदर!', en: 'set it up within budget!' } as Bi,
  subtitle: {
    mr: 'मॉड्यूलर किचन, अत्यावश्यक फर्निचर आणि गृहप्रवेशाची तयारी — checklist, कंत्राटदाराला विचारायचे प्रश्न आणि बजेट नियोजन, क्रमाने व सोप्या भाषेत.',
    en: 'Modular kitchen, essential furniture and move-in preparation — checklists, questions for contractors and budget planning, in order and in plain language.',
  } as Bi,
  topUp: {
    title: { mr: 'इंटिरिअरसाठी बजेट कमी पडतेय?', en: 'Interior budget falling short?' } as Bi,
    body: {
      mr: 'काही बँका चालू गृहकर्जावर टॉप-अप कर्ज किंवा Home Improvement कर्ज देऊ शकतात. उपलब्धता, व्याजदर आणि अटी बँकेनुसार बदलतात — अर्जापूर्वी तुमच्या बँकेकडून खात्री करा.',
      en: 'Some banks may offer a top-up loan on an existing home loan, or a home-improvement loan. Availability, rates and terms vary by bank — confirm with your bank before applying.',
    } as Bi,
    cta: { mr: 'बँकांची तुलना पाहा', en: 'See bank comparison' } as Bi,
  },
  budgetHeading: { mr: 'तुमचे Kitchen / Interior बजेट मोजा', en: 'Plan your kitchen / interior budget' } as Bi,
};
