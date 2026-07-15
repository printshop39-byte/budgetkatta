// lib/homepageConfig.ts
// ────────────────────────────────────────────────────────────────────────────
// Reversible homepage visibility configuration (2026-07 scope narrowing).
//
// BudgetKatta's homepage was narrowed to "Home Finance, Home Insurance &
// Property Budget" for Maharashtra. Non-home-finance categories (FD, SIP,
// mutual funds, demat/broker & credit-card offers, women/education loan
// finders, gold/silver rates, generic financial-literacy) are HIDDEN from the
// homepage here — they are NOT deleted. Their routes, components, data and SEO
// pages remain intact and directly accessible; only their appearance on the
// homepage is gated by the flags below.
//
// FLAG TYPE: COMPILE-TIME. These are plain TypeScript constants bundled into the
// build. Changing a flag here requires a REBUILD and REDEPLOY to take effect —
// it is NOT a runtime, environment-driven, or database-driven toggle, and it
// cannot be changed on a live deployment without shipping a new build.
//
// To RESTORE a hidden section later: flip its flag back to `true`, then rebuild
// and redeploy. No component needs re-implementing — every component is still
// imported by app/page.tsx; the flag only decides whether it renders.
// ────────────────────────────────────────────────────────────────────────────

export const HOMEPAGE_SECTIONS = {
  // ── Home-finance scope (visible) ─────────────────────────────────────────
  hero: true, //                Property-budget & EMI-capacity hero
  readinessPromo: true, //      Home Finance Readiness promo (was Money Health)
  buyBuildTransfer: true, //    Buy a home / Build a home / Transfer loan choices
  propertyTools: true, //       Property-focused tools grid (Available/Coming next)
  homeInsurance: true, //       Home & property insurance (educational only)
  officialSources: true, //     RBI / NHB / MahaRERA / IGR Maharashtra / IRDAI
  trust: true, //               Privacy & official-source trust badges
  finalReadinessCta: true, //   Closing readiness CTA
  faq: true,

  // ── Hidden in the narrowed scope (restore by flipping to true) ────────────
  popularTools: false, //       FD / SIP / gold / women / student shortcuts
  segmentEntryCards: false, //  Women & student loan finders
  calculatorsHub: false, //     Multi-tab SIP/FD/EMI/Insurance/Budget/Goal hub
  smartAdvisory: false, //      Generic investment/loan/insurance Q&A
  educationHub: false, //       Generic financial-literacy cards
  bentoGrid: false, //          SIP/FD/EMI/Insurance feature cards
  scrollMorphCoin: false, //    Decorative "power of investing" animation
  brokerOffers: false, //       Demat / broker affiliate offers
  creditCardOffers: false, //   Credit-card affiliate offers
} as const;

export type HomepageSection = keyof typeof HOMEPAGE_SECTIONS;
