'use client';
// CompareDrawer.tsx — slide-up glass drawer showing selected items side-by-side.

import { useCompareStore } from '@/store/compareStore';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useLeadFormStore } from '@/store/leadFormStore';
import { motion, AnimatePresence } from 'framer-motion';
import type { LeadModule } from '@/types';

const columns: Record<string, string[]> = {
  FD: ['Bank', 'Tenure', 'Regular Rate', 'Senior Rate'],
  LOAN: ['Bank', 'Type', 'ROI', 'Processing Fee', 'Max Tenure'],
  SIP: ['Fund', 'Category', '3Y Return', '5Y Return', 'Risk'],
  INSURANCE: ['Company', 'Plan', 'Premium', 'Key Features'],
};

export default function CompareDrawer() {
  const { items, clearCompare, module } = useCompareStore();
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const openLeadForm = useLeadFormStore((s) => s.open);

  const show = items.length >= 2;
  const cols = columns[module] ?? [];

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
          className="fixed bottom-0 left-0 right-0 z-40 max-h-[60vh] overflow-y-auto rounded-t-3xl glass-card p-5 shadow-2xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-slate-800">
              {t('btn.compare')} ({items.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={clearCompare}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-800 font-deva"
              >
                {t('btn.clear')}
              </button>
              <button
                onClick={handleInterested}
                className="rounded-lg bg-bk-gold px-4 py-1.5 text-sm font-bold text-bk-dark transition-colors hover:bg-bk-gold-light font-deva"
              >
                {t('btn.interested')}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 text-left text-sm font-normal text-slate-400">Field</th>
                  {items.map((item, i) => (
                    <th
                      key={i}
                      className="py-2 text-center text-sm font-semibold text-bk-gold font-deva"
                    >
                      {item.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cols.map((col, ci) => (
                  <tr key={col} className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 text-sm text-slate-500">{col}</td>
                    {items.map((item, ii) => (
                      <td
                        key={ii}
                        className="py-2.5 text-center text-sm text-slate-800 font-deva"
                      >
                        {item.data?.[ci] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
