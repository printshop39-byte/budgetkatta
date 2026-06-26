'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { insuranceTypes } from '@/lib/eduContent';
import InsuranceEstimator from '@/components/calculators/InsuranceEstimator';
import CalculatorDisclaimer from '@/components/shared/CalculatorDisclaimer';
import DocumentChecklist from '@/components/shared/DocumentChecklist';
import { Icon } from '@/components/shared/Icon';
import { insuranceDocuments } from '@/lib/documentChecklists';

export default function InsurancePage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const [insType, setInsType] = useState(insuranceTypes[0].id);
  const [toast, setToast] = useState(false);

  const activeType = insuranceTypes.find((it) => it.id === insType) ?? insuranceTypes[0];

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
        <header className="mb-6 text-center">
          <h1 className="font-display text-3xl font-extrabold text-slate-100 md:text-4xl font-deva">{t('ins.title')}</h1>
          <p className="mt-2 text-slate-400 font-deva">{t('ins.subtitle')}</p>
        </header>

        {/* IRDAI educational-only notice — BudgetKatta is not a registered
            insurance intermediary / web aggregator, so the page stays purely
            informational (no comparison/quote/lead-capture). */}
        <div className="mb-10 flex items-start gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-bold text-amber-300 font-deva">{t('ins.irdai_title')}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-300 font-deva">{t('ins.irdai_note')}</p>
          </div>
        </div>

        {/* Insurance types — educational content */}
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
                  <span className={`relative z-10 inline-flex items-center gap-1.5 ${active ? 'font-bold text-white' : 'text-slate-400'}`}>
                    <Icon name={it.icon} className="h-4 w-4" /> {it.label[language]}
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
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400 font-deva">
                      <Icon name="tick" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
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
          </motion.div>
        </section>

        {/* Premium estimator — clearly labelled as a rough educational estimate
            (not a quote). No comparison table or lead capture. */}
        <section className="mb-12">
          <div className="mx-auto max-w-md">
            <InsuranceEstimator />
            <p className="mt-3 flex items-start gap-1.5 rounded-lg border border-amber-400/30 bg-amber-400/5 px-3 py-2 text-xs leading-relaxed text-amber-300/90 font-deva">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {t('ins.est_note')}
            </p>
            <CalculatorDisclaimer />
          </div>
        </section>

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
