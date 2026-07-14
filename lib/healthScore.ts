// lib/healthScore.ts
// ────────────────────────────────────────────────────────────────────────────
// Money Health Score — a DETERMINISTIC, EXPLAINABLE scoring engine.
//
// Design rules (docs/prd/05-health-score-spec.md):
//   1. Pure function of the profile. No AI in the number — AI only *explains* it.
//   2. Actionable: every point lost maps to a specific, closeable gap (upsidePts).
//   3. Graceful with missing data: scores on partial input, reports confidence,
//      redistributes the weight of pillars it can't measure.
//   4. Score is always an integer in [0, SCORE_MAX].
//
// Reuses lib/calculators.ts (calculateSIP) for goal projection — no formula
// duplication. All thresholds live in lib/healthScoreConfig.ts.
// ────────────────────────────────────────────────────────────────────────────

import { calculateSIP } from './calculators';
import {
  CONFIDENCE_CUTOFFS,
  CREDIT_CFG,
  DEBT_CFG,
  EMERGENCY_CFG,
  HEALTH_SCORE_VERSION,
  INSURANCE_CFG,
  INVESTMENT_CFG,
  PILLAR_WEIGHTS,
  PillarKey,
  PillarStatus,
  SAVINGS_CFG,
  SCORE_BANDS,
  SCORE_MAX,
  STATUS_CUTOFFS,
  type Band,
} from './healthScoreConfig';

import type { Bi } from '@/types';

// ── Input ───────────────────────────────────────────────────────────────────

export type DistrictTier = 'metro' | 'tier2' | 'tier3';

/**
 * Raw answers collected by the Money Health Check. Everything is optional so
 * the engine can score partial input; the flow decides what to require.
 * Monetary fields are monthly ₹ unless the name says otherwise.
 */
export interface HealthProfileInput {
  ageRange?: string;
  city?: string;
  districtTier?: DistrictTier;

  monthlyIncome?: number;
  monthlyEssential?: number;
  monthlyDiscretionary?: number;
  totalEMI?: number;
  liquidSavings?: number; // emergency fund / liquid buckets
  monthlyInvestment?: number; // SIP / RD / recurring investing

  hasHealthInsurance?: boolean;
  healthCoverAmount?: number; // ₹, optional refinement
  hasTermInsurance?: boolean;
  lifeCoverAmount?: number; // ₹, optional refinement

  creditScore?: number; // self-reported CIBIL 300–900 (optional)

  primaryGoal?: string;
  targetTimelineYears?: number;
  goalTargetAmount?: number; // ₹, optional — enables goal-progress sub-score
}

// ── Output ──────────────────────────────────────────────────────────────────

export interface PillarResult {
  key: PillarKey;
  label: Bi;
  /** Normalized pillar score 0..1, or null when there's no data to measure it. */
  value: number | null;
  /** Weight actually applied after redistribution (0 when value is null). */
  weight: number;
  /** Points this pillar contributed to the final score (value × weight × MAX). */
  points: number;
  /** Points still available here = weight × (1 − value) × MAX. Ranks the nudges. */
  upsidePts: number;
  status: PillarStatus | 'unknown';
  /** Plain-language inputs used, e.g. "EMI ₹18,000 vs income ₹60,000". */
  inputs: Bi;
  /** The rule/formula applied, for transparency. */
  formula: Bi;
  explanation: Bi;
  limitation: Bi;
}

export type Confidence = 'low' | 'medium' | 'high';

export interface HealthScoreResult {
  version: string;
  score: number; // 0..SCORE_MAX, integer
  scoreMax: number;
  band: Band;
  confidence: Confidence;
  /** 0..1 fraction of the fields that materially affect the score that were provided. */
  dataCompleteness: number;
  pillars: PillarResult[];
  /** Highest-priority gap (biggest upside, worst status first). */
  topWarning: Bi | null;
  /** One concrete immediate action tied to the top gap. */
  topAction: Bi | null;
  /** Deep-link to the most relevant BudgetKatta calculator for the top gap. */
  topActionHref: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

/** Coerce to a finite, non-negative number, else undefined (invalid/missing). */
function num(v: unknown): number | undefined {
  if (typeof v !== 'number' || !Number.isFinite(v)) return undefined;
  return v < 0 ? 0 : v;
}

const inr = (n: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n));

