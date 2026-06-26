'use client';
import { AlertTriangle } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

export default function CalculatorDisclaimer() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  return (
    <p className="mt-3 flex items-start gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs leading-relaxed text-slate-400 font-deva">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" /> {t('calc.disclaimer')}
    </p>
  );
}
