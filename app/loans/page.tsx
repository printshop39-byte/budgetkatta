'use client';
import { useState } from 'react';
import { loanProducts } from '@/lib/data';
import { useRemoteData } from '@/lib/useRemoteData';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useCompareStore } from '@/store/compareStore';
import EMICalculator from '@/components/calculators/EMICalculator';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import TableSkeleton from '@/components/shared/TableSkeleton';
import CalculatorDisclaimer from '@/components/shared/CalculatorDisclaimer';
import type { LoanProduct } from '@/types';

type LoanType = 'all' | 'home' | 'personal' | 'vehicle' | 'business' | 'education';

export default function LoansPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const { addItem, items } = useCompareStore();
  const [type, setType] = useState<LoanType>('all');
  const { data: loans, loading, source, updatedAt } = useRemoteData<LoanProduct>('/api/loans', loanProducts);

  const filtered = loans.filter((l) => type === 'all' || l.loanType === type);

  const types: { value: LoanType; key: string }[] = [
    { value: 'all', key: 'fd.filter_all' },
    { value: 'home', key: 'loan.home' },
    { value: 'personal', key: 'loan.personal' },
    { value: 'vehicle', key: 'loan.vehicle' },
    { value: 'education', key: 'loan.education' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">{t('loan.title')}</h1>
        <p className="mt-2 text-white/55 font-deva">{t('loan.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {types.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setType(f.value)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-deva transition-all ${
                    type === f.value
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
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-white/50">
                  <th className="p-3 font-medium">{t('loan.col_bank')}</th>
                  <th className="p-3 font-medium">{t('loan.col_roi')}</th>
                  <th className="p-3 font-medium">{t('loan.col_fee')}</th>
                  <th className="p-3 font-medium">{t('loan.col_tenure')}</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((loan) => {
                  const inCompare = items.some((i) => i.id === loan.id);
                  const roi = `${loan.roiMin}% – ${loan.roiMax}%`;
                  const tenure = `${Math.round(loan.maxTenureMonths / 12)} ${language === 'mr' ? 'वर्षे' : 'वर्ष'}`;
                  return (
                    <tr key={loan.id} className="border-b border-white/5">
                      <td className="p-3 font-deva text-white">
                        {loan.bankName}
                        <div className="text-xs text-white/40">{t(`loan.${loan.loanType}`)}</div>
                      </td>
                      <td className="p-3 font-bold text-bk-gold">{roi}</td>
                      <td className="p-3 text-white/70">{loan.processingFee}</td>
                      <td className="p-3 text-white/70">{tenure}</td>
                      <td className="p-3 text-right">
                        <button
                          disabled={inCompare}
                          onClick={() =>
                            addItem('LOAN', {
                              id: loan.id,
                              name: loan.bankName,
                              data: [
                                loan.bankName,
                                t(`loan.${loan.loanType}`),
                                roi,
                                loan.processingFee,
                                tenure,
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
          <EMICalculator />
          <CalculatorDisclaimer />
        </div>
      </div>
    </div>
  );
}
