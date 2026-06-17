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
    'nav.fd': 'FD दर',
    'nav.loans': 'कर्ज',
    'nav.sip': 'SIP',
    'nav.insurance': 'विमा',
    'nav.compare': 'तुलना करा',
    'nav.language': 'भाषा',

    // --- Hero Section ---
    'hero.badge': '🏆 महाराष्ट्रातील #1 आर्थिक मार्गदर्शक',
    'hero.title': 'तुमच्या पैशांसाठी सोपी, पारदर्शक\nआणि स्मार्ट माहिती',
    'hero.subtitle': 'FD, कर्ज, SIP, विमा आणि कागदपत्रांची माहिती आता मराठी आणि हिंदीत, एका ठिकाणी.',
    'hero.cta_primary': 'आता तुलना करा',
    'hero.cta_secondary': 'कागदपत्रे पाहा',
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

    // --- Nav (company pages) ---
    'nav.about': 'आमच्याबद्दल',
    'nav.contact': 'संपर्क',
    'nav.privacy': 'गोपनीयता धोरण',
    'nav.terms': 'अटी व शर्ती',
    'nav.disclaimer': 'अस्वीकरण',

    // --- About page ---
    'about.title': 'बजेट कट्टा बद्दल',
    'about.subtitle': 'मराठी आणि हिंदीतील विश्वासू आर्थिक माहिती व तुलना मंच',
    'about.intro': 'बजेट कट्टा हे मराठी आणि हिंदी भाषिक वापरकर्त्यांसाठी बनवलेले आर्थिक माहिती व तुलना मंच आहे.',
    'about.compare': 'येथे तुम्ही FD दर, कर्ज, SIP / म्युच्युअल फंड आणि विमा योजनांची एकाच ठिकाणी सोपी तुलना करू शकता.',
    'about.ai': 'AI-सहाय्यित मार्गदर्शन, परस्परसंवादी कॅल्क्युलेटर आणि पारदर्शक तुलना यांच्या मदतीने आम्ही माहिती सुलभ करतो. ही माहिती केवळ शैक्षणिक व माहितीपर उद्देशासाठी आहे.',
    'about.cta_fd': 'FD दर पाहा',
    'about.cta_loan': 'कर्ज तुलना करा',
    'about.cta_sip': 'SIP कॅल्क्युलेटर वापरा',
    'about.cta_contact': 'संपर्क करा',

    // --- Contact page ---
    'contact.title': 'संपर्क करा',
    'contact.subtitle': 'तुमचे प्रश्न किंवा गरज सांगा, आमची टीम तुमच्याशी संपर्क साधेल.',
    'contact.form_title': 'आम्हाला संदेश पाठवा',
    'contact.email': 'ईमेल (पर्यायी)',
    'contact.email_ph': 'तुमचा ईमेल',
    'contact.service': 'स्वारस्य असलेली सेवा',
    'contact.general': 'सामान्य चौकशी',
    'contact.message': 'संदेश',
    'contact.message_ph': 'तुमचा संदेश येथे लिहा...',
    'contact.send': 'संदेश पाठवा',
    'contact.info_title': 'संपर्क माहिती',
    'contact.info_email': 'ईमेल',
    'contact.info_area': 'सेवा क्षेत्र',
    'contact.info_area_val': 'महाराष्ट्र आणि भारत',
    'contact.info_response': 'प्रतिसाद वेळ',
    'contact.info_response_val': '२४–४८ तास',
    'contact.whatsapp': 'WhatsApp वर संपर्क करा',
    'contact.whatsapp_soon': 'WhatsApp लवकरच सुरू होईल',

    // --- Privacy page ---
    'privacy.title': 'गोपनीयता धोरण',
    'privacy.subtitle': 'तुमच्या माहितीचे संरक्षण आमच्यासाठी महत्त्वाचे आहे.',
    'privacy.h_collect': 'आम्ही कोणती माहिती गोळा करतो',
    'privacy.collect': 'नाव, मोबाइल नंबर, शहर, तुमचा प्रश्न आणि निवडलेल्या उत्पादनातील स्वारस्य.',
    'privacy.h_why': 'माहिती का गोळा केली जाते',
    'privacy.why': 'फॉलो-अप, सेवा मार्गदर्शन आणि लीड सहाय्यासाठी.',
    'privacy.h_share': 'माहिती सामायिकरण',
    'privacy.share': 'आम्ही तुमची वैयक्तिक माहिती विकत नाही.',
    'privacy.h_delete': 'माहिती हटवण्याची विनंती',
    'privacy.delete': 'तुम्ही कधीही तुमची माहिती हटवण्याची विनंती करू शकता.',
    'privacy.h_contact': 'संपर्क',
    'privacy.contact': 'गोपनीयतेबाबत प्रश्नांसाठी आमच्याशी संपर्क साधा:',

    // --- Terms page ---
    'terms.title': 'अटी व शर्ती',
    'terms.subtitle': 'कृपया सेवा वापरण्यापूर्वी काळजीपूर्वक वाचा.',
    'terms.t1': 'बजेट कट्टा केवळ शैक्षणिक व माहितीपर आर्थिक तुलना सेवा देते.',
    'terms.t2': '"MongoDB लाइव्ह" किंवा सत्यापित स्रोत म्हणून चिन्हांकित नसल्यास डेटा डेमो/नमुना असू शकतो.',
    'terms.t3': 'कोणताही निर्णय घेण्यापूर्वी बँक/विमा/फंडाच्या अधिकृत संकेतस्थळावर तपशील पडताळा.',
    'terms.t4': 'कोणत्याही परताव्याची हमी दिली जात नाही.',
    'terms.t5': 'आर्थिक सल्ल्याची कोणतीही हमी दिली जात नाही.',
    'terms.t6': 'सेवा स्वतःच्या जबाबदारीवर वापरा.',

    // --- Disclaimer page ---
    'disclaimer.title': 'अस्वीकरण',
    'disclaimer.subtitle': 'महत्त्वाची आर्थिक सूचना',
    'disclaimer.d1': 'FD दर, कर्ज दर, SIP परतावा आणि विमा प्रीमियम हे केवळ सूचक आहेत.',
    'disclaimer.d2': 'म्युच्युअल फंडातील गुंतवणूक बाजार जोखमीच्या अधीन आहे.',
    'disclaimer.d3': 'मागील परतावा भविष्यातील परताव्याची हमी देत नाही.',
    'disclaimer.d4': 'कोणताही निर्णय घेण्यापूर्वी प्रमाणित आर्थिक सल्लागाराचा सल्ला घ्या.',
    'disclaimer.d5': 'ही माहिती केवळ शैक्षणिक व माहितीपर उद्देशासाठी आहे.',

    // --- Nav / rates / documents / CTA ---
    'nav.rates': 'दर/बाजार',
    'nav.documents': 'कागदपत्रे',
    'nav.cta': 'मोफत मार्गदर्शन घ्या',

    // --- Easy-explanation phrases ---
    'easy.at_glance': 'एका नजरेत माहिती',
    'easy.docs_quick': 'कागदपत्रे लगेच समजून घ्या',
    'easy.emi_first': 'EMI आधीच पाहा, मग निर्णय घ्या',
    'easy.simple': 'दर, अटी आणि कागदपत्रे सोप्या भाषेत',
    'easy.clear': 'गोंधळ नको, स्पष्ट तुलना करा',
    'easy.profile': 'तुमच्या प्रोफाइलनुसार मार्गदर्शन',

    // --- Guidance CTAs ---
    'cta.free_guidance': 'मोफत मार्गदर्शन घ्या',
    'cta.check_docs': 'कागदपत्रे तपासा',
    'cta.use_emi': 'EMI कॅल्क्युलेटर वापरा',
    'cta.compare': 'तुलना करा',

    // --- Loan extras ---
    'loan.gold': 'गोल्ड लोन',
    'loan.q_amount': 'किती कर्ज हवे आहे?',
    'loan.q_emi': 'EMI किती येईल?',
    'loan.q_approval': 'मंजुरीसाठी काय लागेल?',
    'loan.q_docs': 'कागदपत्रे लगेच पाहा',
    'loan.f_rate': 'व्याजदर श्रेणी',
    'loan.f_fee': 'प्रक्रिया शुल्क',
    'loan.f_tenure': 'कमाल कालावधी',
    'loan.f_eligibility': 'पात्रता',
    'loan.f_documents': 'आवश्यक कागदपत्रे',
    'loan.f_who': 'कोणासाठी योग्य?',
    'loan.f_mistakes': 'टाळायच्या चुका',
    'loan.f_cta': 'मला हे कर्ज हवे आहे',

    // --- Documents page ---
    'doc.title': 'कर्ज, FD, SIP आणि विम्यासाठी लागणारी कागदपत्रे',
    'doc.subtitle': 'तुमच्या प्रोफाइलनुसार नेमकी यादी एका क्लिकवर पाहा.',
    'doc.product': 'उत्पादन निवडा',
    'doc.profile': 'तुमची प्रोफाइल',
    'doc.download': 'डाउनलोड यादी',
    'doc.download_soon': 'डाउनलोड सुविधा लवकरच सुरू होईल',
    'doc.need_help': 'मला मदत हवी आहे',
    'doc.why': 'हे कागदपत्र का लागते?',
    'doc.required': 'आवश्यक',
    'doc.sometimes': 'कधीकधी लागते',
    'doc.section_title': 'आवश्यक कागदपत्रे',

    // --- Rates page ---
    'rates.title': 'दर आणि बाजार माहिती',
    'rates.subtitle': 'FD, कर्ज दर आणि बाजार माहिती एका ठिकाणी.',
    'rates.fd_title': 'सर्वोच्च FD दर',
    'rates.loan_title': 'कर्ज व्याजदर श्रेणी',
    'rates.market_title': 'बाजार माहिती',
    'rates.tools_title': 'झटपट कॅल्क्युलेटर',
    'rates.sample_badge': 'नमुना माहिती',

    // --- Credit score page ---
    'cs.title': 'क्रेडिट स्कोअर मार्गदर्शन',
    'cs.subtitle': 'क्रेडिट स्कोअर सोप्या भाषेत समजून घ्या आणि सुधारा.',
    'cs.cta': 'क्रेडिट स्कोअर मार्गदर्शन हवे आहे',

    // --- Cards page ---
    'cards.title': 'क्रेडिट व डेबिट कार्ड मार्गदर्शन',
    'cards.subtitle': 'कोणते कार्ड तुमच्यासाठी योग्य? सोप्या भाषेत समजून घ्या.',
    'cards.cta': 'मला कार्डबाबत मदत हवी',

    // --- Home extras ---
    'home.selector_title': 'तुम्हाला काय पाहिजे?',
    'home.guide_title': '3D स्मार्ट गाईड',
    'home.guide_sub': 'गोंधळ झाला? आमचा स्मार्ट गाईड तुम्हाला मार्ग दाखवेल.',
    'home.docs_cta': 'कागदपत्रे लगेच पाहा',
    'home.docs_sub': 'तुमच्या प्रोफाइलनुसार नेमकी यादी.',

    // --- Explainers ---
    'explain.section_title': 'सोपं समजून घ्या',

    // --- Footer tools / extra ---
    'tools.title': 'साधने',
    'tools.fd': 'FD कॅल्क्युलेटर',
    'tools.emi': 'EMI कॅल्क्युलेटर',
    'tools.sip': 'SIP कॅल्क्युलेटर',
    'tools.ins': 'विमा अंदाज',
    'tools.docs': 'कागदपत्र यादी',
    'ins.term': 'टर्म विमा',

    // --- UX pass v2 ---
    'nav.cta_short': 'मोफत मार्गदर्शन',
    'trust.educational': 'शैक्षणिक उद्देश',
    'home.how_title': 'हे कसे काम करते?',
    'home.how_1': 'माहिती निवडा',
    'home.how_2': 'दर आणि EMI पाहा',
    'home.how_3': 'कागदपत्रे तयार ठेवा',
    'home.calc_title': 'कॅल्क्युलेटर एका क्लिकवर',
    'fd.hero_title': 'सर्वोत्तम मुदत ठेव (FD) दर शोधा',
    'fd.trust_signal': 'सुरक्षित बँक माहिती',
    'fd.guidance_cta': 'FD साठी मार्गदर्शन हवे आहे',
    'fd.col_docs': 'कागदपत्रे',
    'fd.col_action': 'कृती',
    'fd.tenure_all': 'सर्व कालावधी',
    'sip.intro': 'दर महिन्याला थोडी रक्कम गुंतवा आणि दीर्घकाळात वाढ पहा.',
    'sip.risk_title': 'जोखीम प्रकार समजून घ्या',
    'sip.risk_equity': 'इक्विटी — जास्त जोखीम',
    'sip.risk_hybrid': 'हायब्रिड — मध्यम जोखीम',
    'sip.risk_debt': 'डेट — कमी जोखीम',
    'sip.guidance_cta': 'SIP सुरू करण्यासाठी मार्गदर्शन घ्या',
    'ins.guidance_cta': 'विमा मार्गदर्शन घ्या',
    'ins.types_title': 'विम्याचे प्रकार',
    'ins.what_is': 'हे काय आहे?',
    'ins.who': 'कोणासाठी?',
    'ins.benefits': 'मुख्य फायदे',
    'ins.check': 'खरेदीपूर्वी तपासा',

    // --- Footer ---
    'footer.tagline': 'महाराष्ट्राचा विश्वासू आर्थिक मार्गदर्शक',
    'footer.desc': 'मराठी आणि हिंदीमध्ये FD, कर्ज, SIP आणि विमा यांची सोपी, पारदर्शक तुलना व माहिती.',
    'footer.col_products': 'उत्पादने',
    'footer.col_company': 'कंपनी',
    'footer.col_trust': 'विश्वास',
    'footer.rights': '© 2026 बजेट कट्टा. सर्व हक्क राखीव.',
  },

  // ============================================================
  // English
  // ============================================================
  en: {
    // --- Navbar ---
    'nav.home': 'Home',
    'nav.fd': 'FD Rates',
    'nav.loans': 'Loans',
    'nav.sip': 'SIP',
    'nav.insurance': 'Insurance',
    'nav.compare': 'Compare',
    'nav.language': 'Language',

    // --- Hero Section ---
    'hero.badge': "🏆 India's #1 Financial Guide",
    'hero.title': 'Simple, transparent and smart\ninformation for your money',
    'hero.subtitle': 'FD, loans, SIP, insurance and document information in Marathi and English, all in one place.',
    'hero.cta_primary': 'Compare Now',
    'hero.cta_secondary': 'View Documents',
    'hero.stat_banks': 'Banks',
    'hero.stat_users': 'Users',
    'hero.stat_rate': 'Top FD Rate',

    // --- FD Page ---
    'fd.title': 'Fixed Deposit (FD) Rates',
    'fd.subtitle': 'Best FD rates from all major banks',
    'fd.filter_all': 'All Banks',
    'fd.filter_govt': 'Public Sector Banks',
    'fd.filter_private': 'Private Banks',
    'fd.col_bank': 'Bank',
    'fd.col_tenure': 'Tenure',
    'fd.col_regular': 'Regular Rate',
    'fd.col_senior': 'Senior Citizen Rate',
    'fd.calc_title': 'FD Maturity Calculator',
    'fd.amount': 'Deposit Amount (₹)',
    'fd.rate': 'Interest Rate (%)',
    'fd.tenure': 'Tenure (Years)',
    'fd.senior_toggle': 'Are you a senior citizen?',
    'fd.maturity': 'Maturity Amount',
    'fd.interest_earned': 'Total Interest',
    'fd.calculate': 'Calculate',
    'fd.compare': 'Compare',
    'fd.interested': "I'm Interested",

    // --- Loan Page ---
    'loan.title': 'Loan Schemes',
    'loan.subtitle': 'Best loan rates and terms',
    'loan.home': 'Home Loan',
    'loan.personal': 'Personal Loan',
    'loan.vehicle': 'Vehicle Loan',
    'loan.business': 'Business Loan',
    'loan.education': 'Education Loan',
    'loan.col_bank': 'Bank',
    'loan.col_roi': 'Interest Rate',
    'loan.col_fee': 'Processing Fee',
    'loan.col_tenure': 'Max Tenure',
    'loan.emi_title': 'EMI Calculator',
    'loan.amount': 'Loan Amount (₹)',
    'loan.rate': 'Interest Rate (%)',
    'loan.tenure_month': 'Tenure (Months)',
    'loan.monthly_emi': 'Monthly EMI',
    'loan.total_interest': 'Total Interest',
    'loan.total_amount': 'Total Repayment',
    'loan.calculate': 'Calculate EMI',

    // --- SIP Page ---
    'sip.title': 'SIP / Mutual Funds',
    'sip.subtitle': 'Best funds for long-term wealth creation',
    'sip.col_fund': 'Fund Name',
    'sip.col_category': 'Category',
    'sip.col_3y': '3-Year Return',
    'sip.col_5y': '5-Year Return',
    'sip.col_risk': 'Risk',
    'sip.calc_title': 'SIP Return Calculator',
    'sip.monthly_invest': 'Monthly Investment (₹)',
    'sip.tenure_year': 'Tenure (Years)',
    'sip.expected_return': 'Expected Annual Return (%)',
    'sip.invested': 'Amount Invested',
    'sip.returns': 'Estimated Returns',
    'sip.maturity': 'Expected Maturity Amount',

    // --- Insurance Page ---
    'ins.title': 'Insurance Plans',
    'ins.subtitle': 'Best health, life and vehicle insurance plans',
    'ins.health': 'Health Insurance',
    'ins.life': 'Life Insurance',
    'ins.vehicle': 'Vehicle Insurance',
    'ins.col_company': 'Company',
    'ins.col_plan': 'Plan Name',
    'ins.col_premium': 'Annual Premium',
    'ins.col_features': 'Key Features',
    'ins.est_title': 'Premium Estimate',
    'ins.age': 'Age',
    'ins.cover': 'Sum Insured (₹)',
    'ins.type': 'Insurance Type',
    'ins.policy_term': 'Policy Term (Years)',
    'ins.est_premium': 'Estimated Annual Premium',
    'ins.suggested_cover': 'Suggested Cover',

    // --- Buttons ---
    'btn.apply': 'Apply',
    'btn.learn_more': 'Learn More',
    'btn.compare': 'Compare',
    'btn.interested': "I'm Interested",
    'btn.clear': 'Clear',
    'btn.close': 'Close',
    'btn.calculate': 'Calculate',
    'btn.voice': 'Voice Assistant',

    // --- Lead Form ---
    'lead.title': "I'm Interested",
    'lead.subtitle': 'Share your details and our team will reach out to you.',
    'lead.name': 'Full Name',
    'lead.name_ph': 'Your name',
    'lead.phone': 'Mobile Number',
    'lead.phone_ph': '10-digit mobile number',
    'lead.city': 'City',
    'lead.city_ph': 'Your city',
    'lead.module': 'Area of Interest',
    'lead.product': 'Selected Product',
    'lead.submit': 'Submit',
    'lead.sending': 'Sending...',
    'lead.success': 'Thank you! Our team will contact you soon.',
    'lead.err_name': 'Please enter your name.',
    'lead.err_phone': 'Please enter a valid 10-digit mobile number.',
    'lead.fail': 'Something went wrong while sending. Please try again.',

    // --- Bot ---
    'bot.greeting': "Hi! I'm the BudgetKatta Smart Guide. Would you like information on investments, loans, SIPs or insurance?",
    'bot.quick_fd': 'FD Info',
    'bot.quick_loan': 'Loan Info',
    'bot.quick_sip': 'SIP Info',
    'bot.quick_ins': 'Insurance Info',
    'bot.voice_btn': 'Voice Assistant',
    'bot.type_here': 'Type here...',
    'bot.send': 'Send',
    'bot.title': 'BudgetKatta Guide',

    // --- Trust Section ---
    'trust.secure': 'Secure Information',
    'trust.transparent': 'Transparent Comparison',
    'trust.ai': 'AI-Assisted Guidance',
    'trust.updated': 'Regular Updates',
    'trust.no_hidden': 'No Hidden Charges',
    'trust.disclaimer': 'This information is provided for educational and informational purposes only. Please consult the relevant bank, insurance company, mutual fund house or a certified financial advisor before making any financial decision.',

    // --- Loading & Empty States ---
    'state.loading': 'Loading information...',
    'state.empty': 'No information available',
    'state.error': 'Something went wrong. Please try again.',
    'state.no_results': 'No results found',

    // --- Data source / freshness ---
    'data.demo': 'Demo Data',
    'data.live': 'MongoDB Live',
    'data.updated': 'Updated',

    // --- Calculator disclaimer ---
    'calc.disclaimer': 'Note: The figures shown are indicative only. Actual rates and returns may vary by bank or institution. Consult an expert before making a decision.',

    // --- Nav (company pages) ---
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.privacy': 'Privacy Policy',
    'nav.terms': 'Terms & Conditions',
    'nav.disclaimer': 'Disclaimer',

    // --- About page ---
    'about.title': 'About BudgetKatta',
    'about.subtitle': 'A trusted financial information and comparison platform in Marathi and English',
    'about.intro': 'BudgetKatta is a financial information and comparison platform built for Marathi and English-speaking users.',
    'about.compare': 'Here you can easily compare FD rates, loans, SIPs / mutual funds and insurance plans, all in one place.',
    'about.ai': 'We make financial information accessible through AI-assisted guidance, interactive calculators and transparent comparison. This information is provided for educational and informational purposes only.',
    'about.cta_fd': 'View FD Rates',
    'about.cta_loan': 'Compare Loans',
    'about.cta_sip': 'Use SIP Calculator',
    'about.cta_contact': 'Contact Us',

    // --- Contact page ---
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Share your question or need and our team will reach out to you.',
    'contact.form_title': 'Send Us a Message',
    'contact.email': 'Email (optional)',
    'contact.email_ph': 'Your email',
    'contact.service': 'Service of Interest',
    'contact.general': 'General Enquiry',
    'contact.message': 'Message',
    'contact.message_ph': 'Type your message here...',
    'contact.send': 'Send Message',
    'contact.info_title': 'Contact Information',
    'contact.info_email': 'Email',
    'contact.info_area': 'Service Area',
    'contact.info_area_val': 'Maharashtra and India',
    'contact.info_response': 'Response Time',
    'contact.info_response_val': '24–48 hours',
    'contact.whatsapp': 'Contact on WhatsApp',
    'contact.whatsapp_soon': 'WhatsApp will be available soon',

    // --- Privacy page ---
    'privacy.title': 'Privacy Policy',
    'privacy.subtitle': 'The protection of your information is important to us.',
    'privacy.h_collect': 'What information we collect',
    'privacy.collect': 'Name, mobile number, city, your query and interest in the selected product.',
    'privacy.h_why': 'Why we collect this information',
    'privacy.why': 'For follow-up, service guidance and lead support.',
    'privacy.h_share': 'Information sharing',
    'privacy.share': 'We do not sell your personal information.',
    'privacy.h_delete': 'Data deletion request',
    'privacy.delete': 'You can request the deletion of your information at any time.',
    'privacy.h_contact': 'Contact',
    'privacy.contact': 'For privacy-related questions, please contact us:',

    // --- Terms page ---
    'terms.title': 'Terms & Conditions',
    'terms.subtitle': 'Please read carefully before using the service.',
    'terms.t1': 'BudgetKatta provides only an educational and informational financial comparison service.',
    'terms.t2': 'Unless marked as "MongoDB Live" or as a verified source, data may be demo or sample data.',
    'terms.t3': 'Verify details on the official website of the bank, insurer or fund house before making any decision.',
    'terms.t4': 'No returns of any kind are guaranteed.',
    'terms.t5': 'No financial advice is guaranteed.',
    'terms.t6': 'Use the service at your own discretion.',

    // --- Disclaimer page ---
    'disclaimer.title': 'Disclaimer',
    'disclaimer.subtitle': 'Important Financial Notice',
    'disclaimer.d1': 'FD rates, loan rates, SIP returns and insurance premiums shown are indicative only.',
    'disclaimer.d2': 'Mutual fund investments are subject to market risk.',
    'disclaimer.d3': 'Past returns do not guarantee future returns.',
    'disclaimer.d4': 'Consult a certified financial advisor before making any decision.',
    'disclaimer.d5': 'This information is for educational and informational purposes only.',

    // --- Nav / rates / documents / CTA ---
    'nav.rates': 'Rates / Market',
    'nav.documents': 'Documents',
    'nav.cta': 'Get Free Guidance',

    // --- Easy-explanation phrases ---
    'easy.at_glance': 'Information at a glance',
    'easy.docs_quick': 'Understand documents instantly',
    'easy.emi_first': 'See the EMI first, then decide',
    'easy.simple': 'Rates, terms and documents in simple language',
    'easy.clear': 'No confusion — a clear comparison',
    'easy.profile': 'Guidance tailored to your profile',

    // --- Guidance CTAs ---
    'cta.free_guidance': 'Get Free Guidance',
    'cta.check_docs': 'Check Documents',
    'cta.use_emi': 'Use EMI Calculator',
    'cta.compare': 'Compare',

    // --- Loan extras ---
    'loan.gold': 'Gold Loan',
    'loan.q_amount': 'How much loan do you need?',
    'loan.q_emi': 'What will the EMI be?',
    'loan.q_approval': 'What do you need for approval?',
    'loan.q_docs': 'View documents instantly',
    'loan.f_rate': 'Interest Rate Range',
    'loan.f_fee': 'Processing Fee',
    'loan.f_tenure': 'Max Tenure',
    'loan.f_eligibility': 'Eligibility',
    'loan.f_documents': 'Required Documents',
    'loan.f_who': 'Who is it for?',
    'loan.f_mistakes': 'Mistakes to Avoid',
    'loan.f_cta': 'I want this loan',

    // --- Documents page ---
    'doc.title': 'Documents Required for Loans, FD, SIP and Insurance',
    'doc.subtitle': 'See the exact list for your profile in one click.',
    'doc.product': 'Choose a Product',
    'doc.profile': 'Your Profile',
    'doc.download': 'Download List',
    'doc.download_soon': 'Download feature coming soon',
    'doc.need_help': 'I need help',
    'doc.why': 'Why is this document needed?',
    'doc.required': 'Required',
    'doc.sometimes': 'Sometimes required',
    'doc.section_title': 'Required Documents',

    // --- Rates page ---
    'rates.title': 'Rates and Market Information',
    'rates.subtitle': 'FD rates, loan rates and market information in one place.',
    'rates.fd_title': 'Top FD Rates',
    'rates.loan_title': 'Loan Interest Rate Ranges',
    'rates.market_title': 'Market Information',
    'rates.tools_title': 'Quick Calculators',
    'rates.sample_badge': 'Sample Data',

    // --- Credit score page ---
    'cs.title': 'Credit Score Guidance',
    'cs.subtitle': 'Understand and improve your credit score in simple language.',
    'cs.cta': 'I need credit score guidance',

    // --- Cards page ---
    'cards.title': 'Credit & Debit Card Guidance',
    'cards.subtitle': 'Which card is right for you? Understand it in simple language.',
    'cards.cta': 'I need help with cards',

    // --- Home extras ---
    'home.selector_title': 'What are you looking for?',
    'home.guide_title': '3D Smart Guide',
    'home.guide_sub': 'Feeling confused? Our smart guide will show you the way.',
    'home.docs_cta': 'View documents instantly',
    'home.docs_sub': 'The exact list for your profile.',

    // --- Explainers ---
    'explain.section_title': 'Understand it easily',

    // --- Footer tools / extra ---
    'tools.title': 'Tools',
    'tools.fd': 'FD Calculator',
    'tools.emi': 'EMI Calculator',
    'tools.sip': 'SIP Calculator',
    'tools.ins': 'Insurance Estimate',
    'tools.docs': 'Document List',
    'ins.term': 'Term Insurance',

    // --- UX pass v2 ---
    'nav.cta_short': 'Free Guidance',
    'trust.educational': 'Educational Purpose',
    'home.how_title': 'How does it work?',
    'home.how_1': 'Choose the information',
    'home.how_2': 'View rates and EMI',
    'home.how_3': 'Keep documents ready',
    'home.calc_title': 'Calculators in One Click',
    'fd.hero_title': 'Find the best Fixed Deposit (FD) rates',
    'fd.trust_signal': 'Secure bank information',
    'fd.guidance_cta': 'I need guidance on FDs',
    'fd.col_docs': 'Documents',
    'fd.col_action': 'Action',
    'fd.tenure_all': 'All Tenures',
    'sip.intro': 'Invest a small amount each month and watch it grow over the long term.',
    'sip.risk_title': 'Understand the Risk Types',
    'sip.risk_equity': 'Equity — High Risk',
    'sip.risk_hybrid': 'Hybrid — Medium Risk',
    'sip.risk_debt': 'Debt — Low Risk',
    'sip.guidance_cta': 'Get guidance to start an SIP',
    'ins.guidance_cta': 'Get insurance guidance',
    'ins.types_title': 'Types of Insurance',
    'ins.what_is': 'What is this?',
    'ins.who': 'Who is it for?',
    'ins.benefits': 'Key Benefits',
    'ins.check': 'Check before buying',

    // --- Footer ---
    'footer.tagline': "India's Trusted Financial Guide",
    'footer.desc': 'Easy, transparent comparison and information on FDs, loans, SIPs and insurance in Marathi and English.',
    'footer.col_products': 'Products',
    'footer.col_company': 'Company',
    'footer.col_trust': 'Trust',
    'footer.rights': '© 2026 BudgetKatta. All rights reserved.',
  },
};

// Hook to use translations
export function getTranslation(lang: Language) {
  return (key: string): string => i18n[lang][key] ?? key;
}
