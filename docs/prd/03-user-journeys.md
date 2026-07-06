# 02 · User Journeys

Personas anchor the journeys:
- **Snehal, 29, Pune, salaried teacher** — mobile-first, Marathi-preferring, wants to save for a home and "be less anxious about money."
- **Rohan, 38, Nashik, small-business owner** — irregular income, has loans, under-insured, time-poor.
- **Asmita, 45, Sambhajinagar, homemaker** — manages household finances, cautious, values reminders and simplicity.

Legend: `→` step, `⤷` system/background action, `★` retention hook, `₹` monetization touchpoint (contextual only).

---

## J1 · First-run: anonymous → activated member
*Goal: from landing to first Health Score in one sitting.*

```
→ Lands on a calculator/SEO page (anonymous, as today)
→ Uses FD/SIP calculator, likes it, taps "Save my result / See my full Health Score"
→ Phone-OTP sign-in (≤ 20s)
   ⤷ create User, start session
→ Onboarding wizard (6 skippable steps, progress saved)
   ⤷ build FinancialProfile incrementally
→ First Health Score reveals with an animated dial   ★ (aha moment)
   ⤷ deterministic compute + Gemini narration (3 nudges)
→ "Your score is 612 (Fair). Closing your emergency-fund gap = +80 pts."
→ Prompt: "Set your first goal to start improving →"   ★
→ Lands on Dashboard (activated)
```
**Success:** profile ≥ 50% complete + score generated + ≥1 goal set on day 0.
**Failure guards:** every step skippable; partial profile still scores (with confidence badge) so no dead-ends.

---

## J2 · The daily/weekly return loop (core retention)
*Goal: make re-checking the score and nudging goals a habit.*

```
→ Push/notification: "Snehal, your score can rise 40 pts this week"   ★
→ Opens PWA → Dashboard: score dial + weekly delta + streak
→ "Next best action" card (deterministic-ranked): "Log this month's ₹5,000 SIP"
→ Taps → logs contribution
   ⤷ goal progress ++, investment pillar ++, score recompute, streak ++
→ Sees score tick up + "🎉 +12 pts" micro-celebration   ★
→ (Occasionally) contextual rec appears only if a real gap exists   ₹ (disclosed)
→ Leaves satisfied; streak preserved
```
**Frequency drivers:** streak, weekly score delta, "next best action" always fresh.

---

## J3 · Goal creation & tracking
```
→ Dashboard "Set a goal" → picks template "Emergency Fund"
→ App pre-fills target = 6× monthly expenses (from profile)
→ Sets ₹/month; sees projection "₹1.8L by Apr 2027 at ₹4,000/mo"  (SIP/RD math)
→ Confirms → goal appears with progress bar
   ⤷ auto-creates a monthly "log contribution" reminder
→ Each month: reminder → log → progress + score update   ★
→ Behind schedule? → corrective nudge: "Add ₹800/mo to stay on track"
→ Goal reached → celebration + shareable card   ★→ referral
   ⤷ if goal implies a product (park emergency fund) → contextual FD rec  ₹
```

---

## J4 · Reminder saves money (event loop)
```
⤷ System detects (from vault/profile) health policy renews in 14 days
→ Push + email: "Your health policy renews 12 Sep — review before it lapses"
→ Opens reminder → sees linked policy doc from Vault
→ Options: mark done / snooze / "compare better cover"
   ⤷ if under-insured vs profile → contextual term-insurance rec  ₹ (disclosed)
→ Avoids a lapse; associates BudgetKatta with real money saved   ★ (trust deepens)
```

---

## J5 · Monthly AI report (habit anchor + upgrade)
```
⤷ 1st of month: cron generates report for all members
→ Free user push: "Your March money summary is ready"
→ Opens teaser: score trend sparkline + 1 headline insight
→ "Unlock your full report: net-worth, goal deep-dive, 3-step plan" → upgrade CTA  ₹
   — OR —
→ Plus user: full report in-app + PDF download + emailed
   ⤷ Gemini narrative over deterministic numbers; disclaimer included
→ Report ends with "This month, do these 3 things" → each deep-links to an action   ★
```

---

## J6 · Free → Plus upgrade
```
Trigger points (contextual, not nagging):
  • Hitting free-tier limit (3 goals / vault cap / chat cap)
  • Monthly report teaser → full report
  • Advanced projection locked (retirement, tax-optimizer)
→ Upgrade sheet: ₹149/mo or ₹999/yr (2 months free), clear value list
→ Razorpay checkout (UPI/card/netbanking)
   ⤷ webhook → set plan=plus, unlock features, receipt email
→ Immediate unlock of the exact feature they wanted   ★
→ Retention: Plus members get the full monthly report → higher stickiness
```
**Grace/dunning:** failed renewal → 7-day grace + reminders → soft downgrade (data retained, features locked), never data loss.

---

## J7 · Account, privacy & trust (DPDP)
```
→ Settings → Data & Privacy
   • Export my data (JSON/PDF)
   • Manage notification consent per channel
   • Delete my account → confirm → hard-delete PII within window, revoke sessions
→ Every AI/recommendation surface links to disclaimer + affiliate disclosure
```
Trust is a feature: visible control over data is part of the retention promise.

---

## J8 · Life event — "I'm getting married in 8 months" (the OS moment)
*Goal: the CFO understands the event and builds the whole money plan — products appear only as answers to the event.*
```
→ Dashboard prompt or chat: "Any big life event coming up?" → user: "Marriage in 8 months"
   ⤷ Life Events Engine instantiates the 'marriage' playbook
   ⤷ AI Memory stores: {life_event: marriage, plannedDate}, updates risk/context
→ OS builds the plan in one action:
     • Goal: wedding fund (target from typical + user income)   ★
     • Goal: post-marriage emergency fund (now for 2)
     • Nudge: review health insurance (add spouse), term life
     • Reminders: seeded around the date
→ "Here's your 8-month money plan for marriage" — timeline view
→ Each month: contribute → progress + score + points   ★
   ⤷ underinsured for a couple? → disclosed term-insurance rec  ₹
→ Marriage reached → TimelineEntry logged ("2027 · Married"), CFO adapts next stage (home? baby?)
```
This is the difference between a comparison site (sells a policy) and an OS (guides a life event, remembers it forever).

## Journey → feature traceability
| Journey | Exercises features |
|---------|--------------------|
| J1 First-run | F1, F2, F12, F3, F4, F5 |
| J2 Daily loop | F3, F4, F5, F6, F16, F9 |
| J3 Goals | F5, F3, F6, F9 |
| J4 Reminder | F6, F7, F14, F9 |
| J5 Report | F8, F3, F13, F9 |
| J6 Upgrade | F8, F5, F7, F10 (limits) |
| J7 Privacy | F1, F12 (memory control) |
| J8 Life event | F11, F12, F5, F13, F16, F9 |
