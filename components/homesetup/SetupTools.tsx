'use client';
// SetupTools — interactive checklists (real checkboxes, state kept in this
// browser only, with a safe fallback when storage is blocked), a material
// questions table and a sample payment-stage bar.
import { useEffect, useState } from 'react';
import { AlertTriangle, ClipboardCheck } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import {
  CONTRACTOR_CHECK,
  CONTRACTOR_NOTE,
  MATERIALS,
  MATERIALS_NOTE,
  PAYMENT_NOTE,
  PAYMENT_STAGES,
  SNAGGING,
  SNAGGING_NOTE,
  TOOLS_COPY,
  type CheckItem,
} from '@/lib/homeSetupTools';
import type { Bi } from '@/lib/homeFinanceContent';

function useChecked(storageKey: string) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* storage unavailable — checklist still works for this visit */
    }
  }, [storageKey]);
  const save = (next: Record<string, boolean>) => {
    setChecked(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };
  return { checked, toggle: (id: string) => save({ ...checked, [id]: !checked[id] }), reset: () => save({}) };
}

function Checklist({ id, title, items, note, lang }: { id: string; title: Bi; items: CheckItem[]; note: Bi; lang: 'mr' | 'en' }) {
  const { checked, toggle, reset } = useChecked(`bk-setup-${id}`);
  const done = items.filter((i) => checked[i.id]).length;
  return (
    <section id={id} className="glass-card scroll-mt-24 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-100 font-deva">
          <ClipboardCheck className="h-5 w-5 text-amber-400" />
          {title[lang]}
        </h3>
        <span className="text-xs font-semibold text-slate-400 font-deva">
          {done}/{items.length} {TOOLS_COPY.done[lang]}
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it.id}>
            <label className={`flex min-h-[44px] cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm font-deva ${checked[it.id] ? 'border-emerald-500/40 bg-emerald-500/5 text-slate-400' : 'border-slate-800 bg-slate-900/40 text-slate-200'}`}>
              <input type="checkbox" checked={!!checked[it.id]} onChange={() => toggle(it.id)} className="mt-0.5 h-5 w-5 shrink-0 accent-amber-400" />
              <span className={checked[it.id] ? 'line-through' : ''}>{it.text[lang]}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <p className="flex max-w-2xl gap-2 text-xs text-amber-200 font-deva">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          {note[lang]}
        </p>
        {done > 0 && (
          <button type="button" onClick={reset} className="min-h-[44px] rounded-full border border-slate-700 px-4 text-xs font-semibold text-slate-300 hover:border-amber-400/40 font-deva">
            {TOOLS_COPY.reset[lang]}
          </button>
        )}
      </div>
    </section>
  );
}

export default function SetupTools() {
  const lang = useLanguageStore((s) => s.language) === 'mr' ? 'mr' : 'en';
  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-center font-display text-2xl font-bold text-slate-100 font-deva">{TOOLS_COPY.title[lang]}</h2>

      <Checklist id="snagging" title={TOOLS_COPY.snagTitle} items={SNAGGING} note={SNAGGING_NOTE} lang={lang} />
      <Checklist id="contractor-check" title={TOOLS_COPY.contractTitle} items={CONTRACTOR_CHECK} note={CONTRACTOR_NOTE} lang={lang} />

      <section id="materials" className="glass-card scroll-mt-24 p-5">
        <h3 className="font-display text-lg font-bold text-slate-100 font-deva">{TOOLS_COPY.materialTitle[lang]}</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {MATERIALS.map((m) => (
            <div key={m.area.en} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm font-deva">
              <p className="font-bold text-amber-400">{m.area[lang]}</p>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-xs text-slate-500">{TOOLS_COPY.colAsk[lang]}</dt>
                  <dd className="text-slate-200">{m.ask[lang]}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{TOOLS_COPY.colWhy[lang]}</dt>
                  <dd className="text-slate-300">{m.why[lang]}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{TOOLS_COPY.colCaution[lang]}</dt>
                  <dd className="text-slate-300">{m.caution[lang]}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500 font-deva">{MATERIALS_NOTE[lang]}</p>
      </section>

      <section id="payment-stages" className="glass-card scroll-mt-24 p-5">
        <h3 className="font-display text-lg font-bold text-slate-100 font-deva">{TOOLS_COPY.paymentTitle[lang]}</h3>
        <ol className="mt-3 space-y-2">
          {PAYMENT_STAGES.map((s, i) => (
            <li key={i} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <span className="w-14 shrink-0 text-center font-display text-xl font-black text-amber-400">{s.pct}%</span>
              <span className="text-sm text-slate-200 font-deva">{s.label[lang]}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-slate-500 font-deva">{PAYMENT_NOTE[lang]}</p>
      </section>
    </div>
  );
}
