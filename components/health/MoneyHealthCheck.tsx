'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Info, ShieldCheck } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { useHealthCheckStore } from '@/store/healthCheckStore';
import { useThemeStore } from '@/store/themeStore';
import { computeHealthScore, type HealthProfileInput } from '@/lib/healthScore';
import { track } from '@/lib/analytics';
import {
  AGE_OPTIONS,
  CITY_TIER_OPTIONS,
  GOAL_OPTIONS,
  HC,
  TIMELINE_OPTIONS,
  pick,
  type Bi,
} from '@/lib/healthCheckContent';
import HealthResult from './HealthResult';
import type { Language } from '@/types';

// ── Input primitives ──────────────────────────────────────────────────────

function CurrencyInput({
  id,
  value,
  onChange,
  ariaLabel,
}: {
  id: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  ariaLabel: string;
}) {
  const display = value === undefined ? '' : new Intl.NumberFormat('en-IN').format(value);
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400">₹</span>
      <input
        id={id}
        inputMode="numeric"
        aria-label={ariaLabel}
        value={display}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^\d]/g, '');
          onChange(digits === '' ? undefined : Number(digits));
        }}
        placeholder="0"
        className="w-full rounded-2xl border border-slate-700 bg-slate-950/50 py-3.5 pl-9 pr-4 text-lg font-semibold tabular-nums text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-amber-400/70 focus-visible:ring-2 focus-visible:ring-amber-400/40"
      />
    </div>
  );
}

function PresetChips({ presets, onPick, lang }: { presets: number[]; onPick: (v: number) => void; lang: Language }) {
  const fmt = (n: number) =>
    n >= 100000 ? `₹${n / 100000}L` : `₹${new Intl.NumberFormat(lang === 'mr' ? 'en-IN' : 'en-IN').format(n / 1000)}k`;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {presets.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPick(p)}
          className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-semibold text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
        >
          {fmt(p)}
        </button>
      ))}
    </div>
  );
}

function ChoiceGroup<T extends string | number>({
  options,
  value,
  onChange,
  lang,
}: {
  options: { value: T; label: Bi }[];
  value: T | undefined;
  onChange: (v: T) => void;
  lang: Language;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={String(o.value)}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(o.value)}
            className={`rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
              selected
                ? 'border-amber-400 bg-amber-400/15 text-amber-200'
                : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-amber-400/40 hover:text-amber-200'
            }`}
          >
            {pick(o.label, lang)}
          </button>
        );
      })}
    </div>
  );
}

function YesNo({ value, onChange, lang }: { value: boolean | undefined; onChange: (v: boolean) => void; lang: Language }) {
  const opts: { v: boolean; label: Bi }[] = [
    { v: true, label: { mr: 'होय', en: 'Yes' } },
    { v: false, label: { mr: 'नाही', en: 'No' } },
  ];
  return (
    <div className="flex gap-2.5">
      {opts.map((o) => {
        const selected = value === o.v;
        return (
          <button
            key={String(o.v)}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(o.v)}
            className={`min-w-[88px] rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
              selected
                ? 'border-amber-400 bg-amber-400/15 text-amber-200'
                : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-amber-400/40'
            }`}
          >
            {pick(o.label, lang)}
          </button>
        );
      })}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-sm font-semibold text-slate-200">{children}</label>;
}

// ── Step definitions ──────────────────────────────────────────────────────

type StepDef = {
  id: string;
  title: Bi;
  why: Bi;
  render: (a: HealthProfileInput, set: (p: Partial<HealthProfileInput>) => void, lang: Language) => React.ReactNode;
  validate?: (a: HealthProfileInput) => Bi | null;
};

