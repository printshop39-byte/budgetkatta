'use client';
import { Inbox } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

export default function EmptyState({ messageKey = 'state.empty' }: { messageKey?: string }) {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <Inbox className="h-9 w-9 text-slate-500 opacity-60" strokeWidth={1.5} />
      <p className="text-sm text-slate-400 font-deva">{t(messageKey)}</p>
    </div>
  );
}
