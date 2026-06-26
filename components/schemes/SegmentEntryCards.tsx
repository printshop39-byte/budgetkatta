'use client';
// SegmentEntryCards — the two high-intent entry cards (Women / Students) shown
// on /loans and on the /schemes hub. Each deep-links to its dedicated page.
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, GraduationCap, ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

const CARDS = [
  {
    href: '/loans/women',
    icon: Users,
    title: { mr: 'महिलांसाठी विशेष कर्ज', en: 'Special loans for women' },
    points: {
      mr: ['Stamp Duty 1% सूट (महाराष्ट्र)', '7+ सरकारी योजना व अनुदान', 'महिलांना कमी व्याजदर'],
      en: ['1% stamp-duty concession (Maharashtra)', '7+ government schemes & subsidies', 'Lower interest rate for women'],
    },
    cta: { mr: 'तपशील पाहा', en: 'See details' },
  },
  {
    href: '/education-loan',
    icon: GraduationCap,
    title: { mr: 'विद्यार्थ्यांसाठी कर्ज', en: 'Loans for students' },
    points: {
      mr: ['PM विद्यालक्ष्मी — विनातारण (नवीन)', 'परदेशी शिक्षण कर्ज तुलना', 'Moratorium EMI calculator'],
      en: ['PM Vidyalaxmi — collateral-free (new)', 'Compare abroad education loans', 'Moratorium EMI calculator'],
    },
    cta: { mr: 'तपशील पाहा', en: 'See details' },
  },
] as const;

export default function SegmentEntryCards({
  className = '',
  heading,
}: {
  className?: string;
  /** When set, renders a centered bilingual section heading above the cards. */
  heading?: { mr: string; en: string; sub?: { mr: string; en: string } };
}) {
  const { language: lang } = useLanguageStore();
  const grid = (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${heading ? '' : className}`}>
      {CARDS.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.href}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href={c.href}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-slate-900/40 p-6 transition-all hover:border-amber-400/50 hover:shadow-[0_0_28px_rgba(251,191,36,0.18)]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/15 text-amber-400">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-lg font-bold text-slate-100 font-deva">{c.title[lang]}</h3>
              </div>
              <ul className="space-y-1.5">
                {c.points[lang].map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-300 font-deva">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {p}
                  </li>
                ))}
              </ul>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-bold text-amber-300 font-deva">
                {c.cta[lang]}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );

  if (!heading) return grid;

  return (
    <section className={`mx-auto max-w-5xl px-6 py-20 ${className}`}>
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-extrabold text-slate-100 font-deva md:text-4xl">
          {heading[lang]}
        </h2>
        {heading.sub && (
          <p className="mt-2 text-slate-400 font-deva">{heading.sub[lang]}</p>
        )}
      </div>
      {grid}
    </section>
  );
}
