import { describe, it, expect } from 'vitest';
import { RERA_NUMBER_RE, normalizeReraNumber, reraGrowth } from './reraStats';

describe('reraGrowth', () => {
  it('computes percentage growth between years', () => {
    expect(reraGrowth('Pune')).toBe(169); // 1172 -> 3150
    expect(reraGrowth('Kolhapur')).toBe(71); // 85 -> 145
  });
  it('is null when a year is missing', () => {
    expect(reraGrowth('Sangli')).toBeNull();
    expect(reraGrowth('Solapur')).toBeNull();
  });
});

describe('RERA number format', () => {
  it('accepts P + 11 digits, case/space-insensitive after normalising', () => {
    expect(RERA_NUMBER_RE.test(normalizeReraNumber(' p52100012345 '))).toBe(true);
  });
  it('rejects wrong lengths and prefixes', () => {
    expect(RERA_NUMBER_RE.test('P5210001234')).toBe(false);
    expect(RERA_NUMBER_RE.test('A52100012345')).toBe(false);
    expect(RERA_NUMBER_RE.test('P521000123456')).toBe(false);
  });
});
