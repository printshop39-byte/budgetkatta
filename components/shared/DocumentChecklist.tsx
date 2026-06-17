'use client';
// DocumentChecklist — renders localized document cards with requirement badges
// (✅ required / 🟡 sometimes) and an expandable "why is this needed?" note.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { categoryLabel } from '@/lib/documentChecklists';
import type { DocItem, DocCategory } from '@/lib/documentChecklists';

const categoryOrder: DocCategory[] = ['KYC', 'INCOME', 'PRODUCT', 'OTHER'];

export default function DocumentChecklist({ documents }: { documents: DocItem[] }) {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const groups = categoryOrder
    .map((cat) => ({ cat, items: documents.filter((d) => d.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.cat}>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 font-deva">
            {categoryLabel[group.cat][language]}
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {group.items.map((doc, i) => {
              const key = `${group.cat}-${i}`;
              const required = doc.requirement === 'required';
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card p-4"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-base">{required ? '✅' : '🟡'}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-200 font-deva">{doc.name[language]}</p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          required
                            ? 'bg-amber-400/10 text-emerald-300'
                            : 'bg-amber-500/10 text-amber-300'
                        }`}
                      >
                        {required ? t('doc.required') : t('doc.sometimes')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setOpen((o) => ({ ...o, [key]: !o[key] }))}
                    className="mt-2.5 flex items-center gap-1 text-xs text-amber-400/80 hover:text-amber-400 font-deva"
                    aria-expanded={!!open[key]}
                  >
                    ℹ️ {t('doc.why')}
                  </button>
                  {open[key] && (
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400 font-deva">
                      {doc.explanation[language]}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
