# Changelog

All notable changes to BudgetKatta are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).
Sprint builds are tagged as `v1.0.0-alpha.N` (one per completed sprint).

## [Unreleased] — Sprint 1 · Foundation
Branch: `sprint-1-foundation`. Scope: EPIC 1 Auth · EPIC 2 Profile · EPIC 3 Memory · EPIC 4 Analytics+Security. Nothing outside these four EPICs.

### Added
- **Authentication (EPIC 1)** — Auth.js v5 with **Google Sign-In + Phone OTP**:
  - Phone OTP: salted-SHA-256 storage, 5-min TTL, 5-attempt lockout, 30s resend cooldown, per-phone + per-IP rate limits; MSG91 sender with a dev console fallback.
  - Upstash Redis KV with a `globalThis`-shared in-memory dev fallback (`lib/redis.ts`).
  - Edge-safe/full config split (`lib/auth.config.ts` + `lib/auth.ts`) so Mongoose stays out of the edge middleware.
  - `middleware.ts` protects `/dashboard|/account|/onboarding|/memory|/admin` and redirects to `/signin` (replaces the public-flag admin gate — audit fix).
  - Bilingual, themed, accessible sign-in UI (`/signin`) + protected `/account`; user persisted/linked in MongoDB via `lib/userService.ts`.
  - Verified end-to-end at runtime (OTP → session → protected route), dark/light, mobile, mr/en.
- **Security headers** (`next.config.mjs`): HSTS, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy (mic/geo allowed for voice-search + locator), X-DNS-Prefetch-Control, and a **Report-Only** Content-Security-Policy. (Verified present on live responses.)
- **Data models**: `User`, `FinancialProfile` (money in integer paise), `MemoryFact` (AI memory substrate).
- **Testing**: Vitest added with 12 unit tests for phone normalization + the OTP lifecycle. ESLint configured (`.eslintrc.json`).
- **Environment**: all Sprint 1 vars documented in `.env.example` (auth, MSG91 OTP, Upstash Redis, analytics, PII key), including the previously-undocumented `ADMIN_API_TOKEN`.
- Quality-gate process (`docs/QUALITY_GATES.md`) and this changelog.

### Fixed
- **Audit finding — missing security headers**: addressed (CSP ships Report-Only first, then enforced after tuning).
- **Audit finding — weak admin gate**: `/admin` now requires an authenticated session via `middleware.ts` (was a public env flag).
- Renamed a reserved `module` variable in `app/api/rates/route.ts` (drive-by lint fix surfaced by adding ESLint config).

### Known issues
- CSP is **Report-Only** pending violation review before enforcement.
- Google OAuth and MSG91 SMS require credentials to be set; without them, Google is hidden-by-config and OTP uses the dev console fallback.
- Remaining Sprint 1 work: EPIC 2 (Profile), EPIC 3 (Memory), EPIC 4 (analytics + Redis rate-limit refactor + PII encryption).

### Notes
- Strategy documents frozen at **v1.0** (`docs/VERSION.md`) — execution-only from here.
