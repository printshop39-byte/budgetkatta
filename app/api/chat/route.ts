// app/api/chat/route.ts — chatbot endpoint.
// Flow: rate-limit → validate (Zod) → sanitize → Gemini (or rule-based fallback).
import { NextResponse } from 'next/server';
import { generateChatReply } from '@/lib/gemini';
import { chatSchema } from '@/lib/validation';
import { rateLimit, clientIp, sweepExpired } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Rate limit: 20 messages / minute / IP.
  sweepExpired();
  const limit = rateLimit(`chat:${clientIp(request)}`, 20, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = chatSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const message = sanitizeText(parsed.data.message, 2000);
  const language = parsed.data.language === 'en' ? 'en' : 'mr';

  try {
    const reply = await generateChatReply(message, language);
    return NextResponse.json({ ok: true, reply });
  } catch (err) {
    console.error('[BudgetKatta] /api/chat error:', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
