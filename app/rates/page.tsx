'use client';
import PageShell from '@/components/shared/PageShell';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useRemoteData } from '@/lib/useRemoteData';
import { fdRates, loanProducts } from '@/lib/data';
import { marketCards } from '@/lib/eduContent';
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
            <h2 className="font-display text-xl font-bold text-slate-800">{t('rates.fd_title')}</h2>
            <DataSourceBadge source={source} updatedAt={updatedAt} />
          </div>
          <div className="overflow-x-auto glass-card p-0">
            <table className="w-full min-w-[360px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-400">
                  <th className="p-3 font-medium">{t('fd.col_bank')}</th>
                  <th className="p-3 font-medium">{t('fd.col_regular')}</th>
                </tr>
              </thead>
              <tbody>
                {fdTop.map((r) => (
                  <tr key={r.bank} className="border-b border-slate-100">
                    <td className="p-3 text-slate-800 font-deva">{r.bank}</td>
                    <td className="p-3 font-bold text-bk-gold">{r.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Loan ranges */}
        <section>
          <h2 className="mb-3 font-display text-xl font-bold text-slate-800">{t('rates.loan_title')}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {loanRanges.map((l) => (
              <div key={l.type} className="glass-card p-4 text-center">
                <p className="text-sm text-slate-500 font-deva">{t(loanKey[l.type])}</p>
                <p className="mt-1 font-display text-lg font-bold text-bk-gold">
                  {l.min}%–{l.max}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Market info */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-slate-800">{t('rates.market_title')}</h2>
            <span className="rounded-full border border-slate-200 bg-slate-900/[0.035] px-2.5 py-0.5 text-xs text-slate-500 font-deva">
              {t('rates.sample_badge')}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {marketCards.map((c) => (
              <div key={c.title[language]} className="glass-card p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{c.icon}</span>
                  <h3 className="font-display text-base font-bold text-slate-800 font-deva">
                    {c.title[language]}
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {c.lines.map((line, i) => (
                    <li key={i} className="text-xs leading-relaxed text-slate-500 font-deva">
                      • {line[language]}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Quick calculators */}
        <section>
          <h2 className="mb-3 font-display text-xl font-bold text-slate-800">{t('rates.tools_title')}</h2>
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
