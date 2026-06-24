'use client';
// BrokerOffers — dedicated, clearly-labelled section of demat / investing-app
// referral cards. Each card carries a commission disclosure and an "official
// terms apply" note; figures are indicative (verify on the official site).
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { brokerOffers } from '@/lib/brokerOffers';

export default function BrokerOffers({ className = '' }: { className?: string }) {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <section className={`mx-auto max-w-6xl px-4 py-10 ${className}`} aria-label={t('broker.section_title')}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-200 font-deva md:text-2xl">
            {t('broker.section_title')}
          </h2>
          <p className="mt-1 text-sm text-slate-400 font-deva">{t('broker.section_sub')}</p>
        </div>
        <span className="hidden shrink-0 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-300/90 sm:inline">
          {t('affiliate.badge')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {brokerOffers.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card flex h-full flex-col gap-3 p-5"
          >
            <p className="font-display text-lg font-bold text-slate-100">{b.name}</p>

            <dl className="space-y-1.5 text-xs">
              <Row label={t('broker.fee_open')} value={b.feeOpen[language]} />
              <Row label={t('broker.amc')} value={b.amc[language]} />
              <Row label={t('broker.brokerage')} value={b.brokerage[language]} />
              <Row label={t('broker.benefit')} value={b.benefit[language]} />
            </dl>

            <p className="text-[10px] leading-snug text-slate-500 font-deva">{t('broker.commission_note')}</p>

            <a
              href={b.href}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-500 font-deva"
            >
              {t('broker.cta')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-500 font-deva">{t('broker.indicative')}</p>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <dt className="shrink-0 text-slate-500 font-deva">{label}</dt>
      <dd className="text-right text-slate-300 font-deva">{value}</dd>
    </div>
  );
}
