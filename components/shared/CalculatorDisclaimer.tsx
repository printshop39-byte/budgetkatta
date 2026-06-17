'use client';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

export default function CalculatorDisclaimer() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  return (
    <p className="mt-3 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-xs leading-relaxed text-white/45 font-deva">
      ⚠️ {t('calc.disclaimer')}
    </p>
  );
}
