'use client';
import { useState } from 'react';
import Link from 'next/link';
import { fdRates } from '@/lib/data';
import { useRemoteData } from '@/lib/useRemoteData';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useCompareStore } from '@/store/compareStore';
import { useLeadFormStore } from '@/store/leadFormStore';
import FDCalculator from '@/components/calculators/FDCalculator';
import BadgeChip from '@/components/shared/BadgeChip';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import TableSkeleton from '@/components/shared/TableSkeleton';
import CalculatorDisclaimer from '@/components/shared/CalculatorDisclaimer';
import DocumentChecklist from '@/components/shared/DocumentChecklist';
import { fdDocuments } from '@/lib/documentChecklists';
import type { FDRate } from '@/types';

type Filter = 'all' | 'govt' | 'private';
type Tenure = 'all' | '12' | '36' | '60';

export default function FDPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const { addItem, items } = useCompareStore();
  const openLead = useLeadFormStore((s) => s.open);
  const [filter, setFilter] = useState<Filter>('all');
  const [tenure, setTenure] = useState<Tenure>('all');
  const { data: banks, loading, source, updatedAt } = useRemoteData<FDRate>('/api/fd', fdRates);

  const filtered = banks.filter((b) => filter === 'all' || b.bankType === filter);

  const filters: { value: Filter; key: string }[] = [
    { value: 'all', key: 'fd.filter_all' },
    { value: 'govt', key: 'fd.filter_govt' },
    { value: 'private', key: 'fd.filter_private' },
  ];
  const tenures: { value: Tenure; label: string }[] = [
    { value: 'all', label: t('fd.tenure_all') },
    { value: '12', label: '1Y' },
    { value: '36', label: '3Y' },
    { value: '60', label: '5Y' },
  ];

  // Pick the rate row for the chosen tenure, else the best regular rate.
  function pickRate(bank: FDRate) {
    if (tenure !== 'all') {
      const match = bank.rates.find((r) => r.tenureMonths === Number(tenure));
      if (match) return match;
    }
    return bank.rates.reduce((a, b) => (b.regularRate > a.regularRate ? b : a));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-slate-200 md:text-4xl">{t('fd.hero_title')}</h1>
        <p className="mt-2 text-slate-400 font-deva">{t('fd.subtitle')}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40/25 bg-amber-400/10 px-3 py-1 text-xs text-amber-400 font-deva">
          🔒 {t('fd.trust_signal')}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-deva transition-all ${
                    filter === f.value
                      ? 'border-bk-gold bg-bk-gold/15 text-bk-gold'
                      : 'border-slate-800 text-slate-400 hover:border-slate-800'
                  }`}
                >
                  {t(f.key)}
                </button>
              ))}
            </div>
            <DataSourceBadge source={source} updatedAt={updatedAt} />
          </div>

          {/* Tenure chips */}
          <div className="mb-4 flex flex-wrap gap-2">
            {tenures.map((tn) => (
              <button
                key={tn.value}
                onClick={() => setTenure(tn.value)}
                className={`rounded-full border px-3 py-1 text-xs font-deva transition-all ${
                  tenure === tn.value
                    ? 'border-bk-gold bg-bk-gold/15 text-bk-gold'
                    : 'border-slate-800 text-slate-400 hover:border-slate-800'
                }`}
              >
                {tn.label}
              </button>
            ))}
          </div>

          {loading ? (
            <TableSkeleton cols={6} />
          ) : (
            <div className="overflow-x-auto glass-card rounded-3xl p-0">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-slate-400">
                    <th className="p-4 font-medium">{t('fd.col_bank')}</th>
                    <th className="p-4 font-medium">{t('fd.col_tenure')}</th>
                    <th className="p-4 font-medium">{t('fd.col_regular')}</th>
                    <th className="p-4 font-medium">{t('fd.col_senior')}</th>
                    <th className="p-4 font-medium">{t('fd.col_docs')}</th>
                    <th className="p-4 font-medium">{t('fd.col_action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((bank) => {
                    const row = pickRate(bank);
                    const inCompare = items.some((i) => i.id === bank.id);
                    return (
                      <tr key={bank.id} className="border-b border-slate-800">
                        <td className="p-4 font-deva text-slate-200">
                          {bank.bankName}
                          <div className="mt-1">
                            <BadgeChip tone={bank.bankType === 'govt' ? 'info' : 'neutral'}>
                              {bank.bankType === 'govt' ? t('fd.filter_govt') : t('fd.filter_private')}
                            </BadgeChip>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400">{row.tenureLabel}</td>
                        <td className="p-4 font-bold text-bk-gold">{row.regularRate}%</td>
                        <td className="p-4 font-bold text-bk-success">{row.seniorRate}%</td>
                        <td className="p-4">
                          <Link href="/documents" className="text-xs text-bk-gold/80 hover:text-bk-gold" aria-label={t('fd.col_docs')}>
                            📄 {t('btn.learn_more')}
                          </Link>
                        </td>
                        <td className="p-4">
                          <button
                            disabled={inCompare}
                            onClick={() =>
                              addItem('FD', {
                                id: bank.id,
                                name: bank.bankName,
                                data: [bank.bankName, row.tenureLabel, `${row.regularRate}%`, `${row.seniorRate}%`],
                              })
                            }
                            className="rounded-lg border border-slate-800 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-bk-gold/40 hover:text-bk-gold disabled:opacity-40 font-deva"
                          >
                            {inCompare ? '✓' : t('btn.compare')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <FDCalculator />
          <CalculatorDisclaimer />
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-xl font-bold text-slate-200 font-deva">{t('doc.section_title')}</h2>
        <DocumentChecklist documents={fdDocuments} />
      </section>

      <div className="mt-10 text-center">
        <button
          onClick={() => openLead({ module: 'FD', sourcePage: 'FD_PAGE' })}
          className="rounded-2xl bg-bk-gold px-8 py-3.5 font-bold text-bk-dark shadow-lg shadow-bk-gold/20 transition-colors hover:bg-bk-gold-light font-deva"
        >
          {t('fd.guidance_cta')}
        </button>
      </div>
    </div>
  );
}
