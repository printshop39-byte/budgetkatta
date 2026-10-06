import { describe, it, expect } from 'vitest';
import { BANK_RATES, formatRateRange } from './bankRates';

describe('BANK_RATES integrity', () => {
  it('every entry has an https official source and ISO verification date', () => {
    for (const b of BANK_RATES) {
      expect(b.sourceUrl).toMatch(/^https:\/\//);
      expect(b.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(b.terms.mr.length).toBeGreaterThan(0);
    }
  });
  it('rate ranges are sane', () => {
    for (const b of BANK_RATES) {
      if (b.rateMin !== null && b.rateMax !== null) expect(b.rateMin).toBeLessThanOrEqual(b.rateMax);
    }
  });
});

describe('formatRateRange', () => {
  it('formats closed, open-ended and unknown ranges', () => {
    expect(formatRateRange(7.75, 13.2)).toBe('7.75% – 13.20%');
    expect(formatRateRange(8.5, null)).toBe('8.50% +');
    expect(formatRateRange(null, null)).toBe('—');
  });
});

describe('ICICI headline rate is qualified', () => {
  it('the 7.55% starting rate carries a note pointing to the standard 8.50% rate', () => {
    const icici = BANK_RATES.find((b) => b.id === 'icici');
    expect(icici?.rateMin).toBe(7.55);
    expect(icici?.rateNote?.en).toMatch(/pre-approved/i);
    expect(icici?.rateNote?.en).toMatch(/8\.50%/);
    expect(icici?.rateNote?.mr).toMatch(/8\.50%/);
  });
});
