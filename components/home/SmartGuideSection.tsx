'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useBotStore } from '@/store/botStore';

export default function SmartGuideSection() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const openBot = useBotStore((s) => s.setOpen);

  return (
    <section className="px-4 py-10">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
        {/* Documents shortcut */}
        <Link
          href="/documents"
          className="glass-card glass-card-gold group flex items-center gap-4 p-6 transition-all hover:border-bk-gold/50"
        >
          <span className="text-4xl">📄</span>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-100 group-hover:text-bk-gold font-deva">
              {t('home.docs_cta')}
            </h3>
            <p className="mt-1 text-sm text-slate-400 font-deva">{t('home.docs_sub')}</p>
          </div>
          <span className="ml-auto text-bk-gold opacity-0 transition-opacity group-hover:opacity-100">→</span>
        </Link>

        {/* 3D smart guide */}
        <motion.button
          onClick={() => openBot(true)}
          whileHover={{ scale: 1.01 }}
          className="glass-card flex items-center gap-4 p-6 text-left transition-all hover:border-bk-gold/40"
        >
          <span className="relative flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-bk-gold/20 to-bk-card">
            <span className="pointer-events-none absolute h-10 w-10 rounded-full bg-bk-gold/20 blur-md animate-pulse-gold" />
            <span className="relative text-3xl animate-float">🤖</span>
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-200 font-deva">{t('home.guide_title')}</h3>
            <p className="mt-1 text-sm text-slate-400 font-deva">{t('home.guide_sub')}</p>
          </div>
        </motion.button>
      </div>
    </section>
  );
}
