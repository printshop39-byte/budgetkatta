'use client';
import PageShell from '@/components/shared/PageShell';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useLeadFormStore } from '@/store/leadFormStore';
import { creditScore } from '@/lib/eduContent';

export default function CreditScorePage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const openLead = useLeadFormStore((s) => s.open);

  return (
    <PageShell titleKey="cs.title" subtitleKey="cs.subtitle" narrow>
      <div className="space-y-5">
        <section className="glass-card glass-card-gold p-6">
          <h2 className="font-display text-lg font-bold text-bk-gold">{creditScore.whatIs.title[language]}</h2>
          <p className="mt-1.5 leading-relaxed text-slate-600 font-deva">{creditScore.whatIs.body[language]}</p>
        </section>

        <section className="glass-card p-6">
          <h2 className="font-display text-lg font-bold text-bk-gold">{creditScore.whyMatters.title[language]}</h2>
          <p className="mt-1.5 leading-relaxed text-slate-600 font-deva">{creditScore.whyMatters.body[language]}</p>
        </section>

        <section className="glass-card p-6">
          <h2 className="font-display text-lg font-bold text-bk-gold">{creditScore.improve.title[language]}</h2>
          <ul className="mt-2 space-y-2">
            {creditScore.improve.points.map((p, i) => (
              <li key={i} className="flex gap-2 text-slate-600 font-deva">
                <span className="text-bk-gold">✓</span>
                {p[language]}
              </li>
            ))}
          </ul>
        </section>

        <p className="rounded-lg border border-slate-100 bg-slate-900/[0.03] px-3 py-2 text-xs text-slate-400 font-deva">
          ℹ️ {creditScore.note[language]}
        </p>

        <button
          onClick={() => openLead({ module: 'GENERAL', sourcePage: 'CREDIT_SCORE_PAGE' })}
          className="w-full rounded-xl bg-bk-gold py-3 font-bold text-bk-dark transition-colors hover:bg-bk-gold-light font-deva"
        >
          {t('cs.cta')}
        </button>
      </div>
    </PageShell>
  );
}
