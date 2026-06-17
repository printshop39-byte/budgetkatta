'use client';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { explainers } from '@/lib/explainers';
import AnimatedExplainerCard from '@/components/AnimatedExplainerCard';

export default function ExplainerSection() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-1 text-center font-display text-2xl font-bold text-slate-800 font-deva">
          {t('explain.section_title')}
        </h2>
        <p className="mb-6 text-center text-sm text-slate-500 font-deva">{t('easy.simple')}</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {explainers.map((e) => (
            <AnimatedExplainerCard key={e.id} explainer={e} />
          ))}
        </div>
      </div>
    </section>
  );
}
