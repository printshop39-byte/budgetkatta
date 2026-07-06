// app/api/auth/otp/route.ts — request a phone OTP.
// Flow: per-IP rate-limit → validate → normalize → requestOtp (send/store).
// Verification happens via signIn('phone-otp', {phone, otp}) → Credentials.authorize.
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requestOtp, normalizePhone } from '@/lib/otp';
import { rateLimit, clientIp, sweepExpired } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({ phone: z.string().min(6).max(20) });

export async function POST(request: Request) {
  // Per-IP guard on top of the per-phone guards inside requestOtp. Tunable via
  // env (raise for shared/NAT IPs or E2E); defaults to 5/min.
  sweepExpired();
  const perMin = Number(process.env.OTP_IP_LIMIT_PER_MIN) || 5;
  const limit = rateLimit(`otp:${clientIp(request)}`, perMin, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'too_many_requests' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
    );
  }

  // CSRF / SMS-bombing mitigation: this is not an Auth.js endpoint (no built-in
  // CSRF), so reject cross-origin browser POSTs. A present Origin must match Host.
  const origin = request.headers.get('origin');
  if (origin) {
    const host = request.headers.get('host');
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = null;
    }
    if (originHost !== host) {
      return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
    }
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 });
  }

  const phone = normalizePhone(parsed.data.phone);
  if (!phone) {
    return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 });
  }

  const result = await requestOtp(phone);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.reason },
      { status: 429, headers: { 'Retry-After': String(result.retryAfterSec ?? 30) } }
    );
  }

  // devOtp is only ever present in non-production when SMS is unconfigured.
  return NextResponse.json({ ok: true, devOtp: result.devOtp });
}
