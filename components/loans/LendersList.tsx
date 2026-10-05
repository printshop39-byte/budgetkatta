'use client';
import { ExternalLink, Info } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { LENDERS_COPY, LENDER_GROUPS } from '@/lib/lenders';

export default function LendersList() {
  const lang = useLanguageStore((s) => s.language) === 'mr' ? 'mr' : 'en';
  return (
    <section id="lenders" className="mt-10 scroll-mt-24">
      <h2 className="mb-2 font-display text-xl font-bold text-slate-100 font-deva">{LENDERS_COPY.title[lang]}</h2>
      <p className="mb-4 flex gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-200 font-deva">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        {LENDERS_COPY.note[lang]}
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {LENDER_GROUPS.map((g) => (
          <div key={g.id} className="glass-card p-4">
            <h3 className="text-sm font-bold text-amber-400 font-deva">{g.title[lang]}</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
              {g.names.map((n) => (
                <li key={n} className="flex gap-2">
                  <span aria-hidden className="text-amber-400">•</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500 font-deva">
        {LENDERS_COPY.rbi[lang]}{' '}
        <a href={LENDERS_COPY.rbiUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-amber-400 underline">
          RBI <ExternalLink className="h-3 w-3" />
        </a>
      </p>
    </section>
  );
}
