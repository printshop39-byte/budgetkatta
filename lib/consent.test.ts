import { describe, it, expect } from 'vitest';
import { CONSENT_TEXT, CONSENT_VERSION, consentEvidence } from './consent';
import { leadSchema, missingConsent } from './validation';

describe('consent wording', () => {
  it('has a date-style version and both languages', () => {
    expect(CONSENT_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(CONSENT_TEXT.mr.length).toBeGreaterThan(40);
    expect(CONSENT_TEXT.en.length).toBeGreaterThan(40);
  });
  it('promises no sharing without separate consent, and withdrawal', () => {
    expect(CONSENT_TEXT.en).toMatch(/without my separate consent/);
    expect(CONSENT_TEXT.en).toMatch(/withdraw/);
    expect(CONSENT_TEXT.mr).toMatch(/वेगळ्या संमतीशिवाय/);
  });
  it('evidence carries the version and an ISO timestamp', () => {
    const e = consentEvidence(new Date('2026-10-05T10:00:00Z'));
    expect(e).toEqual({ consentVersion: CONSENT_VERSION, consentAt: '2026-10-05T10:00:00.000Z' });
  });
});

describe('server-side consent rule', () => {
  it('requires consent evidence when contact details are present', () => {
    expect(missingConsent({ phone: '9876543210' })).toBe(true);
    expect(missingConsent({ email: 'a@b.co' })).toBe(true);
    expect(missingConsent({ phone: '9876543210', consentVersion: CONSENT_VERSION })).toBe(false);
  });
  it('does not require it when there are no contact details', () => {
    expect(missingConsent({})).toBe(false);
  });
});

describe('leadSchema', () => {
  const base = { selectedLanguage: 'mr', interestedModule: 'LOAN', sourcePage: 'X', timestamp: '2026-10-05T10:00:00Z' };
  it('accepts employmentType and consent fields', () => {
    const r = leadSchema.safeParse({ ...base, phone: '9876543210', employmentType: 'SALARIED', consentVersion: CONSENT_VERSION, consentAt: '2026-10-05T10:00:00Z' });
    expect(r.success).toBe(true);
  });
  it('rejects an unknown employment type', () => {
    expect(leadSchema.safeParse({ ...base, employmentType: 'PIRATE' }).success).toBe(false);
  });
});