function statusFromValue(value: number | null): PillarStatus | 'unknown' {
  if (value === null) return 'unknown';
  if (value >= STATUS_CUTOFFS.good) return 'good';
  if (value >= STATUS_CUTOFFS.needs_attention) return 'needs_attention';
  return 'urgent';
}

function bandForScore(score: number): Band {
  return (
    SCORE_BANDS.find((b) => score >= b.min && score <= b.max) ??
    SCORE_BANDS[SCORE_BANDS.length - 1]
  );
}

// ── Pillar computations ─────────────────────────────────────────────────────
// Each returns { value|null, ...bilingual explainers }. `null` = "no data";
// the engine then drops the pillar's weight and redistributes it.

type PillarCore = Omit<PillarResult, 'weight' | 'points' | 'upsidePts' | 'status'>;

const NA: Bi = { en: '—', mr: '—' };

function pillarSavings(p: HealthProfileInput): PillarCore {
  const income = num(p.monthlyIncome);
  const essential = num(p.monthlyEssential);
  const discretionary = num(p.monthlyDiscretionary);
  const label: Bi = { en: 'Savings rate', mr: 'बचत दर' };

  if (income === undefined || income <= 0 || essential === undefined) {
    return {
      key: 'savings',
      label,
      value: null,
      inputs: NA,
      formula: { en: '(income − expenses) ÷ income', mr: '(उत्पन्न − खर्च) ÷ उत्पन्न' },
      explanation: {
        en: 'Add your income and expenses to measure how much you keep each month.',
        mr: 'दरमहा किती बचत होते हे मोजण्यासाठी उत्पन्न व खर्च भरा.',
      },
      limitation: {
        en: 'Not enough data to score savings yet.',
        mr: 'बचत मोजण्यासाठी पुरेशी माहिती नाही.',
      },
    };
  }

  const expenses = essential + (discretionary ?? 0);
  const rate = (income - expenses) / income;
  const value = rate <= 0 ? 0 : clamp(rate / SAVINGS_CFG.excellentRate);
  const ratePct = Math.round(rate * 100);

  return {
    key: 'savings',
    label,
    value,
    inputs: {
      en: `Keeping ₹${inr(income - expenses)} of ₹${inr(income)} (${ratePct}%)`,
      mr: `₹${inr(income)} पैकी ₹${inr(income - expenses)} बचत (${ratePct}%)`,
    },
    formula: {
      en: `Saving ${ratePct}% — full marks at ${Math.round(SAVINGS_CFG.excellentRate * 100)}%`,
      mr: `${ratePct}% बचत — ${Math.round(SAVINGS_CFG.excellentRate * 100)}% वर पूर्ण गुण`,
    },
    explanation:
      rate <= 0
        ? {
            en: 'Your expenses meet or exceed income, so nothing is being saved.',
            mr: 'खर्च उत्पन्नाइतका किंवा जास्त आहे, त्यामुळे बचत होत नाही.',
          }
        : {
            en: `You save about ${ratePct}% of income. Aiming for 20–30% builds wealth faster.`,
            mr: `तुम्ही उत्पन्नाच्या सुमारे ${ratePct}% बचत करता. २०–३०% चे ध्येय संपत्ती लवकर वाढवते.`,
          },
    limitation: {
      en: 'Based on the figures you entered; irregular income is averaged.',
      mr: 'तुम्ही दिलेल्या आकड्यांवर आधारित; अनियमित उत्पन्नाची सरासरी घेतली जाते.',
    },
  };
}

