'use client';
import { useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { PROPERTY_DOCS, PROPERTY_DOCS_COPY, PROPERTY_TYPES, type PropertyType } from '@/lib/propertyDocs';

export default function PropertyDocsTabs() {
  const lang = useLanguageStore((s) => s.language) === 'mr' ? 'mr' : 'en';
  const [tab, setTab] = useState<PropertyType>('new');

  return (
    <section id="property-docs" className="mt-10 scroll-mt-24">
      <h2 className="mb-1 font-display text-xl font-bold text-slate-100 font-deva">{PROPERTY_DOCS_COPY.title[lang]}</h2>
      <p className="mb-4 text-sm text-slate-400 font-deva">{PROPERTY_DOCS_COPY.intro[lang]}</p>

      <div role="tablist" aria-label={PROPERTY_DOCS_COPY.title[lang]} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {PROPERTY_TYPES.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-[44px] shrink-0 rounded-full border px-4 text-sm font-semibold font-deva transition-colors ${
              tab === t.id ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-amber-400/40'
            }`}
          >
            {t.label[lang]}
          </button>
        ))}
      </div>

      <ul role="tabpanel" className="mt-4 grid gap-3">
        {PROPERTY_DOCS[tab].map((d) => (
          <li key={d.title.en} className="glass-card flex items-start justify-between gap-3 p-3">
            <div>
              <p className="text-sm font-semibold text-slate-100 font-deva">{d.title[lang]}</p>
              <p className="mt-0.5 text-xs text-slate-400 font-deva">{d.why[lang]}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium font-deva ${
                d.requirement === 'required' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-700/50 text-slate-300'
              }`}
            >
              {PROPERTY_DOCS_COPY[d.requirement][lang]}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500 font-deva">{PROPERTY_DOCS_COPY.note[lang]}</p>
    </section>
  );
}
