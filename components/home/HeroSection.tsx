'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, FileText } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

export default function HeroSection() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-16 md:pt-24">
      {/* soft ambient blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-16 top-32 h-72 w-72 rounded-full bg-yellow-500/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 18 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-slate-900/60 px-4 py-1.5 text-sm text-amber-400 shadow-sm backdrop-blur-xl font-deva">
            <Sparkles className="h-4 w-4" />
            {t('hero.badge')}
          </span>

          <h1 className="mt-6 whitespace-pre-line font-display text-4xl font-extrabold leading-[1.15] tracking-tight text-transparent md:text-6xl bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
            {t('hero.title')}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg font-deva">
            {t('hero.subtitle')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/rates"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-0.5 hover:bg-amber-300 font-deva"
            >
              {t('hero.cta_primary')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/documents"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-7 py-3.5 font-semibold text-slate-300 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-amber-400/40 hover:text-amber-400 font-deva"
            >
              <FileText className="h-4 w-4" />
              {t('hero.cta_secondary')}
            </Link>
          </div>
        </motion.div>

        {/* Right: floating 3D placeholder (Spline-ready) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.1 }}
          className="relative mx-auto w-full max-w-md"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="glass-card relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] p-8"
          >
            {/* layered gradient orbs as the 3D stand-in (swap for <Spline/> later) */}
            <div className="absolute h-56 w-56 rounded-full bg-gradient-to-br from-amber-400/40 to-yellow-600/30 blur-2xl" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              className="absolute h-64 w-64 rounded-[40%] border border-amber-400/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
              className="absolute h-72 w-72 rounded-[45%] border border-yellow-500/20"
            />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl shadow-amber-500/20">
              <span className="text-6xl">🤖</span>
            </div>
          </motion.div>

          {/* floating mini chips */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="glass-card absolute -left-3 top-10 rounded-2xl px-3 py-2 text-xs font-semibold text-amber-400 font-deva"
          >
            7.65% FD
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="glass-card absolute -right-2 bottom-12 rounded-2xl px-3 py-2 text-xs font-semibold text-yellow-400 font-deva"
          >
            EMI ✓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
