# 06 · Roadmap & Implementation Plan

Sequenced by the strategy rule: **retention core first, engagement depth next, monetization last.** Estimates assume a small team (1–2 full-stack). Timeboxes are indicative, not commitments.

## Phase map — named company chapters
Aligned to the [company operating manual](../company/00-operating-manual.md) §7. Each phase advances a moat and ends with a gate.

| Phase | Weeks | Ships | Moats |
|-------|:-----:|-------|-------|
| **FOUNDATION** | 1–6 | **Only:** Auth (Google+OTP) · Profile + **Memory** substrate · Analytics · Security/audit fixes. **No Score/calc/blog.** | M1 |
| **INTELLIGENCE** | 7–14 | Health Score (1000) · **Knowledge Graph** · Life Events · Goals · score-home dashboard | M3, M2, M1 |
| **ENGAGEMENT** | 15–22 | Monthly AI Reports · Reminders/Push · Timeline · Gamification · **Multi-Agent (first agents)** · AI Actions · Vault · Chat | M4, M1 |
| **MARKETPLACE** | 23–30 | Subscription (Money Coach) · Financial Marketplace (CA/insurance/loan/MF) · Contextual Affiliate · Family Mode | M5, M4 |
| **PLATFORM** | 31+ | API · White-label · Enterprise · Account Aggregator · more agents | M2, M3, M5 |

Each phase ends with a **retention/moat gate**: don't advance to Marketplace monetization if D7 < 25% — deepen the loop first.

> ### 🔒 Foundation scope lock (founder directive)
> The first milestone ships **ONLY: Auth · Profile · Memory · Analytics/Security/fixes** — and **zero new calculator or blog features.** The existing public calculators/SEO pages keep running untouched (they feed the funnel). **Health Score moved up to Intelligence** (it belongs with the Knowledge Graph); a *minimal* profile + app shell ships in Foundation only because Memory needs a data substrate. Everything else is deferred until the foundation is solid.

---

## FOUNDATION (Weeks 1–6) — *the substrate; advances M1 Memory*
*Make the OS stateful, remembering, safe, and observed. No Score, no new calculators/blog. The load-bearing wall.*

**1 — Authentication (Google + Phone OTP)**
- Auth.js v5: Google OAuth **and** Phone-OTP (MSG91), both day one; account-linking by verified email/phone.
- OTP store + rate limit in Upstash Redis; JWT session, PWA-friendly; `middleware.ts` guards `(app)` + admin (replaces public-flag admin — closes audit finding).
- `User` (+`googleId`, `householdId?`) + `Subscription(plan=free)` on signup. Progressive auth: existing calculators stay anonymous.

**2 — Memory substrate + profile**
- `FinancialProfile` (F2): skippable, saved onboarding wizard, Zod-validated, completion %.
- `MemoryFact` store (F12, foundational): structured facts written from profile; user-visible "what the CFO remembers" screen (view/edit/delete). *Chat/document writers arrive in Engagement.*
- Route groups: `app/(public)` (move current pages, untouched) + `app/(app)` (member shell + minimal dashboard placeholder).

**3 — Analytics**
- GA4 + Clarity + Meta Pixel/CAPI, Search Console, **consent-gated** loading (fixes cookie/GA mismatch). Full funnel instrumented before anything is optimized.

**4 — Security & audit critical fixes**
- `headers()` + middleware (CSP/HSTS/X-Frame/etc.); `lib/rateLimit.ts` → Redis; fail-close `/api/rates` *(task already running)*; begin PII encryption on profile/memory.

**Exit (foundation solid):** sign in via Google *and* OTP; session persists across PWA reloads; profile saved; the CFO can recall a stored fact; analytics events fire; securityheaders.com grade A. **No Score, no new calculator/blog shipped.**

---

## INTELLIGENCE (Weeks 7–14) — *the brain; advances M3 Graph, M2 Regional, M1*
*Now the data gets smart — it reasons, it doesn't just report.*

