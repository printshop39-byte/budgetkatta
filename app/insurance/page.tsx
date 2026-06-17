'use client';
import { useState } from 'react';
import { insurancePlans } from '@/lib/data';
import { useRemoteData } from '@/lib/useRemoteData';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useCompareStore } from '@/store/compareStore';
import { formatINR } from '@/lib/calculators';
import InsuranceEstimator from '@/components/calculators/InsuranceEstimator';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import TableSkeleton from '@/components/shared/TableSkeleton';
import CalculatorDisclaimer from '@/components/shared/CalculatorDisclaimer';
import type { InsurancePlan } from '@/types';

type InsType = 'all' | 'health' | 'life' | 'vehicle';

export default function InsurancePage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const { addItem, items } = useCompareStore();
  const [type, setType] = useState<InsType>('all');
  const { data: plans, loading, source, updatedAt } = useRemoteData<InsurancePlan>('/api/insurance', insurancePlans);

  const filtered = plans.filter((p) => type === 'all' || p.insuranceType === type);

  const types: { value: InsType; key: string }[] = [
    { value: 'all', key: 'fd.filter_all' },
    { value: 'health', key: 'ins.health' },
    { value: 'life', key: 'ins.life' },
    { value: 'vehicle', key: 'ins.vehicle' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">{t('ins.title')}</h1>
        <p className="mt-2 text-white/55 font-deva">{t('ins.subtitle')}</p>
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
                  <th className="p-3 font-medium">{t('ins.col_company')}</th>
                  <th className="p-3 font-medium">{t('ins.col_plan')}</th>
                  <th className="p-3 font-medium">{t('ins.col_premium')}</th>
                  <th className="p-3 font-medium">{t('ins.col_features')}</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((plan) => {
                  const inCompare = items.some((i) => i.id === plan.id);
                  const premium = formatINR(plan.annualPremium);
                  const feat = plan.features.join(', ');
                  return (
                    <tr key={plan.id} className="border-b border-white/5">
                      <td className="p-3 font-deva text-white">{plan.company}</td>
                      <td className="p-3 text-white/70">{plan.planName}</td>
                      <td className="p-3 font-bold text-bk-gold">{premium}</td>
                      <td className="p-3 text-xs text-white/60">{feat}</td>
                      <td className="p-3 text-right">
                        <button
                          disabled={inCompare}
                          onClick={() =>
                            addItem('INSURANCE', {
                              id: plan.id,
                              name: plan.company,
                              data: [plan.company, plan.planName, premium, feat],
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
          <InsuranceEstimator />
          <CalculatorDisclaimer />
        </div>
      </div>
    </div>
  );
}