function pillarEmergency(p: HealthProfileInput): PillarCore {
  const essential = num(p.monthlyEssential);
  const liquid = num(p.liquidSavings);
  const label: Bi = { en: 'Emergency fund', mr: 'आपत्कालीन निधी' };

  if (essential === undefined || essential <= 0 || liquid === undefined) {
    return {
      key: 'emergency',
      label,
      value: null,
      inputs: NA,
      formula: { en: 'liquid savings ÷ monthly essentials', mr: 'रोख बचत ÷ मासिक अत्यावश्यक खर्च' },
      explanation: {
        en: 'Add your savings and essential expenses to see your safety runway.',
        mr: 'तुमची सुरक्षितता किती महिने टिकेल हे पाहण्यासाठी बचत व अत्यावश्यक खर्च भरा.',
      },
      limitation: {
        en: 'Not enough data to score your emergency fund yet.',
        mr: 'आपत्कालीन निधी मोजण्यासाठी पुरेशी माहिती नाही.',
      },
    };
  }

  const months = liquid / essential;
  const value = clamp(months / EMERGENCY_CFG.targetMonths);
  const monthsLabel = months.toFixed(1);

  return {
    key: 'emergency',
    label,
    value,
    inputs: {
      en: `₹${inr(liquid)} covers ~${monthsLabel} months of ₹${inr(essential)}`,
      mr: `₹${inr(liquid)} ने ₹${inr(essential)} चे सुमारे ${monthsLabel} महिने भागतील`,
    },
    formula: {
      en: `${monthsLabel} months saved — full marks at ${EMERGENCY_CFG.targetMonths} months`,
      mr: `${monthsLabel} महिने साठा — ${EMERGENCY_CFG.targetMonths} महिन्यांवर पूर्ण गुण`,
    },
    explanation: {
      en: `Your fund covers about ${monthsLabel} months of essentials. A 3–6 month buffer protects you from job loss or emergencies.`,
      mr: `तुमचा निधी सुमारे ${monthsLabel} महिन्यांचा अत्यावश्यक खर्च भागवतो. ३–६ महिन्यांचा साठा नोकरी गमावणे किंवा आपत्कालीन प्रसंगी संरक्षण देतो.`,
    },
    limitation: {
      en: 'Counts liquid savings only (bank/FD/RD), not locked-in investments.',
      mr: 'फक्त रोख बचत (बँक/FD/RD) मोजली जाते, लॉक-इन गुंतवणूक नाही.',
    },
  };
}

function pillarDebt(p: HealthProfileInput): PillarCore {
  const income = num(p.monthlyIncome);
  const emi = num(p.totalEMI);
  const label: Bi = { en: 'Debt load', mr: 'कर्जाचा भार' };

  if (income === undefined || income <= 0 || emi === undefined) {
    return {
      key: 'debt',
      label,
      value: null,
      inputs: NA,
      formula: { en: 'total EMI ÷ income', mr: 'एकूण EMI ÷ उत्पन्न' },
      explanation: {
        en: 'Add your income and total EMIs to check how safe your debt level is.',
        mr: 'तुमच्या कर्जाची पातळी किती सुरक्षित आहे हे पाहण्यासाठी उत्पन्न व एकूण EMI भरा.',
      },
      limitation: {
        en: 'Not enough data to score debt yet.',
        mr: 'कर्ज मोजण्यासाठी पुरेशी माहिती नाही.',
      },
    };
  }

  const emiRatio = emi / income;
  // s3 = 0.7·(EMI term) + 0.3·(card term); card term only if card data present.
  const emiTerm = clamp(1 - emiRatio / DEBT_CFG.severeEmiRatio);
  const value = emiTerm; // card utilization not collected in v1 → EMI term only
  const emiPct = Math.round(emiRatio * 100);

  return {
    key: 'debt',
    label,
    value,
    inputs: {
      en: `EMIs ₹${inr(emi)} = ${emiPct}% of ₹${inr(income)} income`,
      mr: `EMI ₹${inr(emi)} = ₹${inr(income)} उत्पन्नाच्या ${emiPct}%`,
    },
    formula: {
      en: `EMI-to-income ${emiPct}% — severe at ${Math.round(DEBT_CFG.severeEmiRatio * 100)}%`,
      mr: `EMI-ते-उत्पन्न ${emiPct}% — ${Math.round(DEBT_CFG.severeEmiRatio * 100)}% वर गंभीर`,
    },
    explanation:
      emi === 0
        ? {
            en: 'You have no EMIs — excellent for financial flexibility.',
            mr: 'तुमच्यावर कोणतेही EMI नाहीत — आर्थिक लवचिकतेसाठी उत्तम.',
          }
        : {
            en: `EMIs take about ${emiPct}% of income. Keeping this under 40% leaves room to save and absorb shocks.`,
            mr: `EMI उत्पन्नाच्या सुमारे ${emiPct}% घेतात. हे ४०% खाली ठेवल्यास बचतीला व अडचणींना जागा राहते.`,
          },
    limitation: {
      en: 'Card-utilization is not counted in this version; EMI ratio only.',
      mr: 'या आवृत्तीत क्रेडिट-कार्ड वापर मोजला जात नाही; फक्त EMI गुणोत्तर.',
    },
  };
}

