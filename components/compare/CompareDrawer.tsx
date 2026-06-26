'use client';
// CompareDrawer.tsx — slide-up glass drawer that shows selected items as
// Apple-style side-by-side comparison cards (instead of a wide table). The
// best value per metric (higher rate/return, lower fee) is highlighted so the
// difference is obvious at a glance. Theme-aware via the global slate remap.

import { useCompareStore } from '@/store/compareStore';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useLeadFormStore } from '@/store/leadFormStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import PremiumButton from '@/components/shared/PremiumButton';
import type { LeadModule } from '@/types';

const columns: Record<string, string[]> = {
  FD: ['Bank', 'Tenure', 'Regular Rate', 'Senior Rate'],
  LOAN: ['Bank', 'Type', 'ROI', 'Processing Fee', 'Max Tenure'],
  SIP: ['Fund', 'Category', '3Y Return', '5Y Return', 'Risk'],
  INSURANCE: ['Company', 'Plan', 'Premium', 'Key Features'],
};

// Pull the leading number out of values like "7.4%", "₹1,200", "5 yrs".
const numeric = (s?: string): number => {
  if (!s) return NaN;
  const n = parseFloat(s.replace(/[,₹%\s]/g, ''));
  return Number.isFinite(n) ? n : NaN;
};

export default function CompareDrawer() {
  const { items, clearCompare, module } = useCompareStore();
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const openLeadForm = useLeadFormStore((s) => s.open);

  const show = items.length >= 2;
  const cols = columns[module] ?? [];

  // For each metric column, find which item holds the "best" value.
  // Higher is better for rates/returns/tenure; lower is better for fees/premium.
  const bestIndexForCol = (ci: number): number => {
    const name = cols[ci]?.toLowerCase() ?? '';
    const higherBetter = /(rate|return|roi|yield|tenure)/.test(name);
    const lowerBetter = /(fee|premium|cost|charge)/.test(name);
    if (!higherBetter && !lowerBetter) return -1;

    const vals = items.map((it) => numeric(it.data?.[ci]));
    const valid = vals.filter((v) => !Number.isNaN(v));
    if (valid.length < 2 || new Set(valid).size <= 1) return -1;

    let best = -1;
    let bestVal = higherBetter ? -Infinity : Infinity;
    vals.forEach((v, idx) => {
      if (Number.isNaN(v)) return;
      if (higherBetter ? v > bestVal : v < bestVal) {
        bestVal = v;
        best = idx;
      }
    });
    return best;
  };

  // Precompute winners so each card can mark its own cells.
  const winners = cols.map((_, ci) => bestIndexForCol(ci));

  function handleInterested() {
    openLeadForm({
      module: (module || 'GENERAL') as LeadModule,
      product: items.map((i) => i.name).join(' vs '),
      sourcePage: 'COMPARE_DRAWER',
    });
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 max-h-[72vh] overflow-y-auto rounded-t-3xl glass-card p-5 shadow-2xl"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-200 font-deva">
                {t('btn.compare')} ({items.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCompare}
                  aria-label={t('btn.clear')}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-800 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 font-deva"
                >
                  <X className="h-3.5 w-3.5" /> {t('btn.clear')}
                </button>
              </div>
            </div>

            {/* Side-by-side comparison cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {items.map((item, ii) => (
                <div
                  key={ii}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
                >
                  <h4 className="text-center text-sm font-bold text-slate-100 font-deva md:text-base">{item.name}</h4>
                  <div className="mt-3 space-y-2.5">
                    {cols.map((col, ci) => {
                      const isBest = winners[ci] === ii;
                      return (
                        <div key={col} className="border-t border-slate-800/60 pt-2">
                          <p className="text-[10px] uppercase tracking-wide text-slate-500 font-deva">{col}</p>
                          <p
                            className={`mt-0.5 inline-flex items-center gap-1 text-sm font-bold font-deva ${
                              isBest ? 'text-emerald-400' : 'text-slate-200'
                            }`}
                          >
                            {item.data?.[ci] ?? '—'}
                            {isBest && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">
                                <Check className="h-2.5 w-2.5" />
                                {language === 'mr' ? 'सर्वोत्तम' : 'Best'}
                              </span>
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <PremiumButton onClick={handleInterested} className="mt-4 w-full font-deva">
              {t('btn.interested')}
            </PremiumButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
