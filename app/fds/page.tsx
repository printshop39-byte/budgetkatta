'use client';
import { useState } from 'react';
import { fdRates } from '@/lib/data';
import { useRemoteData } from '@/lib/useRemoteData';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useCompareStore } from '@/store/compareStore';
import FDCalculator from '@/components/calculators/FDCalculator';
import BadgeChip from '@/components/shared/BadgeChip';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import TableSkeleton from '@/components/shared/TableSkeleton';
import CalculatorDisclaimer from '@/components/shared/CalculatorDisclaimer';
import DocumentChecklist from '@/components/shared/DocumentChecklist';
import { fdDocuments } from '@/lib/documentChecklists';
import type { FDRate } from '@/types';

type Filter = 'all' | 'govt' | 'private';

export default function FDPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const { addItem, items } = useCompareStore();
  const [filter, setFilter] = useState<Filter>('all');
  const { data: banks, loading, source, updatedAt } = useRemoteData<FDRate>('/api/fd', fdRates);

  const filtered = banks.filter((b) => filter === 'all' || b.bankType === filter);

  const filters: { value: Filter; key: string }[] = [
    { value: 'all', key: 'fd.filter_all' },
    { value: 'govt', key: 'fd.filter_govt' },
    { value: 'private', key: 'fd.filter_private' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">{t('fd.title')}</h1>
        <p className="mt-2 text-white/55 font-deva">{t('fd.subtitle')}</p>
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
                      : 'border-white/10 text-white/60 hover:border-white/20'
                  }`}
                >
                  {t(f.key)}
                </button>
              ))}
            </div>
            <DataSourceBadge source={source} updatedAt={updatedAt} />
          </div>

          {loading ? (
            <TableSkeleton cols={5} />
          ) : (
          <div className="overflow-x-auto glass-card p-0">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-white/50">
                  <th className="p-3 font-medium">{t('fd.col_bank')}</th>
                  <th className="p-3 font-medium">{t('fd.col_tenure')}</th>
                  <th className="p-3 font-medium">{t('fd.col_regular')}</th>
                  <th className="p-3 font-medium">{t('fd.col_senior')}</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((bank) => {
                  const best = bank.rates.reduce((a, b) => (b.regularRate > a.regularRate ? b : a));
                  const inCompare = items.some((i) => i.id === bank.id);
                  return (
                    <tr key={bank.id} className="border-b border-white/5">
                      <td className="p-3 font-deva text-white">
                        {bank.bankName}
                        <div className="mt-1">
                          <BadgeChip tone={bank.bankType === 'govt' ? 'info' : 'neutral'}>
                            {bank.bankType === 'govt' ? t('fd.filter_govt') : t('fd.filter_private')}
                          </BadgeChip>
                        </div>
                      </td>
                      <td className="p-3 text-white/70">{best.tenureLabel}</td>
                      <td className="p-3 font-bold text-bk-gold">{best.regularRate}%</td>
                      <td className="p-3 font-bold text-bk-success">{best.seniorRate}%</td>
                      <td className="p-3 text-right">
                        <button
                          disabled={inCompare}
                          onClick={() =>
                            addItem('FD', {
                              id: bank.id,
                              name: bank.bankName,
                              data: [
                                bank.bankName,
                                best.tenureLabel,
                                `${best.regularRate}%`,
                                `${best.seniorRate}%`,
                              ],
                            })
                          }
                          className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/70 transition-colors hover:border-bk-gold/40 hover:text-bk-gold disabled:opacity-40 font-deva"
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
        <h2 className="mb-4 font-display text-xl font-bold text-white font-deva">{t('doc.section_title')}</h2>
        <DocumentChecklist documents={fdDocuments} />
      </section>
    </div>
  );
}
