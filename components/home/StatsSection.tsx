'use client';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

export default function StatsSection() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  const stats = [
    { value: '40+', label: t('hero.stat_banks') },
    { value: '1.2L+', label: t('hero.stat_users') },
    { value: '7.65%', label: t('hero.stat_rate') },
  ];

  return (
    <section className="px-4 pb-4">
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card glass-card-gold p-5 text-center">
            <p className="font-display text-2xl font-extrabold text-bk-gold md:text-3xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-slate-400 font-deva md:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