function pillarInsurance(p: HealthProfileInput): PillarCore {
  const income = num(p.monthlyIncome);
  const tier: DistrictTier = p.districtTier ?? 'tier2';
  const label: Bi = { en: 'Protection (insurance)', mr: 'संरक्षण (विमा)' };

  const hasLifeSignal = p.hasTermInsurance !== undefined || p.lifeCoverAmount !== undefined;
  const hasHealthSignal = p.hasHealthInsurance !== undefined || p.healthCoverAmount !== undefined;
  if (!hasLifeSignal && !hasHealthSignal) {
    return {
      key: 'insurance',
      label,
      value: null,
      inputs: NA,
      formula: { en: 'life vs 10× income + health vs benchmark', mr: 'जीवन विमा १०× उत्पन्न + आरोग्य बेंचमार्क' },
      explanation: {
        en: 'Tell us about your insurance to check if your family is protected.',
        mr: 'तुमचे कुटुंब सुरक्षित आहे का हे पाहण्यासाठी तुमच्या विम्याबद्दल सांगा.',
      },
      limitation: {
        en: 'Not enough data to score protection yet.',
        mr: 'संरक्षण मोजण्यासाठी पुरेशी माहिती नाही.',
      },
    };
  }

  // Life adequacy
  let lifeAdequacy = 0;
  const lifeCover = num(p.lifeCoverAmount);
  if (lifeCover !== undefined && income !== undefined && income > 0) {
    lifeAdequacy = clamp(lifeCover / (INSURANCE_CFG.lifeMultiple * income * 12));
  } else if (p.hasTermInsurance === true) {
    lifeAdequacy = INSURANCE_CFG.booleanOnlyCredit;
  }

  // Health adequacy
  let healthAdequacy = 0;
  const healthCover = num(p.healthCoverAmount);
  const benchmark = INSURANCE_CFG.recommendedHealthCover[tier];
  if (healthCover !== undefined) {
    healthAdequacy = clamp(healthCover / benchmark);
  } else if (p.hasHealthInsurance === true) {
    healthAdequacy = INSURANCE_CFG.booleanOnlyCredit;
  }

  const value = clamp(
    INSURANCE_CFG.lifeWeight * lifeAdequacy + INSURANCE_CFG.healthWeight * healthAdequacy
  );

  const missing: string[] = [];
  const missingMr: string[] = [];
  if (p.hasHealthInsurance === false || (p.hasHealthInsurance === undefined && healthCover === undefined)) {
    missing.push('health cover');
    missingMr.push('आरोग्य विमा');
  }
  if (p.hasTermInsurance === false || (p.hasTermInsurance === undefined && lifeCover === undefined)) {
    missing.push('term life cover');
    missingMr.push('टर्म जीवन विमा');
  }

  return {
    key: 'insurance',
    label,
    value,
    inputs: {
      en: missing.length ? `Missing: ${missing.join(', ')}` : 'Health + life cover reported',
      mr: missingMr.length ? `नाही: ${missingMr.join(', ')}` : 'आरोग्य + जीवन विमा नोंदवला',
    },
    formula: { en: '0.6 × life adequacy + 0.4 × health adequacy', mr: '०.६ × जीवन + ०.४ × आरोग्य पर्याप्तता' },
    explanation: missing.length
      ? {
          en: `Protection has gaps (${missing.join(', ')}). Insurance shields your savings from being wiped out by a medical or income shock.`,
          mr: `संरक्षणात त्रुटी आहेत (${missingMr.join(', ')}). वैद्यकीय किंवा उत्पन्नाच्या धक्क्यापासून विमा तुमची बचत वाचवतो.`,
        }
      : {
          en: 'You report both health and life cover — a strong protection base. Verify the cover amounts are adequate.',
          mr: 'तुम्ही आरोग्य व जीवन विमा दोन्ही नोंदवले — संरक्षणाचा मजबूत पाया. रकमा पुरेशा आहेत का ते तपासा.',
        },
    limitation: {
      en: 'Yes/no answers give partial credit; add exact cover amounts for accuracy. Educational estimate — not insurance advice.',
      mr: 'होय/नाही उत्तरांना अंशतः गुण; अचूकतेसाठी नेमकी रक्कम भरा. शैक्षणिक अंदाज — विमा सल्ला नाही.',
    },
  };
}

