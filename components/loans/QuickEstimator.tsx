'use client';
// QuickEstimator — price + own-contribution sliders -> loan amount and EMI at
// the user's assumed rate. The rate is an editable ASSUMPTION (not a bank
// offer); the full set of calculators lives on /calculators.
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calculator } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { calculateEMI, formatINR } from '@/lib/calculators';
import { estimateDownPayment } from '@/lib/homeCalc';

export default function QuickEstimator() {
  const mr = useLanguageStore((s) => s.language) === 'mr';
  const [price, setPrice] = useState(5_000_000);
  const [margin, setMargin] = useState(20);
  const [rate, setRate] = useState(8.75);
  const [years, setYears] = useState(20);

  const split = useMemo(() => estimateDownPayment({ propertyPrice: price, marginPercent: margin }), [price, margin]);
  const emi = useMemo(() => calculateEMI(split.loanNeeded, rate, Math.max(1, years * 12)), [split.loanNeeded, rate, years]);

  return (
    <section aria-label={mr ? 'गृहकर्ज अंदाज' : 'Loan estimator'} className="glass-card glass-card-gold mb-8 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-slate-100 font-deva">
          {mr ? 'झटपट गृहकर्ज अंदाज' : 'Quick home-loan estimate'}
        </h2>
        <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-300 font-deva">
          {mr ? 'अंदाज — बँकेची मंजुरी नाही' : 'Estimate — not a bank approval'}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 flex justify-between text-sm text-slate-400 font-deva">
            <span>{mr ? 'घराची किंमत' : 'Property price'}</span>
            <span className="font-bold text-slate-100">{formatINR(price)}</span>
          </span>
          <input
            type="range"
            min={1_500_000}
            max={20_000_000}
            step={100_000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="h-11 w-full accent-amber-400"
          />
        </label>
        <label className="block">
          <span className="mb-1 flex justify-between text-sm text-slate-400 font-deva">
            <span>{mr ? 'स्वतःचा वाटा (Down Payment)' : 'Own contribution (down payment)'}</span>
            <span className="font-bold text-slate-100">{margin}% · {formatINR(split.downPayment)}</span>
          </span>
          <input
            type="range"
            min={10}
            max={50}
            step={1}
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="h-11 w-full accent-amber-400"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400 font-deva">{mr ? 'गृहीत व्याजदर (वार्षिक %)' : 'Assumed interest rate (% p.a.)'}</span>
          <input type="number" min={1} max={20} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="bk-input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400 font-deva">{mr ? 'कालावधी (वर्षे)' : 'Tenure (years)'}</span>
          <input type="number" min={1} max={30} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="bk-input" />
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 font-deva">{mr ? 'अंदाजे मासिक EMI' : 'Estimated monthly EMI'}</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-amber-400">{formatINR(emi.emi)}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 font-deva">{mr ? 'कर्ज रक्कम' : 'Loan amount'}</p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-100">{formatINR(split.loanNeeded)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500 font-deva">
          {mr
            ? 'व्याजदर तुमचा गृहीत दर आहे. बँकेचा प्रत्यक्ष दर पात्रतेनुसार ठरतो — खाली बँक तुलना पाहा.'
            : 'The rate is your assumption. The bank actual rate depends on eligibility — see the bank comparison below.'}
        </p>
        <Link
          href="/calculators"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-amber-400 px-5 text-sm font-bold text-slate-950 hover:bg-amber-300 font-deva"
        >
          <Calculator className="h-4 w-4" />
          {mr ? 'पात्रता व इतर कॅल्क्युलेटर' : 'Eligibility & more calculators'}
        </Link>
      </div>
    </section>
  );
}