const STEPS: StepDef[] = [
  {
    id: 'about',
    title: { mr: 'तुमच्याबद्दल', en: 'About you' },
    why: { mr: 'शहरानुसार शिफारस केलेली विमा रक्कम बदलते, म्हणून हे विचारतो.', en: 'Recommended cover benchmarks vary by city, so this tailors your result.' },
    render: (a, set, lang) => (
      <div className="space-y-6">
        <div>
          <FieldLabel>{lang === 'mr' ? 'वयोगट' : 'Age range'}</FieldLabel>
          <ChoiceGroup options={AGE_OPTIONS} value={a.ageRange} onChange={(v) => set({ ageRange: v })} lang={lang} />
        </div>
        <div>
          <FieldLabel>{lang === 'mr' ? 'तुम्ही कुठे राहता?' : 'Where do you live?'}</FieldLabel>
          <ChoiceGroup options={CITY_TIER_OPTIONS} value={a.districtTier} onChange={(v) => set({ districtTier: v })} lang={lang} />
        </div>
      </div>
    ),
  },
  {
    id: 'income',
    title: { mr: 'मासिक उत्पन्न', en: 'Monthly income' },
    why: { mr: 'तुमची बचत, EMI व गुंतवणूक उत्पन्नाशी तुलना करून स्कोअर ठरतो.', en: 'Your score compares savings, EMIs and investing against income.' },
    render: (a, set, lang) => (
      <div>
        <FieldLabel>{lang === 'mr' ? 'निव्वळ घरगुती उत्पन्न (दरमहा)' : 'Net household income (per month)'}</FieldLabel>
        <CurrencyInput id="income" value={a.monthlyIncome} onChange={(v) => set({ monthlyIncome: v })} ariaLabel={lang === 'mr' ? 'मासिक उत्पन्न रुपये' : 'Monthly income in rupees'} />
        <PresetChips presets={[25000, 50000, 100000, 200000]} onPick={(v) => set({ monthlyIncome: v })} lang={lang} />
      </div>
    ),
    validate: (a) => (a.monthlyIncome && a.monthlyIncome > 0 ? null : { mr: 'कृपया तुमचे मासिक उत्पन्न भरा.', en: 'Please enter your monthly income.' }),
  },
  {
    id: 'expenses',
    title: { mr: 'मासिक खर्च', en: 'Monthly expenses' },
    why: { mr: 'अत्यावश्यक व ऐच्छिक खर्च तुम्ही किती बचत करू शकता हे दाखवतात.', en: 'Essential vs discretionary expenses show how much you can save.' },
    render: (a, set, lang) => (
      <div className="space-y-6">
        <div>
          <FieldLabel>{lang === 'mr' ? 'अत्यावश्यक खर्च (भाडे, किराणा, बिले)' : 'Essential expenses (rent, groceries, bills)'}</FieldLabel>
          <CurrencyInput id="essential" value={a.monthlyEssential} onChange={(v) => set({ monthlyEssential: v })} ariaLabel={lang === 'mr' ? 'अत्यावश्यक खर्च' : 'Essential expenses'} />
          <PresetChips presets={[15000, 30000, 50000, 80000]} onPick={(v) => set({ monthlyEssential: v })} lang={lang} />
        </div>
        <div>
          <FieldLabel>
            {lang === 'mr' ? 'ऐच्छिक खर्च (बाहेर जेवण, खरेदी)' : 'Discretionary expenses (dining, shopping)'}{' '}
            <span className="font-normal text-slate-500">({pick(HC.optional, lang)})</span>
          </FieldLabel>
          <CurrencyInput id="discretionary" value={a.monthlyDiscretionary} onChange={(v) => set({ monthlyDiscretionary: v })} ariaLabel={lang === 'mr' ? 'ऐच्छिक खर्च' : 'Discretionary expenses'} />
        </div>
      </div>
    ),
    validate: (a) => (a.monthlyEssential !== undefined ? null : { mr: 'कृपया तुमचा अत्यावश्यक खर्च भरा.', en: 'Please enter your essential expenses.' }),
  },
  {
    id: 'debt-savings',
    title: { mr: 'कर्ज व बचत', en: 'Debt & savings' },
    why: { mr: 'EMI, आपत्कालीन निधी व गुंतवणूक हे स्कोअरचे तीन महत्त्वाचे घटक आहेत.', en: 'EMIs, emergency fund and investing are three of the six score pillars.' },
    render: (a, set, lang) => (
      <div className="space-y-6">
        <div>
          <FieldLabel>{lang === 'mr' ? 'एकूण मासिक EMI (सर्व कर्जे)' : 'Total monthly EMI (all loans)'} <span className="font-normal text-slate-500">({pick(HC.optional, lang)})</span></FieldLabel>
          <CurrencyInput id="emi" value={a.totalEMI} onChange={(v) => set({ totalEMI: v })} ariaLabel={lang === 'mr' ? 'एकूण EMI' : 'Total EMI'} />
        </div>
        <div>
          <FieldLabel>{lang === 'mr' ? 'सध्याची रोख बचत / आपत्कालीन निधी' : 'Current liquid savings / emergency fund'} <span className="font-normal text-slate-500">({pick(HC.optional, lang)})</span></FieldLabel>
          <CurrencyInput id="savings" value={a.liquidSavings} onChange={(v) => set({ liquidSavings: v })} ariaLabel={lang === 'mr' ? 'रोख बचत' : 'Liquid savings'} />
        </div>
        <div>
          <FieldLabel>{lang === 'mr' ? 'दरमहा गुंतवणूक / SIP' : 'Monthly investment / SIP'} <span className="font-normal text-slate-500">({pick(HC.optional, lang)})</span></FieldLabel>
          <CurrencyInput id="invest" value={a.monthlyInvestment} onChange={(v) => set({ monthlyInvestment: v })} ariaLabel={lang === 'mr' ? 'मासिक गुंतवणूक' : 'Monthly investment'} />
        </div>
      </div>
    ),
  },
  {
    id: 'protection',
    title: { mr: 'संरक्षण (विमा)', en: 'Protection (insurance)' },
    why: { mr: 'वैद्यकीय किंवा उत्पन्नाच्या धक्क्यापासून विमा तुमची बचत वाचवतो.', en: 'Insurance shields your savings from medical or income shocks.' },
    render: (a, set, lang) => (
      <div className="space-y-6">
        <div>
          <FieldLabel>{lang === 'mr' ? 'तुमच्याकडे आरोग्य विमा आहे का?' : 'Do you have health insurance?'}</FieldLabel>
          <YesNo value={a.hasHealthInsurance} onChange={(v) => set({ hasHealthInsurance: v })} lang={lang} />
          {a.hasHealthInsurance && (
            <div className="mt-3">
              <FieldLabel>{lang === 'mr' ? 'विमा रक्कम (कव्हर)' : 'Cover amount'} <span className="font-normal text-slate-500">({pick(HC.optional, lang)})</span></FieldLabel>
              <CurrencyInput id="healthCover" value={a.healthCoverAmount} onChange={(v) => set({ healthCoverAmount: v })} ariaLabel={lang === 'mr' ? 'आरोग्य विमा कव्हर' : 'Health cover amount'} />
            </div>
          )}
        </div>
        <div>
          <FieldLabel>{lang === 'mr' ? 'तुमच्याकडे टर्म (जीवन) विमा आहे का?' : 'Do you have term (life) insurance?'}</FieldLabel>
          <YesNo value={a.hasTermInsurance} onChange={(v) => set({ hasTermInsurance: v })} lang={lang} />
          {a.hasTermInsurance && (
            <div className="mt-3">
              <FieldLabel>{lang === 'mr' ? 'जीवन विमा कव्हर' : 'Life cover amount'} <span className="font-normal text-slate-500">({pick(HC.optional, lang)})</span></FieldLabel>
              <CurrencyInput id="lifeCover" value={a.lifeCoverAmount} onChange={(v) => set({ lifeCoverAmount: v })} ariaLabel={lang === 'mr' ? 'जीवन विमा कव्हर' : 'Life cover amount'} />
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    id: 'goal',
    title: { mr: 'तुमचे ध्येय', en: 'Your goal' },
    why: { mr: 'तुमचे मुख्य ध्येय योजना ठरवते; क्रेडिट स्कोअर (पर्यायी) अचूकता वाढवतो.', en: 'Your main goal shapes the plan; a credit score (optional) improves accuracy.' },
    render: (a, set, lang) => (
      <div className="space-y-6">
        <div>
          <FieldLabel>{lang === 'mr' ? 'मुख्य आर्थिक ध्येय' : 'Primary financial goal'}</FieldLabel>
          <ChoiceGroup options={GOAL_OPTIONS} value={a.primaryGoal} onChange={(v) => set({ primaryGoal: v })} lang={lang} />
        </div>
        <div>
          <FieldLabel>{lang === 'mr' ? 'कालमर्यादा' : 'Target timeline'}</FieldLabel>
          <ChoiceGroup options={TIMELINE_OPTIONS} value={a.targetTimelineYears} onChange={(v) => set({ targetTimelineYears: v })} lang={lang} />
        </div>
        <div>
          <FieldLabel>
            {lang === 'mr' ? 'क्रेडिट स्कोअर (CIBIL) माहित असल्यास' : 'Credit score (CIBIL), if known'}{' '}
            <span className="font-normal text-slate-500">({pick(HC.optional, lang)})</span>
          </FieldLabel>
          <input
            id="credit"
            inputMode="numeric"
            aria-label={lang === 'mr' ? 'क्रेडिट स्कोअर' : 'Credit score'}
            value={a.creditScore ?? ''}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^\d]/g, '');
              set({ creditScore: digits === '' ? undefined : Number(digits) });
            }}
            placeholder="300–900"
            className="w-40 rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3.5 text-lg font-semibold tabular-nums text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-amber-400/70 focus-visible:ring-2 focus-visible:ring-amber-400/40"
          />
        </div>
      </div>
    ),
  },
];

