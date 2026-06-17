// lib/i18n.ts
// Architecture: add new languages by adding a new key block below.
// Usage: const t = getTranslation(language); t('hero.title')

import type { Language } from '@/types';

export type { Language };

export const i18n: Record<Language, Record<string, string>> = {
  // ============================================================
  // मराठी (Marathi)
  // ============================================================
  mr: {
    // --- Navbar ---
    'nav.home': 'मुख्यपृष्ठ',
    'nav.fd': 'ठेव (FD)',
    'nav.loans': 'कर्ज',
    'nav.sip': 'SIP',
    'nav.insurance': 'विमा',
    'nav.compare': 'तुलना करा',
    'nav.language': 'भाषा',

    // --- Hero Section ---
    'hero.badge': '🏆 महाराष्ट्रातील #1 आर्थिक मार्गदर्शक',
    'hero.title': 'स्मार्ट गुंतवणूक,\nसुरक्षित भविष्य',
    'hero.subtitle': 'FD, कर्ज, SIP आणि विम्याच्या सर्वोत्तम योजना एकाच ठिकाणी. AI सहाय्यित मार्गदर्शन.',
    'hero.cta_primary': 'आता सुरुवात करा',
    'hero.cta_secondary': 'कॅल्क्युलेटर वापरा',
    'hero.stat_banks': 'बँका',
    'hero.stat_users': 'वापरकर्ते',
    'hero.stat_rate': 'सर्वोच्च FD दर',

    // --- FD Page ---
    'fd.title': 'मुदत ठेव (FD) दर',
    'fd.subtitle': 'सर्व प्रमुख बँकांचे सर्वोत्तम FD दर',
    'fd.filter_all': 'सर्व बँका',
    'fd.filter_govt': 'सरकारी बँका',
    'fd.filter_private': 'खाजगी बँका',
    'fd.col_bank': 'बँक',
    'fd.col_tenure': 'कालावधी',
    'fd.col_regular': 'सामान्य दर',
    'fd.col_senior': 'ज्येष्ठ नागरिक दर',
    'fd.calc_title': 'FD परिपक्वता कॅल्क्युलेटर',
    'fd.amount': 'ठेव रक्कम (₹)',
    'fd.rate': 'व्याजदर (%)',
    'fd.tenure': 'कालावधी (वर्षे)',
    'fd.senior_toggle': 'ज्येष्ठ नागरिक आहात का?',
    'fd.maturity': 'परिपक्वता रक्कम',
    'fd.interest_earned': 'एकूण व्याज',
    'fd.calculate': 'गणना करा',
    'fd.compare': 'तुलना करा',
    'fd.interested': 'मला स्वारस्य आहे',

    // --- Loan Page ---
    'loan.title': 'कर्ज योजना',
    'loan.subtitle': 'सर्वोत्तम कर्ज दर आणि अटी',
    'loan.home': 'गृहकर्ज',
    'loan.personal': 'वैयक्तिक कर्ज',
    'loan.vehicle': 'वाहन कर्ज',
    'loan.business': 'व्यवसाय कर्ज',
    'loan.education': 'शैक्षणिक कर्ज',
    'loan.col_bank': 'बँक',
    'loan.col_roi': 'व्याजदर',
    'loan.col_fee': 'प्रक्रिया शुल्क',
    'loan.col_tenure': 'कमाल कालावधी',
    'loan.emi_title': 'EMI कॅल्क्युलेटर',
    'loan.amount': 'कर्ज रक्कम (₹)',
    'loan.rate': 'व्याजदर (%)',
    'loan.tenure_month': 'कालावधी (महिने)',
    'loan.monthly_emi': 'मासिक EMI',
    'loan.total_interest': 'एकूण व्याज',
    'loan.total_amount': 'एकूण परतफेड',
    'loan.calculate': 'EMI गणना करा',

    // --- SIP Page ---
    'sip.title': 'SIP / म्युच्युअल फंड',
    'sip.subtitle': 'दीर्घकालीन संपत्ती निर्माणासाठी सर्वोत्तम फंड',
    'sip.col_fund': 'फंडाचे नाव',
    'sip.col_category': 'प्रकार',
    'sip.col_3y': '3 वर्षे परतावा',
    'sip.col_5y': '5 वर्षे परतावा',
    'sip.col_risk': 'जोखीम',
    'sip.calc_title': 'SIP परतावा कॅल्क्युलेटर',
    'sip.monthly_invest': 'मासिक गुंतवणूक (₹)',
    'sip.tenure_year': 'कालावधी (वर्षे)',
    'sip.expected_return': 'अपेक्षित वार्षिक परतावा (%)',
    'sip.invested': 'गुंतवलेली रक्कम',
    'sip.returns': 'अंदाजे परतावा',
    'sip.maturity': 'अपेक्षित परिपक्वता रक्कम',

    // --- Insurance Page ---
    'ins.title': 'विमा योजना',
    'ins.subtitle': 'आरोग्य, जीवन आणि वाहन विम्याच्या सर्वोत्तम योजना',
    'ins.health': 'आरोग्य विमा',
    'ins.life': 'जीवन विमा',
    'ins.vehicle': 'वाहन विमा',
    'ins.col_company': 'कंपनी',
    'ins.col_plan': 'योजनेचे नाव',
    'ins.col_premium': 'वार्षिक प्रीमियम',
    'ins.col_features': 'मुख्य वैशिष्ट्ये',
    'ins.est_title': 'प्रीमियम अंदाज',
    'ins.age': 'वय',
    'ins.cover': 'विमा संरक्षण (₹)',
    'ins.type': 'विम्याचा प्रकार',
    'ins.policy_term': 'पॉलिसी कालावधी (वर्षे)',
    'ins.est_premium': 'अंदाजे वार्षिक प्रीमियम',
    'ins.suggested_cover': 'सुचविलेले संरक्षण',

    // --- Buttons ---
    'btn.apply': 'अर्ज करा',
    'btn.learn_more': 'अधिक जाणून घ्या',
    'btn.compare': 'तुलना करा',
    'btn.interested': 'मला स्वारस्य आहे',
    'btn.clear': 'साफ करा',
    'btn.close': 'बंद करा',
    'btn.calculate': 'गणना करा',
    'btn.voice': 'व्हॉइस सहाय्यक',

    // --- Lead Form ---
    'lead.title': 'मला स्वारस्य आहे',
    'lead.subtitle': 'तुमची माहिती द्या, आमची टीम तुमच्याशी संपर्क साधेल.',
    'lead.name': 'पूर्ण नाव',
    'lead.name_ph': 'तुमचे नाव',
    'lead.phone': 'मोबाइल नंबर',
    'lead.phone_ph': '१० अंकी मोबाइल नंबर',
    'lead.city': 'शहर',
    'lead.city_ph': 'तुमचे शहर',
    'lead.module': 'स्वारस्य असलेला विभाग',
    'lead.product': 'निवडलेले उत्पादन',
    'lead.submit': 'पाठवा',
    'lead.sending': 'पाठवत आहे...',
    'lead.success': 'धन्यवाद! आमची टीम लवकरच तुमच्याशी संपर्क साधेल.',
    'lead.err_name': 'कृपया तुमचे नाव लिहा.',
    'lead.err_phone': 'कृपया वैध १० अंकी मोबाइल नंबर लिहा.',
    'lead.fail': 'पाठवताना अडचण आली. कृपया पुन्हा प्रयत्न करा.',

    // --- Bot ---
    'bot.greeting': 'नमस्कार! मी बजेट कट्टाचा स्मार्ट गाईड आहे. तुम्हाला गुंतवणूक, कर्ज, SIP की विम्याची माहिती हवी आहे?',
    'bot.quick_fd': 'FD माहिती',
    'bot.quick_loan': 'कर्ज माहिती',
    'bot.quick_sip': 'SIP माहिती',
    'bot.quick_ins': 'विमा माहिती',
    'bot.voice_btn': 'व्हॉइस सहाय्यक',
    'bot.type_here': 'येथे लिहा...',
    'bot.send': 'पाठवा',
    'bot.title': 'बजेट कट्टा गाईड',

    // --- Trust Section ---
    'trust.secure': 'सुरक्षित माहिती',
    'trust.transparent': 'पारदर्शक तुलना',
    'trust.ai': 'AI-सहाय्यित मार्गदर्शन',
    'trust.updated': 'नियमित अपडेट्स',
    'trust.no_hidden': 'कोणतेही छुपे शुल्क नाहीत',
    'trust.disclaimer': 'ही माहिती केवळ शैक्षणिक आणि माहितीपर उद्देशासाठी दिलेली आहे. कोणताही आर्थिक निर्णय घेण्यापूर्वी संबंधित बँक, विमा कंपनी, म्युच्युअल फंड संस्था किंवा प्रमाणित आर्थिक सल्लागाराशी संपर्क साधावा.',

    // --- Loading & Empty States ---
    'state.loading': 'माहिती लोड होत आहे...',
    'state.empty': 'माहिती उपलब्ध नाही',
    'state.error': 'काहीतरी चुकले. पुन्हा प्रयत्न करा.',
    'state.no_results': 'कोणताही निकाल सापडला नाही',

    // --- Data source / freshness ---
    'data.demo': 'डेमो डेटा',
    'data.live': 'MongoDB लाइव्ह',
    'data.updated': 'अद्ययावत',

    // --- Calculator disclaimer ---
    'calc.disclaimer': 'टीप: वरील आकडे केवळ अंदाजे आहेत. प्रत्यक्ष दर व परतावा बँक/संस्थेनुसार बदलू शकतात. निर्णयापूर्वी तज्ञांचा सल्ला घ्या.',

    // --- Footer ---
    'footer.tagline': 'महाराष्ट्राचा विश्वासू आर्थिक मार्गदर्शक',
    'footer.rights': '© 2025 बजेट कट्टा. सर्व हक्क राखीव.',
  },

  // ============================================================
  // हिंदी (Hindi)
  // ============================================================
  hi: {
    // --- Navbar ---
    'nav.home': 'होम',
    'nav.fd': 'FD जमा',
    'nav.loans': 'लोन',
    'nav.sip': 'SIP',
    'nav.insurance': 'बीमा',
    'nav.compare': 'तुलना करें',
    'nav.language': 'भाषा',

    // --- Hero Section ---
    'hero.badge': '🏆 भारत का #1 वित्तीय मार्गदर्शक',
    'hero.title': 'स्मार्ट निवेश,\nसुरक्षित भविष्य',
    'hero.subtitle': 'FD, लोन, SIP और बीमा की सर्वश्रेष्ठ योजनाएं एक ही जगह। AI-सहायता प्राप्त मार्गदर्शन।',
    'hero.cta_primary': 'अभी शुरू करें',
    'hero.cta_secondary': 'कैलकुलेटर उपयोग करें',
    'hero.stat_banks': 'बैंक',
    'hero.stat_users': 'उपयोगकर्ता',
    'hero.stat_rate': 'सर्वोच्च FD दर',

    // --- FD Page ---
    'fd.title': 'सावधि जमा (FD) दरें',
    'fd.subtitle': 'सभी प्रमुख बैंकों की सर्वश्रेष्ठ FD दरें',
    'fd.filter_all': 'सभी बैंक',
    'fd.filter_govt': 'सरकारी बैंक',
    'fd.filter_private': 'निजी बैंक',
    'fd.col_bank': 'बैंक',
    'fd.col_tenure': 'अवधि',
    'fd.col_regular': 'सामान्य दर',
    'fd.col_senior': 'वरिष्ठ नागरिक दर',
    'fd.calc_title': 'FD परिपक्वता कैलकुलेटर',
    'fd.amount': 'जमा राशि (₹)',
    'fd.rate': 'ब्याज दर (%)',
    'fd.tenure': 'अवधि (वर्ष)',
    'fd.senior_toggle': 'क्या आप वरिष्ठ नागरिक हैं?',
    'fd.maturity': 'परिपक्वता राशि',
    'fd.interest_earned': 'कुल ब्याज',
    'fd.calculate': 'गणना करें',
    'fd.compare': 'तुलना करें',
    'fd.interested': 'मुझे रुचि है',

    // --- Loan Page ---
    'loan.title': 'लोन योजनाएं',
    'loan.subtitle': 'सर्वश्रेष्ठ ऋण दर और शर्तें',
    'loan.home': 'होम लोन',
    'loan.personal': 'पर्सनल लोन',
    'loan.vehicle': 'वाहन लोन',
    'loan.business': 'बिजनेस लोन',
    'loan.education': 'एजुकेशन लोन',
    'loan.col_bank': 'बैंक',
    'loan.col_roi': 'ब्याज दर',
    'loan.col_fee': 'प्रोसेसिंग शुल्क',
    'loan.col_tenure': 'अधिकतम अवधि',
    'loan.emi_title': 'EMI कैलकुलेटर',
    'loan.amount': 'लोन राशि (₹)',
    'loan.rate': 'ब्याज दर (%)',
    'loan.tenure_month': 'अवधि (महीने)',
    'loan.monthly_emi': 'मासिक EMI',
    'loan.total_interest': 'कुल ब्याज',
    'loan.total_amount': 'कुल भुगतान',
    'loan.calculate': 'EMI गणना करें',

    // --- SIP Page ---
    'sip.title': 'SIP / म्यूचुअल फंड',
    'sip.subtitle': 'दीर्घकालीन संपत्ति निर्माण के लिए सर्वश्रेष्ठ फंड',
    'sip.col_fund': 'फंड का नाम',
    'sip.col_category': 'श्रेणी',
    'sip.col_3y': '3 वर्ष रिटर्न',
    'sip.col_5y': '5 वर्ष रिटर्न',
    'sip.col_risk': 'जोखिम',
    'sip.calc_title': 'SIP रिटर्न कैलकुलेटर',
    'sip.monthly_invest': 'मासिक निवेश (₹)',
    'sip.tenure_year': 'अवधि (वर्ष)',
    'sip.expected_return': 'अपेक्षित वार्षिक रिटर्न (%)',
    'sip.invested': 'निवेश राशि',
    'sip.returns': 'अनुमानित रिटर्न',
    'sip.maturity': 'अपेक्षित परिपक्वता राशि',

    // --- Insurance Page ---
    'ins.title': 'बीमा योजनाएं',
    'ins.subtitle': 'स्वास्थ्य, जीवन और वाहन बीमा की सर्वश्रेष्ठ योजनाएं',
    'ins.health': 'स्वास्थ्य बीमा',
    'ins.life': 'जीवन बीमा',
    'ins.vehicle': 'वाहन बीमा',
    'ins.col_company': 'कंपनी',
    'ins.col_plan': 'योजना का नाम',
    'ins.col_premium': 'वार्षिक प्रीमियम',
    'ins.col_features': 'मुख्य विशेषताएं',
    'ins.est_title': 'प्रीमियम अनुमान',
    'ins.age': 'आयु',
    'ins.cover': 'बीमा कवर (₹)',
    'ins.type': 'बीमा प्रकार',
    'ins.policy_term': 'पॉलिसी अवधि (वर्ष)',
    'ins.est_premium': 'अनुमानित वार्षिक प्रीमियम',
    'ins.suggested_cover': 'सुझाया गया कवर',

    // --- Buttons ---
    'btn.apply': 'आवेदन करें',
    'btn.learn_more': 'और जानें',
    'btn.compare': 'तुलना करें',
    'btn.interested': 'मुझे रुचि है',
    'btn.clear': 'साफ करें',
    'btn.close': 'बंद करें',
    'btn.calculate': 'गणना करें',
    'btn.voice': 'वॉइस सहायक',

    // --- Lead Form ---
    'lead.title': 'मुझे रुचि है',
    'lead.subtitle': 'अपनी जानकारी दें, हमारी टीम आपसे संपर्क करेगी।',
    'lead.name': 'पूरा नाम',
    'lead.name_ph': 'आपका नाम',
    'lead.phone': 'मोबाइल नंबर',
    'lead.phone_ph': '10 अंकों का मोबाइल नंबर',
    'lead.city': 'शहर',
    'lead.city_ph': 'आपका शहर',
    'lead.module': 'रुचि वाला विभाग',
    'lead.product': 'चयनित उत्पाद',
    'lead.submit': 'भेजें',
    'lead.sending': 'भेज रहे हैं...',
    'lead.success': 'धन्यवाद! हमारी टीम जल्द ही आपसे संपर्क करेगी।',
    'lead.err_name': 'कृपया अपना नाम लिखें।',
    'lead.err_phone': 'कृपया वैध 10 अंकों का मोबाइल नंबर लिखें।',
    'lead.fail': 'भेजने में समस्या हुई। कृपया फिर से प्रयास करें।',

    // --- Bot ---
    'bot.greeting': 'नमस्ते! मैं बजट कट्टा का स्मार्ट गाइड हूं। आपको निवेश, लोन, SIP या बीमा की जानकारी चाहिए?',
    'bot.quick_fd': 'FD जानकारी',
    'bot.quick_loan': 'लोन जानकारी',
    'bot.quick_sip': 'SIP जानकारी',
    'bot.quick_ins': 'बीमा जानकारी',
    'bot.voice_btn': 'वॉइस सहायक',
    'bot.type_here': 'यहां लिखें...',
    'bot.send': 'भेजें',
    'bot.title': 'बजट कट्टा गाइड',

    // --- Trust Section ---
    'trust.secure': 'सुरक्षित जानकारी',
    'trust.transparent': 'पारदर्शी तुलना',
    'trust.ai': 'AI-सहायता प्राप्त मार्गदर्शन',
    'trust.updated': 'नियमित अपडेट्स',
    'trust.no_hidden': 'कोई छुपे शुल्क नहीं',
    'trust.disclaimer': 'यह जानकारी केवल शैक्षणिक और सूचनात्मक उद्देश्य के लिए दी गई है। कोई भी वित्तीय निर्णय लेने से पहले संबंधित बैंक, बीमा कंपनी, म्यूचुअल फंड संस्था या प्रमाणित वित्तीय सलाहकार से संपर्क करें।',

    // --- Loading & Empty States ---
    'state.loading': 'जानकारी लोड हो रही है...',
    'state.empty': 'जानकारी उपलब्ध नहीं',
    'state.error': 'कुछ गलत हुआ। फिर से कोशिश करें।',
    'state.no_results': 'कोई परिणाम नहीं मिला',

    // --- Data source / freshness ---
    'data.demo': 'डेमो डेटा',
    'data.live': 'MongoDB लाइव',
    'data.updated': 'अपडेट',

    // --- Calculator disclaimer ---
    'calc.disclaimer': 'नोट: ऊपर दिए आंकड़े केवल अनुमानित हैं। वास्तविक दर व रिटर्न बैंक/संस्था के अनुसार बदल सकते हैं। निर्णय से पहले विशेषज्ञ से सलाह लें।',

    // --- Footer ---
    'footer.tagline': 'भारत का भरोसेमंद वित्तीय मार्गदर्शक',
    'footer.rights': '© 2025 बजट कट्टा। सर्वाधिकार सुरक्षित।',
  },
};

// Hook to use translations
export function getTranslation(lang: Language) {
  return (key: string): string => i18n[lang][key] ?? key;
}
