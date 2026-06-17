'use client';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

export default function EmptyState({ messageKey = 'state.empty' }: { messageKey?: string }) {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <span className="text-4xl opacity-40">📭</span>
      <p className="text-sm text-white/50 font-deva">{t(messageKey)}</p>
    </div>
  );
}
