'use client';
// SchemeCard — one scheme tile, used on the women/student loan pages.
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/languageStore';
import { Icon } from '@/components/shared/Icon';
import type { Scheme } from '@/lib/schemes';

export default function SchemeCard({ s, index = 0 }: { s: Scheme; index?: number }) {
  const { language: lang } = useLanguageStore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="glass-card flex h-full flex-col gap-2 p-5 transition-all hover:border-amber-400/40"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20">
          <Icon name={s.icon} className="h-5 w-5" />
        </span>
        <h3 className="font-bold text-slate-100 font-deva">{s.name[lang]}</h3>
        {s.badge && (
          <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300 font-deva">
            {s.badge[lang]}
          </span>
        )}
      </div>
      <span className="w-fit rounded-md bg-amber-400/10 px-2 py-0.5 text-xs font-semibold text-amber-300 font-deva">
        {s.amount[lang]}
      </span>
      <p className="text-xs font-semibold text-slate-300 font-deva">{s.forWhom[lang]}</p>
      <p className="text-xs leading-relaxed text-slate-400 font-deva">{s.detail[lang]}</p>
    </motion.div>
  );
}
