// lib/analytics.ts
// ────────────────────────────────────────────────────────────────────────────
// Privacy-conscious, consent-gated funnel analytics (Phase 8).
//
// RULES:
//  • Fires ONLY after the user accepted cookies (bk-cookie-consent === 'accepted').
//  • NEVER pass raw income / expenses / EMI / phone / email / report text here.
//    Callers send only safe, aggregate props (step number, band key, boolean flags).
//  • No provider wired yet? Then track() is a safe no-op in prod and a console.debug
//    in dev — so the funnel is testable without shipping a tracker.
// ────────────────────────────────────────────────────────────────────────────

export const ANALYTICS_EVENTS = {
  homepage_primary_cta_clicked: 'homepage_primary_cta_clicked',
  health_check_started: 'health_check_started',
  health_check_step_completed: 'health_check_step_completed',
  health_check_completed: 'health_check_completed',
  result_viewed: 'result_viewed',
  paid_report_clicked: 'paid_report_clicked',
  checkout_started: 'checkout_started',
  payment_completed: 'payment_completed',
  report_generated: 'report_generated',
  report_downloaded: 'report_downloaded',
  calculator_clicked_from_report: 'calculator_clicked_from_report',
  partner_consent_given: 'partner_consent_given',
  partner_lead_created: 'partner_lead_created',
  affiliate_offer_viewed: 'affiliate_offer_viewed',
  affiliate_link_clicked: 'affiliate_link_clicked',
} as const;

export type AnalyticsEvent = keyof typeof ANALYTICS_EVENTS;

/** Only non-identifying primitives are allowed as event properties. */
export type SafeProps = Record<string, string | number | boolean | undefined>;

// A small allow-list guard: drop anything that looks like raw PII/financial data
// even if a caller passes it by mistake (defense-in-depth).
const BLOCKED_KEYS =
  /income|expense|emi|salary|phone|mobile|email|amount|name|address|otp|token|card/i;

function hasConsent(): boolean {
  try {
    return localStorage.getItem('bk-cookie-consent') === 'accepted';
  } catch {
    return false;
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: AnalyticsEvent, props: SafeProps = {}): void {
  if (typeof window === 'undefined') return;
  if (!hasConsent()) return;

  const safe: SafeProps = {};
  for (const [k, v] of Object.entries(props)) {
    if (BLOCKED_KEYS.test(k)) continue; // never forward PII/financial fields
    if (v !== undefined) safe[k] = v;
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', event, safe);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...safe });
  } else if (process.env.NODE_ENV !== 'production') {
    // No provider configured — surface the event in dev so the funnel is testable.
    // Safe props only (guaranteed above); never PII.
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, safe);
  }
}
