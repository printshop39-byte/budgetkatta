'use client';
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

// Indicative city-wise precious-metal rates (mock data, refreshed manually).
// gold24 / gold22 are per 10g; silver is per 1kg — all in ₹.
type CityRate = { city: { en: string; mr: string }; gold24: number; gold22: number; silver: number };

const cityRates: CityRate[] = [
  { city: { en: 'Mumbai', mr: 'मुंबई' }, gold24: 72500, gold22: 66800, silver: 91200 },
  { city: { en: 'Delhi', mr: 'दिल्ली' }, gold24: 72650, gold22: 66950, silver: 91000 },
  { city: { en: 'Kolkata', mr: 'कोलकाता' }, gold24: 72480, gold22: 66780, silver: 91250 },
  { city: { en: 'Chennai', mr: 'चेन्नई' }, gold24: 73100, gold22: 67350, silver: 92800 },
  { city: { en: 'Bengaluru', mr: 'बेंगळुरू' }, gold24: 72550, gold22: 66850, silver: 91400 },
  { city: { en: 'Hyderabad', mr: 'हैदराबाद' }, gold24: 72520, gold22: 66820, silver: 91500 },
  { city: { en: 'Pune', mr: 'पुणे' }, gold24: 72530, gold22: 66830, silver: 91300 },
  { city: { en: 'Ahmedabad', mr: 'अहमदाबाद' }, gold24: 72600, gold22: 66900, silver: 91150 },
];

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function RatesPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
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
              {language === 'mr' ? 'सूचक दर' : 'Indicative'}
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
                {cityRates.map((c) => (
                  <tr key={c.city.en} className="border-b border-slate-800 last:border-0 transition-colors hover:bg-amber-400/5">
                    <td className="p-3 font-semibold text-slate-200 font-deva">{c.city[language]}</td>
                    <td className="p-3 text-right font-bold text-bk-gold">{inr(c.gold24)}</td>
                    <td className="p-3 text-right font-bold text-amber-300/90">{inr(c.gold22)}</td>
                    <td className="p-3 text-right font-bold text-slate-200">{inr(c.silver)}</td>
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
