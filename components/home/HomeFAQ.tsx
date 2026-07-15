'use client';
// HomeFAQ — focused home-finance FAQ accordion for the homepage. Content comes
// from HOME_FAQ (lib/homeFinanceContent) so the JSON-LD in app/page.tsx can be
// built from the SAME list (structured data == visible content).
//
// Accessibility: real <button> triggers (keyboard-operable, aria-expanded); the
// answer is always in the DOM (hidden only via max-height/visibility), never at
// permanent opacity 0. No scroll/opacity entrance animation.
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { HOME_FAQ, HOME_FAQ_COPY, pick } from '@/lib/homeFinanceContent';

export default function HomeFAQ() {
  const lang = useLanguageStore((s) => s.language);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-20 scroll-mt-20 border-t border-slate-800">
      <div className="mb-12 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-400/30">
          {pick(HOME_FAQ_COPY.eyebrow, lang)}
        </span>
        <h2 className="mt-4 text-3xl font-extrabold leading-[1.3] text-slate-100">{pick(HOME_FAQ_COPY.title, lang)}</h2>
      </div>

      <div className="space-y-4">
        {HOME_FAQ.map((item, i) => {
          const isOpen = open === i;
          const panelId = `home-faq-panel-${i}`;
          const btnId = `home-faq-btn-${i}`;
          return (
            <div key={i} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
              <h3>
                <button
                  id={btnId}
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                >
                  <span className="text-sm md:text-base font-bold text-slate-200">{pick(item.q, lang)}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-amber-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                hidden={!isOpen}
                className="border-t border-slate-800 px-6 pb-5 pt-3 text-xs md:text-sm font-medium leading-relaxed text-slate-400"
              >
                {pick(item.a, lang)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
