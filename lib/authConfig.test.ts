import { describe, it, expect } from 'vitest';
import { PROTECTED_PREFIXES, ADMIN_PREFIXES, underPrefix } from '@/lib/authPaths';

// This list MUST mirror the static `config.matcher` in middleware.ts. If someone
// changes PROTECTED_PREFIXES without updating the matcher, this test fails.
const MIDDLEWARE_MATCHER_PREFIXES = ['/dashboard', '/account', '/onboarding', '/memory', '/admin'];

describe('route-protection config', () => {
  it('middleware matcher covers exactly the protected prefixes (drift guard)', () => {
    expect([...PROTECTED_PREFIXES].sort()).toEqual([...MIDDLEWARE_MATCHER_PREFIXES].sort());
  });
  it('admin prefixes are a subset of protected prefixes', () => {
    for (const p of ADMIN_PREFIXES) expect(PROTECTED_PREFIXES).toContain(p);
  });
  it('matches base and nested paths, not lookalikes', () => {
    expect(underPrefix('/admin', ADMIN_PREFIXES)).toBe(true);
    expect(underPrefix('/admin/users', ADMIN_PREFIXES)).toBe(true);
    expect(underPrefix('/administrator', ADMIN_PREFIXES)).toBe(false); // no false prefix match
    expect(underPrefix('/account', PROTECTED_PREFIXES)).toBe(true);
    expect(underPrefix('/', PROTECTED_PREFIXES)).toBe(false);
  });
});
