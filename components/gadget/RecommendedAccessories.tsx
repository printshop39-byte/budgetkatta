'use client';
// RecommendedAccessories — affiliate-link cards for a gadget category. Renders
// the accessory list from gadgetCategories data; each card is an outbound,
// clearly-labelled affiliate link (rel="sponsored") that blends with the dark
// glass theme. Bilingual via languageStore.
import { motion } from 'framer-motion';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { RETAILER_LABEL, type AffiliateAccessory } from '@/lib/gadgetCategories';

const retailerStyle: Record<string, string> = {
  amazon: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  flipkart: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
};

export default function RecommendedAccessories({
  accessories,
}: {
  accessories: AffiliateAccessory[];
}) {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold text-slate-100 font-deva">
          🛍️ {t('gadget.accessories_title')}
        </h3>
        <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500 font-deva">
          {language === 'mr' ? 'जाहिरात' : 'Ad'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {accessories.map((acc, i) => (
          <motion.a
            key={acc.id}
            href={acc.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card group flex h-full flex-col gap-2 p-4 transition-colors hover:border-bk-gold/40"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
                <ShoppingCart className="h-4 w-4" />
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                  retailerStyle[acc.retailer] ?? 'border-slate-700 text-slate-400'
                }`}
              >
                {RETAILER_LABEL[acc.retailer]}
              </span>
            </div>

            <p className="text-sm font-bold text-slate-100 font-deva">{acc.name[language]}</p>
            <p className="text-xs text-slate-400 font-deva">{acc.desc[language]}</p>

            <div className="mt-auto flex items-center justify-between pt-2">
              {acc.price && <span className="text-sm font-bold text-bk-gold">{acc.price}</span>}
              <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors group-hover:text-bk-gold font-deva">
                {t('gadget.buy_now')}
                <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      <p className="text-[11px] leading-relaxed text-slate-500 font-deva">
        {t('gadget.affiliate_note')}
      </p>
    </section>
  );
}
