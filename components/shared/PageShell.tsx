'use client';
// PageShell — shared chrome for company/legal pages: animated bilingual heading
// + container. Title/subtitle come from i18n keys (no hardcoded copy).
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

export default function PageShell({
  titleKey,
  subtitleKey,
  children,
  narrow = false,
}: {
  titleKey: string;
  subtitleKey?: string;
  children: ReactNode;
  narrow?: boolean;
}) {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <div className={`mx-auto px-4 py-12 ${narrow ? 'max-w-3xl' : 'max-w-5xl'}`}>
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 text-center"
      >
        <h1 className="font-display text-3xl font-extrabold text-slate-100 md:text-4xl">{t(titleKey)}</h1>
        {subtitleKey && (
          <p className="mx-auto mt-3 max-w-2xl text-slate-400 font-deva">{t(subtitleKey)}</p>
        )}
      </motion.header>
      {children}
    </div>
  );
}
