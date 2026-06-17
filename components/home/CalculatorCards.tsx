'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

const calcs = [
  { href: '/fds', key: 'tools.fd', icon: '🏦' },
  { href: '/loans', key: 'tools.emi', icon: '🧮' },
  { href: '/sip', key: 'tools.sip', icon: '📈' },
  { href: '/insurance', key: 'tools.ins', icon: '🛡️' },
];

export default function CalculatorCards() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-center font-display text-2xl font-bold text-slate-100 font-deva">
          {t('home.calc_title')}
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {calcs.map((c, i) => (
            <motion.div
              key={c.href + c.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={c.href}
                className="glass-card glass-card-gold flex flex-col items-center gap-2 rounded-2xl p-5 text-center transition-all hover:bg-slate-800/60"
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="text-xs font-semibold text-slate-300 font-deva">{t(c.key)}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
