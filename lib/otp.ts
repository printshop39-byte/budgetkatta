// lib/otp.ts — phone OTP: generate → store (Redis/in-memory) → send (MSG91) →
// verify. Security: OTP is stored only as a salted SHA-256 hash, 5-min TTL,
// max 5 verify attempts, 30s resend cooldown, and a per-phone hourly cap.
// Dev fallback: when MSG91 isn't configured, the OTP is logged to the server
// console (and returned to the caller) so the flow is fully testable.
import { createHash, randomInt } from 'crypto';
import { kvGet, kvSet, kvDel, kvIncr } from '@/lib/redis';

const OTP_TTL_SEC = 300; // 5 minutes
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_SEC = 30;
const MAX_PER_PHONE_PER_HOUR = 5;

/** Normalize an Indian mobile number to E.164 (+91XXXXXXXXXX), or null. */
export function normalizePhone(raw: string): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]/.test(digits)) return '+91' + digits;
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) return '+' + digits;
  if (digits.length === 11 && digits.startsWith('0') && /^[6-9]/.test(digits.slice(1))) return '+91' + digits.slice(1);
  return null;
}

function hashOtp(phone: string, otp: string): string {
  // Prefix with a non-numeric char so the KV layer never treats it as JSON.
  return 'h' + createHash('sha256').update(`${phone}:${otp}`).digest('hex');
}

export interface RequestOtpResult {
  ok: boolean;
  reason?: 'cooldown' | 'rate_limited';
  retryAfterSec?: number;
  /** Present only in dev when SMS isn't configured — never in production. */
  devOtp?: string;
}

export async function requestOtp(phone: string): Promise<RequestOtpResult> {
  if (await kvGet(`otp:cd:${phone}`)) {
    return { ok: false, reason: 'cooldown', retryAfterSec: RESEND_COOLDOWN_SEC };
  }
  const count = await kvIncr(`otp:rl:${phone}`, 3600);
  if (count > MAX_PER_PHONE_PER_HOUR) {
    return { ok: false, reason: 'rate_limited', retryAfterSec: 3600 };
  }

  const otp = String(randomInt(0, 1_000_000)).padStart(6, '0');
  await kvSet(`otp:${phone}`, hashOtp(phone, otp), OTP_TTL_SEC);
  await kvDel(`otp:att:${phone}`);
  await kvSet(`otp:cd:${phone}`, '1', RESEND_COOLDOWN_SEC);

  const sent = await sendSms(phone, otp);
  if (!sent && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info(`[BudgetKatta][DEV] OTP for ${phone}: ${otp}`);
    return { ok: true, devOtp: otp };
  }
  return { ok: true };
}

export async function verifyOtp(phone: string, otp: string): Promise<boolean> {
  const stored = await kvGet(`otp:${phone}`);
  if (!stored) return false;

  const attempts = Number((await kvGet(`otp:att:${phone}`)) ?? '0');
  if (attempts >= MAX_ATTEMPTS) {
    await kvDel(`otp:${phone}`);
    return false;
  }

  if (stored !== hashOtp(phone, otp)) {
    await kvIncr(`otp:att:${phone}`, OTP_TTL_SEC);
    return false;
  }

  // Success — consume the OTP and its guards.
  await kvDel(`otp:${phone}`);
  await kvDel(`otp:att:${phone}`);
  await kvDel(`otp:cd:${phone}`);
  return true;
}

/** Send the OTP via MSG91. Returns false (→ dev fallback) if unconfigured or on error. */
async function sendSms(phone: string, otp: string): Promise<boolean> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_OTP_TEMPLATE_ID;
  if (!authKey || !templateId) return false;
  const mobile = phone.replace('+', ''); // MSG91 wants 91XXXXXXXXXX
  try {
    const res = await fetch('https://control.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authkey: authKey },
      body: JSON.stringify({ template_id: templateId, mobile, otp }),
    });
    return res.ok;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[BudgetKatta] MSG91 send failed:', e);
    return false;
  }
}
