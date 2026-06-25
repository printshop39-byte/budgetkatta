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
  /** Show the "next step" prompt caption above the button. Default: true. */
  prompt?: boolean;
}

export default function InterestButton({ module, product, sourcePage, className = '', full, prompt = true }: Props) {
  const open = useLeadFormStore((s) => s.open);
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <div className={full ? 'w-full space-y-2' : 'space-y-2'}>
      {prompt && (
        <p className="text-center text-xs leading-snug text-slate-400 font-deva">{t('lead.calc_prompt')}</p>
      )}
      <motion.button
        onClick={() => open({ module, product, sourcePage })}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`rounded-xl bg-amber-400 px-5 py-2.5 font-bold text-slate-950 transition-all duration-300 hover:bg-amber-500 hover:shadow-[0_0_24px_rgba(251,191,36,0.4)] font-deva ${
          full ? 'w-full' : ''
        } ${className}`}
      >
        {t('btn.interested')}
      </motion.button>
    </div>
  );
}
