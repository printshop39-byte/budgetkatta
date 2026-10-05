// lib/consent.ts — the single consent wording used by every lead form.
//
// WHY A VERSION: when the wording changes, the stored `consentVersion` shows
// which text a visitor actually agreed to (and when: `consentAt`). Bump
// CONSENT_VERSION whenever CONSENT_TEXT changes in a way that matters.
//
// CURRENT TRUTH: leads go to BudgetKatta's own follow-up (DB + automation). The
// text therefore promises NO sharing with banks / partners without a separate
// consent. If partners are added later, ask for that separate, specific consent
// at that time — do not widen this wording silently.
import type { Bi } from '@/lib/homeFinanceContent';

export const CONSENT_VERSION = '2026-10-05';

export const CONSENT_TEXT: Bi = {
  mr: 'मी माझे नाव, मोबाइल नंबर, शहर आणि (दिल्यास) नोकरीचा प्रकार यांचा वापर करून BudgetKatta ने माझ्याशी call / WhatsApp / email द्वारे संपर्क साधून गृहकर्ज व घर-सजावट मार्गदर्शन देण्यास संमती देतो. माझी माहिती कोणत्याही बँक, वित्तसंस्था किंवा भागीदाराला माझ्या वेगळ्या संमतीशिवाय दिली जाणार नाही. मी ही संमती कधीही मागे घेऊ शकतो.',
  en: 'I consent to BudgetKatta using my name, mobile number, city and (if given) employment type to contact me by call / WhatsApp / email with home-loan and home-setup guidance. My details will not be given to any bank, financial institution or partner without my separate consent. I can withdraw this consent at any time.',
};

export const CONSENT_LINK_LABEL: Bi = { mr: 'गोपनीयता धोरण', en: 'Privacy Policy' };

/** Evidence fields stored with every lead that has contact details. */
export function consentEvidence(now: Date = new Date()) {
  return { consentVersion: CONSENT_VERSION, consentAt: now.toISOString() };
}
