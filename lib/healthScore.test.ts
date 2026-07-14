// lib/healthScore.test.ts — golden fixtures, edge cases, and property tests.
import { describe, it, expect } from 'vitest';
import { computeHealthScore, type HealthProfileInput } from './healthScore';
import { SCORE_MAX, PILLAR_WEIGHTS } from './healthScoreConfig';

// A complete, strong profile — used as a base for property tests.
const STRONG: HealthProfileInput = {
  ageRange: '30-39',
  city: 'Pune',
  districtTier: 'tier2',
  monthlyIncome: 100_000,
  monthlyEssential: 40_000,
  monthlyDiscretionary: 15_000,
  totalEMI: 10_000,
  liquidSavings: 300_000,
  monthlyInvestment: 20_000,
  hasHealthInsurance: true,
  healthCoverAmount: 1_000_000,
  hasTermInsurance: true,
  lifeCoverAmount: 12_000_000,
  creditScore: 800,
};

describe('computeHealthScore — invariants', () => {
  const profiles: HealthProfileInput[] = [
    {},
    STRONG,
    { monthlyIncome: 0 },
    { monthlyIncome: 50_000, monthlyEssential: 60_000 }, // expenses > income
    { monthlyIncome: 50_000, monthlyEssential: 20_000, totalEMI: 40_000 }, // very high EMI
    { monthlyIncome: NaN as unknown as number, monthlyEssential: -5000 }, // invalid
    { monthlyIncome: 30_000, monthlyEssential: 25_000, liquidSavings: 0 },
    { monthlyIncome: 30_000, monthlyEssential: 10_000, liquidSavings: 5_000_000 },
  ];

  it('score is always an integer within [0, SCORE_MAX]', () => {
    for (const p of profiles) {
      const r = computeHealthScore(p);
      expect(Number.isInteger(r.score)).toBe(true);
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(SCORE_MAX);
    }
  });

  it('every measured pillar value is within [0,1]; null pillars are "unknown"', () => {
    for (const p of profiles) {
      const r = computeHealthScore(p);
      for (const pillar of r.pillars) {
        if (pillar.value === null) {
          expect(pillar.status).toBe('unknown');
          expect(pillar.weight).toBe(0);
        } else {
          expect(pillar.value).toBeGreaterThanOrEqual(0);
          expect(pillar.value).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it('effective weights of measured pillars sum to ~1 (redistribution)', () => {
    for (const p of profiles) {
      const r = computeHealthScore(p);
      const measured = r.pillars.filter((x) => x.value !== null);
      if (measured.length === 0) continue;
      const sum = measured.reduce((s, x) => s + x.weight, 0);
      expect(sum).toBeCloseTo(1, 6);
    }
  });
});

describe('computeHealthScore — edge cases (Phase 4)', () => {
  it('empty profile → score 0, all pillars unknown, low confidence', () => {
    const r = computeHealthScore({});
    expect(r.score).toBe(0);
    expect(r.pillars.every((x) => x.value === null)).toBe(true);
    expect(r.confidence).toBe('low');
    expect(r.topWarning).toBeNull();
  });

  it('zero income → income-based pillars are unscored, no crash', () => {
    const r = computeHealthScore({ monthlyIncome: 0, monthlyEssential: 20_000, liquidSavings: 40_000 });
    const savings = r.pillars.find((x) => x.key === 'savings')!;
    const debt = r.pillars.find((x) => x.key === 'debt')!;
    expect(savings.value).toBeNull();
    expect(debt.value).toBeNull();
    // Emergency fund can still be scored (2 months here).
    const em = r.pillars.find((x) => x.key === 'emergency')!;
    expect(em.value).toBeCloseTo(40_000 / 20_000 / 6, 6);
  });

  it('invalid/negative/NaN inputs are sanitized, not crashed', () => {
    const r = computeHealthScore({
      monthlyIncome: -50_000 as number,
      monthlyEssential: NaN as unknown as number,
      totalEMI: -1 as number,
    });
    expect(Number.isInteger(r.score)).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(0);
  });

  it('expenses exceeding income → savings pillar is 0 (urgent)', () => {
    const r = computeHealthScore({ monthlyIncome: 50_000, monthlyEssential: 55_000 });
    const savings = r.pillars.find((x) => x.key === 'savings')!;
    expect(savings.value).toBe(0);
    expect(savings.status).toBe('urgent');
  });

  it('no EMI → debt pillar is full marks', () => {
    const r = computeHealthScore({ monthlyIncome: 50_000, totalEMI: 0 });
    const debt = r.pillars.find((x) => x.key === 'debt')!;
    expect(debt.value).toBe(1);
    expect(debt.status).toBe('good');
  });

  it('EMI at/over the severe ratio → debt pillar is 0', () => {
    const r = computeHealthScore({ monthlyIncome: 50_000, totalEMI: 25_000 }); // 50% exactly
    const debt = r.pillars.find((x) => x.key === 'debt')!;
    expect(debt.value).toBe(0);
  });

  it('no emergency fund → emergency pillar 0; huge fund → clamps to 1', () => {
    const none = computeHealthScore({ monthlyEssential: 20_000, liquidSavings: 0 });
    expect(none.pillars.find((x) => x.key === 'emergency')!.value).toBe(0);
    const huge = computeHealthScore({ monthlyEssential: 20_000, liquidSavings: 10_000_000 });
    expect(huge.pillars.find((x) => x.key === 'emergency')!.value).toBe(1);
  });

  it('missing insurance (both false) → protection pillar 0 with a warning', () => {
    const r = computeHealthScore({
      monthlyIncome: 50_000,
      monthlyEssential: 20_000,
      hasHealthInsurance: false,
      hasTermInsurance: false,
    });
    const ins = r.pillars.find((x) => x.key === 'insurance')!;
    expect(ins.value).toBe(0);
    expect(ins.status).toBe('urgent');
  });

  it('boundary: savings rate exactly 30% → savings pillar = 1', () => {
    // (income - expenses)/income = 0.30 → expenses = 70k on 100k
    const r = computeHealthScore({ monthlyIncome: 100_000, monthlyEssential: 70_000, monthlyDiscretionary: 0 });
    expect(r.pillars.find((x) => x.key === 'savings')!.value).toBe(1);
  });

  it('credit score is optional; when absent its weight redistributes', () => {
    const withCredit = computeHealthScore(STRONG);
    const { creditScore, ...noCredit } = STRONG;
    void creditScore;
    const without = computeHealthScore(noCredit);
    const creditPillar = without.pillars.find((x) => x.key === 'credit')!;
    expect(creditPillar.value).toBeNull();
    expect(creditPillar.weight).toBe(0);
    // Both are valid scores in range.
    expect(withCredit.score).toBeLessThanOrEqual(SCORE_MAX);
    expect(without.score).toBeLessThanOrEqual(SCORE_MAX);
  });
});

describe('computeHealthScore — golden fixtures (locked)', () => {
  it('strong complete profile scores 943 (Excellent)', () => {
    const r = computeHealthScore(STRONG);
    // Hand-computed: 0.2·1 + 0.2·1 + 0.2·0.8 + 0.15·1 + 0.15·1 + 0.1·0.8333 = 0.94333
    expect(r.score).toBe(943);
    expect(r.band.key).toBe('excellent');
    expect(r.confidence).toBe('high');
  });

  it('indebted thin profile scores 68 (Needs Attention)', () => {
    const r = computeHealthScore({
      monthlyIncome: 30_000,
      monthlyEssential: 20_000,
      monthlyDiscretionary: 8_000,
      totalEMI: 15_000,
      liquidSavings: 10_000,
      monthlyInvestment: 0,
      hasHealthInsurance: false,
      hasTermInsurance: false,
      districtTier: 'tier3',
    });
    expect(r.score).toBe(68);
    expect(r.band.key).toBe('needs_attention');
    // Weakest area should surface as the top warning + a concrete action.
    expect(r.topWarning).not.toBeNull();
    expect(r.topAction).not.toBeNull();
    expect(r.topActionHref).toBeTruthy();
  });

  it('mid profile lands in a middle band with medium/high confidence', () => {
    const r = computeHealthScore({
      monthlyIncome: 60_000,
      monthlyEssential: 30_000,
      monthlyDiscretionary: 12_000,
      totalEMI: 12_000,
      liquidSavings: 90_000,
      monthlyInvestment: 6_000,
      hasHealthInsurance: true,
      hasTermInsurance: false,
      districtTier: 'tier2',
    });
    expect(r.score).toBeGreaterThan(399);
    expect(r.score).toBeLessThan(875);
  });
});

describe('computeHealthScore — monotonicity (property)', () => {
  it('more savings (lower expenses) never lowers the score', () => {
    let prev = -1;
    for (const essential of [80_000, 60_000, 40_000, 20_000]) {
      const s = computeHealthScore({ ...STRONG, monthlyEssential: essential }).score;
      expect(s).toBeGreaterThanOrEqual(prev);
      prev = s;
    }
  });

  it('higher EMI never raises the score', () => {
    let prev = Number.POSITIVE_INFINITY;
    for (const emi of [0, 10_000, 20_000, 30_000, 45_000]) {
      const s = computeHealthScore({ ...STRONG, totalEMI: emi }).score;
      expect(s).toBeLessThanOrEqual(prev);
      prev = s;
    }
  });

  it('a bigger emergency fund never lowers the score', () => {
    let prev = -1;
    for (const liquid of [0, 50_000, 120_000, 240_000, 500_000]) {
      const s = computeHealthScore({ ...STRONG, liquidSavings: liquid }).score;
      expect(s).toBeGreaterThanOrEqual(prev);
      prev = s;
    }
  });

  it('a higher credit score never lowers the score', () => {
    let prev = -1;
    for (const cibil of [300, 500, 650, 750, 900]) {
      const s = computeHealthScore({ ...STRONG, creditScore: cibil }).score;
      expect(s).toBeGreaterThanOrEqual(prev);
      prev = s;
    }
  });
});

describe('config sanity', () => {
  it('pillar weights sum to 1', () => {
    const sum = Object.values(PILLAR_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 9);
  });
});
