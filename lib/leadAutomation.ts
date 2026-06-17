// lib/leadAutomation.ts
//
// Two paths:
//   • sendLeadToN8N(payload)  — lightweight, fire-and-forget CLIENT events
//     (e.g. bot quick actions). Posts directly to NEXT_PUBLIC_N8N_WEBHOOK_URL
//     if set, else logs to console. Never throws.
//   • submitLead(payload)     — the real lead form. Posts to our SERVER route
//     /api/leads, which persists to MongoDB (if configured) and forwards to
//     n8n securely (server-side webhook). Returns { ok }.
//
// n8n workflow downstream should: append to Google Sheets, create a CRM
// contact, send WhatsApp/email follow-up, and ping Slack/Telegram.

import type { LeadPayload } from '@/types';

export type { LeadPayload };
export type { LeadModule } from '@/types';

/** Fire-and-forget client event. Never blocks or throws. */
export async function sendLeadToN8N(payload: LeadPayload): Promise<void> {
  const webhookURL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

  if (!webhookURL) {
    console.info('[BudgetKatta] Lead (n8n not connected):', payload);
    return;
  }

  try {
    await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // Silent fail — never break UX if n8n is down.
    console.error('[BudgetKatta] Lead send failed:', err);
  }
}

/** Submit a full lead via the server route. Resolves false on error (UI never blocks). */
export async function submitLead(payload: LeadPayload): Promise<boolean> {
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({ ok: false }));
    return Boolean(json?.ok);
  } catch (err) {
    console.error('[BudgetKatta] submitLead failed:', err);
    return false;
  }
}
