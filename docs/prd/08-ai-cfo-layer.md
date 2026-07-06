# 07 · The AI CFO Layer

> This is what separates an **OS** from a website: the system **remembers, tracks, reminds, measures, and improves.** F11–F16 interlock into one intelligence. This doc specs how they connect.

## Assistant → CFO, concretely
```
Assistant:  user asks → LLM answers → forgotten
CFO:        state changes → memory updates → CFO plans → proposes action →
            user confirms → action runs → timeline logs → score moves → points awarded →
            next month's report reflects it → gets smarter next time
```
Every arrow is a retention touchpoint and a place the OS gets more valuable to the user.

## How the pieces interlock
```
        ┌──────────────── Life Events Engine (F11) ────────────────┐
        │  "where is this user on the money timeline?"             │
        └───────────────┬──────────────────────────────────────────┘
                        │ drives goals, pillars, reminders, recs
   ┌────────────────────┼───────────────────────────────────────────┐
   │                    ▼                                            │
   │   AI Financial Memory (F12) ──reads/writes──► every AI surface  │
   │   (structured facts: income, EMI, goals, risk, insurance…)     │
   │        ▲                        │                               │
   │  writes│                        │ grounds                       │
   │  from  │                        ▼                               │
   │  profile/chat/docs      Score narration · Chat · Report · Recs  │
   └────────┼────────────────────────┬──────────────────────────────┘
            │                         │ proposes
            ▼                         ▼
     Financial Timeline (F13) ◄── AI Actions (F14) ──► Gamification (F16)
     (autobiography of        (confirm → do work:      (points for real
      what happened)           reminder, PDF, compare)  financial wins)
```

---

## F11 · Life Events Engine — model
**Life-event graph** (config, `lib/lifeEvents.ts`): each node =
```
{
  key: 'baby',
  label_mr / label_en,
  typicalAgeRange, prerequisites: ['health_insurance','emergency_fund'],
  playbook: [
    { move: 'increase_health_cover', goalTemplate: 'health_topup', pillar: 'insurance' },
    { move: 'buy_term_life',        goalTemplate: 'term_life',     pillar: 'insurance' },
    { move: 'start_child_education',goalTemplate: 'child_education',pillar: 'investment' },
    { move: 'make_will',            checklist: 'will_docs' }
  ],
  recommendationTriggers: ['underinsured','no_child_goal']
}
```
- **Stage inference:** from age + profile + declared events → current stage(s) + "next best stage."
- **Declared events:** user says "marriage in 8 months" → engine instantiates the playbook (goals + reminders + checklist) in one action.
- Stored per user as `LifeEvent` records (see data model): `{key, status: upcoming/active/done, plannedDate, instantiatedGoalIds}`.

---

## F12 · AI Financial Memory — model & flow
**`MemoryFact`** (structured, queryable):
```
{ userId, type, key, value, unit?, source, confidence(0–1), asOf, expiresHint? }
  type ∈ income | expense | emi | loan | goal | risk_profile | insurance |
         investment | preference | decision | life_event | doc_summary
```
**Write path** (server-side, never client-trusted):
- Profile edit / goal action → deterministic fact write.
- Chat message → an **extraction step** pulls candidate facts ("I earn 60k") → stored with `source: chat`, moderate confidence, surfaced for user confirmation.
- Document upload → summary extractor writes `doc_summary` facts (policy sum-assured, FD maturity date, loan rate).

**Read path:** before any AI call, assemble a **compact grounded context** = top-N relevant facts (by type + recency + confidence) → inject into the prompt. Keep it minimal (privacy + token cost).

**Governance (privacy-first / DPDP):**
- User-facing "**What the CFO remembers**" screen: view, edit, delete any fact; deletion propagates and is logged (`ConsentRecord`).
- Facts are per-user, encrypted at rest, **never used to train external models**; only the minimal grounded subset is sent per LLM call.
- Confidence decays with age; stale critical facts (salary > 12mo old) prompt re-confirmation (also a re-engagement hook).

---

## F13 · Financial Timeline — model
`TimelineEntry { userId, type, title_mr/en, at, refModel/refId, magnitude? }`
- Auto-emitted by: goal achieved, loan closed, policy added, SIP started, life-event reached, score milestone (crossed a band), big jump (+50).
- Rendered as a vertical, shareable autobiography; drives "year in review" and report narrative.

---

## F14 · AI Actions — bounded agentic layer
**Allow-listed toolset** (function-calling in `lib/gemini.ts`), each a thin wrapper over an existing service:
| Action | Wraps | Mutating? | Confirm? |
|--------|-------|:---------:|:--------:|
| `createReminder` | Reminder service | yes | yes |
| `createGoal` | Goal service | yes | yes |
| `generateReportPDF` | PDF pipeline | no (produces artifact) | optional |
| `comparePolicy` | reference data + benchmark | no | no |
| `findBetterFD` | `FDRate` query | no | no |
| `suggestSIP` | `calculateSIP` | no | no |
| `updateMemory` | MemoryFact write | yes | yes |

**Rules of the layer**
- The LLM may **propose** any allow-listed action; **mutating** actions require explicit user confirmation — no silent writes to money data.
- No open-ended/tool-forming ability; inputs Zod-validated; every run logged to `ActionLog` (userId, action, args, outcome, at); rate-limited + per-user quota.
- Stays inside the SEBI boundary: actions are informational/execution-only. `suggestSIP`/`comparePolicy` present *categories and math*, never "buy security X."
- Actions are connective tissue: a chat can spawn a reminder; a `comparePolicy` result can surface a disclosed contextual rec.

---

## F16 · Gamification — model
`GamificationLedger { userId, event, points, at, dedupeKey }` + derived `level`, `streak`.
| Event | Points | Guard |
|-------|:------:|-------|
| Emergency fund started | +10 | first time |
| Health/Term insurance added | +15 | per policy, verified in profile |
| SIP started | +20 | first SIP |
| Loan closed | +30 | debt→0 transition |
| Monthly goal contribution logged | +5 | once/goal/month |
| Check-in streak day | +1..bonus | daily, anti-farm |

- Points measure **actions taken** (behavior); the 1000-Score measures **state**. Correlated but distinct — a user can have low state but earn points for improving, which is motivating precisely when they most need it.
- Anti-gaming: points fire on verified first-time/meaningful transitions only; idempotent via `dedupeKey`.

---

## Why this is the moat
An assistant any competitor can clone in a weekend. **A CFO that has remembered a user's money life for two years cannot be cloned at all** — the memory, timeline, and life-event context are the switching cost. Every day the OS runs, that moat gets one day deeper. This is why `Intelligence` (memory growth per user) is a North-Star branch, and why F12 ships in Phase 0.
