// Regression guards for the mobile-navigation and readiness-flow hardening
// fixes (navbar width, wizard rendering, and the animation-free mobile drawer).
// The test env is node-only (no DOM/render harness and no JSX-transform plugin),
// so these read component source and fail if a fix is reverted. Behavioural
// coverage of the progression primitives lives in store/healthCheckStore.test.ts.
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

describe('mobile navigation drawer has no animation dependency', () => {
  const src = read('components/layout/Navbar.tsx');

  it('imports/uses no animation library (framer-motion / AnimatePresence / motion)', () => {
    // Visibility must never wait on an enter/exit animation, an animation
    // callback or requestAnimationFrame.
    expect(src).not.toMatch(/from ['"]framer-motion['"]/);
    expect(src).not.toMatch(/<AnimatePresence/);
    expect(src).not.toMatch(/<motion\./);
  });

  it('renders the overlay + drawer conditionally from the mobile-open state', () => {
    expect(src).toMatch(/\{open && \(/);
    expect(src).toMatch(/\{open && \(([\s\S]*?)<aside/); // aside lives inside the open guard
  });

  it('renders the drawer in its final visible position — closed drawer is absent, not parked off-screen', () => {
    expect(src).not.toMatch(/translate-x-full/);
    expect(src).not.toMatch(/x:\s*['"]100%['"]/);
    expect(src).toMatch(/<aside[\s\S]*?className="fixed right-0 top-0/);
  });

  it('keeps aria-expanded + aria-controls on the hamburger and a matching id on the drawer', () => {
    expect(src).toMatch(/aria-expanded=\{open\}/);
    expect(src).toMatch(/aria-controls="mobile-nav-drawer"/);
    expect(src).toMatch(/id="mobile-nav-drawer"/);
  });

  it('keeps every close path: Close button + overlay (closeMenu), Escape, and link selection', () => {
    expect(src).toMatch(/if \(e\.key === 'Escape'\) closeMenu\(\)/); // Escape
    expect(src).toMatch(/onClick=\{closeMenu\}/); // Close button + overlay
    expect(src).toMatch(/onClick=\{\(\) => setOpen\(false\)\}/); // link selection
    expect(src).toMatch(/aria-label="Close menu"/); // close button accessible name
  });

  it('locks background scroll while the drawer is open', () => {
    expect(src).toMatch(/document\.body\.style\.overflow = 'hidden'/);
  });
});
