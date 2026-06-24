'use client';
import PageShell from '@/components/shared/PageShell';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { CONTACT_EMAIL } from '@/lib/config';

const paras = ['affdisc.body1', 'affdisc.body2', 'affdisc.body3'];

export default function AffiliateDisclosurePage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <PageShell titleKey="affdisc.title" subtitleKey="affdisc.subtitle" narrow>
      <div className="glass-card space-y-5 p-6 md:p-8">
        {paras.map((p) => (
          <p key={p} className="leading-relaxed text-slate-400 font-deva">
            {t(p)}
          </p>
        ))}
        <p className="leading-relaxed text-slate-400 font-deva">
          {language === 'mr' ? 'प्रश्नांसाठी संपर्क: ' : 'For questions, contact: '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-bk-gold hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </PageShell>
  );
}
