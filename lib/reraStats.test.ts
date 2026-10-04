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
  it('accepts the newer PR/PM + 13 digit numbers', () => {
    expect(RERA_NUMBER_RE.test('PR1150002601102')).toBe(true);
    expect(RERA_NUMBER_RE.test('PM1150002602106')).toBe(true);
  });
  it('rejects wrong lengths and prefixes', () => {
    expect(RERA_NUMBER_RE.test('P5210001234')).toBe(false);
    expect(RERA_NUMBER_RE.test('A52100012345')).toBe(false);
    expect(RERA_NUMBER_RE.test('P521000123456')).toBe(false);
    expect(RERA_NUMBER_RE.test('PR115000260110')).toBe(false);
    expect(RERA_NUMBER_RE.test('1150002601102')).toBe(false);
  });
});
