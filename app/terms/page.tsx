'use client';
import PageShell from '@/components/shared/PageShell';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

const points = ['terms.t1', 'terms.t2', 'terms.t3', 'terms.t4', 'terms.t5', 'terms.t6'];

export default function TermsPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <PageShell titleKey="terms.title" subtitleKey="terms.subtitle" narrow>
      <div className="glass-card p-6 md:p-8">
        <ul className="space-y-4">
          {points.map((p, i) => (
            <li key={p} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-bk-gold/15 text-xs font-bold text-bk-gold">
                {i + 1}
              </span>
              <p className="leading-relaxed text-white/75 font-deva">{t(p)}</p>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
