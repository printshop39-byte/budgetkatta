// Regression guards for the two pre-production hardening fixes
// (fix(ui): harden mobile navigation and readiness flow). The test env is
// node-only (no DOM/render harness and no JSX-transform plugin), so these read
// component source and fail if either fix is reverted. Behavioural coverage of
// the progression primitives lives in store/healthCheckStore.test.ts.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('readiness wizard progression does not depend on animation', () => {
  const src = read('components/health/MoneyHealthCheck.tsx');

  it('imports no animation library (framer-motion) in the wizard', () => {
    // No AnimatePresence exit gate / motion component => Continue/Back never wait
    // on an exit animation or a requestAnimationFrame callback to complete.
    expect(src).not.toMatch(/from ['"]framer-motion['"]/);
  });

  it('renders the current step keyed by id so it swaps immediately', () => {
    expect(src).toMatch(/<div key=\{current\.id\}>/);
  });

  it('derives the on-screen step purely from the store step (content follows state)', () => {
    expect(src).toMatch(/const current = STEPS\[Math\.min\(step, STEPS\.length - 1\)\]/);
  });

  it('gates Continue on the current step validator before advancing (blocks invalid input)', () => {
    // validate() runs first; on an error it returns early WITHOUT calling goTo,
    // so an invalid required answer never advances the step.
    expect(src).toMatch(/current\.validate\?\.\(answers\)/);
    expect(src).toMatch(/if \(err\) \{\s*setError\(err\);\s*return;/);
  });
});

describe('mobile navbar has no fixed-width overflow pattern', () => {
  const src = read('components/layout/Navbar.tsx');

  it('shows a compact 2-letter language code on narrow screens, full name from sm', () => {
    expect(src).toMatch(/className="sm:hidden"/); // compact मर / EN
    expect(src).toMatch(/className="hidden sm:inline"/); // मराठी / English
  });

  it('keeps the full language name in aria-label for assistive tech', () => {
    expect(src).toMatch(/aria-label=\{lng === 'mr' \? 'मराठी भाषा' : 'English language'\}/);
  });

  it('uses responsive horizontal padding on the nav bar (tighter on narrow)', () => {
    expect(src).toMatch(/px-3 py-3 sm:px-4/);
  });

  it('keeps the controls row from shrinking/wrapping (shrink-0 + tight gap)', () => {
    expect(src).toMatch(/flex shrink-0 items-center gap-1\.5 sm:gap-2/);
  });
});
