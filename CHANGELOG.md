# Changelog

All notable changes to BudgetKatta are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — Home-finance focus & Financial Readiness for a Home Goal (P0)

> **Scope note (2026-07):** the homepage was **refocused on home finance** — home loan, EMI, property budget and home/property insurance for Maharashtra. The **Financial Readiness for a Home Goal** check (P0) is the entry point. Off-scope promotions (FD, SIP, demat, credit cards, education/women loans, gold rates) are **hidden** from the homepage via a reversible config — their routes, data and SEO pages are **preserved and still reachable**. Score scale is **0–1000**.

### Added
- **Financial Readiness for a Home Goal** `/health-check` (public — no login/OTP/card): a 6-step bilingual (Marathi/English) wizard (`components/health/MoneyHealthCheck.tsx`) over a deterministic, explainable 0–1000 engine (`lib/healthScore.ts`; versioned thresholds in `lib/healthScoreConfig.ts`, each an "educational estimate"; golden-fixture unit tests in `lib/healthScore.test.ts`) with a value-preserving `sessionStorage` store (`store/healthCheckStore.ts`). The result (`components/health/HealthResult.tsx`) shows the score, band + confidence, a "Why this score?" pillar breakdown, top priority and first action. It is a **preliminary educational estimate — not a CIBIL score, not a property-specific eligibility report, and not a loan approval or sanction**; it does **not** calculate a property budget.
- **Home-finance homepage** (`app/page.tsx`; sections gated by a reversible `lib/homepageConfig.ts`): hero, readiness promo, Buy/Build/Transfer, property tools, home-insurance guide, official sources and a focused FAQ. Tools are classified honestly:
  - **Available** (working routes): Home Loan EMI Calculator (`/loans#loan-calc`), Property Document Checklist (`/documents`), and the six-step financial-readiness flow.
  - **Educational guide:** Home Insurance — on-page educational content only (no premium calculation, comparison or lead capture; IRDAI disclaimer).
  - **Illustrative:** the homepage hero and promo score previews — hardcoded and prominently labelled "not calculated from your data, not a loan offer".
  - **Coming next** (shown but not linked): Home Loan Eligibility, Safe Property Budget, Down-Payment Planner, Plot + Construction Loan, Construction Finance, Balance Transfer, Stamp Duty & Registration.
- **Focused bilingual FAQ** whose visible questions match the homepage FAQ JSON-LD, plus **verified official-source links** (RBI, NHB, MahaRERA project search, IGR Maharashtra, IRDAI policyholder) with last-verified dates and a "not affiliated" note.
- **Homepage chatbot hidden** (it promoted FD/SIP and forwarded leads); the guide stays available and unchanged on every other route. New hero/promo/final-CTA (`components/HeroSection.tsx`, `components/home/MoneyHealthPromo.tsx`, `FinalHealthCTA.tsx`); the sample `FinancialHealthQuiz` and placeholder `Testimonials` stay off the homepage (components kept, not deleted).
- **Consent-gated analytics** `lib/analytics.ts` — funnel event names; fires only after cookie-consent; PII/financial-field guard; no provider wired.
- **OG image** moved to the **edge runtime** (`app/opengraph-image.tsx`) so the standard `next build` completes on all platforms.

### Changed
- **Light-mode readiness alerts** — urgent/error text made theme-safe with inline theme-aware colours (readable in both themes) without a global override.

### Notes
- **Not live:** payments, the ₹99 report, partner leads, and any production deployment.
