'use client';
// InterestButton — opens the global lead form pre-filled with context.
import { motion } from 'framer-motion';
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
    <motion.button
      onClick={() => open({ module, product, sourcePage })}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`rounded-xl bg-bk-gold px-5 py-2.5 font-bold text-bk-dark transition-all duration-300 hover:bg-bk-gold-light hover:shadow-[0_0_24px_rgba(13,148,136,0.4)] font-deva ${
        full ? 'w-full' : ''
      } ${className}`}
    >
      {t('btn.interested')}
    </motion.button>
  );
}