function pillarInvestment(p: HealthProfileInput): PillarCore {
  const income = num(p.monthlyIncome);
  const sip = num(p.monthlyInvestment);
  const label: Bi = { en: 'Investing & goals', mr: 'गुंतवणूक व ध्येये' };

  if (income === undefined || income <= 0 || sip === undefined) {
    return {
      key: 'investment',
      label,
      value: null,
      inputs: NA,
      formula: { en: 'monthly investing ÷ income (+ goal progress)', mr: 'मासिक गुंतवणूक ÷ उत्पन्न (+ ध्येय प्रगती)' },
      explanation: {
        en: 'Add your monthly investing amount to measure long-term progress.',
        mr: 'दीर्घकालीन प्रगती मोजण्यासाठी तुमची मासिक गुंतवणूक भरा.',
      },
      limitation: {
        en: 'Not enough data to score investing yet.',
        mr: 'गुंतवणूक मोजण्यासाठी पुरेशी माहिती नाही.',
      },
    };
  }

  const investRate = sip / income;
  const s5a = clamp(investRate / INVESTMENT_CFG.targetInvestRate);

  // s5b: goal progress — only if a target amount + timeline are provided.
  let s5b: number | null = null;
  const target = num(p.goalTargetAmount);
  const years = num(p.targetTimelineYears);
  if (target !== undefined && target > 0 && years !== undefined && years > 0) {
    const projected = calculateSIP(sip, INVESTMENT_CFG.assumedAnnualReturnPct, years).maturityValue;
    s5b = clamp(projected / target);
  }

  const value =
    s5b === null
      ? s5a
      : clamp(INVESTMENT_CFG.investWeight * s5a + INVESTMENT_CFG.goalWeight * s5b);
  const investPct = Math.round(investRate * 100);

  return {
    key: 'investment',
    label,
    value,
    inputs: {
      en: `Investing ₹${inr(sip)}/mo = ${investPct}% of income`,
      mr: `दरमहा ₹${inr(sip)} गुंतवणूक = उत्पन्नाच्या ${investPct}%`,
    },
    formula: {
      en: `Investing ${investPct}% — full marks at ${Math.round(INVESTMENT_CFG.targetInvestRate * 100)}%`,
      mr: `${investPct}% गुंतवणूक — ${Math.round(INVESTMENT_CFG.targetInvestRate * 100)}% वर पूर्ण गुण`,
    },
    explanation: {
      en: `You invest about ${investPct}% of income. Steady investing of 10–15% compounds into major goals over time.`,
      mr: `तुम्ही उत्पन्नाच्या सुमारे ${investPct}% गुंतवता. १०–१५% ची नियमित गुंतवणूक कालांतराने मोठ्या ध्येयांसाठी चक्रवाढ होते.`,
    },
    limitation: {
      en: 'Goal projection assumes a flat return and is an educational estimate, not a guarantee.',
      mr: 'ध्येय प्रक्षेपण स्थिर परताव्याचे गृहीत धरते; हा शैक्षणिक अंदाज आहे, हमी नाही.',
    },
  };
}

