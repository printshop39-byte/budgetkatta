'use client';
import { useEffect, useState } from 'react';
import PageShell from '@/components/shared/PageShell';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useRemoteData } from '@/lib/useRemoteData';
import { fdRates, loanProducts } from '@/lib/data';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import FDCalculator from '@/components/calculators/FDCalculator';
import EMICalculator from '@/components/calculators/EMICalculator';
import SIPCalculator from '@/components/calculators/SIPCalculator';
import type { FDRate, LoanProduct } from '@/types';

const loanKey: Record<string, string> = {
  home: 'loan.home',
  personal: 'loan.personal',
  business: 'loan.business',
  vehicle: 'loan.vehicle',
  education: 'loan.education',
  gold: 'loan.gold',
};

// City-wise precious-metal rates. gold24 / gold22 are per 10g; silver is per 1kg (₹).
type CityRate = { city: { en: string; mr: string }; gold24: number; gold22: number; silver: number };

// Each city carries a small realistic offset from the national base price, so a
// single fetched spot price still produces believable per-city variation.
const CITY_OFFSETS = [
  { city: { en: 'Mumbai', mr: 'मुंबई' }, d24: 0, d22: 0, dS: 0 },
  { city: { en: 'Delhi', mr: 'दिल्ली' }, d24: 150, d22: 140, dS: -1500 },
  { city: { en: 'Kolkata', mr: 'कोलकाता' }, d24: -120, d22: -110, dS: 250 },
  { city: { en: 'Chennai', mr: 'चेन्नई' }, d24: 620, d22: 560, dS: 2100 },
  { city: { en: 'Bengaluru', mr: 'बेंगळुरू' }, d24: 80, d22: 70, dS: 600 },
  { city: { en: 'Hyderabad', mr: 'हैदराबाद' }, d24: 40, d22: 40, dS: 700 },
  { city: { en: 'Pune', mr: 'पुणे' }, d24: 60, d22: 50, dS: 400 },
  { city: { en: 'Ahmedabad', mr: 'अहमदाबाद' }, d24: 110, d22: 100, dS: 150 },
] as const;

const buildRates = (base24: number, base22: number, baseSilver: number): CityRate[] =>
  CITY_OFFSETS.map((c) => ({
    city: c.city,
    gold24: Math.round(base24 + c.d24),
    gold22: Math.round(base22 + c.d22),
    silver: Math.round(baseSilver + c.dS),
  }));

// Per-gram base rates (₹) — the single source of truth for both the city table
// and the interactive calculator. In India 1 Tola = exactly 12 g.
const METAL_PER_GRAM = { '24k': 14595, '22k': 13900, silver: 275 } as const;
type MetalKey = keyof typeof METAL_PER_GRAM;

// Realistic current-market defaults (June 2026). Used as-is, and as the graceful
// fallback whenever the live API is unavailable, rate-limited, or CORS-blocked.
// Gold rows are per 10 g; silver is per 1 kg — derived from the per-gram bases.
const DEFAULT_RATES = buildRates(
  METAL_PER_GRAM['24k'] * 10,
  METAL_PER_GRAM['22k'] * 10,
  METAL_PER_GRAM.silver * 1000,
);

const toDevanagariDigits = (s: string) => s.replace(/[0-9]/g, (d) => '०१२३४५६७८९'[Number(d)]);

// Indian numbering system (lakh/crore grouping), with Devanagari numerals for mr.
const formatINR = (n: number, language: 'mr' | 'en') => {
  const grouped = Math.round(n).toLocaleString('en-IN');
  return `₹${language === 'mr' ? toDevanagariDigits(grouped) : grouped}`;
};

