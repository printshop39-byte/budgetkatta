'use client';
import Link from 'next/link';
import { ChefHat, Sofa, KeyRound, Paintbrush, Wallet, type LucideIcon } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { SETUP_PAGE, SETUP_SECTIONS } from '@/lib/homeSetupContent';
import HomeCalculators from '@/components/calculators/HomeCalculators';

const NAV_ICON: Record<string, LucideIcon> = { kitchen: ChefHat, furniture: Sofa, setup: KeyRound, interior: Paintbrush };

export default function HomeSetupContent() {
  const lang = useLanguageStore((s) => s.language) === 'mr' ? 'mr' : 'en';
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
          <KeyRound className="h-3.5 w-3.5" />
          {SETUP_PAGE.badge[lang]}
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-slate-100 md:text-5xl font-deva">
          {SETUP_PAGE.headline[lang]}
          <span className="block bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">{SETUP_PAGE.headlineAccent[lang]}</span>
        </h1>
        <p className="mt-2 text-sm font-semibold text-slate-500 font-deva">{SETUP_PAGE.title[lang]}</p>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400 font-deva">{SETUP_PAGE.subtitle[lang]}</p>
        <nav aria-label="Sections" className="mt-5 flex flex-wrap justify-center gap-2">
          {SETUP_SECTIONS.map((s) => {
            const Icon = NAV_ICON[s.id];
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:border-amber-400/40 hover:text-amber-400"
              >
                {Icon && <Icon className="h-4 w-4 text-amber-400" />}
                {s.title[lang]}
              </a>
            );
          })}
        </nav>
      </header>

      <div className="space-y-6">
        {SETUP_SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="glass-card scroll-mt-24 p-5">
            <h2 className="font-display text-2xl font-bold text-amber-400 font-deva">{s.title[lang]}</h2>
            <p className="mt-1 text-sm text-slate-400 font-deva">{s.intro[lang]}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {s.blocks.map((b) => (
                <div key={b.heading.en} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <h3 className="text-sm font-bold text-slate-100 font-deva">{b.heading[lang]}</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-300 font-deva">
                    {b.items[lang].map((it) => (
                      <li key={it} className="flex gap-2">
                        <span aria-hidden className="text-amber-400">•</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <aside className="glass-card mt-6 flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-start gap-3">
          <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <h2 className="font-display text-lg font-bold text-slate-100 font-deva">{SETUP_PAGE.topUp.title[lang]}</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-400 font-deva">{SETUP_PAGE.topUp.body[lang]}</p>
          </div>
        </div>
        <Link
          href="/loans/home-loan#banks"
          className="inline-flex min-h-[44px] items-center rounded-full border border-amber-400/40 px-5 text-sm font-bold text-amber-400 hover:bg-amber-400/10 font-deva"
        >
          {SETUP_PAGE.topUp.cta[lang]}
        </Link>
      </aside>

      <section id="budget" className="mt-10 scroll-mt-24">
        <h2 className="mb-4 text-center font-display text-2xl font-bold text-slate-100 font-deva">{SETUP_PAGE.budgetHeading[lang]}</h2>
        <HomeCalculators initialTab="setup" />
      </section>

      <section className="mt-10 rounded-3xl border border-amber-400/30 bg-amber-400/5 p-6 text-center">
        <h2 className="font-display text-xl font-extrabold text-slate-100 md:text-2xl font-deva">{SETUP_PAGE.bridge.title[lang]}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400 font-deva">{SETUP_PAGE.bridge.body[lang]}</p>
        <Link
          href="/loans/home-loan"
          className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-amber-400 px-7 font-bold text-slate-950 hover:bg-amber-300 font-deva"
        >
          {SETUP_PAGE.bridge.cta[lang]} →
        </Link>
      </section>
    </div>
  );
}
