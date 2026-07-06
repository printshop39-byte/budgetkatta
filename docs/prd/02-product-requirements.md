# 01 · Product Requirements

Every feature below lists: **Purpose · User story · Requirements · Acceptance criteria · Reuse.** Priority tags: **P0** (MVP retention core), **P1** (engagement depth), **P2** (monetization / later).

Bilingual (mr/en) is a blanket requirement on every user-facing string — route all copy through `lib/i18n.ts`.

---

## F1 · Authentication & Account (P0)
**Purpose:** Turn anonymous visitors into members with persistent state — the precondition for everything.

**User story:** *As a visitor, I sign in with my phone number and an OTP so my financial data is saved and private to me.*

**Requirements**
- Phone-OTP primary (SMS via MSG91/Twilio). Google OAuth optional secondary.
- Session via Auth.js (NextAuth v5) with JWT strategy + MongoDB adapter.
- Progressive auth: users can use calculators anonymously; sign-in is required only to **save** a result, set a goal, or view a score history. (Preserves the SEO/top-of-funnel value of the current site.)
- Account settings: language, notification prefs, delete account (DPDP right to erasure), export my data.

**Acceptance criteria**
- OTP delivered < 10s; 3 attempts, 30s resend cooldown, rate-limited server-side.
- Session persists across PWA reloads; logout clears client state.
- Deleting an account hard-deletes PII within the DPDP window and revokes sessions.

**Reuse / new:** New (`lib/auth.ts`, `middleware.ts`). Rate-limit reuses `lib/rateLimit.ts` (must move to Redis — see architecture).

---

## F2 · Financial Profile (P0)
**Purpose:** The data foundation for the Score and all personalization.

**User story:** *As a new member, I answer a short, friendly set of questions about my money so the app can assess my situation.*

**Requirements**
- Onboarding wizard, ≤ 6 steps, each skippable, progress-saved. Steps:
  1. Basics — age, city/district, dependents, employment type.
  2. Income — monthly take-home (range slider OK to reduce friction).
  3. Expenses — monthly essentials (or 50/30/20 estimate).
  4. Savings & investments — bank balance, FD, SIP/MF, EPF, other (self-reported buckets).
  5. Debt — loans/EMIs, credit-card outstanding.
  6. Protection — life & health insurance cover amounts (or "none").
- Every field optional; Score computes on whatever exists and shows **"complete X to unlock Y points of accuracy."** (Missing-data → engagement hook.)
- Data editable anytime; each edit re-computes Score and is versioned (for the trend line).

**Acceptance criteria**
- Profile completion % is visible and drives an activation nudge.
- Partial profile still yields a Score with a confidence indicator.
- All monetary inputs validated (Zod) and stored in paise/integer to avoid float drift.

**Reuse:** Evolves the inputs already collected by `components/FinancialHealthQuiz.tsx`.

---

## F3 · AI Financial Health Score (P0) — *the spine*
**Purpose:** One memorable number that answers "how am I doing?" and improves over time. Full algorithm in [05-health-score-spec.md](05-health-score-spec.md).

**User story:** *As a member, I see my Financial Health Score (0–1000), what's dragging it down, and exactly what to do to raise it.*

**Requirements**
- **Deterministic** 0–1000 score (credit-score-like scale, culturally familiar), computed from 6 weighted pillars: Savings rate, Emergency fund, Debt load, Insurance adequacy, Investment/goal progress, Credit health.
- Band labels (bilingual): Needs Attention / Fair / Good / Strong / Excellent.
- **Sub-scores** per pillar with a plain-language "why."
- **AI narration layer (Gemini):** turns the deterministic breakdown into 3–5 personalized, prioritized nudges ("Your emergency fund covers 0.8 months; aim for 6. Start a ₹3,000/mo RD.") — *explains*, never invents the number.
- **History & trend:** every recompute stored → line chart over weeks/months. This is the return hook.
- Disclaimer on every score view (reuse existing SEBI/IRDAI/RBI disclaimer machinery): *informational, not personalized advice.*

