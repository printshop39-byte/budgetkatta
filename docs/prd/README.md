# BudgetKatta — Documentation Suite

> **Start at the top of the pyramid:** 📕 **[The 10-Year Operating Manual](../company/00-operating-manual.md)** — the *company* thesis (moats, category, brand, revenue, 10-year arc). It sits **above** this feature PRD. The manual answers *"what company are we building?"*; the PRD answers *"what do we build?"*

**What we are building:** India's Marathi-first **AI Financial Operating System** (internal) / **AI Money Coach** (public) — a lifelong financial companion for every Maharashtra family, engineered as a stack of five defensible moats. Not a website, calculator, blog, or affiliate portal. Think **CRED × Notion × Duolingo** for money; category to create: *"The Marathi AI Financial Companion for Every Family in Maharashtra."*

**The five moats** (see manual): **M1** Financial Memory · **M2** Regional Maharashtra Intelligence · **M3** Financial Knowledge Graph · **M4** Multi-Agent AI System · **M5** Financial Marketplace. *Every feature must strengthen ≥1 moat or it isn't built.*

**Sequencing rule (non-negotiable):** grow retention first; monetize after the habit works, diversified (Subscription 35 / Marketplace 30 / Affiliate 20 / B2B 10 / Education 5).

This suite is the plan to build **before** production code. Read in order.

| Layer | Document | What it answers |
|-------|----------|-----------------|
| 🏛 Company | [The 10-Year Operating Manual](../company/00-operating-manual.md) | Moats, category creation, brand, revenue architecture, 10-year arc, ₹1000cr thesis |
| Vision | [00 · Vision & Strategy](01-vision-strategy.md) | OS/CFO positioning, founder vision, Life-Events principle, North-Star |
| Product | [01 · Product Requirements](02-product-requirements.md) | All 19 features (F1–F19) with acceptance criteria + moat mapping |
| Moat M4 | [10 · Multi-Agent AI System](10-agent-system.md) | The AI CFO + specialist agent fleet architecture |
| Moat M3 | [09 · Financial Knowledge Graph](09-knowledge-graph.md) | Money as a reasoning graph (nodes/edges) |
| CFO layer | [07 · The AI CFO Layer](08-ai-cfo-layer.md) | Life Events + Memory + Timeline + AI Actions + Gamification interlock |
| Journeys | [02 · User Journeys](03-user-journeys.md) | Onboarding, daily/weekly loops, life-event, upgrade, privacy |
| Data | [03 · Data Model](04-data-model.md) | Mongoose schemas incl. OS-layer collections, migration |
| Score | [04 · Health Score Spec](05-health-score-spec.md) | Deterministic **0–1000** algorithm + AI narration |
| Arch | [05 · Architecture, Security & Compliance](06-architecture-security-compliance.md) | System design, auth, memory/agentic layer, PII/DPDP, SEBI boundary |
| Plan | [06 · Roadmap & Implementation](07-roadmap-implementation.md) | Named 5-phase company arc, Foundation scope-lock, tickets |

## Decisions — RATIFIED (2026-07-06)

| Decision | Locked value | Why |
|----------|--------------|-----|
| **Positioning** | AI Financial OS (internal) / **AI Money Coach** (public) — *founder to ratify public name* | OS is jargon to a homemaker; "Money Coach / आर्थिक साथीदार" is warm & mass-market |
| **Strategy** | Category creator, not incumbent challenger | A category of one has pricing power & no parity race |
| **Moats** | M1 Memory · M2 Regional · M3 Graph · M4 Agents · M5 Marketplace | The company *is* the moat stack |
| **Auth** | **Google Sign-In + Phone OTP (both, day one)** | Google = 10-sec onboarding; OTP = Indian backup + mobile/WhatsApp |
| **Health Score** | 0–**1000** scale | Granularity; CIBIL-like familiarity; improve toward a target |
| **Data ingestion** | Manual + document upload (v1) | Not an RBI AA; ships fast — AA in Platform phase |
| **AI posture** | Hybrid — rules compute, AI explains & acts | Explainable/auditable for YMYL finance |
| **Revenue mix** | Sub 35 / Marketplace 30 / Affiliate 20 / B2B 10 / Edu 5 | No single-channel dependence |

## 🔒 FOUNDATION scope lock (founder directive)
The first milestone ships **only: Auth (Google+OTP) · Profile + Memory · Analytics · Security/audit fixes** — and **no new calculator/blog.** Health Score moved up to the **Intelligence** phase (it belongs with the Knowledge Graph). Everything else is deferred until the foundation is solid, so each later feature reinforces the others. Phases are named company chapters: **Foundation → Intelligence → Engagement → Marketplace → Platform.**

## What we deliberately are NOT building in v1
- No real-time bank connectivity (AA) — manual + upload only.
- No personalized *investment advice* ("buy fund X") — stays educational/informational to avoid SEBI RIA registration. See [compliance](06-architecture-security-compliance.md).
- No in-house payments/lending — affiliate + lead referral only.
- No native mobile app — PWA first (the codebase is already a PWA).

## How this reuses what already exists
BudgetKatta already ships a competent Next.js 14 + MongoDB + Gemini codebase. This is an **evolution, not a rewrite**. Major reuse:
- `lib/calculators.ts` → powers Health Score sub-components (formulas already verified correct).
- `components/FinancialHealthQuiz.tsx` (today: throwaway stateless quiz) → becomes the **persistent, tracked-over-time Health Score** — the retention spine.
- `lib/gemini.ts` → extended for report generation & contextual explanations (disclaimer machinery already in place).
- `lib/i18n.ts` → all new surfaces stay bilingual (mr/en).
- `lib/affiliate.ts` + offer libs → become the **contextual recommendation** engine (surfaced by score/goal gaps, not by page).
- `lib/documentChecklists.ts` → informs the **Document Vault** required-doc lists.
- PWA (`public/sw.js`, service worker) → push notifications for reminders/streaks.
