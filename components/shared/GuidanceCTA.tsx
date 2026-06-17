'use client';
// GuidanceCTA — reusable CTA row. Each button either navigates, opens the lead
// form, opens the bot, or scrolls to a section on the page.
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useLeadFormStore } from '@/store/leadFormStore';
import { useBotStore } from '@/store/botStore';
import type { LeadModule } from '@/types';

export type CTAAction =
  | { kind: 'link'; href: string }
  | { kind: 'lead'; module: LeadModule; product?: string; sourcePage: string }
  | { kind: 'bot' }
  | { kind: 'scroll'; targetId: string };

export interface CTAItem {
  labelKey: string;
  action: CTAAction;
}

export default function GuidanceCTA({
  items,
  className = '',
}: {
  items: CTAItem[];
  className?: string;
}) {
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const openLead = useLeadFormStore((s) => s.open);
  const openBot = useBotStore((s) => s.setOpen);

  function run(action: CTAAction) {
    switch (action.kind) {
      case 'link':
        return router.push(action.href);
      case 'lead':
        return openLead({ module: action.module, product: action.product, sourcePage: action.sourcePage });
      case 'bot':
        return openBot(true);
      case 'scroll': {
        const el = document.getElementById(action.targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {items.map((item, i) => (
        <motion.button
          key={item.labelKey + i}
          onClick={() => run(item.action)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 font-deva ${
            i === 0
              ? 'bg-bk-gold text-bk-dark hover:bg-bk-gold-light hover:shadow-[0_0_24px_rgba(13,148,136,0.4)]'
              : 'border border-slate-200 bg-white/60 backdrop-blur-md text-slate-700 hover:border-bk-gold/50 hover:text-bk-gold hover:shadow-[0_0_20px_rgba(13,148,136,0.15)]'
          }`}
        >
          {t(item.labelKey)}
        </motion.button>
      ))}
    </div>
  );
}