// ── Orchestrator ──────────────────────────────────────────────────────────

export default function MoneyHealthCheck() {
  const lang = useLanguageStore((s) => s.language);
  const { answers, step, set, goTo, reset } = useHealthCheckStore();
  // Theme-aware error rose (readable in both themes without the global text-rose rule).
  const dark = useThemeStore((s) => s.theme) === 'dark';
  const errRose = dark ? '#fda4af' : '#be123c'; // rose-300 / rose-700
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<Bi | null>(null);
  const startedRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => setMounted(true), []);

  // Fire "started" once per visit when the flow becomes interactive.
  useEffect(() => {
    if (mounted && !startedRef.current) {
      startedRef.current = true;
      track('health_check_started');
    }
  }, [mounted]);

  const atResult = step >= STEPS.length;
  const result = useMemo(() => (atResult ? computeHealthScore(answers) : null), [atResult, answers]);

  if (!mounted) {
    return <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-3xl border border-slate-800 bg-slate-900/40" aria-hidden />;
  }

  if (atResult && result) {
    return (
      <HealthResult
        result={result}
        lang={lang}
        onRevise={() => {
          setError(null);
          goTo(0);
        }}
      />
    );
  }

  const current = STEPS[Math.min(step, STEPS.length - 1)];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    const err = current.validate?.(answers) ?? null;
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    track('health_check_step_completed', { step: step + 1, stepId: current.id });
    if (isLast) {
      track('health_check_completed', { confidence: computeHealthScore(answers).confidence });
      goTo(STEPS.length);
    } else {
      goTo(step + 1);
    }
    headingRef.current?.focus();
  };

  const handleBack = () => {
    setError(null);
    goTo(Math.max(0, step - 1));
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>
            {pick(HC.stepOf, lang)} {step + 1} {pick(HC.of, lang)} {STEPS.length}
          </span>
          <span className="tabular-nums text-slate-500">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length}>
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Keyed by the step id so React swaps step content IMMEDIATELY on
          Continue/Back. No AnimatePresence exit gate — progression never waits
          on an exit animation or requestAnimationFrame, so it stays usable even
          when the compositor/rAF is throttled or paused. Content renders at its
          final, visible state (no opacity/transform initial) → SSR-visible,
          reduced-motion-safe, and no hydration mismatch. */}
      <div key={current.id}>
          <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold text-slate-50 outline-none">
            {pick(current.title, lang)}
          </h2>

          {/* Why we ask */}
          <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-slate-400">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span>
              <span className="font-semibold text-slate-300">{pick(HC.whyLabel, lang)}:</span> {pick(current.why, lang)}
            </span>
          </p>

          <div className="mt-6">{current.render(answers, set, lang)}</div>

          {error && (
            <p role="alert" className="mt-4 text-sm font-semibold" style={{ color: errRose }}>
              {pick(error, lang)}
            </p>
          )}
      </div>

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors enabled:hover:bg-slate-800 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
        >
          <ArrowLeft className="h-4 w-4" /> {pick(HC.back, lang)}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-7 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
        >
          {isLast ? pick(HC.seeResult, lang) : pick(HC.next, lang)} <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Trust strip */}
      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-800 pt-5">
        {HC.trust.map((tItem, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/70" /> {pick(tItem, lang)}
          </span>
        ))}
      </div>

      {/* Reset (dev-friendly + genuine "start over") */}
      {step > 0 && (
        <button
          type="button"
          onClick={() => {
            reset();
            setError(null);
          }}
          className="mt-4 text-[11px] font-semibold text-slate-600 underline-offset-2 hover:text-slate-400 hover:underline"
        >
          {lang === 'mr' ? 'सुरुवातीपासून सुरू करा' : 'Start over'}
        </button>
      )}
    </div>
  );
}
