'use client';
// PropertyTools — the property-focused tools grid. Every tool is explicitly
// classified:
//   • "Available"       → an interactive tool at a REAL working route.
//   • "Educational Guide"→ educational content only (no calculator/comparison).
//   • "Coming next"      → not built; inert (no href) so we never link to a
//                          nonexistent route or imply a working tool.
// No entrance/opacity animations: content renders visibly in SSR, without JS,
// and under prefers-reduced-motion.
import Link from 'next/link';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { PROPERTY_TOOLS, TOOLS_COPY, pick, type PropertyTool } from '@/lib/homeFinanceContent';

function Badge({ tool, lang }: { tool: PropertyTool; lang: 'mr' | 'en' }) {
  if (tool.status === 'available')
    return (
      <span className="shrink-0 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-300">
        {pick(TOOLS_COPY.available, lang)}
      </span>
    );
  if (tool.status === 'guide')
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-sky-300">
        <BookOpen className="h-2.5 w-2.5" />
        {pick(TOOLS_COPY.guide, lang)}
      </span>
    );
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-400">
      <Clock className="h-2.5 w-2.5" />
      {pick(TOOLS_COPY.comingNext, lang)}
    </span>
  );
}

function ToolCard({ tool, lang }: { tool: PropertyTool; lang: 'mr' | 'en' }) {
  const linkable = tool.status === 'available' || tool.status === 'guide';
  const base = 'flex h-full flex-col rounded-2xl border p-5';

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-100">{pick(tool.label, lang)}</h3>
        <Badge tool={tool} lang={lang} />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">{pick(tool.desc, lang)}</p>
      {linkable && (
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-bold text-amber-300">
          {tool.status === 'guide' ? pick(TOOLS_COPY.read, lang) : pick(TOOLS_COPY.open, lang)}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      )}
    </>
  );

  const linkCls = `${base} group border-slate-800 bg-slate-900/50 transition-all hover:border-amber-400/50 hover:bg-slate-900 hover:shadow-[0_12px_30px_rgba(251,191,36,0.14)]`;
  if (!linkable) {
    return (
      <div aria-disabled="true" className={`${base} border-slate-800/70 bg-slate-900/25 opacity-80`}>
        {inner}
      </div>
    );
  }
  // Same-page hash target → plain <a> (scroll, no RSC fetch); route → next/link.
  return tool.href!.startsWith('/#') ? (
    <a href={tool.href!} className={linkCls}>
      {inner}
    </a>
  ) : (
    <Link href={tool.href!} className={linkCls}>
      {inner}
    </Link>
  );
}

export default function PropertyTools() {
  const lang = useLanguageStore((s) => s.language);

  return (
    <section id="property-tools" className="mx-auto max-w-7xl px-6 py-20 scroll-mt-20 border-t border-slate-800">
      <div className="mb-10 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
          {pick(TOOLS_COPY.eyebrow, lang)}
        </span>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold leading-[1.3] text-slate-50 md:text-4xl">
          {pick(TOOLS_COPY.title, lang)}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">{pick(TOOLS_COPY.subtitle, lang)}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PROPERTY_TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} lang={lang} />
        ))}
      </div>
    </section>
  );
}
