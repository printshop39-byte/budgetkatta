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
  // Per-IP guard on top of the per-phone guards inside requestOtp.
  sweepExpired();
  const limit = rateLimit(`otp:${clientIp(request)}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'too_many_requests' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
    );
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
