'use client';
// LenderComparison — generic, affiliate-aware multi-lender comparison widget.
// Used for both education loans (/loans/students) and women business loans
// (/loans/women). Renders a table on desktop and stacked cards on mobile so the
// per-lender "Apply" CTA is always reachable. Each href is resolved in the data
// layer (per-lender env link -> aggregator link -> official site), so this
// component just displays whatever it's given.
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { isLiveLink } from '@/lib/affiliate';
import type { Bi } from '@/types';

export interface Lender {
  id: string;
  name: string;
  href: string;
  rate: Bi;
  maxAmount: Bi;
  collateral: Bi;
  highlight: Bi;
}

export default function LenderComparison({
  title,
  lenders,
  aggregatorLink = '',
  aggregatorCta,
  updated,
  className = '',
}: {
  title: Bi;
  lenders: Lender[];
  aggregatorLink?: string;
  /** Headline for the "compare all in one place" CTA (shown only if link set). */
  aggregatorCta?: Bi;
  updated: string;
  className?: string;
}) {
  const { language: lang } = useLanguageStore();
  const mr = lang === 'mr';
  const aggregatorLive = isLiveLink(aggregatorLink) && Boolean(aggregatorCta);

  const cols = {
    lender: mr ? 'लेंडर' : 'Lender',
    rate: mr ? 'व्याजदर' : 'Rate',
    amount: mr ? 'कमाल रक्कम' : 'Max amount',
    collateral: mr ? 'तारण' : 'Collateral',
    highlight: mr ? 'वैशिष्ट्य' : 'Highlight',
  };

  function ApplyLink({ href, full }: { href: string; full?: boolean }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-500 font-deva ${full ? 'w-full' : ''}`}
      >
        Apply
        <ArrowRight className="h-4 w-4" />
      </a>
    );
  }

  return (
    <section className={className} aria-label={title[lang]}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold text-slate-100 font-deva">{title[lang]}</h3>
        <span className="shrink-0 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-300/90">
          {mr ? 'जाहिरात' : 'Ad'}
        </span>
      </div>

      {/* Compare-all CTA — one aggregator link (e.g. Paisabazaar) covering many
          lenders. Shown only when a real aggregator link is configured. */}
      {aggregatorLive && (
        <a
          href={aggregatorLink}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-400/15 to-slate-900/40 p-4 transition-colors hover:border-amber-400/60"
        >
          <span className="text-sm font-bold text-slate-100 font-deva">{aggregatorCta![lang]}</span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 font-deva">
            {mr ? 'तुलना करा' : 'Compare'}
            <ArrowRight className="h-4 w-4" />
          </span>
        </a>
      )}

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-800 sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/40 text-left text-slate-400">
              <th className="p-3 font-medium font-deva">{cols.lender}</th>
              <th className="p-3 font-medium font-deva">{cols.rate}</th>
              <th className="p-3 font-medium font-deva">{cols.amount}</th>
              <th className="p-3 font-medium font-deva">{cols.collateral}</th>
              <th className="p-3 font-medium font-deva">{cols.highlight}</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {lenders.map((l) => (
              <tr key={l.id} className="border-b border-slate-800 last:border-0">
                <td className="p-3 font-bold text-slate-100 font-deva">{l.name}</td>
                <td className="p-3 font-bold text-bk-gold font-deva">{l.rate[lang]}</td>
                <td className="p-3 text-slate-300 font-deva">{l.maxAmount[lang]}</td>
                <td className="p-3 text-slate-400 font-deva">{l.collateral[lang]}</td>
                <td className="p-3 text-slate-400 font-deva">{l.highlight[lang]}</td>
                <td className="p-3 text-right">
                  <ApplyLink href={l.href} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="space-y-3 sm:hidden">
        {lenders.map((l, i) => (
          <motion.div
            key={l.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="glass-card flex flex-col gap-2 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-100 font-deva">{l.name}</p>
              <span className="font-bold text-bk-gold font-deva">{l.rate[lang]}</span>
            </div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
              <dt className="text-slate-500 font-deva">{cols.amount}</dt>
              <dd className="text-right text-slate-300 font-deva">{l.maxAmount[lang]}</dd>
              <dt className="text-slate-500 font-deva">{cols.collateral}</dt>
              <dd className="text-right text-slate-300 font-deva">{l.collateral[lang]}</dd>
              <dt className="text-slate-500 font-deva">{cols.highlight}</dt>
              <dd className="text-right text-slate-300 font-deva">{l.highlight[lang]}</dd>
            </dl>
            <ApplyLink href={l.href} full />
          </motion.div>
        ))}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500 font-deva">
        {mr
          ? '* आकडे सूचक (indicative) आहेत व वारंवार बदलतात — अर्जापूर्वी अधिकृत साईटवर तपासा. काही "Apply" links affiliate असू शकतात; त्यातून BudgetKatta ला commission मिळू शकते (तुम्हाला अतिरिक्त खर्च नाही).'
          : '* Figures are indicative and change often — verify on the official site before applying. Some "Apply" links may be affiliate links; BudgetKatta may earn a commission (at no extra cost to you).'}{' '}
        {mr ? 'शेवटचा आढावा' : 'Last reviewed'}: {updated}
      </p>
    </section>
  );
}