**Acceptance criteria**
- Same inputs always → same score (pure function, unit-tested).
- Each pillar shows current value, target, and point-impact of closing the gap.
- AI nudges are grounded in the user's actual numbers (passed as structured context, temperature low) and carry the disclaimer.
- Score recomputes on profile edit and on a weekly cron (to reflect goal progress / time decay of stale data).

**Reuse:** `lib/calculators.ts` for sub-computations; `lib/gemini.ts` for narration.

---

## F4 · Personal Dashboard (P0)
**Purpose:** The logged-in home — a glanceable command center that makes returning feel worthwhile.

**User story:** *As a member, I open the app and instantly see my score, my goals' progress, and the one thing to do today.*

**Requirements**
- Above the fold: Score dial + weekly delta; "Next best action" card; streak indicator.
- Cards: Goals progress, upcoming Reminders, latest Report teaser, contextual recommendation slot (see F9, only if relevant).
- Empty states are onboarding prompts, not blanks ("Set your first goal →").
- Fully responsive/PWA; loads fast (server components + skeletons).

**Acceptance criteria**
- First meaningful paint shows score without layout shift.
- "Next best action" is deterministic-ranked from open nudges/goals/reminders.
- Works offline-first for last-known state (PWA cache).

**Reuse:** New route `app/(app)/dashboard`; charts, existing Icon registry, theming.

---

## F5 · Goals (P0)
**Purpose:** Convert intent into a tracked, recurring commitment — the strongest retention lever after the Score.

