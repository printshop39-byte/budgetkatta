'use client';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import type { DataSource } from '@/lib/useRemoteData';

export default function DataSourceBadge({
  source,
  updatedAt,
}: {
  source: DataSource;
  updatedAt: Date | null;
}) {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  if (!source) return null;

  const live = source === 'mongodb';
  const time = updatedAt
    ? updatedAt.toLocaleTimeString(language === 'mr' ? 'mr-IN' : 'hi-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium ${
          live
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-slate-200 bg-slate-100 text-slate-500'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-emerald-500' : 'bg-slate-400'}`} />
        {live ? t('data.live') : t('data.demo')}
      </span>
      {time && (
        <span className="text-slate-400 font-deva">
          {t('data.updated')}: {time}
        </span>
      )}
    </div>
  );
}
