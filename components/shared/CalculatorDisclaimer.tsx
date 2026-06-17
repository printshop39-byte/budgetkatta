'use client';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

export default function CalculatorDisclaimer() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  return (
    <p className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs leading-relaxed text-slate-400 font-deva">
      ⚠️ {t('calc.disclaimer')}
    </p>
  );
}
