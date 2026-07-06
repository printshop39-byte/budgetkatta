# 03 · Data Model

**Store:** MongoDB via Mongoose (already in the stack). **Money:** store all amounts as **integer paise** (`amountPaise: number`) to avoid float drift — format at the edge with `lib/format.ts`. **IDs:** Mongo `ObjectId`. **Every user-owned doc carries `userId` (indexed) and `createdAt/updatedAt`.**

New collections are added alongside the existing ones (`BankRate`, `FDRate`, `Institution`, `Insurance`, `LoanProduct`, `SIPFund`, `Lead`) — those become **reference data** the new user-owned collections consume.

## Entity-relationship overview
```
Household 1───N User            (Family Mode; owner + members)
User 1───1 FinancialProfile
User 1───N MemoryFact           ★ AI memory — the moat (structured facts)
User 1───N LifeEvent            ★ life-stage records (upcoming/active/done)
User 1───N Goal
User 1───N Reminder
User 1───N Document
User 1───N ScoreSnapshot        (time series — powers the trend)
User 1───N TimelineEntry        ★ financial autobiography
User 1───N Report               (monthly)
User 1───N ActionLog            ★ AI Actions audit
User 1───N GamificationLedger   ★ points / streak
User 1───1 Subscription         (plan state)
User 1───N RecommendationEvent  (contextual affiliate attribution)
User 1───N NotificationLog
User 1───N ConsentRecord        (DPDP)
Advisor 1───N AdvisorBooking N───1 User   (marketplace, later)

Reference data (existing, read-only to users):
FDRate / BankRate / LoanProduct / SIPFund / Insurance / Institution
  ↑ consumed by Health Score, Goal projections, Life-event playbooks,
    AI Actions (findBetterFD/comparePolicy), and Contextual Recommendations
```
★ = new OS-defining collections (the CFO layer). `User` gains `householdId?` and `googleId` (auth is Google **and** Phone OTP).

---

## Collections

### `User`
| Field | Type | Notes |
|-------|------|-------|
| `_id` | ObjectId | |
| `phone` | string | E.164, unique, indexed. Primary identity. |
| `phoneVerifiedAt` | Date | |
| `email` | string? | optional; unique sparse index |
| `googleId` | string? | optional OAuth link |
| `displayName` | string? | |
| `locale` | 'mr' \| 'en' | default 'mr' |
| `district` | string? | for local recommendations |
| `roles` | string[] | `['member']`, `['member','admin']` |
| `status` | 'active' \| 'deleted' | soft-delete flag; PII scrubbed on delete |
| `lastActiveAt` | Date | powers WAMa / retention |
| `streak` | { count, lastCheckInAt } | gamification |
| `createdAt/updatedAt` | Date | |

Indexes: `{phone:1}` unique, `{email:1}` unique sparse, `{lastActiveAt:-1}`.

### `FinancialProfile` (1:1 with User)
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | unique, indexed |
| `age` | number? | |
| `employmentType` | enum | salaried/self-employed/business/student/retired |
| `dependents` | number? | |
| `monthlyIncomePaise` | number? | |
| `monthlyExpensesPaise` | number? | |
| `savings` | { bankPaise, fdPaise, rdPaise, otherPaise } | liquid/near-liquid |
| `investments` | { sipMonthlyPaise, mfCorpusPaise, epfPaise, stocksPaise, otherPaise } | |
| `debts` | [{ type, principalPaise, emiPaise, ratePct, tenureMonths }] | loans + cards |
| `insurance` | { lifeCoverPaise, healthCoverPaise, hasTermLife:boolean } | |
| `creditScoreSelfReported` | number? | 300–900, optional |
| `completionPct` | number | derived, cached |
| `dataAsOf` | Date | staleness for time-decay |
| `version` | number | bumped each edit (audit trail) |

Indexes: `{userId:1}` unique.

