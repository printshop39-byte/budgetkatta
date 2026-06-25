// Blog content for BudgetKatta — data-driven and bilingual so posts ship with
// the bundle and render under the same language toggle as the rest of the site.
// Posts are statically generated (see app/blog) and added to the sitemap, which
// is the point: organic search traffic in Marathi + English.
//
// To add a post: append an entry below. `slug` must be URL-safe (ascii). `date`
// is ISO (used for sitemap + Article JSON-LD); `dateDisplay` is what users see.
// Body is an ordered list of typed blocks so rendering stays simple and safe.

type Bi = { mr: string; en: string };

export type BlogBlock =
  | { type: 'p'; mr: string; en: string }
  | { type: 'h2'; mr: string; en: string }
  | { type: 'ul'; mr: string[]; en: string[] };

export interface BlogPost {
  slug: string;
  title: Bi;
  excerpt: Bi;
  tag: Bi;
  date: string; // ISO (YYYY-MM-DD)
  dateDisplay: Bi;
  readMins: number;
  body: BlogBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'sip-guide-marathi',
    title: {
      mr: 'SIP म्हणजे काय? नवशिक्यांसाठी संपूर्ण मार्गदर्शक',
      en: 'What is a SIP? A complete beginner’s guide',
    },
    excerpt: {
      mr: 'दरमहा ५०० रुपयांपासून गुंतवणूक कशी सुरू करावी, चक्रवाढीचा फायदा आणि सुरुवात करताना टाळायच्या चुका.',
      en: 'How to start investing from just ₹500 a month, the power of compounding, and mistakes to avoid.',
    },
    tag: { mr: 'गुंतवणूक', en: 'Investing' },
    date: '2026-06-10',
    dateDisplay: { mr: '१० जून २०२६', en: '10 June 2026' },
    readMins: 4,
    body: [
      {
        type: 'p',
        mr: 'SIP (Systematic Investment Plan) म्हणजे म्युच्युअल फंडात दरमहा ठराविक रक्कम नियमितपणे गुंतवण्याची शिस्तबद्ध पद्धत. एकरकमी मोठी रक्कम लागत नाही — दरमहा ५०० रुपयांपासूनही सुरुवात करता येते.',
        en: 'A SIP (Systematic Investment Plan) is a disciplined way to invest a fixed amount in a mutual fund every month. You don’t need a big lump sum — you can start with as little as ₹500 a month.',
      },
      {
        type: 'h2',
        mr: 'SIP चे मुख्य फायदे',
        en: 'Why SIPs work',
      },
      {
        type: 'ul',
        mr: [
          'चक्रवाढ व्याज: लवकर सुरुवात केल्यास वेळेसोबत पैसा झपाट्याने वाढतो.',
          'रुपी कॉस्ट अॅव्हरेजिंग: बाजार खाली असताना जास्त युनिट्स मिळतात, त्यामुळे सरासरी किंमत कमी होते.',
          'शिस्त: दरमहा आपोआप गुंतवणूक झाल्याने बचतीची सवय लागते.',
        ],
        en: [
          'Compounding: start early and your money grows faster over time.',
          'Rupee-cost averaging: you buy more units when markets dip, lowering your average cost.',
          'Discipline: automatic monthly investing builds a savings habit.',
        ],
      },
      {
        type: 'h2',
        mr: 'सुरुवात करताना टाळायच्या चुका',
        en: 'Mistakes to avoid',
      },
      {
        type: 'ul',
        mr: [
          'बाजार पडला म्हणून SIP थांबवणे — नेमका तेव्हाच तो सर्वाधिक फायदेशीर असतो.',
          'फक्त मागील परताव्याकडे बघून फंड निवडणे.',
          'दीर्घकालीन ध्येयाशिवाय गुंतवणूक करणे.',
        ],
        en: [
          'Stopping your SIP when markets fall — that’s exactly when it helps most.',
          'Picking a fund only by its past returns.',
          'Investing without a long-term goal in mind.',
        ],
      },
      {
        type: 'p',
        mr: 'तुमच्या ध्येयासाठी किती रक्कम लागेल याचा अंदाज घेण्यासाठी आमचे SIP कॅल्क्युलेटर वापरा. लक्षात ठेवा: म्युच्युअल फंड बाजार-जोखमीच्या अधीन असतात; ही माहिती केवळ शैक्षणिक आहे.',
        en: 'Use our SIP calculator to estimate how much you need for your goal. Remember: mutual funds are subject to market risk; this information is educational only.',
      },
    ],
  },
  {
    slug: 'home-loan-checklist',
    title: {
      mr: 'होम लोन घेण्यापूर्वी या ५ गोष्टी तपासा',
      en: '5 things to check before taking a home loan',
    },
    excerpt: {
      mr: 'व्याजदर, प्रोसेसिंग फी, EMI चे प्रमाण, प्री-पेमेंट अटी आणि क्रेडिट स्कोअर — कर्जापूर्वीची तयारी.',
      en: 'Interest rate, processing fees, EMI ratio, prepayment terms and credit score — prep before you borrow.',
    },
    tag: { mr: 'कर्ज', en: 'Loans' },
    date: '2026-06-15',
    dateDisplay: { mr: '१५ जून २०२६', en: '15 June 2026' },
    readMins: 5,
    body: [
      {
        type: 'p',
        mr: 'घर घेणे हा आयुष्यातील सर्वात मोठा आर्थिक निर्णय असतो. कर्ज घेण्याआधी या पाच गोष्टी तपासल्यास लाखो रुपये वाचू शकतात.',
        en: 'Buying a home is one of life’s biggest financial decisions. Checking these five things before you borrow can save you lakhs.',
      },
      {
        type: 'ul',
        mr: [
          'व्याजदर: फ्लोटिंग की फिक्स्ड? वेगवेगळ्या बँकांचे दर तुलना करा.',
          'प्रोसेसिंग फी व छुपे शुल्क: एकूण खर्चात मोठा फरक पडतो.',
          'EMI चे प्रमाण: एकूण EMI उत्पन्नाच्या ४०% पेक्षा कमी ठेवा.',
          'प्री-पेमेंट / फोरक्लोजर अटी: मुदतीपूर्वी कर्ज फेडता येते का ते तपासा.',
          'क्रेडिट स्कोअर: ७५०+ स्कोअरवर कमी व्याजदर मिळण्याची शक्यता वाढते.',
        ],
        en: [
          'Interest rate: floating or fixed? Compare rates across banks.',
          'Processing fees & hidden charges: they change the total cost a lot.',
          'EMI ratio: keep total EMIs under 40% of your income.',
          'Prepayment / foreclosure terms: check if you can repay early.',
          'Credit score: a 750+ score improves your chance of a lower rate.',
        ],
      },
      {
        type: 'h2',
        mr: 'EMI आधी मोजा',
        en: 'Calculate the EMI first',
      },
      {
        type: 'p',
        mr: 'कर्जाची रक्कम, व्याजदर आणि मुदत टाकून आमच्या EMI कॅल्क्युलेटरमध्ये मासिक हप्ता व एकूण व्याज किती होईल ते आधीच पाहा. यामुळे तुम्हाला परवडणारी रक्कम ठरवता येते.',
        en: 'Enter the loan amount, rate and tenure into our EMI calculator to see your monthly instalment and total interest upfront. It helps you decide what you can actually afford.',
      },
    ],
  },
  {
    slug: 'emergency-fund-guide',
    title: {
      mr: 'आणीबाणीचा निधी: किती, का आणि कुठे ठेवावा?',
      en: 'Emergency fund: how much, why, and where to keep it',
    },
    excerpt: {
      mr: 'अनपेक्षित संकटात कर्जात बुडण्यापासून वाचवणारा निधी — किती ठेवावा आणि कुठे ठेवावा याचे सोपे गणित.',
      en: 'The fund that keeps an unexpected crisis from pushing you into debt — how much to keep and where.',
    },
    tag: { mr: 'बचत', en: 'Saving' },
    date: '2026-06-20',
    dateDisplay: { mr: '२० जून २०२६', en: '20 June 2026' },
    readMins: 3,
    body: [
      {
        type: 'p',
        mr: 'नोकरी जाणे, आजारपण किंवा अचानक मोठा खर्च — अशा वेळी आणीबाणीचा निधी तुम्हाला कर्जात बुडण्यापासून वाचवतो. हा कोणत्याही आर्थिक नियोजनाचा पहिला पाया आहे.',
        en: 'A job loss, an illness or a sudden big expense — an emergency fund keeps you from sliding into debt. It’s the first foundation of any financial plan.',
      },
      {
        type: 'h2',
        mr: 'किती असावा?',
        en: 'How much?',
      },
      {
        type: 'p',
        mr: 'तुमच्या एकूण मासिक खर्चाच्या किमान ३ ते ६ पट रक्कम बाजूला ठेवा. उदाहरणार्थ, दरमहा खर्च ₹३०,००० असेल तर ₹९०,००० ते ₹१,८०,००० चा निधी असावा.',
        en: 'Set aside at least 3 to 6 times your total monthly expenses. For example, if you spend ₹30,000 a month, aim for a fund of ₹90,000 to ₹1,80,000.',
      },
      {
        type: 'h2',
        mr: 'कुठे ठेवावा?',
        en: 'Where to keep it?',
      },
      {
        type: 'ul',
        mr: [
          'बँकेचे बचत खाते — लगेच काढता येते.',
          'लिक्विड म्युच्युअल फंड — थोडा जास्त परतावा, १-२ दिवसांत पैसे.',
          'शेअर्स किंवा दीर्घ-मुदतीच्या गुंतवणुकीत हा निधी ठेवू नका.',
        ],
        en: [
          'A bank savings account — instantly accessible.',
          'A liquid mutual fund — slightly better returns, money in 1–2 days.',
          'Do not keep this fund in stocks or long-term investments.',
        ],
      },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  // Newest first by ISO date (string compare is safe for YYYY-MM-DD).
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
