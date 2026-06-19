'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useLeadFormStore } from '@/store/leadFormStore';
import { useThemeStore } from '@/store/themeStore';

// Single source of truth for header navigation — used by BOTH the desktop bar
// and the mobile drawer so they can never drift out of sync. Labels are inlined
// bilingually here to guarantee every route shows in both languages.
// `secondary` items (Documents/About/Contact) are kept out of the crowded
// desktop bar — they remain in the footer and the full mobile drawer.
type NavItem = { href: string; label: { mr: string; en: string }; secondary?: boolean };

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: { mr: 'मुख्यपृष्ठ', en: 'Home' } },
  { href: '/fds', label: { mr: 'FD दर', en: 'FD Rates' } },
  { href: '/loans', label: { mr: 'कर्ज', en: 'Loans' } },
  { href: '/sip', label: { mr: 'SIP', en: 'SIP' } },
  { href: '/insurance', label: { mr: 'विमा', en: 'Insurance' } },
  { href: '/gadget-emi', label: { mr: 'गॅजेट EMI', en: 'Gadget EMI' } },
  { href: '/rates', label: { mr: 'दर/बाजार', en: 'Rates / Market' } },
  { href: '/directory', label: { mr: 'बँक निर्देशिका', en: 'Bank Directory' } },
  { href: '/documents', label: { mr: 'कागदपत्रे', en: 'Documents' }, secondary: true },
  { href: '/about', label: { mr: 'आमच्याबद्दल', en: 'About Us' }, secondary: true },
  { href: '/contact', label: { mr: 'संपर्क', en: 'Contact' }, secondary: true },
];

// Desktop bar shows only the primary routes; the full list (incl. secondary)
// renders in the mobile drawer.
const DESKTOP_ITEMS = NAV_ITEMS.filter((i) => !i.secondary);

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

export default function Navbar() {
  const { language, setLanguage } = useLanguageStore();
  const t = getTranslation(language);
  const openLead = useLeadFormStore((s) => s.open);
  const { theme, toggleTheme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || '/';

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0A1128]/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="font-display text-lg font-bold text-slate-200">
            Budget<span className="text-amber-400">Katta</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {DESKTOP_ITEMS.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-2.5 py-2 text-sm font-deva transition-colors ${
                  active ? 'bg-amber-400/10 text-amber-400' : 'text-slate-400 hover:bg-slate-800/60 hover:text-amber-400'
                }`}
              >
                {l.label[language]}
              </Link>
            );
          })}
        </div>

        {/* Language switcher + CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openLead({ module: 'GENERAL', sourcePage: 'NAVBAR_CTA' })}
            className="hidden rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-amber-500 hover:shadow-[0_0_22px_rgba(251,191,36,0.45)] active:scale-95 font-deva lg:block"
          >
            {t('nav.cta_short')}
          </button>
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="rounded-lg border border-slate-800 p-2 text-slate-400 transition-colors hover:border-amber-400/40 hover:text-amber-400"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="flex overflow-hidden rounded-lg border border-slate-800">
            {(['mr', 'en'] as const).map((lng) => (
              <button
                key={lng}
                onClick={() => setLanguage(lng)}
                aria-pressed={language === lng}
                aria-label={lng === 'mr' ? 'मराठी भाषा' : 'English language'}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  language === lng ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lng === 'mr' ? 'मराठी' : 'English'}
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
    </header>

    {/* Mobile slide-out drawer — rendered OUTSIDE <header> so its fixed
        positioning resolves against the viewport, not the header's
        backdrop-filter containing block (which would clip it to ~64px). */}
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
              className="fixed right-0 top-0 z-50 flex h-full max-h-screen w-72 max-w-[85vw] flex-col border-l border-slate-800 bg-slate-900 p-5 lg:hidden"
            >
              <div className="mb-4 flex shrink-0 items-center justify-between">
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

              {/* Scrollable nav list — min-h-0 lets the flex child actually scroll
                  when the full list exceeds the viewport height (e.g. on 390px). */}
              <div className="-mr-2 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-2">
                {NAV_ITEMS.map((l, idx) => {
                  const active = isActive(pathname, l.href);
                  // Divider above the first secondary item to set it apart.
                  const firstSecondary = l.secondary && !NAV_ITEMS[idx - 1]?.secondary;
                  return (
                    <div key={l.href}>
                      {firstSecondary && <div className="my-2 border-t border-slate-800" />}
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={`block rounded-xl px-4 py-3 text-sm font-medium font-deva transition-colors ${
                          active ? 'bg-amber-400/10 text-amber-400' : 'text-slate-300 hover:bg-slate-800/60 hover:text-amber-400'
                        }`}
                      >
                        {l.label[language]}
                      </Link>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  openLead({ module: 'GENERAL', sourcePage: 'MOBILE_MENU' });
                }}
                className="mt-4 w-full shrink-0 rounded-xl bg-amber-400 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-500 font-deva"
              >
                {t('nav.cta')}
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