function pillarCredit(p: HealthProfileInput): PillarCore {
  const label: Bi = { en: 'Credit health', mr: 'क्रेडिट आरोग्य' };
  const cibil = num(p.creditScore);
  if (cibil === undefined || cibil === 0) {
    return {
      key: 'credit',
      label,
      value: null,
      inputs: NA,
      formula: { en: '(CIBIL − 300) ÷ 600', mr: '(CIBIL − ३००) ÷ ६००' },
      explanation: {
        en: 'Add your credit score for a more accurate result.',
        mr: 'अधिक अचूक निकालासाठी तुमचा क्रेडिट स्कोअर भरा.',
      },
      limitation: {
        en: 'Optional — its weight is shared across the other pillars when absent.',
        mr: 'पर्यायी — नसल्यास त्याचे वजन इतर घटकांमध्ये वाटले जाते.',
      },
    };
  }
  const value = clamp((cibil - CREDIT_CFG.min) / (CREDIT_CFG.max - CREDIT_CFG.min));
  return {
    key: 'credit',
    label,
    value,
    inputs: { en: `Self-reported CIBIL ${Math.round(cibil)}`, mr: `स्वतः नोंदवलेला CIBIL ${Math.round(cibil)}` },
    formula: { en: `Normalized on the ${CREDIT_CFG.min}–${CREDIT_CFG.max} range`, mr: `${CREDIT_CFG.min}–${CREDIT_CFG.max} श्रेणीवर सामान्यीकृत` },
    explanation: {
      en: 'A higher credit score means cheaper loans and easier approvals.',
      mr: 'उच्च क्रेडिट स्कोअर म्हणजे स्वस्त कर्ज आणि सुलभ मंजुरी.',
    },
    limitation: {
      en: 'Self-reported; verify with your official CIBIL/credit report.',
      mr: 'स्वतः नोंदवलेले; तुमच्या अधिकृत CIBIL अहवालाशी पडताळा.',
    },
  };
}

// Which calculator helps close each pillar's gap.
const PILLAR_ACTION: Record<PillarKey, { href: string; action: Bi }> = {
  savings: { href: '/sip', action: { en: 'Start a small monthly SIP to grow savings.', mr: 'बचत वाढवण्यासाठी लहान मासिक SIP सुरू करा.' } },
  emergency: { href: '/fd', action: { en: 'Build an emergency fund in a liquid FD/RD.', mr: 'रोख FD/RD मध्ये आपत्कालीन निधी तयार करा.' } },
  debt: { href: '/loans', action: { en: 'Review EMIs and consider refinancing high-rate loans.', mr: 'EMI तपासा व जास्त व्याजाची कर्जे पुनर्वित्त करण्याचा विचार करा.' } },
  insurance: { href: '/insurance', action: { en: 'Get adequate health and term cover for your family.', mr: 'कुटुंबासाठी पुरेसा आरोग्य व टर्म विमा घ्या.' } },
  investment: { href: '/sip', action: { en: 'Automate a monthly SIP toward your goal.', mr: 'तुमच्या ध्येयासाठी मासिक SIP स्वयंचलित करा.' } },
  credit: { href: '/credit-score', action: { en: 'Check your credit score and pay dues on time.', mr: 'तुमचा क्रेडिट स्कोअर तपासा व वेळेवर देय भरा.' } },
};

