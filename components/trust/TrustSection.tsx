'use client';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

const trustIcons = [
  { key: 'trust.secure', emoji: '🔒' },
  { key: 'trust.transparent', emoji: '📊' },
  { key: 'trust.ai', emoji: '🤖' },
  { key: 'trust.updated', emoji: '🔄' },
  { key: 'trust.no_hidden', emoji: '✅' },
];

export default function TrustSection() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <section className="border-t border-white/5 bg-bk-card px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {trustIcons.map((badge) => (
            <div
              key={badge.key}
              className="glass-card flex flex-col items-center gap-2 p-4 text-center transition-all hover:border-bk-gold/30"
            >
              <span className="text-2xl">{badge.emoji}</span>
              <p className="text-xs leading-snug text-white/80 font-deva">{t(badge.key)}</p>
            </div>
          ))}
        </div>

        <div className="glass-card border-l-4 border-bk-gold/50 p-5">
          <p className="text-xs leading-relaxed text-white/50 font-deva">
            ⚠️ {t('trust.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
}
