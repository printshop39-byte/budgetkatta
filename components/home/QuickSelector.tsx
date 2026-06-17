'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Landmark, Banknote, TrendingUp, ShieldCheck, FileText, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

interface Tile {
  href: string;
  labelKey: string;
  subKey: string;
  Icon: LucideIcon;
  accent: string; // soft icon chip classes
  span?: string; // bento span
}

const tiles: Tile[] = [
  { href: '/fds', labelKey: 'nav.fd', subKey: 'fd.subtitle', Icon: Landmark, accent: 'bg-teal-50 text-teal-600', span: 'sm:col-span-2' },
  { href: '/loans', labelKey: 'nav.loans', subKey: 'loan.subtitle', Icon: Banknote, accent: 'bg-amber-50 text-amber-600' },
  { href: '/sip', labelKey: 'nav.sip', subKey: 'sip.subtitle', Icon: TrendingUp, accent: 'bg-emerald-50 text-emerald-600' },
  { href: '/insurance', labelKey: 'nav.insurance', subKey: 'ins.subtitle', Icon: ShieldCheck, accent: 'bg-sky-50 text-sky-600' },
  { href: '/documents', labelKey: 'nav.documents', subKey: 'doc.subtitle', Icon: FileText, accent: 'bg-violet-50 text-violet-600' },
  { href: '/rates', labelKey: 'nav.rates', subKey: 'rates.subtitle', Icon: BarChart3, accent: 'bg-rose-50 text-rose-600', span: 'sm:col-span-2' },
];

export default function QuickSelector() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-center font-display text-2xl font-bold text-slate-800 md:text-3xl font-deva">
          {t('home.selector_title')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.href + tile.labelKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', stiffness: 100, damping: 18, delay: i * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={tile.span ?? ''}
            >
              <Link
                href={tile.href}
                className="glass-card flex h-full flex-col gap-3 rounded-3xl p-5 transition-shadow hover:shadow-[0_18px_40px_rgb(13_148_136/0.12)]"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tile.accent}`}>
                  <tile.Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-800 font-deva">{t(tile.labelKey)}</h3>
                  <p className="mt-1 text-sm leading-snug text-slate-500 font-deva">{t(tile.subKey)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