- **Knowledge Graph (F18):** `lib/knowledgeGraph.ts` projects profile+memory into typed nodes/edges; deterministic, tested. This is the reasoning substrate the Score and agents use.
- **Health Score (F3):** `lib/healthScore.ts` (pure, 1000-scale, reuses `calculators.ts`), pillars computed as **graph queries**; `ScoreSnapshot` + weekly cron → trend; Gemini narration (grounded, reads memory + graph, disclaimer, fallback).
- **Life Events Engine (F11):** life-event graph + playbooks; infer stage; declare-an-event → auto-build plan; injects nodes/edges into the graph. Seed the **Regional Intelligence** data (co-op banks, district/Maharashtra schemes) here — it feeds life-events + recommendations (M2).
- **Goals (F5):** model, templates, projections (SIP/RD math), contribution logging → graph/score/memory update.
- **Score-home dashboard (F4):** score dial, delta, next-best-action, trend, memory + graph-gap summary.

**Exit (activation gate):** activation ≥ 55%, first Score + ≥1 life-event mapped per activated user, D7 ≥ 25%, weekly Score re-check ≥ 40%. If not met, iterate before Engagement.

---

## ENGAGEMENT (Weeks 15–22) — *the habit; advances M4 Agents, M1*
*Make it feel like a CFO: it reminds, records, does work, and speaks as a fleet of specialists.*

- **Multi-Agent System (F19), first agents:** Orchestrator + Goal/Insurance/Loan agents over shared memory+graph; reconciled answers; confirm-before-mutate. This is where the AI CFO becomes an orchestra.
- **AI Actions (F14):** allow-listed toolset (createReminder, generateReportPDF, comparePolicy, findBetterFD, suggestSIP…), `ActionLog`.
- **Monthly AI Reports (F8):** report cron; deterministic data + agent/graph narrative; PDF via existing headless-Chrome pipeline; free teaser vs full; email/push. *(Report authoring lands here; the paywall lands in Marketplace.)*
- **Reminders + Push (F6):** `Reminder` model + scheduler (Vercel Cron/QStash), Web Push via existing SW, consent controls, idempotent sends.
- **Document Vault + AI summary (F7)** & **Memory writers (F12 full):** encrypted storage; AI extracts document summaries + chat facts → `MemoryFact`s.
- **Financial Timeline (F13)** & **Gamification (F16):** autobiography + points/streak.
- **Context-aware Chat (F10):** routed through the orchestrator; guardrails + per-user quota.

**Exit (retention gate):** D30 ≥ 15%, push opt-in ≥ 40%, memory facts/user growing MoM, ≥1 AI action + ≥1 multi-agent interaction per active user.

---

## MARKETPLACE (Weeks 23–30) — *the money; advances M5, M4*
*Only now, riding on a working habit loop and real trust. Revenue diversifies (see manual §6: 35/30/20/10/5).*

- **Subscription — "Money Coach / Plus" (F8):** Razorpay subscriptions + webhooks → `Subscription`; paywall/limits; grace/dunning; ₹149/mo, ₹999/yr. *(Target 35% of revenue.)*
- **Financial Marketplace (F17):** CA / insurance / loan / MF categories first; vetted regional (Marathi) providers; agent handoff → booking → take-rate; notes back to memory. *(Target 30%.)*
- **Contextual Affiliate (F9):** rule engine mapping graph gaps → offer libs; relevance gate + frequency cap + new-user suppression; `RecommendationEvent` attribution; populate real links. *(Target 20%.)*
- **Family Mode (F15):** `Household`/`FamilyMember`, per-member profiles + roll-up, granular privacy — retention + native referral.

**Exit:** subscription + marketplace live and revenue-mixing; Plus 2–4% of MAU, marketplace bookings flowing, family added by ≥15% of owners, no retention regression.

---

## PLATFORM (Weeks 31+) — *the empire; advances M2, M3, M5*
- **B2B / API / White-label:** expose calculators, Score, and select agent capabilities to banks / co-ops / advisors. *(Target 10%.)* + **Education** revenue (Marathi courses/content, target 5%).
- **Account Aggregator** (Setu/Finvu, FIU partner) → verified auto-updating data (revisit compliance).
- **More agents** (Tax, Investment, Retirement, Document) + marketplace categories (lawyer, property, estate).
- WhatsApp reminders/broadcast; programmatic local-SEO engine (from the audit) feeding signups.

