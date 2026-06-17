'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageShell from '@/components/shared/PageShell';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

const trustKeys = [
  { key: 'trust.secure', emoji: '🔒' },
  { key: 'trust.transparent', emoji: '📊' },
  { key: 'trust.ai', emoji: '🤖' },
  { key: 'trust.updated', emoji: '🔄' },
  { key: 'trust.no_hidden', emoji: '✅' },
];

const ctas = [
  { href: '/fds', key: 'about.cta_fd' },
  { href: '/loans', key: 'about.cta_loan' },
  { href: '/sip', key: 'about.cta_sip' },
  { href: '/contact', key: 'about.cta_contact' },
];

export default function AboutPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <PageShell titleKey="about.title" subtitleKey="about.subtitle">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card glass-card-gold space-y-4 p-6 md:p-8"
      >
        <p className="text-base leading-relaxed text-slate-700 font-deva">{t('about.intro')}</p>
        <p className="text-base leading-relaxed text-slate-600 font-deva">{t('about.compare')}</p>
        <p className="text-base leading-relaxed text-slate-600 font-deva">{t('about.ai')}</p>
      </motion.div>

      {/* Trust badges */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {trustKeys.map((badge) => (
          <div
            key={badge.key}
            className="glass-card flex flex-col items-center gap-2 p-4 text-center transition-all hover:border-bk-gold/30"
          >
            <span className="text-2xl">{badge.emoji}</span>
            <p className="text-xs leading-snug text-slate-700 font-deva">{t(badge.key)}</p>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {ctas.map((cta, i) => (
          <Link
            key={cta.href}
            href={cta.href}
            className={`rounded-xl px-5 py-3 font-bold transition-colors font-deva ${
              i === ctas.length - 1
                ? 'bg-bk-gold text-bk-dark hover:bg-bk-gold-light'
                : 'border border-slate-200 text-slate-700 hover:border-bk-gold/40 hover:text-bk-gold'
            }`}
          >
            {t(cta.key)}
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
