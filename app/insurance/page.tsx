'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { insurancePlans } from '@/lib/data';
import { useRemoteData } from '@/lib/useRemoteData';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useCompareStore } from '@/store/compareStore';
import { useLeadFormStore } from '@/store/leadFormStore';
import { formatINR } from '@/lib/calculators';
import { insuranceTypes } from '@/lib/eduContent';
import InsuranceEstimator from '@/components/calculators/InsuranceEstimator';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import TableSkeleton from '@/components/shared/TableSkeleton';
import CalculatorDisclaimer from '@/components/shared/CalculatorDisclaimer';
import DocumentChecklist from '@/components/shared/DocumentChecklist';
import { insuranceDocuments } from '@/lib/documentChecklists';
import type { InsurancePlan } from '@/types';

type InsType = 'all' | 'health' | 'life' | 'vehicle';

export default function InsurancePage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const { addItem, items } = useCompareStore();
  const openLead = useLeadFormStore((s) => s.open);
  const [type, setType] = useState<InsType>('all');
  const [insType, setInsType] = useState(insuranceTypes[0].id);
  const { data: plans, loading, source, updatedAt } = useRemoteData<InsurancePlan>('/api/insurance', insurancePlans);

  const activeType = insuranceTypes.find((it) => it.id === insType) ?? insuranceTypes[0];

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

      {/* Insurance types */}
      <section className="mb-12">
        <h2 className="mb-3 font-display text-xl font-bold text-white font-deva">{t('ins.types_title')}</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {insuranceTypes.map((it) => (
            <button
              key={it.id}
              onClick={() => setInsType(it.id)}
              className={`rounded-xl border px-3 py-2 text-sm font-deva transition-all ${
                insType === it.id
                  ? 'border-bk-gold bg-bk-gold/15 text-bk-gold'
                  : 'border-white/10 text-white/70 hover:border-white/25'
              }`}
            >
              {it.icon} {it.label[language]}
            </button>
          ))}
        </div>

        <motion.div
          key={activeType.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card glass-card-gold rounded-3xl p-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-white/80 font-deva">{t('ins.what_is')}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/70 font-deva">{activeType.whatIs[language]}</p>
              <h3 className="mt-4 text-sm font-semibold text-white/80 font-deva">{t('ins.who')}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/70 font-deva">{activeType.who[language]}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/80 font-deva">{t('ins.benefits')}</h3>
              <ul className="mt-1 space-y-1.5">
                {activeType.benefits.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm text-white/70 font-deva">
                    <span className="text-bk-success">✓</span>
                    {b[language]}
                  </li>
                ))}
              </ul>
              <h3 className="mt-4 text-sm font-semibold text-white/80 font-deva">{t('ins.check')}</h3>
              <ul className="mt-1 space-y-1.5">
                {activeType.check.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm text-white/70 font-deva">
                    <span className="text-bk-gold">•</span>
                    {c[language]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button
            onClick={() => openLead({ module: 'INSURANCE', product: activeType.label[language], sourcePage: 'INSURANCE_PAGE' })}
            className="mt-5 w-full rounded-xl bg-bk-gold py-3 font-bold text-bk-dark transition-colors hover:bg-bk-gold-light font-deva sm:w-auto sm:px-8"
          >
            {t('ins.guidance_cta')}
          </button>
        </motion.div>
      </section>

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

      <section className="mt-12">
        <h2 className="mb-4 font-display text-xl font-bold text-white font-deva">{t('doc.section_title')}</h2>
        <DocumentChecklist documents={insuranceDocuments} />
      </section>
    </div>
  );
}
