'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

const options = [
  { href: '/fds', key: 'nav.fd', icon: '🏦' },
  { href: '/loans', key: 'nav.loans', icon: '💰' },
  { href: '/sip', key: 'nav.sip', icon: '📈' },
  { href: '/insurance', key: 'nav.insurance', icon: '🛡️' },
  { href: '/documents', key: 'nav.documents', icon: '📄' },
  { href: '/rates', key: 'nav.rates', icon: '📊' },
];

export default function QuickSelector() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <section className="px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-5 text-center font-display text-2xl font-bold text-white font-deva">
          {t('home.selector_title')}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {options.map((o, i) => (
            <motion.div
              key={o.href + o.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={o.href}
                className="glass-card flex flex-col items-center gap-2 p-4 text-center transition-all hover:border-bk-gold/40 hover:bg-white/[0.07]"
              >
                <span className="text-2xl">{o.icon}</span>
                <span className="text-xs font-semibold text-white/80 font-deva">{t(o.key)}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
