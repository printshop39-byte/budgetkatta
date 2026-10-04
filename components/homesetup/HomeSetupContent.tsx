'use client';
import { useLanguageStore } from '@/store/languageStore';
import { SETUP_PAGE, SETUP_SECTIONS } from '@/lib/homeSetupContent';
import HomeCalculators from '@/components/calculators/HomeCalculators';

export default function HomeSetupContent() {
  const lang = useLanguageStore((s) => s.language) === 'mr' ? 'mr' : 'en';
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-slate-100 md:text-4xl font-deva">{SETUP_PAGE.title[lang]}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400 font-deva">{SETUP_PAGE.subtitle[lang]}</p>
        <nav aria-label="Sections" className="mt-5 flex flex-wrap justify-center gap-2">
          {SETUP_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="min-h-[44px] rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:border-amber-400/40 hover:text-amber-400"
            >
              {s.title[lang]}
            </a>
          ))}
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

      <section id="budget" className="mt-10 scroll-mt-24">
        <h2 className="mb-4 text-center font-display text-2xl font-bold text-slate-100 font-deva">{SETUP_PAGE.budgetHeading[lang]}</h2>
        <HomeCalculators initialTab="setup" />
      </section>
    </div>
  );
}
