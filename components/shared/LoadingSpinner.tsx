'use client';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

export default function LoadingSpinner() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-bk-gold border-t-transparent" />
      <p className="text-sm text-slate-400 font-deva">{t('state.loading')}</p>
    </div>
  );
}
