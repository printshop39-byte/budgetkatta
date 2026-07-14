'use client';

import { Activity } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { HC, pick } from '@/lib/healthCheckContent';

// Language-aware intro hero for /health-check. Kept free of any persisted-answer
// state so it server-renders real (Marathi-default) content for SEO.
export default function HealthCheckIntro() {
  const lang = useLanguageStore((s) => s.language);
  return (
    <header className="mb-10 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
        <Activity className="h-3.5 w-3.5" /> {pick(HC.eyebrow, lang)}
      </span>
      <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold leading-[1.3] text-slate-50 md:text-4xl">
        {pick(HC.title, lang)}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
        {pick(HC.intro, lang)}
      </p>
    </header>
  );
}
