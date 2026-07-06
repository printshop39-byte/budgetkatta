import { describe, it, expect } from 'vitest';
import { safeInternalPath } from '@/lib/safeRedirect';

describe('safeInternalPath (open-redirect guard)', () => {
  it('allows same-origin relative paths', () => {
    expect(safeInternalPath('/account')).toBe('/account');
    expect(safeInternalPath('/dashboard?x=1')).toBe('/dashboard?x=1');
    expect(safeInternalPath('/')).toBe('/');
  });
  it('rejects absolute / scheme URLs', () => {
    expect(safeInternalPath('https://evil.com')).toBe('/account');
    expect(safeInternalPath('http://evil.com/x')).toBe('/account');
    expect(safeInternalPath('javascript:alert(1)')).toBe('/account');
  });
  it('rejects protocol-relative and backslash tricks', () => {
    expect(safeInternalPath('//evil.com')).toBe('/account');
    expect(safeInternalPath('/\\evil.com')).toBe('/account');
    expect(safeInternalPath('/ /evil.com')).toBe('/account');
  });
  it('falls back on empty / null / undefined', () => {
    expect(safeInternalPath(null)).toBe('/account');
    expect(safeInternalPath('')).toBe('/account');
    expect(safeInternalPath(undefined, '/home')).toBe('/home');
  });
});
