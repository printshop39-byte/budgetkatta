// lib/vapi.ts — Vapi voice assistant integration (placeholder, architecture-ready).
//
// Detection uses NEXT_PUBLIC_VAPI_PUBLIC_KEY so the client can decide whether to
// show "coming soon" or actually start a call. When you're ready to ship voice:
//   1. npm install @vapi-ai/web
//   2. set NEXT_PUBLIC_VAPI_PUBLIC_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID
//   3. implement startVoiceCall() below (real code is sketched in comments).

import type { Language } from '@/types';

export function isVapiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
}

/** Bilingual "coming soon" message used when Vapi isn't configured. */
export function voiceComingSoonMessage(language: Language): string {
  return language === 'mr'
    ? '🎤 व्हॉइस सहाय्यक लवकरच सुरू होईल!'
    : '🎤 वॉइस सहायक जल्द शुरू होगा!';
}

/**
 * Starts a voice conversation. Currently a safe placeholder — it never throws
 * if the key is missing. Replace the body with the real Vapi client once the
 * package is installed:
 *
 *   const Vapi = (await import('@vapi-ai/web')).default;
 *   const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);
 *   await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!);
 *   return vapi; // keep a handle to stop()/send() later
 */
export async function startVoiceCall(_language: Language): Promise<{ started: boolean }> {
  if (!isVapiConfigured()) return { started: false };
  // TODO: real Vapi start (see docblock). Architecture is ready; no-op for now.
  console.info('[BudgetKatta] Vapi configured — voice start placeholder invoked.');
  return { started: true };
}
