import { describe, it, expect } from 'vitest';
import { validateProductionEnv } from '@/lib/env';

const base = {
  NODE_ENV: 'production',
  AUTH_SECRET: 'x',
  MONGODB_URI: 'mongodb+srv://a',
  UPSTASH_REDIS_REST_URL: 'https://r',
  UPSTASH_REDIS_REST_TOKEN: 't',
  AUTH_GOOGLE_ID: 'g',
  AUTH_GOOGLE_SECRET: 's',
};

describe('validateProductionEnv', () => {
  it('passes with a complete production env', () => {
    expect(validateProductionEnv(base)).toEqual([]);
  });
  it('is a no-op outside production', () => {
    expect(validateProductionEnv({ NODE_ENV: 'development' })).toEqual([]);
  });
  it('flags a missing shared store (Redis)', () => {
    const { UPSTASH_REDIS_REST_URL, ...rest } = base;
    void UPSTASH_REDIS_REST_URL;
    const issues = validateProductionEnv(rest);
    expect(issues.map((i) => i.key)).toContain('UPSTASH_REDIS_REST_URL');
  });
  it('flags when no sign-in method is configured', () => {
    const { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, ...rest } = base;
    void AUTH_GOOGLE_ID;
    void AUTH_GOOGLE_SECRET;
    const issues = validateProductionEnv(rest);
    expect(issues.map((i) => i.key)).toContain('AUTH_PROVIDERS');
  });
  it('accepts OTP-only (MSG91) as a valid sign-in method', () => {
    const { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, ...rest } = base;
    void AUTH_GOOGLE_ID;
    void AUTH_GOOGLE_SECRET;
    const issues = validateProductionEnv({ ...rest, MSG91_AUTH_KEY: 'k', MSG91_OTP_TEMPLATE_ID: 'tpl' });
    expect(issues).toEqual([]);
  });
});
