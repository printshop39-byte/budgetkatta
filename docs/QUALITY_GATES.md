# Quality Gates — mandatory for every EPIC

> **Rule of record (founder, Sprint 1):** *No feature is considered complete until it passes ALL quality gates below. Never mark a task complete based only on successful compilation.* Completion = compile **+ runtime test + edge cases + regression check + mobile test.*

## The 10 gates (all must pass)
| # | Gate | How it's checked |
|---|------|------------------|
| 1 | TypeScript compile = **0 errors** | `npx tsc --noEmit` |
| 2 | ESLint = **0 errors** | `npm run lint` |
| 3 | Unit tests pass | test runner (added this sprint) |
| 4 | Mobile responsive | preview @ 375px |
| 5 | Dark mode verified | preview, `data-theme` light + dark |
| 6 | Marathi + English verified | toggle both locales |
| 7 | Accessibility (keyboard + labels) | tab-order, focus-visible, aria/labels |
| 8 | Security review | authz, input validation, secrets, rate-limit |
| 9 | Performance impact measured | bundle/route impact noted |
| 10 | Documentation updated | CHANGELOG + relevant docs |

A single failing gate ⇒ the EPIC is **not** complete.

## Workflow per EPIC
```
Build (small commits) → Quality gates → Self-review checklist →
Code Review → QA (runtime + edge + regression + mobile) → Merge (PR) → next EPIC
```
- **EPIC order:** 1 Auth → 2 Profile → 3 Memory → 4 Analytics+Security. One at a time; merge before the next.

## Git / GitHub rules
- ❌ **No direct push to `main`.**
- ✅ Feature branch per sprint/EPIC (`sprint-1-foundation`).
- ✅ **Small, scoped commits** — e.g. `feat(auth): Google OAuth setup`, `feat(auth): Phone OTP`, `test(auth): auth flow`. Small commits = easy rollback.
- ✅ Pull Request + self-review checklist.
- ✅ Merge only after all checks pass.

## Self-review checklist (paste into each PR)
- [ ] Gates 1–10 pass (evidence attached)
- [ ] Runtime tested (happy path + ≥2 edge cases)
- [ ] No regression in existing pages (spot-checked)
- [ ] No secrets committed; `.env.example` updated
- [ ] Bilingual + dark mode + mobile screenshots
- [ ] CHANGELOG updated
