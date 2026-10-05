'use client';
// HeroEstimator — a LIVE micro-calculator for the hero: monthly income and
// existing EMIs in, affordable new EMI and an indicative loan limit out. It uses
// the same estimateEligibility() as /calculators. The assumptions (50% of income
// towards EMIs, 8.75% rate, 20 years) are shown on the card; the full calculator
// lets the user edit them. An estimate only — never a bank eligibility result.
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { formatINR } from '@/lib/calculators';
import { estimateEligibility } from '@/lib/homeCalc';
import { track } from '@/lib/analytics';

const FOIR = 0.5;
const RATE = 8.75;
const YEARS = 20;

export default function HeroEstimator() {
  const mr = useLanguageStore((s) => s.language) === 'mr';
  const [income, setIncome] = useState(60_000);
  const [existing, setExisting] = useState(0);

  // Existing EMIs can never exceed what the income slider allows.
  const maxExisting = Math.round((income * 0.6) / 1000) * 1000;
  const emiNow = Math.min(existing, maxExisting);

  const r = useMemo(
    () => estimateEligibility({ monthlyIncome: income, existingEmi: emiNow, annualRate: RATE, tenureMonths: YEARS * 12, foir: FOIR }),
    [income, emiNow],
  );

  return (
    <div className="bk-preview-card relative overflow-hidden rounded-[36px] border border-slate-800 bg-slate-900/75 p-6 shadow-[0_20px_50px_rgba(251,191,36,0.08)] backdrop-blur-2xl md:p-8">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-base font-extrabold text-slate-100 font-deva">
          {mr ? 'तुमची गृहकर्ज क्षमता — झटपट' : 'Your home-loan capacity — instantly'}
        </h2>
        <span className="shrink-0 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
          {mr ? 'अंदाज' : 'Estimate'}
        </span>
      </div>

      <label className="block">
        <span className="mb-1 flex items-baseline justify-between text-sm text-slate-400 font-deva">
          <span>{mr ? 'मासिक उत्पन्न' : 'Monthly income'}</span>
          <span className="bk-sample-value text-lg font-black text-slate-100">{formatINR(income)}</span>
        </span>
        <input
          type="range"
          min={20_000}
          max={500_000}
          step={5_000}
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          aria-label={mr ? 'मासिक उत्पन्न' : 'Monthly income'}
          className="h-11 w-full"
        />
      </label>

      <label className="mt-2 block">
        <span className="mb-1 flex items-baseline justify-between text-sm text-slate-400 font-deva">
          <span>{mr ? 'सध्याचे मासिक EMI' : 'Existing monthly EMIs'}</span>
          <span className="bk-sample-value text-lg font-black text-slate-100">{formatINR(emiNow)}</span>
        </span>
        <input
          type="range"
          min={0}
          max={Math.max(1000, maxExisting)}
          step={1_000}
          value={emiNow}
          onChange={(e) => setExisting(Number(e.target.value))}
          aria-label={mr ? 'सध्याचे मासिक EMI' : 'Existing monthly EMIs'}
          className="h-11 w-full"
        />
      </label>

      <div className="mt-4 grid grid-cols-2 gap-3" aria-live="polite">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3">
          <p className="text-xs font-semibold text-slate-400 font-deva">{mr ? 'अंदाजे कर्ज मर्यादा' : 'Indicative loan limit'}</p>
          <p className="bk-sample-value mt-1 font-display text-2xl font-black text-amber-300">{formatINR(r.loanAmount)}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-3">
          <p className="text-xs font-semibold text-slate-400 font-deva">{mr ? 'परवडणारा नवीन EMI' : 'Affordable new EMI'}</p>
          <p className="bk-sample-value mt-1 font-display text-2xl font-black text-slate-100">
            <span className="whitespace-nowrap">{formatINR(r.affordableEmi)}</span>{" "}
            <span className="whitespace-nowrap text-xs font-semibold text-slate-400">{mr ? '/महिना' : '/mo'}</span>
          </p>
        </div>
      </div>

      <p className="mt-3 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-[11px] font-medium leading-snug text-slate-300 font-deva">
        {mr
          ? `गृहीत: उत्पन्नाच्या ${FOIR * 100}% पर्यंत EMI, ${RATE}% दर, ${YEARS} वर्षे. ही बँकेची पात्रता किंवा loan offer नाही — बँकेचे निकष वेगळे असू शकतात.`
          : `Assumes EMIs up to ${FOIR * 100}% of income, ${RATE}% rate, ${YEARS} years. This is not a bank eligibility result or a loan offer — bank criteria can differ.`}
      </p>

      <Link
        href="/calculators"
        onClick={() => track('homepage_primary_cta_clicked', { cta: 'hero_estimator_full' })}
        className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 text-sm font-extrabold text-slate-950 transition-colors hover:bg-amber-300 font-deva"
      >
        <Calculator className="h-4 w-4" />
        {mr ? 'दर, कालावधी बदला — पूर्ण कॅल्क्युलेटर' : 'Change rate & tenure — full calculator'}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
