'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

const modules = [
  { href: '/fds', key: 'fd.title', icon: '🏦', sub: 'fd.subtitle' },
  { href: '/loans', key: 'loan.title', icon: '💰', sub: 'loan.subtitle' },
  { href: '/sip', key: 'sip.title', icon: '📈', sub: 'sip.subtitle' },
  { href: '/insurance', key: 'ins.title', icon: '🛡️', sub: 'ins.subtitle' },
];

export default function ModuleCards() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <section className="px-4 py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
        {modules.map((m, i) => (
          <motion.div
            key={m.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={m.href}
              className="glass-card group flex items-start gap-4 p-6 transition-all hover:border-bk-gold/30"
            >
              <span className="text-3xl">{m.icon}</span>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-100 group-hover:text-bk-gold">
                  {t(m.key)}
                </h3>
                <p className="mt-1 text-sm text-slate-400 font-deva">{t(m.sub)}</p>
              </div>
              <span className="ml-auto text-bk-gold opacity-0 transition-opacity group-hover:opacity-100">
                →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
