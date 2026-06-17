'use client';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

const steps = [
  { key: 'home.how_1', icon: '🧭' },
  { key: 'home.how_2', icon: '📊' },
  { key: 'home.how_3', icon: '📄' },
];

export default function HowItWorks() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-center font-display text-2xl font-bold text-slate-800 font-deva">
          {t('home.how_title')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card relative flex flex-col items-center gap-3 rounded-3xl p-6 text-center"
            >
              <span className="absolute right-4 top-3 font-display text-3xl font-extrabold text-slate-900/5">
                {i + 1}
              </span>
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-bk-gold/20 to-bk-card text-2xl">
                {s.icon}
              </span>
              <p className="font-semibold text-slate-700 font-deva">{t(s.key)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
