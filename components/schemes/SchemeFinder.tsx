'use client';
// SchemeFinder — a small, rule-based eligibility quiz reused by both the Women
// and Student finders. Ask N single-choice questions, then show the schemes
// worth checking (ranked) plus a guidance CTA. No data leaves the browser.
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RotateCcw, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { useLeadFormStore } from '@/store/leadFormStore';
import { Icon } from '@/components/shared/Icon';
import { rankSchemes, type FinderOption, type FinderQuestion, type Scheme } from '@/lib/schemes';

export default function SchemeFinder({
  id,
  questions,
  schemes,
  accentLabel,
}: {
  id: string;
  questions: FinderQuestion[];
  schemes: Scheme[];
  accentLabel: { mr: string; en: string };
}) {
  const { language } = useLanguageStore();
  const openLead = useLeadFormStore((s) => s.open);
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState<FinderOption[]>([]);

  const done = step >= questions.length;
  const results = done ? rankSchemes(schemes, chosen) : [];

  function pick(opt: FinderOption) {
    setChosen((c) => [...c, opt]);
    setStep((s) => s + 1);
  }
  function reset() {
    setChosen([]);
    setStep(0);
  }

  return (
    <div id={id} className="glass-card glass-card-gold scroll-mt-20 p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-300 font-deva">
          {accentLabel[language]}
        </span>
        {!done && (
          <span className="text-xs font-semibold text-slate-400 font-deva">
            {language === 'mr' ? 'प्रश्न' : 'Q'} {Math.min(step + 1, questions.length)}/{questions.length}
          </span>
        )}
      </div>

      {/* progress bar */}
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{ width: `${(Math.min(step, questions.length) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={`q-${step}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-3"
          >
            <h3 className="text-base font-bold text-slate-200 font-deva">{questions[step].q[language]}</h3>
            <div className="space-y-2.5">
              {questions[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => pick(opt)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 text-left text-sm font-medium text-slate-200 transition-all hover:border-amber-400/50 hover:bg-slate-900 font-deva"
                >
                  <span>{opt.label[language]}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-amber-400" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-amber-300 font-deva">
                {language === 'mr' ? 'तुमच्यासाठी तपासण्यासारख्या योजना' : 'Schemes worth checking for you'}
              </p>
              <p className="mt-1 text-xs text-slate-400 font-deva">
                {language === 'mr'
                  ? 'ही फक्त प्राथमिक माहिती आहे — अर्जापूर्वी अधिकृत portal व बँकेकडे पात्रता तपासा.'
                  : 'This is indicative only — verify eligibility on the official portal and with your bank before applying.'}
              </p>
            </div>

            <div className="space-y-2.5">
              {results.map((s) => (
                <div key={s.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20">
                      <Icon name={s.icon} className="h-4 w-4" />
                    </span>
                    <span className="font-bold text-slate-100 font-deva">{s.name[language]}</span>
                    <span className="ml-auto rounded-md bg-amber-400/10 px-2 py-0.5 text-[11px] font-semibold text-amber-300 font-deva">
                      {s.amount[language]}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400 font-deva">{s.detail[language]}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={() => openLead({ module: 'LOAN', product: accentLabel.en, sourcePage: `SCHEMES_FINDER_${id}` })}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-500 font-deva"
              >
                <MessageCircle className="h-4 w-4" />
                {language === 'mr' ? 'मार्गदर्शन घ्या' : 'Get guidance'}
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-2.5 text-sm font-bold text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-400 font-deva"
              >
                <RotateCcw className="h-4 w-4" />
                {language === 'mr' ? 'पुन्हा तपासा' : 'Start over'}
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-2.5 text-sm font-bold text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-400 font-deva"
              >
                {language === 'mr' ? 'WhatsApp वर विचारा' : 'Ask on WhatsApp'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