### `ScoreSnapshot` (time series — the retention spine)
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | indexed |
| `score` | number | 0–1000 |
| `band` | enum | needs_attention/fair/good/strong/excellent |
| `pillars` | { savingsRate, emergencyFund, debt, insurance, investment, credit } | each 0–100 + weight |
| `confidence` | number | 0–1, from profile completeness |
| `nudges` | [{ pillar, text_mr, text_en, pointsUpside }] | AI-generated, stored |
| `computedAt` | Date | indexed |
| `trigger` | enum | onboarding/edit/weekly_cron/goal_log |

Indexes: `{userId:1, computedAt:-1}` (trend queries). Consider a capped retention or monthly rollups after N snapshots.

### `Goal`
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | indexed |
| `type` | enum | emergency_fund/home/education/vehicle/retirement/custom |
| `title_mr/title_en` | string | |
| `targetPaise` | number | |
| `targetDate` | Date | |
| `currentPaise` | number | running total |
| `monthlyContribPaise` | number | |
| `instrumentHint` | enum? | fd/rd/sip/mf — for projection & rec |
| `status` | enum | active/paused/achieved/archived |
| `contributions` | [{ amountPaise, at, note }] | log → progress + score |
| `projection` | { reachDate, shortfallPaise } | cached from calculators |

Indexes: `{userId:1, status:1}`.

### `Reminder`
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | indexed |
| `kind` | enum | insurance_renewal/fd_maturity/emi/sip/tax/custom |
| `title_mr/title_en` | string | |
| `dueAt` | Date | indexed |
| `recurrence` | enum? | none/monthly/yearly |
| `channels` | string[] | push/email/whatsapp |
| `linkedRef` | { model, id }? | e.g. Document or Goal |
| `status` | enum | scheduled/sent/done/snoozed/cancelled |
| `lastFiredAt` | Date? | idempotency |

Indexes: `{dueAt:1, status:1}` (scheduler scan), `{userId:1}`.

### `Document` (vault)
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | indexed |
| `category` | enum | insurance/loan/investment/kyc/tax/other |
| `title` | string | |
| `storageKey` | string | object-store key (S3/Cloudinary), **not public** |
| `encMeta` | { algo, iv, keyRef } | envelope encryption metadata |
| `mime` | string | |
| `sizeBytes` | number | |
| `tags` | string[] | |
| `linkedReminderId` | ObjectId? | |
| `createdAt` | Date | |

Indexes: `{userId:1, category:1}`. **Blob bytes never in Mongo** — only the encrypted-at-rest object-store reference.

### `Report` (monthly premium)
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | indexed |
| `period` | string | `YYYY-MM` |
| `tier` | enum | free_teaser/plus_full |
| `data` | object | reconciled numbers/charts (deterministic) |
| `narrative_mr/narrative_en` | string | Gemini output (grounded) |
| `pdfKey` | string? | rendered PDF in object store |
| `status` | enum | generated/failed/delivered |
| `generatedAt` | Date | |

Indexes: `{userId:1, period:1}` unique (idempotent generation).

### `Subscription`
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | unique |
| `plan` | enum | free/plus |
| `billingCycle` | enum? | monthly/yearly |
| `razorpaySubId` | string? | |
| `currentPeriodEnd` | Date? | |
| `status` | enum | active/grace/past_due/cancelled |
| `history` | [{ event, at, amountPaise }] | payments/dunning |

Indexes: `{userId:1}` unique, `{currentPeriodEnd:1}` (renewal scan).

### `RecommendationEvent` (contextual affiliate attribution — fixes audit gap)
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | indexed |
| `trigger` | enum | low_emergency_fund/underinsured/high_cc_debt/new_sip_goal/... |
| `product` | { partner, category, offerId } | from offer libs |
| `surface` | enum | dashboard/goal/reminder/report |
| `action` | enum | shown/clicked/dismissed/not_relevant |
| `at` | Date | |

