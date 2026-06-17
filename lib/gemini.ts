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
  en: 'Note: This information is for educational purposes only. Please consult a certified financial advisor before making any decisions.',
};

// ── Prompt engineering ──────────────────────────────────────────────────────
// The system instruction is the guardrail. It pins the persona, restricts the
// domain to the four finance areas, fixes the reply language, caps length, and
// forces the disclaimer. Keep it tight: longer instructions = more drift.
function buildSystemInstruction(language: Language): string {
  const langName = language === 'mr' ? 'Marathi (मराठी)' : 'English';
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
      en: 'A Fixed Deposit (FD) is a safe investment. Interest rates vary by bank, and senior citizens get a higher rate. Compare options on our FD page and use the calculator.',
    },
    loan: {
      mr: 'कर्जाचा EMI रक्कम, व्याजदर आणि कालावधीवर अवलंबून असतो. आमचे EMI कॅल्क्युलेटर वापरून मासिक हप्ता पाहा आणि बँकांची तुलना करा.',
      en: 'Your loan EMI depends on the amount, interest rate, and tenure. Use our EMI calculator to see the monthly installment and compare banks.',
    },
    sip: {
      mr: 'SIP द्वारे दर महिन्याला थोडी रक्कम गुंतवून दीर्घकाळात संपत्ती निर्माण होते. जोखीम फंडानुसार बदलते. आमचे SIP कॅल्क्युलेटर वापरून परतावा अंदाजा.',
      en: 'A SIP lets you invest a small amount each month to build wealth over the long term. Risk varies by fund. Use our SIP calculator to estimate returns.',
    },
    insurance: {
      mr: 'विमा तुमच्या आरोग्य, जीवन किंवा वाहनासाठी आर्थिक संरक्षण देतो. प्रीमियम वय व संरक्षणावर अवलंबून असतो. आमचा प्रीमियम अंदाज वापरा.',
      en: 'Insurance provides financial protection for your health, life, or vehicle. The premium depends on your age and coverage. Use our premium estimator.',
    },
    off: {
      mr: 'माफ करा, मी फक्त FD, कर्ज, SIP आणि विमा याबद्दल मदत करू शकतो. कृपया यापैकी एखादा प्रश्न विचारा.',
      en: 'Sorry, I can only help with FDs, Loans, SIPs, and Insurance. Please ask a question on one of these topics.',
    },
  };

  let body: string;
  let onTopic = true;
  if (has('fd', 'fixed', 'deposit', 'ठेव', 'जमा', 'मुदत')) body = A.fd[language];
  else if (has('loan', 'emi', 'कर्ज', 'ऋण', 'हप्ता')) body = A.loan[language];
  else if (has('sip', 'mutual', 'fund', 'म्युच्युअल', 'गुंतवणूक')) body = A.sip[language];
  else if (has('insurance', 'policy', 'विमा', 'पॉलिसी', 'प्रीमियम')) body = A.insurance[language];
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
