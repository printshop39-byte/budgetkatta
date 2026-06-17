// lib/gemini.ts — chatbot brain.
// Uses Google Gemini when GEMINI_API_KEY is set, otherwise a rule-based
// fallback. Both paths: (a) answer only finance topics — FD, Loans,
// SIP/Mutual Funds, Insurance; (b) reply in the site's selected language
// (Marathi or Hindi); (c) append a short advisory disclaimer.

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Language } from '@/types';

// ── Disclaimers (appended to financial guidance) ────────────────────────────
const DISCLAIMER: Record<Language, string> = {
  mr: 'टीप: ही माहिती केवळ शैक्षणिक आहे. निर्णयापूर्वी प्रमाणित आर्थिक सल्लागाराचा सल्ला घ्या.',
  hi: 'नोट: यह जानकारी केवल शैक्षणिक है। निर्णय से पहले प्रमाणित वित्तीय सलाहकार से सलाह लें।',
};

// ── Prompt engineering ──────────────────────────────────────────────────────
// The system instruction is the guardrail. It pins the persona, restricts the
// domain to the four finance areas, fixes the reply language, caps length, and
// forces the disclaimer. Keep it tight: longer instructions = more drift.
function buildSystemInstruction(language: Language): string {
  const langName = language === 'mr' ? 'Marathi (मराठी)' : 'Hindi (हिंदी)';
  return [
    `You are "BudgetKatta Guide", a friendly financial information assistant for users in India.`,
    `ALWAYS reply in ${langName}. Keep answers short (2-4 sentences), simple, and jargon-free.`,
    `You may ONLY discuss these topics: Fixed Deposits (FD), Loans (home/personal/vehicle/business/education), SIP / Mutual Funds, and Insurance (health/life/vehicle).`,
    `If the user asks anything outside these topics, politely decline in ${langName} and steer them back to FD, loans, SIP, or insurance. Do NOT answer off-topic questions.`,
    `Never invent specific bank rates, fund returns, or guarantees. Speak in general, educational terms.`,
    `When you give any financial guidance, end your reply with this exact line: "${DISCLAIMER[language]}"`,
  ].join('\n');
}

// ── Rule-based fallback (no API key) ─────────────────────────────────────────
// Keyword routing → canned, on-topic answer in the selected language. Used when
// GEMINI_API_KEY is missing or the API call fails.
function ruleBasedReply(message: string, language: Language): string {
  const m = message.toLowerCase();
  const has = (...words: string[]) => words.some((w) => m.includes(w));

  const A = {
    fd: {
      mr: 'मुदत ठेव (FD) ही सुरक्षित गुंतवणूक आहे. बँकेनुसार व्याजदर बदलतात आणि ज्येष्ठ नागरिकांना अधिक दर मिळतो. आमच्या FD पानावर तुलना करा आणि कॅल्क्युलेटर वापरा.',
      hi: 'सावधि जमा (FD) एक सुरक्षित निवेश है। ब्याज दरें बैंक के अनुसार बदलती हैं और वरिष्ठ नागरिकों को अधिक दर मिलती है। हमारे FD पेज पर तुलना करें और कैलकुलेटर उपयोग करें।',
    },
    loan: {
      mr: 'कर्जाचा EMI रक्कम, व्याजदर आणि कालावधीवर अवलंबून असतो. आमचे EMI कॅल्क्युलेटर वापरून मासिक हप्ता पाहा आणि बँकांची तुलना करा.',
      hi: 'लोन का EMI राशि, ब्याज दर और अवधि पर निर्भर करता है। हमारे EMI कैलकुलेटर से मासिक किस्त देखें और बैंकों की तुलना करें।',
    },
    sip: {
      mr: 'SIP द्वारे दर महिन्याला थोडी रक्कम गुंतवून दीर्घकाळात संपत्ती निर्माण होते. जोखीम फंडानुसार बदलते. आमचे SIP कॅल्क्युलेटर वापरून परतावा अंदाजा.',
      hi: 'SIP के ज़रिए हर महीने थोड़ी राशि निवेश कर लंबे समय में संपत्ति बनती है। जोखिम फंड के अनुसार बदलता है। हमारे SIP कैलकुलेटर से रिटर्न का अनुमान लगाएं।',
    },
    insurance: {
      mr: 'विमा तुमच्या आरोग्य, जीवन किंवा वाहनासाठी आर्थिक संरक्षण देतो. प्रीमियम वय व संरक्षणावर अवलंबून असतो. आमचा प्रीमियम अंदाज वापरा.',
      hi: 'बीमा आपके स्वास्थ्य, जीवन या वाहन के लिए वित्तीय सुरक्षा देता है। प्रीमियम उम्र और कवर पर निर्भर करता है। हमारा प्रीमियम अनुमान उपयोग करें।',
    },
    off: {
      mr: 'माफ करा, मी फक्त FD, कर्ज, SIP आणि विमा याबद्दल मदत करू शकतो. कृपया यापैकी एखादा प्रश्न विचारा.',
      hi: 'क्षमा करें, मैं केवल FD, लोन, SIP और बीमा के बारे में मदद कर सकता हूं। कृपया इनमें से कोई प्रश्न पूछें।',
    },
  };

  let body: string;
  let onTopic = true;
  if (has('fd', 'fixed', 'deposit', 'ठेव', 'जमा', 'मुदत', 'सावधि')) body = A.fd[language];
  else if (has('loan', 'emi', 'कर्ज', 'लोन', 'ऋण', 'हप्ता', 'किस्त')) body = A.loan[language];
  else if (has('sip', 'mutual', 'fund', 'म्युच्युअल', 'म्यूचुअल', 'फंड', 'गुंतवणूक', 'निवेश')) body = A.sip[language];
  else if (has('insurance', 'policy', 'विमा', 'बीमा', 'पॉलिसी', 'प्रीमियम')) body = A.insurance[language];
  else { body = A.off[language]; onTopic = false; }

  // Disclaimer only when actual guidance was given.
  return onTopic ? `${body}\n\n${DISCLAIMER[language]}` : body;
}

// ── Public entry point ───────────────────────────────────────────────────────
export async function generateChatReply(message: string, language: Language): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return ruleBasedReply(message, language);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: buildSystemInstruction(language),
    });
    const result = await model.generateContent(message);
    const text = result.response.text().trim();
    return text || ruleBasedReply(message, language);
  } catch (err) {
    console.error('[BudgetKatta] Gemini call failed, using fallback:', err);
    return ruleBasedReply(message, language);
  }
}