// ── Confidence (data completeness) ────────────────────────────────────────
// Weighted fraction of the fields that materially affect the score.
const COMPLETENESS_FIELDS: { present: (p: HealthProfileInput) => boolean; weight: number }[] = [
  { present: (p) => num(p.monthlyIncome) !== undefined && (num(p.monthlyIncome) ?? 0) > 0, weight: 2 },
  { present: (p) => num(p.monthlyEssential) !== undefined, weight: 2 },
  { present: (p) => num(p.monthlyDiscretionary) !== undefined, weight: 1 },
  { present: (p) => num(p.totalEMI) !== undefined, weight: 1.5 },
  { present: (p) => num(p.liquidSavings) !== undefined, weight: 1.5 },
  { present: (p) => num(p.monthlyInvestment) !== undefined, weight: 1.5 },
  { present: (p) => p.hasHealthInsurance !== undefined, weight: 1 },
  { present: (p) => p.hasTermInsurance !== undefined, weight: 1 },
  { present: (p) => num(p.creditScore) !== undefined && (num(p.creditScore) ?? 0) > 0, weight: 1 },
];

function computeCompleteness(p: HealthProfileInput): number {
  const total = COMPLETENESS_FIELDS.reduce((s, f) => s + f.weight, 0);
  const have = COMPLETENESS_FIELDS.reduce((s, f) => s + (f.present(p) ? f.weight : 0), 0);
  return total === 0 ? 0 : clamp(have / total);
}

function confidenceLabel(completeness: number): Confidence {
  if (completeness >= CONFIDENCE_CUTOFFS.high) return 'high';
  if (completeness >= CONFIDENCE_CUTOFFS.medium) return 'medium';
  return 'low';
}

// ── Main ─────────────────────────────────────────────────────────────────────

/**
 * Compute the Money Health Score for a profile. Pure & deterministic.
 * Missing pillars (value === null) have their weight redistributed across the
 * pillars that could be measured, so the score reflects only what we know.
 */
export function computeHealthScore(profile: HealthProfileInput): HealthScoreResult {
  const cores: PillarCore[] = [
    pillarSavings(profile),
    pillarEmergency(profile),
    pillarDebt(profile),
    pillarInsurance(profile),
    pillarInvestment(profile),
    pillarCredit(profile),
  ];

  const measured = cores.filter((c) => c.value !== null);
  const measuredWeightSum = measured.reduce((s, c) => s + PILLAR_WEIGHTS[c.key], 0);

  const pillars: PillarResult[] = cores.map((c) => {
    if (c.value === null || measuredWeightSum === 0) {
      return { ...c, weight: 0, points: 0, upsidePts: 0, status: statusFromValue(c.value) };
    }
    // Redistribute: each measured pillar's effective weight is scaled so they sum to 1.
    const weight = PILLAR_WEIGHTS[c.key] / measuredWeightSum;
    const points = c.value * weight * SCORE_MAX;
    const upsidePts = weight * (1 - c.value) * SCORE_MAX;
    return { ...c, weight, points, upsidePts, status: statusFromValue(c.value) };
  });

  const rawScore = pillars.reduce((s, p) => s + p.points, 0);
  const score = Math.round(clamp(rawScore, 0, SCORE_MAX));
  const band = bandForScore(score);

  const completeness = computeCompleteness(profile);
  const confidence = confidenceLabel(completeness);

  // Top gap = worst status, then biggest upside. Only among measured pillars.
  const statusRank: Record<string, number> = { urgent: 0, needs_attention: 1, good: 2, unknown: 3 };
  const ranked = pillars
    .filter((p) => p.value !== null && p.status !== 'good')
    .sort((a, b) => {
      const s = statusRank[a.status] - statusRank[b.status];
      return s !== 0 ? s : b.upsidePts - a.upsidePts;
    });

  const top = ranked[0] ?? null;
  const topWarning = top ? top.explanation : null;
  const topAction = top ? PILLAR_ACTION[top.key].action : null;
  const topActionHref = top ? PILLAR_ACTION[top.key].href : null;

  return {
    version: HEALTH_SCORE_VERSION,
    score,
    scoreMax: SCORE_MAX,
    band,
    confidence,
    dataCompleteness: completeness,
    pillars,
    topWarning,
    topAction,
    topActionHref,
  };
}

/** Convenience: localized band label. */
export function bandLabel(result: HealthScoreResult, lang: 'mr' | 'en'): string {
  return lang === 'mr' ? result.band.mr : result.band.en;
}