---

## Migration from today's codebase (concrete)
| Existing | Action in 2.0 |
|----------|---------------|
| `app/*` public pages | Move under `app/(public)`; keep indexable |
| `components/FinancialHealthQuiz.tsx` | Refactor into persistent Profile+Score flow (data now saved to profile + memory) |
| Auth | New: Auth.js v5 with **Google OAuth + Phone OTP** (both), account-linking |
| `lib/calculators.ts` | Import into `lib/healthScore.ts` & Goal projections (no change to formulas) |
| `lib/gemini.ts` | Add `generateScoreNarration()` & `generateMonthlyReport()`; reuse disclaimer + fallback |
| `lib/rateLimit.ts` | Swap in-memory Map → Redis adapter (same interface) |
| `lib/affiliate.ts` + offer libs | Wrap in a rule-driven `recommendationEngine.ts`; add attribution |
| `lib/documentChecklists.ts` | Power Vault checklist mode |
| `lib/leadAutomation.ts` (n8n) | Reuse for server-side CAPI + partner lead routing |
| `models/*` | Keep as reference data; add new user-owned models |
| `public/sw.js` | Extend for Web Push |
| `lib/i18n.ts` | Add keys for all new surfaces (blanket bilingual) |

**Principle:** additive, behind route groups and feature flags — the current public site keeps working and earning SEO throughout.

---

## Workstream / ticket seeds (FOUNDATION only)
```
EPIC Auth (Google + Phone OTP)
  - OTP request/verify API + Redis store + rate limit
  - Auth.js v5 (Google OAuth + Credentials OTP), account-linking, session
  - middleware.ts guard for (app) + admin (real roles)
  - Sign-in UI (bilingual), progressive-auth triggers
EPIC Profile + Memory substrate
  - FinancialProfile model + Zod + skippable onboarding wizard + completion %
  - MemoryFact model + write-from-profile + "what the CFO remembers" screen
  - Route groups: move pages to (public); create (app) shell + dashboard placeholder
EPIC Analytics
  - GA4 + Clarity + Meta CAPI + Search Console, consent-gated
EPIC Security
  - next.config headers() + middleware security headers
  - Upstash Redis; refactor rateLimit interface; fail-close /api/rates
  - begin PII encryption (profile, memory)

EXCLUDED from Foundation (do NOT start): Health Score, Knowledge Graph, new
calculators, blog, goals, life events, reminders, vault, timeline, agents,
reports, family, affiliate, marketplace. (Score + Graph start in INTELLIGENCE.)
```

## Team, cost & risk (indicative)
- **Team:** 1–2 full-stack, part-time design/QA. Phases 0–3 ≈ 4–5 months.
- **New run-cost:** MongoDB Atlas, Upstash Redis, SMS (per-OTP), object storage, Gemini usage, Razorpay fees, email — modest at MVP scale; SMS and Gemini scale with users (cap both).
- **Top risks & mitigations:**
  - *Onboarding drop-off* → skippable steps, partial scoring, ranges.
  - *Gemini cost/latency* → deterministic core, per-user caps, cached narration, fallback.
  - *Notification fatigue* → frequency caps, value-first reminders, user controls.
  - *Compliance drift* → keep the educational/execution-only boundary; legal review before any "advice" or money custody.
  - *Retention shortfall* → phase gates; don't monetize a leaky bucket.

## Definition of Done for this PRD stage
- [x] Positioning locked: **AI Financial Operating System (Marathi-first)** / AI CFO.
- [x] Decisions ratified: **auth = Google + Phone OTP**, score = 1000-scale, data = manual+upload (v1), AI = hybrid.
- [x] Phase 0 scope locked to the **4 founder deliverables** (no new calculator/blog).
- [ ] Schema reviewed; index/encryption plan agreed.
- [ ] Health Score weights sanity-checked against 8–10 real sample profiles.
- [ ] Phase 0 (D1–D4) tickets estimated and scheduled.
- [ ] Only then: begin production code, Phase 0 first.
