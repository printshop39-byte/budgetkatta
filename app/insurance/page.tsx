'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle2 } from 'lucide-react';
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
  const [toast, setToast] = useState(false);
  const { data: plans, loading, source, updatedAt } = useRemoteData<InsurancePlan>('/api/insurance', insurancePlans);

  const activeType = insuranceTypes.find((it) => it.id === insType) ?? insuranceTypes[0];

  const filtered = plans.filter((p) => type === 'all' || p.insuranceType === type);

  const types: { value: InsType; key: string }[] = [
    { value: 'all', key: 'fd.filter_all' },
    { value: 'health', key: 'ins.health' },
    { value: 'life', key: 'ins.life' },
    { value: 'vehicle', key: 'ins.vehicle' },
  ];

  // Generate a plain-text checklist of the required insurance documents and
  // trigger a browser download, then surface a success toast.
  const handleDownloadChecklist = () => {
    const heading = language === 'mr' ? 'विमा — आवश्यक कागदपत्रे' : 'Insurance — Required Documents';
    const reqLabel = (req: string) =>
      req === 'required'
        ? language === 'mr'
          ? 'आवश्यक'
          : 'Required'
        : language === 'mr'
          ? 'कधीकधी'
          : 'Optional';

    const lines = insuranceDocuments.map(
      (d, i) => `${i + 1}. ${d.name[language]}  [${reqLabel(d.requirement)}]\n   ${d.explanation[language]}`,
    );
    const content = `BudgetKatta\n${heading}\n${'='.repeat(40)}\n\n${lines.join('\n\n')}\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budgetkatta-insurance-documents.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0B1120] to-[#0A0F1C]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="font-display text-3xl font-extrabold text-slate-100 md:text-4xl font-deva">{t('ins.title')}</h1>
          <p className="mt-2 text-slate-400 font-deva">{t('ins.subtitle')}</p>
        </header>

        {/* Insurance types */}
        <section className="mb-12">
          <h2 className="mb-4 font-display text-xl font-bold text-slate-200 font-deva">{t('ins.types_title')}</h2>

          {/* Apple-style segmented control */}
          <div className="mb-5 inline-flex max-w-full flex-wrap gap-1 rounded-full border border-slate-700/50 bg-slate-800/50 p-1 backdrop-blur-xl">
            {insuranceTypes.map((it) => {
              const active = insType === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => setInsType(it.id)}
                  className="relative rounded-full px-4 py-2 text-sm font-deva transition-colors focus:outline-none"
                >
                  {active && (
                    <motion.span
                      layoutId="insTypePill"
                      className="absolute inset-0 rounded-full bg-slate-700 shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 ${active ? 'font-bold text-white' : 'text-slate-400'}`}>
                    {it.icon} {it.label[language]}
                  </span>
                </button>
              );
            })}
          </div>

          <motion.div
            key={activeType.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-300 font-deva">{t('ins.what_is')}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400 font-deva">{activeType.whatIs[language]}</p>
                <h3 className="mt-4 text-sm font-semibold text-slate-300 font-deva">{t('ins.who')}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400 font-deva">{activeType.who[language]}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-300 font-deva">{t('ins.benefits')}</h3>
                <ul className="mt-1 space-y-1.5">
                  {activeType.benefits.map((b, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-400 font-deva">
                      <span className="text-emerald-400">✓</span>
                      {b[language]}
                    </li>
                  ))}
                </ul>
                <h3 className="mt-4 text-sm font-semibold text-slate-300 font-deva">{t('ins.check')}</h3>
                <ul className="mt-1 space-y-1.5">
                  {activeType.check.map((c, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-400 font-deva">
                      <span className="text-amber-400">•</span>
                      {c[language]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={() => openLead({ module: 'INSURANCE', product: activeType.label[language], sourcePage: 'INSURANCE_PAGE' })}
              className="mt-5 w-full rounded-xl bg-amber-400 py-3 font-bold text-slate-950 transition-colors hover:bg-amber-300 font-deva sm:w-auto sm:px-8"
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
                        ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                        : 'border-slate-800 text-slate-400 hover:border-amber-400/40'
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
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-0 backdrop-blur-xl">
                <table className="w-full min-w-[620px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left text-slate-400">
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
                        <tr key={plan.id} className="border-b border-slate-800">
                          <td className="p-3 font-deva text-slate-200">{plan.company}</td>
                          <td className="p-3 text-slate-400">{plan.planName}</td>
                          <td className="p-3 font-bold text-amber-400">{premium}</td>
                          <td className="p-3 text-xs text-slate-400">{feat}</td>
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
                              className="rounded-lg border border-slate-800 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-amber-400/40 hover:text-amber-300 disabled:opacity-40 font-deva"
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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-slate-200 font-deva">{t('doc.section_title')}</h2>
            <button
              onClick={handleDownloadChecklist}
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-5 py-2.5 text-sm font-bold text-amber-300 transition-all hover:bg-amber-400/20 hover:shadow-[0_0_22px_rgba(251,191,36,0.25)] font-deva"
            >
              <Download className="h-4 w-4" />
              {language === 'mr' ? 'कागदपत्रे यादी डाउनलोड करा' : 'Download Documents Checklist'}
            </button>
          </div>
          <DocumentChecklist documents={insuranceDocuments} />
        </section>
      </div>

      {/* Success toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-emerald-400/40 bg-slate-900/95 px-5 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            role="status"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-semibold text-slate-100 font-deva">
              {language === 'mr' ? 'कागदपत्रे यादी डाउनलोड झाली!' : 'Documents checklist downloaded!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
