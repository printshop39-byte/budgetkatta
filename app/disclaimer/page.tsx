'use client';
import PageShell from '@/components/shared/PageShell';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

const points = ['disclaimer.d1', 'disclaimer.d2', 'disclaimer.d3', 'disclaimer.d4', 'disclaimer.d5'];

export default function DisclaimerPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <PageShell titleKey="disclaimer.title" subtitleKey="disclaimer.subtitle" narrow>
      <div className="glass-card border-l-4 border-bk-gold/50 p-6 md:p-8">
        <ul className="space-y-4">
          {points.map((p) => (
            <li key={p} className="flex gap-3">
              <span className="mt-1 text-bk-gold">⚠️</span>
              <p className="leading-relaxed text-white/75 font-deva">{t(p)}</p>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
