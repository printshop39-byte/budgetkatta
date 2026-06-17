// app/api/leads/route.ts — secure server-side lead capture.
// Flow: rate-limit → validate (Zod) → sanitize → persist to MongoDB (if
// configured) → forward to n8n. Returns ok:true on a valid request so the UI
// never blocks, even if n8n or the DB are unavailable (failures are logged).
import { NextResponse } from 'next/server';
import type { LeadPayload } from '@/types';
import { connectDB, isMongoConfigured } from '@/lib/mongodb';
import { leadSchema } from '@/lib/validation';
import { rateLimit, clientIp, sweepExpired } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

// Prefer a server-only webhook URL (kept out of the browser bundle); fall back
// to the public one so a single var still works for simpler setups.
const N8N_URL =
  process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

async function persist(payload: LeadPayload) {
  if (!isMongoConfigured()) return;
  try {
    await connectDB();
    const { Lead } = await import('@/models/Lead');
    await Lead.create(payload);
  } catch (err) {
    console.error('[BudgetKatta] Lead DB persist failed:', err);
  }
}

async function forwardToN8N(payload: LeadPayload) {
  if (!N8N_URL) {
    console.info('[BudgetKatta] Lead (n8n not connected):', payload);
    return;
  }
  try {
    await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[BudgetKatta] Lead n8n forward failed:', err);
  }
}

// Lightweight count for the admin placeholder. Guarded by the admin flag so it
// isn't openly queryable when admin is disabled.
export async function GET() {
  if (process.env.NEXT_PUBLIC_ENABLE_ADMIN !== 'true') {
    return NextResponse.json({ ok: false, error: 'Not enabled' }, { status: 403 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json({ ok: true, count: 0, source: 'demo' });
  }
  try {
    await connectDB();
    const { Lead } = await import('@/models/Lead');
    const count = await Lead.countDocuments();
    return NextResponse.json({ ok: true, count, source: 'mongodb' });
  } catch (err) {
    console.error('[BudgetKatta] Lead count failed:', err);
    return NextResponse.json({ ok: true, count: 0, source: 'demo' });
  }
}

export async function POST(request: Request) {
  // Rate limit: 8 submissions / minute / IP.
  sweepExpired();
  const limit = rateLimit(`leads:${clientIp(request)}`, 8, 60_000);
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

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  // Sanitize free-text fields before persisting/forwarding.
  const d = parsed.data;
  const payload: LeadPayload = {
    ...d,
    userName: d.userName ? sanitizeText(d.userName, 120) : undefined,
    phone: d.phone ? sanitizeText(d.phone, 20) : undefined,
    email: d.email ? sanitizeText(d.email, 160) : undefined,
    city: d.city ? sanitizeText(d.city, 120) : undefined,
    selectedProduct: d.selectedProduct ? sanitizeText(d.selectedProduct, 300) : undefined,
    userQuery: d.userQuery ? sanitizeText(d.userQuery, 2000) : undefined,
  };

  // Run both side effects; never let either block the response.
  await Promise.allSettled([persist(payload), forwardToN8N(payload)]);

  return NextResponse.json({ ok: true });
}
