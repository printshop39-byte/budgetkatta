'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useLeadFormStore } from '@/store/leadFormStore';

// Desktop navbar links.
const primaryLinks = [
  { href: '/', key: 'nav.home' },
  { href: '/fds', key: 'nav.fd' },
  { href: '/loans', key: 'nav.loans' },
  { href: '/sip', key: 'nav.sip' },
  { href: '/insurance', key: 'nav.insurance' },
  { href: '/rates', key: 'nav.rates' },
  { href: '/documents', key: 'nav.documents' },
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
];

// Extra links shown only in the mobile drawer.
const mobileExtraLinks = [
  { href: '/privacy', key: 'nav.privacy' },
  { href: '/terms', key: 'nav.terms' },
];

export default function Navbar() {
  const { language, setLanguage } = useLanguageStore();
  const t = getTranslation(language);
  const openLead = useLeadFormStore((s) => s.open);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="font-display text-lg font-bold text-slate-200">
            Budget<span className="text-amber-400">Katta</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-2.5 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-amber-400 font-deva"
            >
              {t(l.key)}
            </Link>
          ))}
        </div>

        {/* Language switcher + CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openLead({ module: 'GENERAL', sourcePage: 'NAVBAR_CTA' })}
            className="hidden rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-amber-500 hover:shadow-[0_0_22px_rgba(251,191,36,0.45)] active:scale-95 font-deva lg:block"
          >
            {t('nav.cta_short')}
          </button>
          <div className="flex overflow-hidden rounded-lg border border-slate-800">
            {(['mr', 'hi'] as const).map((lng) => (
              <button
                key={lng}
                onClick={() => setLanguage(lng)}
                aria-pressed={language === lng}
                aria-label={lng === 'mr' ? 'मराठी भाषा' : 'हिंदी भाषा'}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  language === lng ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lng === 'mr' ? 'मराठी' : 'हिंदी'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/60 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile slide-out drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col border-l border-slate-800 bg-slate-900 p-5 lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display font-bold text-slate-200">
                  Budget<span className="text-amber-400">Katta</span>
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {[...primaryLinks, ...mobileExtraLinks].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-amber-400 font-deva"
                  >
                    {t(l.key)}
                  </Link>
                ))}
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  openLead({ module: 'GENERAL', sourcePage: 'MOBILE_MENU' });
                }}
                className="mt-4 w-full rounded-xl bg-amber-400 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-500 font-deva"
              >
                {t('nav.cta')}
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