Indexes: `{userId:1, at:-1}`, `{trigger:1, action:1}` (fit analysis).

### `ConsentRecord` & `NotificationLog` (DPDP + ops)
- `ConsentRecord`: `{userId, purpose, channel, granted:boolean, at, policyVersion}` — auditable consent per DPDP.
- `NotificationLog`: `{userId, type, channel, at, status, dedupeKey}` — idempotency + deliverability metrics.

---

## OS-layer collections (the AI CFO) — see [08-ai-cfo-layer.md](08-ai-cfo-layer.md)

### `MemoryFact` (★ the moat)
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | indexed |
| `type` | enum | income/expense/emi/loan/goal/risk_profile/insurance/investment/preference/decision/life_event/doc_summary |
| `key` | string | e.g. `monthly_income` |
| `value` | mixed | number(paise)/string/enum |
| `source` | enum | profile/chat/document/action/derived |
| `confidence` | number | 0–1; decays with age |
| `asOf` | Date | staleness → re-confirm hook |
| `status` | enum | active/superseded/deleted |

Indexes: `{userId:1, type:1}`, `{userId:1, asOf:-1}`. Encrypted at rest; only minimal subset sent to LLM; never used to train external models.

### `LifeEvent`
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | indexed |
| `key` | enum | first_job/marriage/baby/home/vehicle/education/retirement/... |
| `status` | enum | upcoming/active/done |
| `plannedDate` | Date? | for declared future events |
| `instantiatedGoalIds` | ObjectId[] | goals created from its playbook |
| `checklistState` | object | playbook progress |

Indexes: `{userId:1, status:1}`.

### `TimelineEntry`
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | indexed |
| `type` | enum | goal_achieved/loan_closed/policy_added/sip_started/life_event/score_milestone |
| `title_mr/title_en` | string | |
| `at` | Date | |
| `ref` | {model,id}? | source object |

Indexes: `{userId:1, at:-1}`. Auto-emitted, idempotent per source event.

### `ActionLog` (AI Actions audit)
`{userId, action, args(redacted), mutating:boolean, confirmedAt?, outcome, at}` — every proposed/run AI action; supports reversibility & rate limits. Index `{userId:1, at:-1}`.

### `GamificationLedger`
`{userId, event, points, at, dedupeKey}` + derived `level`/`streak` on `User`. Unique on `{userId, dedupeKey}` to prevent farming. Index `{userId:1, at:-1}`.

### `Household` & `FamilyMember` (Family Mode)
- `Household`: `{ownerUserId, name, memberUserIds[], createdAt}`.
- Membership/roles: `User.householdId?` + `User.householdRole` (owner/adult/managed_minor). Per-member privacy flags govern what the owner/others can view. Minors are managed profiles (no own login) until claimed.

### `Advisor` & `AdvisorBooking` (marketplace, later)
- `Advisor`: `{name, credentials(verified), type: ca/ria/insurance, rating, feePaise}`.
- `AdvisorBooking`: `{userId, advisorId, slot, status, amountPaise, takeRatePaise, notesToMemory?}`.

---

## Migration from current models
- **No breaking changes** to existing reference collections; they gain read consumers.
- `Lead` stays for anonymous/pre-auth capture; on sign-up, an existing lead (matched by phone) can be linked to the new `User` (`lead.userId`).
- Add compound indexes flagged in the audit: `Lead {createdAt, module}`, `Institution {district, type}` (directory perf).
- **PII encryption**: `FinancialProfile`, `Document`, `User.email/phone` are sensitive — apply field-level or storage-level encryption + a documented retention/TTL. See [compliance](06-architecture-security-compliance.md).

## Data volume & retention notes
- `ScoreSnapshot` grows fastest (weekly/user). Plan monthly rollups or a rolling window (keep daily 90d, monthly beyond).
- `NotificationLog` / `RecommendationEvent` are high-volume analytics → consider TTL (e.g., 400 days) and/or export to an analytics warehouse.
