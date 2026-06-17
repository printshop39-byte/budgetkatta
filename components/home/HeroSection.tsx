'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

export default function HeroSection() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-28">
      {/* Ambient gold glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-bk-gold/10 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block rounded-full border border-bk-gold/30 bg-bk-gold/10 px-4 py-1.5 text-sm text-bk-gold font-deva"
        >
          {t('hero.badge')}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 whitespace-pre-line font-display text-4xl font-extrabold leading-tight text-white md:text-6xl"
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-base text-white/60 md:text-lg font-deva"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/rates"
            className="rounded-2xl bg-bk-gold px-7 py-3.5 font-bold text-bk-dark shadow-lg shadow-bk-gold/20 transition-colors hover:bg-bk-gold-light font-deva"
          >
            {t('hero.cta_primary')}
          </Link>
          <Link
            href="/documents"
            className="rounded-2xl border border-white/15 px-7 py-3.5 font-semibold text-white/80 transition-colors hover:border-bk-gold/40 hover:text-bk-gold font-deva"
          >
            {t('hero.cta_secondary')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
