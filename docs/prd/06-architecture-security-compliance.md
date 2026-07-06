# 05 · Architecture, Security & Compliance

## System architecture (evolution of the current stack)
```
                        ┌──────────────────────────────────────────┐
   PWA (Next.js 14) ────┤  App Router                               │
   - anonymous tools    │  ├─ (public)  SEO calculators, directory  │  ← keep for top-of-funnel
   - member app         │  ├─ (app)     dashboard/goals/vault/...   │  ← new, auth-gated
   Service Worker ──────┤  └─ /api/*    route handlers              │
   (push, offline)      └───────┬───────────────┬──────────────────┘
                                │               │
                     ┌──────────┴───┐   ┌───────┴────────┐
                     │ Auth.js v5   │   │ Domain services │
                     │ (OTP+Google) │   │ healthScore,    │
                     └──────┬───────┘   │ goals, reports, │
                            │           │ recommendations │
             ┌──────────────┼───────────┴───────┬─────────┴───────┐
             │              │                    │                 │
        ┌────┴────┐   ┌─────┴─────┐        ┌─────┴─────┐    ┌──────┴──────┐
        │ MongoDB │   │ Upstash   │        │ Gemini    │    │ Object store │
        │ (Atlas) │   │ Redis     │        │ (server)  │    │ S3/Cloudinary│
        │ user +  │   │ rate-limit│        │ narration │    │ encrypted    │
        │ ref data│   │ cache,    │        │ + reports │    │ vault + PDFs │
        └─────────┘   │ OTP store │        └───────────┘    └─────────────┘
                      └───────────┘
      Cron/Queue: Vercel Cron (or QStash) → weekly score, monthly reports, reminder scans
      Payments: Razorpay (webhooks → Subscription)     Notifications: Web Push + email (Resend) + WhatsApp(later)
      Analytics: GA4 + Meta CAPI (server-side via existing n8n) + Microsoft Clarity
```

### Key additions vs today
| Concern | Today | 2.0 |
|---------|-------|-----|
| Auth | none | Auth.js v5 (OTP/Google), `middleware.ts` gates `(app)` |
| Sessions/state | none | JWT session; user-owned Mongo collections |
| Rate limit / cache | in-memory (broken on serverless) | **Upstash Redis** (shared, correct) |
| Scheduling | none | Vercel Cron / QStash (score, reports, reminders) |
| Payments | none | Razorpay + webhooks |
| Notifications | none | Web Push (existing SW) + email |
| Object storage | Cloudinary (images) | + encrypted vault & report PDFs |
| Analytics | **none** | GA4 + CAPI + Clarity (fix audit gap) |

