'use client';
// InterestButton — opens the global lead form pre-filled with context.
import { useLeadFormStore } from '@/store/leadFormStore';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import type { LeadModule } from '@/types';

interface Props {
  module: LeadModule;
  product?: string;
  sourcePage: string;
  className?: string;
  full?: boolean;
}

export default function InterestButton({ module, product, sourcePage, className = '', full }: Props) {
  const open = useLeadFormStore((s) => s.open);
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <button
      onClick={() => open({ module, product, sourcePage })}
      className={`rounded-xl bg-bk-gold px-5 py-2.5 font-bold text-bk-dark transition-colors hover:bg-bk-gold-light font-deva ${
        full ? 'w-full' : ''
      } ${className}`}
    >
      {t('btn.interested')}
    </button>
  );
}
