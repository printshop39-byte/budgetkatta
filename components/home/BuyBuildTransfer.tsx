'use client';
// BuyBuildTransfer — the three home-finance paths (Buy / Build / Transfer).
// Each card links only to a real, working route/anchor; tools that don't exist
// yet resolve to the property-tools section (where they're marked "Coming next")
// rather than a broken link.
// No entrance/opacity animations: content renders visibly in SSR, without JS,
// and under prefers-reduced-motion.
import Link from 'next/link';
import { Home, HardHat, RefreshCw, ArrowRight, Check } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { PATH_CHOICES, PATHS_COPY, pick } from '@/lib/homeFinanceContent';

const ICONS = { buy: Home, build: HardHat, transfer: RefreshCw } as const;

// Plain <a> for same-page hash targets (scrolls without a reload / RSC fetch);
// next/link for real route changes.
const CARD_CLS =
  'group flex h-full flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-7 transition-all hover:border-amber-400/50 hover:bg-slate-900 hover:shadow-[0_14px_36px_rgba(251,191,36,0.14)]';

export default function BuyBuildTransfer() {
  const lang = useLanguageStore((s) => s.language);

  return (
    <section id="buy-build-transfer" className="mx-auto max-w-7xl px-6 py-20 scroll-mt-20">
      <div className="mb-10 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
          {pick(PATHS_COPY.eyebrow, lang)}
        </span>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold leading-[1.3] text-slate-50 md:text-4xl">
          {pick(PATHS_COPY.title, lang)}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {PATH_CHOICES.map((choice) => {
          const Icon = ICONS[choice.id];
          const href = choice.href ?? '/#property-tools';
          const inner = (
            <>
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/15 text-amber-300">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg font-bold text-slate-100">{pick(choice.title, lang)}</h3>
                </div>

                <p className="text-sm leading-relaxed text-slate-400">{pick(choice.tagline, lang)}</p>

                <ul className="space-y-2">
                  {choice.points[lang].map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/10">
                        <Check className="h-2.5 w-2.5 text-amber-400" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>

                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-amber-300">
                  {pick(choice.cta, lang)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
            </>
          );
          return (
            <div key={choice.id} id={choice.id} className="scroll-mt-24">
              {href.startsWith('/#') ? (
                <a href={href} className={CARD_CLS}>
                  {inner}
                </a>
              ) : (
                <Link href={href} className={CARD_CLS}>
                  {inner}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
