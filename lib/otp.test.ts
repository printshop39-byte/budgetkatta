// lib/otp.test.ts — unit tests for phone normalization + the OTP lifecycle
// (issue → verify → consume → cooldown → lockout). Runs against the in-memory
// KV fallback (no Upstash/MSG91 env), so requestOtp returns a devOtp.
import { describe, it, expect, beforeEach } from 'vitest';
import { normalizePhone, requestOtp, verifyOtp } from '@/lib/otp';
import { __clearMemoryStore } from '@/lib/redis';

beforeEach(() => __clearMemoryStore());

describe('normalizePhone', () => {
  it('normalizes a 10-digit mobile to E.164', () => {
    expect(normalizePhone('9876543210')).toBe('+919876543210');
  });
  it('strips spaces and separators', () => {
    expect(normalizePhone('98765-43210')).toBe('+919876543210');
    expect(normalizePhone('+91 98765 43210')).toBe('+919876543210');
  });
  it('accepts a 91-prefixed number', () => {
    expect(normalizePhone('919876543210')).toBe('+919876543210');
  });
  it('accepts a 0-prefixed number', () => {
    expect(normalizePhone('09876543210')).toBe('+919876543210');
  });
  it('rejects numbers starting with an invalid digit', () => {
    expect(normalizePhone('1234567890')).toBeNull();
    expect(normalizePhone('5876543210')).toBeNull();
  });
  it('rejects too-short / empty input', () => {
    expect(normalizePhone('98765')).toBeNull();
    expect(normalizePhone('')).toBeNull();
  });
});

describe('OTP lifecycle', () => {
  const phone = '+919876543210';

  it('issues a 6-digit OTP and verifies it', async () => {
    const r = await requestOtp(phone);
    expect(r.ok).toBe(true);
    expect(r.devOtp).toMatch(/^\d{6}$/);
    expect(await verifyOtp(phone, r.devOtp!)).toBe(true);
  });

  it('rejects an incorrect OTP', async () => {
    const r = await requestOtp(phone);
    const wrong = r.devOtp === '000000' ? '111111' : '000000';
    expect(await verifyOtp(phone, wrong)).toBe(false);
  });

  it('consumes the OTP on success (no reuse)', async () => {
    const r = await requestOtp(phone);
    expect(await verifyOtp(phone, r.devOtp!)).toBe(true);
    expect(await verifyOtp(phone, r.devOtp!)).toBe(false);
  });

  it('enforces a resend cooldown', async () => {
    await requestOtp(phone);
    const second = await requestOtp(phone);
    expect(second.ok).toBe(false);
    expect(second.reason).toBe('cooldown');
  });

  it('locks out after 5 failed attempts', async () => {
    const r = await requestOtp(phone);
    const wrong = r.devOtp === '000000' ? '111111' : '000000';
    for (let i = 0; i < 5; i++) await verifyOtp(phone, wrong);
    // The correct OTP now also fails — attempts are exhausted.
    expect(await verifyOtp(phone, r.devOtp!)).toBe(false);
  });

  it('rejects verification when no OTP was requested', async () => {
    expect(await verifyOtp(phone, '123456')).toBe(false);
  });
});