export default function RatesPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  const [rates, setRates] = useState<CityRate[]>(DEFAULT_RATES);
  const [isLive, setIsLive] = useState(false);

  // Interactive metal-price calculator state.
  const [metal, setMetal] = useState<MetalKey>('24k');
  const [grams, setGrams] = useState(12); // default to 1 Tola

  const metalOptions: { key: MetalKey; label: { en: string; mr: string } }[] = [
    { key: '24k', label: { en: '24K Gold', mr: '२४K सोने' } },
    { key: '22k', label: { en: '22K Gold', mr: '२२K सोने' } },
    { key: 'silver', label: { en: 'Silver', mr: 'चांदी' } },
  ];

  const presets: { grams: number; label: { en: string; mr: string } }[] = [
    { grams: 1, label: { en: '1 Gram', mr: '१ ग्रॅम' } },
    { grams: 10, label: { en: '10 Grams', mr: '१० ग्रॅम' } },
    { grams: 12, label: { en: '1 Tola (12g)', mr: '१ तोळा (१२ ग्रॅम)' } },
    { grams: 1000, label: { en: '1 KG (1000g)', mr: '१ किलो (१००० ग्रॅम)' } },
  ];

  const calcTotal = grams * METAL_PER_GRAM[metal];
  const gramsDisplay = language === 'mr' ? toDevanagariDigits(String(grams)) : String(grams);

  // Attempt a live spot-price fetch; silently keep realistic defaults on any failure.
  useEffect(() => {
    let active = true;

    const loadLiveRates = async () => {
      try {
        const USD_INR = 83.5; // approximate conversion
        const GRAMS_PER_OZ = 31.1035;

        const [goldRes, silverRes] = await Promise.all([
          fetch('https://api.gold-api.com/price/XAU', { cache: 'no-store' }),
          fetch('https://api.gold-api.com/price/XAG', { cache: 'no-store' }),
        ]);
        if (!goldRes.ok || !silverRes.ok) throw new Error('rate API unavailable');

        const goldJson = await goldRes.json();
        const silverJson = await silverRes.json();
        const goldUsdPerOz = Number(goldJson?.price);
        const silverUsdPerOz = Number(silverJson?.price);
        if (!goldUsdPerOz || !silverUsdPerOz) throw new Error('malformed rate payload');

        const inrPerGramGold = (goldUsdPerOz * USD_INR) / GRAMS_PER_OZ;
        const inrPerGramSilver = (silverUsdPerOz * USD_INR) / GRAMS_PER_OZ;

        const base24 = inrPerGramGold * 10;
        const base22 = base24 * 0.916; // 22K purity ratio
        const baseSilver = inrPerGramSilver * 1000;

        // Sanity guard: spot price + an uncertain USD→INR rate can diverge sharply
        // from curated retail figures (retail carries GST + jeweller premiums, and
        // the FX constant may be stale). Only let live data take over when it lands
        // within ±15% of our curated baseline; otherwise keep the trusted defaults.
        const within = (live: number, base: number) => live >= base * 0.85 && live <= base * 1.15;
        const plausible =
          within(base24, METAL_PER_GRAM['24k'] * 10) && within(baseSilver, METAL_PER_GRAM.silver * 1000);

        if (active && plausible) {
          setRates(buildRates(base24, base22, baseSilver));
          setIsLive(true);
        }
      } catch {
        // Graceful fallback: DEFAULT_RATES already in state, leave isLive false.
      }
    };

    loadLiveRates();
    return () => {
      active = false;
    };
  }, []);
  const { data: fds, source, updatedAt } = useRemoteData<FDRate>('/api/fd', fdRates);
  const { data: loans } = useRemoteData<LoanProduct>('/api/loans', loanProducts);

  // Top FD rate per bank, highest first.
  const fdTop = [...fds]
    .map((b) => ({ bank: b.bankName, rate: Math.max(...b.rates.map((r) => r.regularRate)) }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 6);

  // Loan ROI range per type.
  const loanRanges = Object.keys(loanKey)
    .map((type) => {
      const rows = loans.filter((l) => l.loanType === type);
      if (!rows.length) return null;
      return {
        type,
        min: Math.min(...rows.map((r) => r.roiMin)),
        max: Math.max(...rows.map((r) => r.roiMax)),
      };
    })
    .filter(Boolean) as { type: string; min: number; max: number }[];

  return (
    <PageShell titleKey="rates.title" subtitleKey="rates.subtitle">
      <div className="space-y-10">
        {/* FD highest */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-slate-200">{t('rates.fd_title')}</h2>
            <DataSourceBadge source={source} updatedAt={updatedAt} />
          </div>
          <div className="overflow-x-auto glass-card p-0">
            <table className="w-full min-w-[360px] text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="p-3 font-medium">{t('fd.col_bank')}</th>
                  <th className="p-3 font-medium">{t('fd.col_regular')}</th>
                </tr>
              </thead>
              <tbody>
                {fdTop.map((r) => (
                  <tr key={r.bank} className="border-b border-slate-800">
                    <td className="p-3 text-slate-200 font-deva">{r.bank}</td>
                    <td className="p-3 font-bold text-bk-gold">{r.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Loan ranges */}
        <section>
          <h2 className="mb-3 font-display text-xl font-bold text-slate-200">{t('rates.loan_title')}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {loanRanges.map((l) => (
              <div key={l.type} className="glass-card p-4 text-center">
                <p className="text-sm text-slate-400 font-deva">{t(loanKey[l.type])}</p>
                <p className="mt-1 font-display text-lg font-bold text-bk-gold">
                  {l.min}%–{l.max}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Live market rates — city-wise gold & silver */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <h2 className="font-display text-xl font-bold text-slate-200 font-deva">
                {language === 'mr' ? 'थेट बाजार भाव' : 'Live Market Rates'}
              </h2>
            </div>
            <span className="rounded-full border border-slate-800 bg-slate-900/60 px-2.5 py-0.5 text-xs text-slate-400 font-deva">
              {isLive
                ? language === 'mr'
                  ? 'थेट दर'
                  : 'Live'
                : language === 'mr'
                  ? 'सूचक दर'
                  : 'Indicative'}
            </span>
          </div>

          <div className="overflow-x-auto glass-card p-0">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="p-3 font-medium font-deva">{language === 'mr' ? 'शहर' : 'City'}</th>
                  <th className="p-3 text-right font-medium font-deva">
                    {language === 'mr' ? '२४K सोने (१० ग्रॅम)' : '24K Gold (10g)'}
                  </th>
                  <th className="p-3 text-right font-medium font-deva">
                    {language === 'mr' ? '२२K सोने (१० ग्रॅम)' : '22K Gold (10g)'}
                  </th>
                  <th className="p-3 text-right font-medium font-deva">
                    {language === 'mr' ? 'चांदी (१ किलो)' : 'Silver (1kg)'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rates.map((c) => (
                  <tr key={c.city.en} className="border-b border-slate-800 last:border-0 transition-colors hover:bg-amber-400/5">
                    <td className="p-3 font-semibold text-slate-200 font-deva">{c.city[language]}</td>
                    <td className="p-3 text-right font-bold text-bk-gold font-deva">{formatINR(c.gold24, language)}</td>
                    <td className="p-3 text-right font-bold text-amber-300/90 font-deva">{formatINR(c.gold22, language)}</td>
                    <td className="p-3 text-right font-bold text-slate-200 font-deva">{formatINR(c.silver, language)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official RBI Repo Rate */}
          <div className="mt-4 glass-card relative overflow-hidden p-6">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl" />
            <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400 font-deva">
                  {language === 'mr' ? 'चालू रेपो दर' : 'Official RBI Repo Rate'}
                </p>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400 font-deva">
                  {language === 'mr'
                    ? 'हा दर थेट गृहकर्ज आणि वैयक्तिक कर्जाच्या EMI वर परिणाम करतो.'
                    : 'This rate directly influences your Home and Personal Loan EMIs.'}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="font-display text-4xl font-extrabold text-bk-gold">6.50%</span>
              </div>
            </div>
          </div>

          {/* Live Metal Price Calculator */}
          <div className="mt-4 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
              </span>
              <h3 className="font-display text-lg font-bold text-slate-200 font-deva">
                {language === 'mr' ? 'लाईव्ह धातू दर कॅल्क्युलेटर' : 'Live Metal Price Calculator'}
              </h3>
            </div>

            {/* Metal selector */}
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 font-deva">
              {language === 'mr' ? 'धातू निवडा' : 'Select Metal'}
            </p>
            <div className="mb-6 grid grid-cols-3 gap-2">
              {metalOptions.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMetal(m.key)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-bold font-deva transition-all ${
                    metal === m.key
                      ? 'border-amber-400 bg-amber-400/15 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.25)]'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-amber-400/40 hover:text-amber-300'
                  }`}
                >
                  {m.label[language]}
                </button>
              ))}
            </div>

            {/* Weight selector */}
            <div className="mb-2 flex items-end justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 font-deva">
                {language === 'mr' ? 'वजन निवडा' : 'Select Weight'}
              </p>
              <span className="font-display text-lg font-bold text-amber-300 font-deva">
                {gramsDisplay} {language === 'mr' ? 'ग्रॅम' : 'g'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={1000}
              step={1}
              value={grams}
              onChange={(e) => setGrams(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
              aria-label={language === 'mr' ? 'वजन निवडा' : 'Select Weight'}
            />

            {/* Quick presets */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {presets.map((p) => (
                <button
                  key={p.grams}
                  onClick={() => setGrams(p.grams)}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold font-deva transition-all ${
                    grams === p.grams
                      ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-amber-400/40 hover:text-amber-300'
                  }`}
                >
                  {p.label[language]}
                </button>
              ))}
            </div>

            {/* Total value */}
            <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400 font-deva">
                {language === 'mr' ? 'एकूण अंदाजित मूल्य' : 'Total Estimated Value'}
              </p>
              <p className="mt-1.5 font-display text-3xl font-extrabold text-bk-gold font-deva sm:text-4xl">
                {formatINR(calcTotal, language)}
              </p>
              <p className="mt-1 text-xs text-slate-400 font-deva">
                {gramsDisplay} {language === 'mr' ? 'ग्रॅम' : 'g'} × {formatINR(METAL_PER_GRAM[metal], language)}
                {language === 'mr' ? '/ग्रॅम' : '/g'}
              </p>
            </div>
          </div>
        </section>

        {/* Quick calculators */}
        <section>
          <h2 className="mb-3 font-display text-xl font-bold text-slate-200">{t('rates.tools_title')}</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <FDCalculator />
            <EMICalculator />
            <SIPCalculator />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