**User story:** *As a member, I set a goal (emergency fund, house down-payment, child's education, car, retirement) and track monthly progress toward it.*

**Requirements**
- Goal templates with sensible defaults (target amount, horizon) + custom goals.
- Each goal: target ₹, target date, current saved, monthly contribution, linked instrument suggestion (FD/RD/SIP via reused calculators for projection).
- Projection: "At ₹X/mo you'll reach ₹Y by [date]" using SIP/RD math (reuse `calculateSIP`).
- Monthly "log your contribution" prompt → updates progress bar, feeds Score's investment pillar.
- Goal completion = celebration moment (shareable → referral loop).

**Acceptance criteria**
- Projection matches calculator math exactly.
- Logging a contribution updates goal, dashboard, and Score in one action.
- On-track / behind status shown with a corrective nudge if behind.

**Reuse:** `lib/calculators.ts` (SIP/FD/EMI), goal projection helpers.

---

## F6 · Reminders & Notifications (P1)
**Purpose:** Event-based reasons to return that save the user real money.

**User story:** *As a member, I'm reminded before my insurance renewal, FD maturity, EMI due date, SIP date, and tax deadlines.*

**Requirements**
- Reminder types: insurance renewal, FD maturity, loan EMI, SIP date, tax dates (advance tax, ITR, 80C cutoff), custom.
- Channels: Web Push (PWA), email; WhatsApp opt-in later (aligns with audience).
- Auto-created from profile/goal/vault data where possible (e.g., FD maturity from a saved FD).
- Notification center in-app; user controls frequency/channels (respect DPDP consent).

**Acceptance criteria**
- Push works via existing service worker; permission asked contextually, not on load.
- Reminders fire via a scheduled job (cron) with idempotency (no double-sends).
- Every notification deep-links to the relevant action.

**Reuse:** `public/sw.js` / `ServiceWorkerRegister`; new `Reminder` model + scheduler.

---

## F7 · Document Vault (P1)
**Purpose:** A private, encrypted place for financial documents — increases switching cost and daily relevance.

**User story:** *As a member, I securely store my policy PDFs, loan sanction letters, PAN/Aadhaar, and investment proofs, organized and searchable.*

**Requirements**
- Upload (PDF/JPG/PNG), categorize (Insurance, Loans, Investments, KYC, Tax, Other), tag, note.
- Encrypted at rest (server-side envelope encryption); signed, expiring access URLs; never public.
- Link a document to a Reminder (policy → renewal) or Goal.
- Checklist mode: reuse `lib/documentChecklists.ts` to show "for a home loan you still need: …".
- Storage cap on free tier (e.g., 20 docs / 100 MB); unlimited on Plus.

**Acceptance criteria**
- Files encrypted before persistence; access requires an authenticated, authorized session.
- Deleting a doc purges the blob and its metadata.
- Virus/type/size validation on upload; rate-limited.

**Reuse:** `lib/documentChecklists.ts`. New: object storage (S3/Cloudinary signed) + encryption util.

---

## F8 · Premium AI Reports — "BudgetKatta Plus" (P2)
**Purpose:** The monthly habit anchor *and* the primary recurring revenue line.

**User story:** *As a Plus member, on the 1st of each month I get a personalized PDF report: my score trend, goal progress, what changed, and my prioritized action plan for the month.*

**Requirements**
- Auto-generated monthly (cron) from the user's data; Gemini writes the narrative, deterministic engine supplies all numbers/charts.
- Sections: Score trend & drivers, Net-worth snapshot, Goal progress, Wins & risks, 3 prioritized actions, relevant (disclosed) product suggestions.
- Delivered as in-app view + downloadable PDF (reuse the Chrome-render pipeline already used for the audit PDF) + email/push notification.
- Free tier: a lightweight monthly summary (teaser) → upgrade prompt for the full report.
- Plus also unlocks: unlimited goals, advanced projections (retirement, tax-optimizer), ad-free, unlimited vault, priority AI chat.

**Acceptance criteria**
- Report numbers reconcile exactly with dashboard/score.
- Every AI claim is grounded in the user's data + carries the disclaimer.
- Report generation is idempotent and retried on failure.
- Paywall gates the full report cleanly; teaser always free.

**Reuse:** `lib/gemini.ts`, calculators, the headless-Chrome PDF approach; new payments (Razorpay).

---

## F9 · Contextual Affiliate Recommendations (P2) — *quiet monetization*
**Purpose:** Monetize **only when a recommendation genuinely helps the user**, riding on trust already earned.

**User story:** *As a member whose emergency fund is low, I see a relevant, clearly-disclosed high-yield FD/RD option — because it fits my situation, not because I landed on a page.*

**Requirements**
- Recommendations are **triggered by the user's own state** (score gaps, goals, reminders), not by page context. Examples:
  - Low emergency fund → high-yield FD/RD partners.
  - Underinsured (life cover < 10× income) → term insurance partners.
  - High-interest credit-card debt → balance-transfer / personal-loan partners.
  - New SIP goal → demat/broker partners.
- **Relevance gate + frequency cap:** at most 1 recommendation per surface, only above a relevance threshold; suppressed entirely for users below a retention/trust threshold (new users see none).
- Always labeled "Sponsored · Affiliate" with the existing disclosure; ranked by user-fit first, commission second; user can dismiss / "not relevant."
- Click attribution tracked (fixes the audit's "passive forwarding" gap) → measure fit, not just clicks.

**Acceptance criteria**
- No recommendation renders unless a real user-state trigger fires.
- Disclosure present on every unit; dismissable; frequency-capped.
- Attribution event logged on click (source trigger, product, user cohort).

**Reuse:** `lib/affiliate.ts` + all offer libs (`creditCardOffers`, `brokerOffers`, `personalLoanLenders`, `womenLenders`, `eduLenders`) — now selected by rules, not routes.

---

## F10 · AI Chat, upgraded (P1)
**Purpose:** The existing chatbot becomes **context-aware** — it knows the signed-in user's score and goals.

**Requirements**
- For signed-in users, inject (server-side) a compact profile/score summary into the system context so answers are personalized *and* still bounded to educational framing.
- Keep domain lock (FD/loans/SIP/insurance), disclaimer, sanitization, rate limits.
- Free: limited daily messages; Plus: higher/unlimited + priority.

**Reuse:** `lib/gemini.ts`, `app/api/chat/route.ts`.

---

---

# The AI CFO layer — what makes it an OS, not a website

F11–F16 are the differentiating spine. They turn a set of tools into a system that *remembers, tracks, reminds, measures, improves.* Detailed model/interaction spec: [08-ai-cfo-layer.md](08-ai-cfo-layer.md).

## F11 · Life Events Engine (P0–P1) — *the organizing principle*
**Purpose:** Organize the entire OS around the life event the user is actually living, not around product SKUs. People solve events (marriage, baby, home), not buy products.

**User story:** *As a member, I see my money life as a timeline of life stages, and at each stage the OS tells me exactly what to do — with the right product surfacing only as the answer to that stage.*

**Requirements**
- A **canonical life-event graph**: First Job → Emergency Fund → Health Insurance → Term Insurance → SIP → Marriage → Home → Vehicle → Baby → Child Education → Retirement (extensible, bilingual, culturally tuned for Maharashtra).
- Each event = a **playbook**: the money moves it implies (e.g. *Baby* → health cover top-up, term insurance, child-education goal, will), each mapped to a Goal template, a Score pillar, reminders, and (later) a contextual recommendation.
- The OS infers the user's current stage(s) from profile + age + declared events, and **guides the next best stage**. Users can also declare an upcoming event ("I'm getting married in 8 months") → the OS builds the plan.
- **Life Timeline dashboard widget**: past stages (done), current (active), upcoming (planned) — a vertical timeline the user grows.

**Acceptance criteria**
- Every life event maps deterministically to ≥1 goal template + score pillar + checklist.
- Declaring an event auto-creates its plan (goals, reminders) in one action.
- Recommendations never appear except as the answer to an active/upcoming event or a score gap.

**Reuse:** Goal templates (F5), `documentChecklists.ts`, Score pillars (F3).

## F12 · AI Financial Memory (P0) — *the moat*
**Purpose:** The CFO never forgets. Every relevant fact about the user persists and is recalled in every future interaction — the compounding switching cost.

**User story:** *As a member, I never repeat myself. The AI already knows my salary, EMIs, goals, risk appetite, insurance, and past decisions, so its help is personal from the first word.*

**Requirements**
- A structured **MemoryFact** store: typed facts (income, EMI, goal, risk profile, insurance, loan, investment, preference, past decision) with source, confidence, and timestamp. Structured-first (queryable), not just a chat log.
- Memory is **written** from: profile edits, goal actions, chat disclosures (extracted server-side), document summaries (F7), life-event declarations.
- Memory is **read** into every AI surface (chat, score narration, monthly report, recommendations) as compact, grounded context — so answers are consistently personal.
- **User-visible & editable memory** ("Here's what I remember about you") — trust + DPDP control; user can correct or delete any fact.
- Privacy-first: memory is per-user, encrypted, never used to train external models, minimal facts sent to the LLM per call.

**Acceptance criteria**
- The same fact is never asked twice across surfaces.
- User can view/edit/delete every stored fact; deletion propagates.
- Facts carry provenance + confidence; stale facts decay / prompt re-confirmation.

**Reuse:** extends `FinancialProfile`; feeds `lib/gemini.ts`. New `MemoryFact` model + extraction service.

## F13 · Financial Timeline / History (P1)
**Purpose:** The user's financial autobiography — a durable record of what they did and when. Increases attachment ("this is my history") and powers the trend narrative.

**User story:** *As a member, I see my financial history — "2026 started SIP · 2027 bought insurance · 2028 closed loan · 2029 bought house" — as a timeline I've built.*

**Requirements**
- **TimelineEntry** events: goal achieved, loan closed, policy bought, SIP started, life event reached, score milestone, big score jump.
- Auto-logged from actions across the OS; user can add manual milestones.
- Rendered as a scrollable, shareable timeline (share = referral loop).
- Feeds the monthly report ("this year you…") and year-in-review moments.

**Acceptance criteria**
- Major financial actions auto-create a timeline entry (idempotent).
- Timeline is bilingual, shareable, and reconciles with goals/score history.

**Reuse:** `ScoreSnapshot`, `Goal.contributions`, life events.

## F14 · AI Actions (P1) — *the CFO does work, not just talk*
**Purpose:** Move from answering to *acting*. The AI performs bounded, useful actions on the user's behalf (with confirmation) — the difference between assistant and CFO.

**User story:** *As a member, when the AI spots something, it doesn't just tell me — it offers to do it: set the reminder, generate the report PDF, compare my policy, find a better FD, draft the SIP plan.*

**Requirements**
- A bounded, allow-listed **action toolset** (function-calling), each action deterministic and reversible/confirmable:
  - `createReminder`, `generateReportPDF`, `comparePolicy` (against benchmark/partners), `findBetterFD` (query reference rates), `suggestSIP` (projection), `createGoal`, `updateMemory`.
- AI **proposes** actions from user state; user **confirms** before anything mutating runs (no silent actions on money data).
- Every action is logged (`ActionLog`), rate-limited, and respects the SEBI boundary (execution-only/informational, never personalized security advice).
- Actions are the connective tissue: a reminder can be born from a chat; a policy comparison can spawn a contextual rec (disclosed).

**Acceptance criteria**
- Mutating actions require explicit user confirmation and are logged + reversible where applicable.
- The action layer is allow-listed (no open-ended tool use on financial data); inputs validated (Zod).
- Actions reuse existing services (reminders, PDF pipeline, reference-rate queries), not new ad-hoc logic.

**Reuse:** reminders (F6), PDF pipeline (F8), reference data (`FDRate`, `Insurance`), `lib/gemini.ts` function-calling.

## F15 · Family Mode (P1–P2)
**Purpose:** One household account covering the whole family — the retention + virality unlock (Indian finances are managed at the household level).

**User story:** *As the family's money manager, I manage profiles for my spouse, children, and parents from one login, with a household view and per-member dashboards.*

**Requirements**
- **Household** with an owner + members (spouse, child, parent), each with role-based access (owner manages; adult members can have their own login linked; minors are managed profiles).
- Per-member Financial Profile, Score, goals; plus a **household roll-up** (combined net worth, shared goals like a home, family insurance adequacy).
- Granular privacy: members control what the owner/others can see; DPDP consent per member; minors handled per guardianship.
- Inviting a family member = a native referral.

**Acceptance criteria**
- One owner can create/manage ≥N member profiles; adult members can claim their own login.
- Household roll-up reconciles with member data; per-member privacy honored.
- Adding a member is a first-class, low-friction flow.

**Reuse:** `User`, `FinancialProfile`, Score. New `Household`/`FamilyMember` models.

## F16 · Gamification (P1)
**Purpose:** Make progress visible and habitual — Duolingo for money. Points accrue for real financial improvement, not vanity clicks.

**User story:** *As a member, I earn points for doing the right things (building an emergency fund, buying insurance, starting a SIP, closing a loan) and I can see my progress and streak.*

**Requirements**
- **Action points** tied to genuinely good financial moves, e.g. `+10` emergency fund started · `+15` health/term insurance added · `+20` SIP started · `+30` loan closed · `+5` monthly goal contribution logged · streak bonuses.
- Points feed a member level/badge and a check-in **streak**; visible on dashboard.
- Points are a *proxy for behavior*, decoupled from the Score (Score = state; points = actions taken) but correlated — doing point-worthy actions raises the Score.
- Anti-gaming: points only for verified/first-time meaningful actions, not repeatable trivial toggles.

**Acceptance criteria**
- Point events are deterministic, idempotent, and logged.
- Dashboard shows points, level, and streak without layout shift.
- No point can be farmed by toggling a field.

**Reuse:** `User.streak`, action logs. New `GamificationLedger`.

## F17 · Financial Marketplace (P2–Platform) — *moat M5*
**Purpose:** Turn earned trust into a two-sided marketplace — the largest long-term revenue line. Not just advisors: the full spectrum of financial professionals a family needs.

**User story:** *As a member with a need beyond the AI, I'm connected to a vetted professional — CA, insurance agent, loan expert, mutual-fund distributor, lawyer, property advisor, or estate planner — and can book/transact, all in Marathi.*

**Marketplace categories (phased):**
- **First:** CA / tax filing, Insurance, Loans, Mutual-fund distributors (highest, most frequent demand).
- **Later:** Lawyers, Property advisors, Estate/will planners.

**Requirements**
- Trigger: an agent (F19) hits its educational/regulatory limit (personalized investment advice, tax filing, legal/estate) → **human handoff** to a vetted professional.
- Vetted, credential-verified provider directory; booking + scheduling; paid consult or referral (take-rate / lead fee); post-consult notes flow back into memory/timeline (with consent).
- Marketplace supply is **regional-first** (Maharashtra professionals, Marathi-speaking) → reinforces M2.
- Keeps BudgetKatta as the *informational* layer; the professional provides regulated advice — clean compliance separation.

**Acceptance criteria**
- Handoff fires only on genuine beyond-AI needs; credentials verified before listing.
- Booking + payment + take-rate tracked per category; outcome optionally saved to memory (consent).
- Providers rated; low-quality supply removed.

**Reuse:** payments (F8/Razorpay), memory (F12), agents (F19), lead infra (`leadAutomation.ts`).

---

## F18 · Financial Knowledge Graph (P1–Intelligence) — *moat M3*
**Purpose:** Model the user's money as a connected, reasoning system rather than independent rows — the brain the Score and agents think with. Full spec: [09-knowledge-graph.md](09-knowledge-graph.md).

**User story:** *As a member, the AI understands how my money connects — that my thin emergency fund makes a new loan risky — not just that the numbers exist.*

**Requirements**
- `lib/knowledgeGraph.ts` projects profile + memory into per-user nodes (Income, Savings, EmergencyFund, Insurance, Loan, Investment, Goal, LifeEvent, Product) and typed edges (funds / protects / blocks / enables / requires / progresses / recommends).
- Edges are **deterministic + testable**; the graph grounds Score pillars (each pillar = a graph query), Life-event playbooks, recommendations (fire on real gaps), agents, and reports.
- v1 in-memory derived graph (Mongo = store of record); migrate to a graph store only if scale demands (interface-isolated).

**Acceptance criteria**
- Score pillars are explainable via graph paths; recommendations only fire on a real weak/missing edge.
- Golden-graph tests per fixture profile; graph is monotonic in obvious directions.

**Reuse:** `FinancialProfile`, `MemoryFact`, `calculators.ts`, reference data + Regional Intelligence.

## F19 · Multi-Agent AI System (P1–Engagement) — *moat M4*
**Purpose:** Replace one chatbot with an orchestrated fleet: the AI CFO conductor + specialist agents (Tax, Loan, Insurance, Investment, Goal, Retirement, Document) sharing memory + graph. Full spec: [10-agent-system.md](10-agent-system.md).

**User story:** *As a member, my "should I prepay my loan or start a SIP?" question is answered by the right specialists working together — and the Insurance agent already knows what the Loan agent knows.*

**Requirements**
- Orchestrator (`lib/agents/orchestrator.ts`) assembles memory+graph context, routes to one or more agents, reconciles their outputs into one CFO answer, and proposes actions (F14, confirm-before-mutate).
- Each agent = `lib/agents/<name>.ts` with a shared contract `(ctx:{memory,graph,tools}) => AgentReply`; allow-listed tools only; SEBI/IRDAI boundary enforced per agent (personalized advice → human handoff F17, never agent overstep).
- Ship incrementally: Orchestrator + Goal/Insurance/Loan agents first; Tax/Investment/Retirement/Document later; expose select capabilities via API in the Platform phase.
- Grounded-only reasoning; rule-based fallback on failure; full `ActionLog` audit; per-user caps.

**Acceptance criteria**
- Multi-agent questions fan out + reconcile into a single coherent answer.
- No agent gives personalized security/policy advice; it hands off instead.
- Every mutating action confirmed + logged; memory written back after decisions.

**Reuse:** `lib/gemini.ts` (function-calling), Memory (F12), Knowledge Graph (F18), AI Actions (F14).

---

## Feature priority summary
Phases are now **named company chapters** (see [company operating manual](../company/00-operating-manual.md) §7). Every feature maps to a moat (M1 Memory · M2 Regional · M3 Graph · M4 Agents · M5 Marketplace) or is an enabler/retention amplifier. Founder rule: *a feature that strengthens no moat and doesn't lift retention/LTV does not get built.*

| Feature | Phase | Moat |
|---------|-------|------|
| F1 Auth (Google + Phone OTP) | **Foundation** | Enabler |
| F2 Financial Profile | **Foundation** | M1 |
| F12 AI Financial Memory | **Foundation**→ongoing | **M1** |
| Analytics · Security · audit fixes | **Foundation** | Enabler |
| F3 Health Score (1000) | **Intelligence** | M3 |
| F18 Knowledge Graph | **Intelligence** | **M3** |
| F11 Life Events Engine | **Intelligence** | M2, M3 |
| F5 Goals | **Intelligence** | M1, M3 |
| F4 Dashboard | Intelligence | Retention |
| F8 Monthly AI Reports | **Engagement** | M1, M4 |
| F6 Reminders / Notifications | **Engagement** | M2 |
| F13 Financial Timeline | **Engagement** | M1 |
| F16 Gamification | **Engagement** | Retention |
| F19 Multi-Agent System (first agents) | **Engagement** | **M4** |
| F14 AI Actions | Engagement | M4 |
| F7 Document Vault (+AI summary) | Engagement | M1 |
| F10 Context-aware Chat | Engagement | M4 |
| F15 Family Mode | **Marketplace** | M1, network |
| F9 Contextual Affiliate | Engagement→Marketplace | M2 |
| F17 Financial Marketplace | **Marketplace** | **M5** |
| Subscription (Money Coach / Plus) | Marketplace | M1, M4 |
| B2B / API / White-label | **Platform** | M2, M3, M5 |
| Account Aggregator, more agents | **Platform** | M1, M4 |

> **Foundation scope-lock (founder directive):** the first milestone ships only **Auth · Profile · Memory · Analytics/Security/fixes** — **no new calculator/blog, and Health Score moves to Intelligence.** A minimal profile + app shell ships in Foundation because Memory needs a substrate; the Score's *reasoning* belongs with the Knowledge Graph in Intelligence.

---

## Feature priority summary
Priority reflects the founder's Phase-0 constraint: **no new calculator/blog features**; Phase 0 ships only auth, profile+memory, score+dashboard, and the audit's critical fixes.

| Feature | Priority | Phase | Layer |
|---------|----------|-------|-------|
| F1 Auth (Google + Phone OTP) | P0 | **0** | Foundation |
| F2 Financial Profile | P0 | **0** | Foundation |
| F12 AI Financial Memory (core) | P0 | **0** | CFO spine |
| F3 Health Score (1000) | P0 | **0** | Foundation |
| F4 Personal Dashboard | P0 | **0** | Foundation |
| F5 Goals | P0 | 1 | Habit |
| F11 Life Events Engine | P0–P1 | 1 | CFO spine |
| F16 Gamification | P1 | 1 | Habit |
| F6 Reminders / Notifications | P1 | 2 | Habit |
| F7 Document Vault (+ AI summarize) | P1 | 2 | CFO spine |
| F13 Financial Timeline | P1 | 2 | CFO spine |
| F14 AI Actions (agentic) | P1 | 2 | CFO spine |
| F10 Context-aware Chat | P1 | 2 | CFO spine |
| F15 Family Mode | P1–P2 | 3 | Network |
| F8 Premium AI Reports | P2 | 3 | Monetization |
| F9 Contextual Affiliate | P2 | 3 | Monetization |
| F17 Advisor Marketplace | P2 | 4 | Monetization |

> **Note on F12 in Phase 0:** memory ships in Phase 0 in its *foundational* form — the structured `MemoryFact` store written from profile/score, read into the dashboard. Chat-extraction and document-summary writers arrive with F10/F7 in Phase 2. This satisfies the founder's Phase-0 "persistent financial memory" deliverable without pulling later features forward.