### Route groups
- `app/(public)/…` — anonymous SEO surfaces (today's site) stay indexable and fast.
- `app/(app)/…` — authenticated member app (dashboard, goals, vault, reports, settings); `middleware.ts` enforces session + security headers.
- `app/api/…` — existing + new handlers (auth, profile, score, goals, reminders, documents, reports, billing, webhooks).

## Auth design — Google + Phone OTP (both, day one)
- **Google OAuth:** primary fast path (≈10-sec onboarding). Link/create `User` by verified email.
- **Phone OTP:** request → 6-digit OTP hashed in Redis, TTL 5 min, keyed by phone, rate-limited (per-phone + per-IP). Verify → Auth.js session. SMS via MSG91 (India-optimized). Serves as the Indian-audience default + backup, and the identity that eases future mobile-app / WhatsApp integration.
- **Account linking:** a user who signs in with Google then verifies a phone (or vice-versa) is linked into one `User` (match by verified email/phone).
- **Session:** JWT strategy, short access + rotating; PWA-friendly. `middleware.ts` protects `(app)` and admin.
- **Admin:** replace today's public-flag gate with real role check (`roles` includes `admin`) — closes the audit's weak-admin finding.

## AI CFO layer (what makes it an OS) — see [08-ai-cfo-layer.md](08-ai-cfo-layer.md)
- **AI Financial Memory:** structured `MemoryFact` store (Mongo, encrypted), written server-side from profile/chat/documents/actions and read as a **compact grounded context** into every LLM call. Optional vector index later for semantic recall; structured-first for v1 (queryable, cheap, private). Memory is per-user, never used to train external models, user-viewable/editable (DPDP).
- **Agentic AI Actions:** an **allow-listed** function-calling toolset (createReminder, generateReportPDF, comparePolicy, findBetterFD, suggestSIP, updateMemory…). The LLM *proposes*; **mutating actions require explicit user confirmation**; every run is Zod-validated, rate-limited, and written to `ActionLog`. No open-ended tool use on financial data. Stays within the SEBI educational/execution-only boundary.
- **Life Events Engine:** config-driven graph (`lib/lifeEvents.ts`) inferring the user's stage and driving goals/pillars/reminders/recs.
- **Family Mode:** `Household` groups `User`s with role-based access + per-member privacy; household roll-ups computed server-side.

## Security (closes audit findings)
| Audit finding | Fix in 2.0 |
|---------------|-----------|
| No security headers | `headers()` in `next.config.mjs` **and** enforced in `middleware.ts`: CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| In-memory rate limit | Upstash Redis sliding-window on **all** mutating + sensitive routes (incl. `/api/locations`, OTP, chat, leads) |
| `/api/rates` fail-open | Fail-closed (require `ADMIN_API_TOKEN`) + role check + Zod body validation *(already queued as a task)* |
| No auth / middleware | Auth.js + `middleware.ts` |
| No CSRF | Same-site cookies + CSRF token on state-changing POSTs (Auth.js helpers); webhooks verified by signature |
| PII unencrypted | Field/storage-level encryption (below) + retention policy |
| Gemini cost abuse | Per-user quota (Redis counter) + global spend cap + low-temp bounded prompts |
| Vault | Private object store, envelope encryption, signed expiring URLs, authz check per fetch |

## Data protection & DPDP (Digital Personal Data Protection Act, 2023)
BudgetKatta will be a **Data Fiduciary** handling financial PII → concrete obligations:
- **Consent:** explicit, purpose-bound, per-channel (`ConsentRecord`); easy withdrawal. Fix the audit's cookie-banner/GA mismatch (only load trackers after consent).
- **Data minimization:** collect only what the Score needs; ranges over exact values where possible.
- **Encryption:** sensitive fields (`FinancialProfile`, contacts) encrypted at rest; vault blobs envelope-encrypted; TLS in transit (Vercel).
- **Rights:** self-serve **export** and **erasure** (J7); erasure hard-deletes PII and cascades to vault blobs within a defined window.
- **Retention:** documented TTLs (score snapshots rolled up, logs expired); no indefinite PII retention.
- **Breach readiness:** logging/alerting; incident runbook; Data Protection contact published.
- **Third parties:** DPAs with Gemini/SMS/storage/Razorpay; keep financial PII out of prompts beyond the minimal grounded context; never send raw documents to the LLM.

## Regulatory boundary (SEBI / IRDAI / RBI)
The platform stays **educational + execution-only referral**, *not* an adviser/intermediary — this is a deliberate product constraint that keeps us out of registration regimes:
- Health Score & reports are **informational**, framed "based on the data you entered," never "you should buy X." Disclaimer on every surface (machinery already exists).
- **No personalized security/fund recommendations** → stay outside SEBI **RIA** registration. Goal instrument hints are generic categories (FD/RD/SIP), not specific securities advice.
- Affiliate/lead referrals are disclosed and **execution-only** (we forward, partners fulfill) — the audit already confirmed disclosures are compliant; extend the same to every contextual unit.
- Insurance suggestions are informational comparisons, not solicitation → keep clear of IRDAI intermediary rules; if we later earn insurance commissions directly, revisit as a registered web-aggregator/POSP.
- **Escalation trigger:** the day we add personalized "buy this fund/policy" advice or take custody of money, pause and get qualified legal/regulatory counsel + pursue the appropriate registration (RIA / IRDAI web-aggregator / AA-FIU).

## Observability
- Product analytics: GA4 events on the full funnel (signup→activation→retention→revenue); Clarity for UX; server-side CAPI via n8n.
- App health: structured logs (no PII), error tracking (Sentry), uptime + cron success alerts.
- Business dashboards: WAMa, D1/D7/D30, score-recheck rate, report opens, Plus MRR, contextual-rec fit.
