// lib/healthScoreConfig.ts
// ────────────────────────────────────────────────────────────────────────────
// Versioned, reviewable configuration for the Money Health Score engine.
//
// WHY A SEPARATE FILE: every threshold that shapes a user's score lives here so
// it can be reviewed / re-calibrated WITHOUT touching engine logic or UI code
// (founder directive, Phase 4). Bump `version` on any change — snapshots in the
// score history reference it so a re-calibration is auditable.
//
// SOURCING NOTE (important, YMYL/finance): the numbers below are widely-cited
// personal-finance *rules of thumb*, NOT regulatory thresholds. We deliberately
// do NOT attribute them to RBI/SEBI/IRDAI with fabricated URLs. Each is an
// "educational estimate". Where a rule maps to a well-known convention we name
// the convention. Anything that later needs a regulator-backed number must be
// added to `SCORE_SOURCES` with a real, verified URL + date.
// ────────────────────────────────────────────────────────────────────────────

export const HEALTH_SCORE_VERSION = '2026-07-13.v1';

/** Canonical score scale — ratified 0–1000 (CIBIL 300–900 mental model). */
export const SCORE_MAX = 1000;

/** Pillar identifiers — stable keys used by engine, UI and analytics. */
export type PillarKey =
  | 'savings'
  | 'emergency'
  | 'debt'
  | 'insurance'
  | 'investment'
  | 'credit';

/**
 * Pillar weights (must sum to 1). When a pillar has no data its weight is
 * redistributed across the pillars that DO have data (see engine), so the
 * final score is always a weighted average of what we actually know.
 */
export const PILLAR_WEIGHTS: Record<PillarKey, number> = {
  savings: 0.2,
  emergency: 0.2,
  debt: 0.2,
  insurance: 0.15,
  investment: 0.15,
  credit: 0.1,
};

export const SAVINGS_CFG = {
  /** Saving ≥30% of income scores full marks on this pillar. */
  excellentRate: 0.3,
};

export const EMERGENCY_CFG = {
  /** Months of essential-expense runway for full marks. */
  targetMonths: 6,
};

export const DEBT_CFG = {
  /** EMI-to-income at/above this is treated as severe (pillar → 0). */
  severeEmiRatio: 0.5,
  /** Weight of the EMI sub-term inside the debt pillar. */
  emiWeight: 0.7,
  /** Credit-card utilization above this is penalized. */
  ccUtilCap: 0.3,
  /** Weight of the card-utilization sub-term (only used if card data present). */
  ccWeight: 0.3,
};

export const INSURANCE_CFG = {
  /** Recommended life cover = this multiple of ANNUAL income. */
  lifeMultiple: 10,
  lifeWeight: 0.6,
  healthWeight: 0.4,
  /**
   * When the user says "yes, I have cover" but doesn't give the amount, we give
   * partial credit (better than 0, worse than a verified adequate cover) and
   * flag lower confidence. Educational estimate only.
   */
  booleanOnlyCredit: 0.5,
  /** Recommended health cover benchmark by city tier (₹). Educational estimate. */
  recommendedHealthCover: {
    metro: 1_000_000,
    tier2: 500_000,
    tier3: 300_000,
  } as Record<'metro' | 'tier2' | 'tier3', number>,
};

export const INVESTMENT_CFG = {
  /** Investing ≥15% of income scores full marks on the "rate" sub-term. */
  targetInvestRate: 0.15,
  investWeight: 0.6,
  goalWeight: 0.4,
  /** Assumed nominal annual return used to project goal progress (educational). */
  assumedAnnualReturnPct: 10,
};

export const CREDIT_CFG = {
  /** CIBIL band bounds used to normalize a self-reported score to 0..1. */
  min: 300,
  max: 900,
};

/**
 * Per-pillar status cutoffs on the normalized pillar value (0..1).
 * value ≥ good → "good"; ≥ attention → "needs_attention"; else → "urgent".
 */
export type PillarStatus = 'good' | 'needs_attention' | 'urgent';

export const STATUS_CUTOFFS = {
  good: 0.67,
  needs_attention: 0.34,
};

/** Confidence cutoffs on data-completeness fraction (0..1). */
export const CONFIDENCE_CUTOFFS = {
  high: 0.8,
  medium: 0.5,
};

export type Band = {
  min: number;
  max: number;
  key: string;
  en: string;
  mr: string;
};

/** Score bands (0–1000) — from docs/prd/05-health-score-spec.md. */
export const SCORE_BANDS: Band[] = [
  { min: 0, max: 399, key: 'needs_attention', en: 'Needs Attention', mr: 'लक्ष देण्याची गरज' },
  { min: 400, max: 599, key: 'fair', en: 'Fair', mr: 'ठीक' },
  { min: 600, max: 749, key: 'good', en: 'Good', mr: 'चांगले' },
  { min: 750, max: 874, key: 'strong', en: 'Strong', mr: 'मजबूत' },
  { min: 875, max: 1000, key: 'excellent', en: 'Excellent', mr: 'उत्कृष्ट' },
];

/**
 * Documented provenance for the thresholds above. These are educational
 * conventions, not regulatory mandates — labelled as such so the UI can be
 * honest. Add real regulator URLs here only when genuinely verified.
 */
export type ScoreSource = {
  rule: string;
  convention: string;
  note: string;
  lastVerified: string;
  educationalEstimate: true;
};

export const SCORE_SOURCES: ScoreSource[] = [
  {
    rule: 'Save ≥20–30% of income',
    convention: '50/30/20 budgeting rule of thumb',
    note: 'Common budgeting guidance; not a regulatory requirement.',
    lastVerified: '2026-07-13',
    educationalEstimate: true,
  },
  {
    rule: '6 months of expenses as emergency fund',
    convention: 'Widely-cited emergency-fund guidance',
    note: 'A general resilience benchmark; individual needs vary.',
    lastVerified: '2026-07-13',
    educationalEstimate: true,
  },
  {
    rule: 'EMIs under ~40–50% of income',
    convention: 'Lender FOIR / debt-service norms (indicative)',
    note: 'Lenders assess this individually; used here only as an educational band.',
    lastVerified: '2026-07-13',
    educationalEstimate: true,
  },
  {
    rule: 'Life cover ≈ 10× annual income',
    convention: 'Common term-insurance rule of thumb',
    note: 'A starting benchmark only; actual need depends on dependents, debts, goals.',
    lastVerified: '2026-07-13',
    educationalEstimate: true,
  },
  {
    rule: 'Invest ≥15% of income toward goals',
    convention: 'Common long-term-investing guidance',
    note: 'Illustrative target; not personalized investment advice.',
    lastVerified: '2026-07-13',
    educationalEstimate: true,
  },
];

/** Full config object (handy for snapshotting a computation's exact inputs). */
export const HEALTH_SCORE_CONFIG = {
  version: HEALTH_SCORE_VERSION,
  scoreMax: SCORE_MAX,
  weights: PILLAR_WEIGHTS,
  savings: SAVINGS_CFG,
  emergency: EMERGENCY_CFG,
  debt: DEBT_CFG,
  insurance: INSURANCE_CFG,
  investment: INVESTMENT_CFG,
  credit: CREDIT_CFG,
  statusCutoffs: STATUS_CUTOFFS,
  confidenceCutoffs: CONFIDENCE_CUTOFFS,
  bands: SCORE_BANDS,
  sources: SCORE_SOURCES,
} as const;
