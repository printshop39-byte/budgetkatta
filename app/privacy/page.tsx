'use client';
import PageShell from '@/components/shared/PageShell';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { CONTACT_EMAIL } from '@/lib/config';

const sections = [
  { h: 'privacy.h_collect', b: 'privacy.collect' },
  { h: 'privacy.h_why', b: 'privacy.why' },
  { h: 'privacy.h_share', b: 'privacy.share' },
  { h: 'privacy.h_delete', b: 'privacy.delete' },
  { h: 'privacy.h_contact', b: 'privacy.contact' },
];

export default function PrivacyPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <PageShell titleKey="privacy.title" subtitleKey="privacy.subtitle" narrow>
      <div className="glass-card space-y-6 p-6 md:p-8">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-lg font-bold text-bk-gold">{t(s.h)}</h2>
            <p className="mt-1.5 leading-relaxed text-slate-400 font-deva">
              {t(s.b)}
              {s.b === 'privacy.contact' && (
                <>
                  {' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-bk-gold hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                </>
              )}
            </p>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
