# 04 · Financial Health Score — Algorithm Spec

**Design principles**
1. **Deterministic & explainable.** The number is a pure function of the profile. No AI in the number — AI only *explains* it. This is auditable, testable, and safe for YMYL/finance.
2. **Actionable.** Every point lost maps to a specific, closeable gap.
3. **Culturally legible.** 0–1000 scale echoes the CIBIL/credit-score mental model Indian users already trust.
4. **Graceful with missing data.** Scores on partial input; reports a **confidence** level; missing data becomes an engagement hook, not a blocker.

Implement as a pure module `lib/healthScore.ts` (new), reusing `lib/calculators.ts`. Unit-tested with fixture profiles.

## Score composition
Final score = round( Σ (pillarScoreᵢ × weightᵢ) × 1000 ), where each `pillarScoreᵢ ∈ [0,1]` and weights sum to 1.

| # | Pillar | Weight | Measures |
|---|--------|:------:|----------|
| 1 | Savings rate | 0.20 | (income − expenses) / income |
| 2 | Emergency fund | 0.20 | liquid savings ÷ monthly expenses (months of runway) |
| 3 | Debt load | 0.20 | EMI-to-income + credit-utilization |
| 4 | Insurance adequacy | 0.15 | life cover vs 10× income; health cover vs benchmark |
| 5 | Investment / goal progress | 0.15 | investing rate + on-track goals |
| 6 | Credit health | 0.10 | self-reported credit score band |

Weights are config constants (tunable) — expose in `lib/healthScore.ts` so they can be re-calibrated from real data later.

## Pillar functions (v1 rules)

### 1. Savings rate → `s1`
```
rate = (monthlyIncome − monthlyExpenses) / monthlyIncome
s1 =  0      if rate ≤ 0
      linear 0→1 for rate in (0 … 0.30]
      1      if rate ≥ 0.30       // saving ≥30% is excellent
```

### 2. Emergency fund → `s2`
```
months = liquidSavings / monthlyExpenses      // bank + FD (liquid buckets)
s2 = clamp(months / 6, 0, 1)                  // 6 months = full marks
```
(Reuses no external calc; liquidSavings = `savings.bank + savings.fd + savings.rd`.)

### 3. Debt load → `s3` (lower burden = higher score)
```
emiRatio  = totalEMI / monthlyIncome          // <0.20 good, >0.50 severe
ccUtil    = ccOutstanding / ccLimit           // if card data present
s3 = 0.7 * clamp(1 − emiRatio/0.50, 0, 1)
   + 0.3 * clamp(1 − ccUtil/0.30,  0, 1)      // >30% utilization penalized
```

### 4. Insurance adequacy → `s4`
```
lifeAdequacy   = clamp(lifeCover / (10 * annualIncome), 0, 1)
healthAdequacy = clamp(healthCover / RECOMMENDED_HEALTH_COVER[district_tier], 0, 1)
s4 = 0.6 * lifeAdequacy + 0.4 * healthAdequacy
```
`RECOMMENDED_HEALTH_COVER` is a small lookup (metro ₹10L / tier-2 ₹5L etc.).

### 5. Investment / goal progress → `s5`
```
investRate = monthlySIP / monthlyIncome
s5a = clamp(investRate / 0.15, 0, 1)          // investing 15% of income = full
s5b = fractionOfGoalsOnTrack()                 // goals where projection ≥ target
s5 = 0.6 * s5a + 0.4 * s5b                      // goal projections reuse calculateSIP()
```

### 6. Credit health → `s6`
```
if creditScoreSelfReported present:
   s6 = clamp((cibil − 300) / (900 − 300), 0, 1)
else:
   s6 = null → redistribute its 0.10 weight across present pillars,
        and flag "add your credit score for a more accurate result" (hook)
```

## Confidence
```
confidence = weightedFractionOfFieldsPresent(profile)   // 0..1
```
Displayed as Low/Medium/High. Below a threshold, UI nudges profile completion with the exact point-accuracy upside.

## Bands
| Score | Band | mr label |
|-------|------|----------|
| 0–399 | Needs Attention | लक्ष देण्याची गरज |
| 400–599 | Fair | ठीक |
| 600–749 | Good | चांगले |
| 750–874 | Strong | मजबूत |
| 875–1000 | Excellent | उत्कृष्ट |

## AI narration layer (Gemini) — explains, never computes
Input to Gemini = **structured, grounded** context only:
```json
{
  "score": 612, "band": "fair", "confidence": "medium",
  "pillars": [
    {"key":"emergency_fund","value":0.13,"months":0.8,"weight":0.20,"upsidePts":80},
    {"key":"insurance","value":0.30,"lifeMultiple":3,"weight":0.15,"upsidePts":52}, ...
  ],
  "locale": "mr"
}
```
Prompt contract:
- Produce **3–5 nudges**, ranked by `upsidePts` (biggest, cheapest wins first).
- Each nudge: plain-language, specific, includes the rupee action ("start a ₹3,000/mo RD").
- **Must not** invent numbers or give personalized *investment* advice (no "buy fund X"). Educational framing only.
- Append the standard SEBI/IRDAI/RBI disclaimer (reuse `lib/gemini.ts` machinery).
- Low temperature; fall back to a rule-based nudge template if the API fails (pattern already exists in `lib/gemini.ts`).

`upsidePts` per pillar = `weightᵢ × (1 − sᵢ) × 1000` → lets both the ranking and the UI ("+80 pts") stay deterministic even though the wording is AI.

## Recompute triggers
- On profile edit (sync).
- On goal contribution log (sync, affects s5).
- Weekly cron (time-decay: if `dataAsOf` is stale > 45 days, lower confidence and nudge a refresh).
Each recompute writes a `ScoreSnapshot` → feeds the trend chart (the core return hook).

## Testing
- Golden fixtures: 8–10 representative profiles (thin/complete, indebted, over-insured, ideal) with expected scores locked in a snapshot test.
- Property test: score is monotonic in the obvious direction (more savings never lowers s1, etc.).
- Reconciliation test: report/dashboard/score all read the same computed object.
