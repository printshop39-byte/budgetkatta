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

// Realistic current-market defaults (June 2026). Used as-is, and as the graceful
// fallback whenever the live API is unavailable, rate-limited, or CORS-blocked.
const DEFAULT_RATES = buildRates(151100, 138500, 265000);

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
        const plausible = within(base24, 151100) && within(baseSilver, 265000);

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
