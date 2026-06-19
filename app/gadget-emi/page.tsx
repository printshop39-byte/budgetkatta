'use client';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import GadgetEMISection from '@/components/gadget/GadgetEMISection';
import LocatorSection from '@/components/home/LocatorSection';

export default function GadgetEMIPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-slate-200 md:text-4xl font-deva">
          {t('gadget.title')}
        </h1>
        <p className="mt-2 text-slate-400 font-deva">{t('gadget.subtitle')}</p>
      </header>

      <GadgetEMISection />

      {/* Discoverable link to the Local Finance & Store Locator */}
      <LocatorSection />
    </div>
  );
}
