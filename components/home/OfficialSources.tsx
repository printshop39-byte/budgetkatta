'use client';
// OfficialSources — links to the official/regulatory sources relevant to home
// finance & property in Maharashtra (RBI, NHB, MahaRERA, IGR Maharashtra,
// IRDAI). Each row shows the source organisation, the direct official URL and
// the last-verified date. Carries an explicit "not affiliated" + educational
// disclaimer — we never claim affiliation with these bodies.
import { ExternalLink, BadgeCheck, AlertTriangle } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { OFFICIAL_SOURCES, OFFICIAL_SOURCES_COPY as C, pick } from '@/lib/homeFinanceContent';

export default function OfficialSources() {
  const lang = useLanguageStore((s) => s.language);

  return (
    <section id="official-sources" className="mx-auto max-w-5xl px-6 py-16 scroll-mt-20">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-sky-300">
          <BadgeCheck className="h-3.5 w-3.5" /> {pick(C.eyebrow, lang)}
        </span>
        <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-extrabold leading-[1.3] text-slate-50 md:text-3xl">
          {pick(C.title, lang)}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OFFICIAL_SOURCES.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:border-sky-400/40 hover:bg-slate-900"
          >
            <div>
              <p className="text-sm font-bold text-slate-100">{pick(s.org, lang)}</p>
              <p className="mt-0.5 text-xs text-slate-400">{pick(s.what, lang)}</p>
              <p className="mt-2 truncate text-[11px] text-sky-300/90">{s.url.replace('https://', '')}</p>
              <p className="mt-1 text-[10px] text-slate-500">
                {pick(C.verifiedLabel, lang)}: {s.verified}
              </p>
            </div>
            <span className="mt-0.5 shrink-0 text-slate-500 transition-colors group-hover:text-sky-300" aria-label={pick(C.visit, lang)}>
              <ExternalLink className="h-4 w-4" />
            </span>
          </a>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border-l-4 border-sky-400/40 bg-slate-900/50 p-5">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-400">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400" />
          {pick(C.disclaimer, lang)}
        </p>
      </div>
    </section>
  );
}
