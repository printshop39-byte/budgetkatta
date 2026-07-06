// Chaos / resilience unit tests. Verifies the OTP flow REFUSES to run in
// production when the shared store (Upstash Redis) is unavailable, rather than
// silently degrading to a per-instance in-memory store.
import { describe, it, expect, afterEach, vi } from 'vitest';
import { requestOtp, verifyOtp } from '@/lib/otp';

afterEach(() => {
  vi.unstubAllEnvs();
});

function simulateProdWithoutRedis() {
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
  vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
}

describe('chaos: shared store (Redis) unavailable in production', () => {
  it('requestOtp fails loud in production without Redis configured', async () => {
    simulateProdWithoutRedis();
    await expect(requestOtp('+919000000009')).rejects.toThrow(/OTP store/);
  });

  it('verifyOtp fails loud in production without Redis configured', async () => {
    simulateProdWithoutRedis();
    await expect(verifyOtp('+919000000009', '123456')).rejects.toThrow(/OTP store/);
  });
});
