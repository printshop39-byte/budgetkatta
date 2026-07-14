'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { track } from '@/lib/analytics';
import type { Language } from '@/types';

type Bi = { mr: string; en: string };
const pick = (b: Bi, lang: Language) => (lang === 'mr' ? b.mr : b.en);

const COPY = {
  eyebrow: { mr: 'कसे काम करते', en: 'How it works' } as Bi,
  title: { mr: '३ सोप्या पायऱ्यांत घराच्या ध्येयासाठी आर्थिक तयारी', en: 'Your financial readiness for a home goal in 3 simple steps' } as Bi,
  steps: [
    {
      t: { mr: 'माहिती भरा', en: 'Enter your details' } as Bi,
      d: { mr: 'उत्पन्न, सध्याचे EMI, बचत व आर्थिक संरक्षण — रेंजमध्ये चालेल. नाव, OTP किंवा कार्ड लागत नाही.', en: 'Income, existing EMIs, savings & financial protection — ranges are fine. No name, OTP or card.' } as Bi,
    },
    {
      t: { mr: 'मोफत अंदाज व कृती', en: 'Free estimate & action' } as Bi,
      d: { mr: '० ते १००० चा प्राथमिक शैक्षणिक तयारी-अंदाज, तुमची सर्वात महत्त्वाची कृती व संबंधित साधन. हा eligibility report नाही.', en: 'A 0–1000 preliminary educational readiness estimate, your top action and the right tool. Not an eligibility report.' } as Bi,
    },
    {
      t: { mr: '₹९९ चा ९०-दिवसांचा प्लॅन', en: '₹99 90-day plan' } as Bi,
      d: { mr: 'हवे असल्यास — ३०/६०/९० दिवसांची कृती योजना व सुधारणा-सिम्युलेशन (लवकरच).', en: 'Optional — a 30/60/90-day action plan and improvement simulation (coming soon).' } as Bi,
    },
  ],
  sampleTag: { mr: 'झलक', en: 'Preview' } as Bi,
  sampleBand: { mr: 'ठीक', en: 'Fair' } as Bi,
  // Real engine pillars (savings / emergency fund / protection) — the promo must
  // reflect what the generic engine actually measures, not property-specific
  // metrics it does not compute.
  samplePillars: [
    { label: { mr: 'बचत दर', en: 'Savings rate' } as Bi, status: 'good' as const },
    { label: { mr: 'आपत्कालीन निधी', en: 'Emergency fund' } as Bi, status: 'attention' as const },
    { label: { mr: 'संरक्षण', en: 'Protection' } as Bi, status: 'urgent' as const },
  ],
  sampleNote: { mr: 'केवळ इंटरफेस झलक — तुमच्या माहितीवरून गणना केलेली नाही, हा loan offer नाही.', en: 'Illustrative interface preview — not calculated from your data, not a loan offer.' } as Bi,
  cta: { mr: 'घराच्या ध्येयासाठी माझी आर्थिक तयारी तपासा — मोफत', en: 'Check my financial readiness for a home goal — Free' } as Bi,
};

const CHIP: Record<string, { cls: string; label: Bi }> = {
  good: { cls: 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300', label: { mr: 'चांगले', en: 'Good' } },
  attention: { cls: 'bg-amber-500/10 border-amber-400/30 text-amber-300', label: { mr: 'लक्ष द्या', en: 'Needs attention' } },
  urgent: { cls: 'bg-rose-500/10 border-rose-400/30 text-rose-300', label: { mr: 'तातडीचे', en: 'Urgent' } },
};

export default function MoneyHealthPromo() {
  const lang = useLanguageStore((s) => s.language);

  // Static sample dial — 612/1000.
  const R = 46;
  const C = 2 * Math.PI * R;

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-300">{pick(COPY.eyebrow, lang)}</span>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold leading-[1.3] text-slate-50 md:text-4xl">
          {pick(COPY.title, lang)}
        </h2>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
        {/* Steps */}
        <ol className="space-y-4">
          {COPY.steps.map((s, i) => (
            <li key={i} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-sm font-black text-amber-300">
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold text-slate-100">{pick(s.t, lang)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{pick(s.d, lang)}</p>
              </div>
            </li>
          ))}
          <li>
            <Link
              href="/health-check"
              onClick={() => track('homepage_primary_cta_clicked', { cta: 'promo' })}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-7 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              {pick(COPY.cta, lang)} <ArrowRight className="h-4 w-4" />
            </Link>
          </li>
        </ol>

        {/* Sample report preview — clearly labelled as a sample layout. */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {pick(COPY.sampleTag, lang)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> {pick({ mr: 'घराच्या ध्येयासाठी आर्थिक तयारी', en: 'Financial Readiness for a Home Goal' }, lang)}
            </span>
          </div>

          {/* Prominent illustrative label — not a tucked-away footnote */}
          <p className="mt-4 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-[11px] font-medium leading-snug text-slate-300">
            {pick(COPY.sampleNote, lang)}
          </p>

          <div className="mt-4 flex items-center gap-6">
            <div className="relative h-28 w-28 shrink-0" role="img" aria-label="Illustrative preview dial, not calculated">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="9" />
                <circle cx="60" cy="60" r={R} fill="none" stroke="#fbbf24" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - 612 / 1000)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-50">612</span>
                <span className="text-[10px] font-semibold text-slate-500">/ 1000</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-100">{pick(COPY.sampleBand, lang)}</p>
              <div className="mt-3 space-y-2">
                {COPY.samplePillars.map((p, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-300">{pick(p.label, lang)}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${CHIP[p.status].cls}`}>
                      {pick(CHIP[p.status].label, lang)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
