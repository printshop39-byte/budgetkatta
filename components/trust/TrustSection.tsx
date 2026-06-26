'use client';
import { Lock, PieChart, Sparkles, RefreshCw, BadgeCheck } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

// Trust signals carry a blue accent — the conventional "trust/security" colour
// on finance sites — kept distinct from the amber brand accent.
const trustIcons = [
  { key: 'trust.secure', Icon: Lock },
  { key: 'trust.transparent', Icon: PieChart },
  { key: 'trust.ai', Icon: Sparkles },
  { key: 'trust.updated', Icon: RefreshCw },
  { key: 'trust.no_hidden', Icon: BadgeCheck },
];

export default function TrustSection() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <section className="border-t border-slate-800 bg-[#050814] px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {trustIcons.map((badge) => (
            <div
              key={badge.key}
              className="glass-card flex flex-col items-center gap-2.5 p-4 text-center transition-all hover:border-sky-400/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-400/25 bg-sky-400/10 text-sky-300">
                <badge.Icon className="h-5 w-5" />
              </span>
              <p className="text-xs leading-snug text-slate-300 font-deva">{t(badge.key)}</p>
            </div>
          ))}
        </div>

        <div className="glass-card border-l-4 border-amber-400/50 p-5">
          <p className="text-xs leading-relaxed text-slate-400 font-deva">
            ⚠️ {t('trust.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
}
