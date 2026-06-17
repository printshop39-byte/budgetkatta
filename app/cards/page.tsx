'use client';
import PageShell from '@/components/shared/PageShell';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useLeadFormStore } from '@/store/leadFormStore';
import { cardsContent } from '@/lib/eduContent';

export default function CardsPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const openLead = useLeadFormStore((s) => s.open);
  const c = cardsContent;

  return (
    <PageShell titleKey="cards.title" subtitleKey="cards.subtitle">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <section className="glass-card glass-card-gold p-6">
            <h2 className="font-display text-lg font-bold text-bk-gold">{c.credit.title[language]}</h2>
            <p className="mt-1.5 leading-relaxed text-slate-400 font-deva">{c.credit.body[language]}</p>
          </section>
          <section className="glass-card p-6">
            <h2 className="font-display text-lg font-bold text-bk-gold">{c.debit.title[language]}</h2>
            <p className="mt-1.5 leading-relaxed text-slate-400 font-deva">{c.debit.body[language]}</p>
          </section>
        </div>

        {[c.whoFor, c.docs, c.fees].map((sec) => (
          <section key={sec.title[language]} className="glass-card p-6">
            <h2 className="font-display text-lg font-bold text-bk-gold">{sec.title[language]}</h2>
            <ul className="mt-2 space-y-2">
              {sec.points.map((p, i) => (
                <li key={i} className="flex gap-2 text-slate-400 font-deva">
                  <span className="text-bk-gold">•</span>
                  {p[language]}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="glass-card p-6">
          <h2 className="font-display text-lg font-bold text-bk-gold">{c.rewards.title[language]}</h2>
          <p className="mt-1.5 leading-relaxed text-slate-400 font-deva">{c.rewards.body[language]}</p>
        </section>

        <button
          onClick={() => openLead({ module: 'GENERAL', sourcePage: 'CARDS_PAGE' })}
          className="w-full rounded-xl bg-bk-gold py-3 font-bold text-bk-dark transition-colors hover:bg-bk-gold-light font-deva"
        >
          {t('cards.cta')}
        </button>
      </div>
    </PageShell>
  );
}
