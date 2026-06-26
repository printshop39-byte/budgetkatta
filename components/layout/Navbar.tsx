'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ChevronDown, Menu, X } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useLeadFormStore } from '@/store/leadFormStore';
import { useThemeStore } from '@/store/themeStore';
import Logo from '@/components/layout/Logo';

// Single source of truth for header navigation — used by BOTH the desktop bar
// and the mobile drawer so they can never drift out of sync. The flat list grew
// to ~9 items, so routes are grouped into a few category dropdowns
// (गुंतवणूक / कर्ज / साधने) with Home and विमा kept as direct links. Labels are
// inlined bilingually here to guarantee every route shows in both languages.
type Leaf = { href: string; label: { mr: string; en: string } };
type Group = { id: string; label: { mr: string; en: string }; items: Leaf[] };

const HOME: Leaf = { href: '/', label: { mr: 'मुख्यपृष्ठ', en: 'Home' } };
const INSURANCE: Leaf = { href: '/insurance', label: { mr: 'विमा', en: 'Insurance' } };

const GROUPS: Group[] = [
  {
    id: 'invest',
    label: { mr: 'गुंतवणूक', en: 'Investments' },
    items: [
      { href: '/fds', label: { mr: 'FD दर', en: 'FD Rates' } },
      { href: '/sip', label: { mr: 'SIP', en: 'SIP' } },
      { href: '/rates', label: { mr: 'दर / बाजार', en: 'Rates / Market' } },
    ],
  },
  {
    id: 'loans',
    label: { mr: 'कर्ज', en: 'Loans' },
    items: [
      { href: '/loans', label: { mr: 'सर्व कर्ज', en: 'All Loans' } },
      { href: '/education-loan', label: { mr: 'शिक्षण कर्ज', en: 'Education Loan' } },
      { href: '/loans/women', label: { mr: 'महिला कर्ज', en: 'Women Loans' } },
      { href: '/gadget-emi', label: { mr: 'गॅजेट EMI', en: 'Gadget EMI' } },
    ],
  },
  {
    id: 'tools',
    label: { mr: 'साधने', en: 'Tools' },
    items: [
      { href: '/directory', label: { mr: 'बँक निर्देशिका', en: 'Bank Directory' } },
      { href: '/documents', label: { mr: 'कागदपत्रे', en: 'Documents' } },
    ],
  },
];

// Secondary company links — kept out of the desktop bar; shown in the mobile
// drawer (and the footer) only.
const SECONDARY: Leaf[] = [
  { href: '/about', label: { mr: 'आमच्याबद्दल', en: 'About Us' } },
  { href: '/contact', label: { mr: 'संपर्क', en: 'Contact' } },
];

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
const groupActive = (pathname: string, g: Group) => g.items.some((i) => isActive(pathname, i.href));

export default function Navbar() {
  const { language, setLanguage } = useLanguageStore();
  const t = getTranslation(language);
  const openLead = useLeadFormStore((s) => s.open);
  const { theme, toggleTheme } = useThemeStore();
  const [open, setOpen] = useState(false); // mobile drawer
  const [openGroup, setOpenGroup] = useState<string | null>(null); // desktop dropdown
  const [expanded, setExpanded] = useState<string | null>(null); // mobile accordion
  const pathname = usePathname() || '/';

  const linkBase = (active: boolean) =>
    `rounded-lg px-2.5 py-2 text-sm font-deva transition-colors ${
      active ? 'bg-amber-400/10 text-amber-400' : 'text-slate-400 hover:bg-slate-800/60 hover:text-amber-400'
    }`;

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0A1128]/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />

        {/* Desktop links — Home + category dropdowns + विमा */}
        <div className="hidden items-center gap-0.5 lg:flex">
          <Link href={HOME.href} aria-current={isActive(pathname, HOME.href) ? 'page' : undefined} className={linkBase(isActive(pathname, HOME.href))}>
            {HOME.label[language]}
          </Link>

          {GROUPS.map((g) => {
            const active = groupActive(pathname, g);
            const isOpen = openGroup === g.id;
            return (
              <div
                key={g.id}
                className="relative"
                onMouseEnter={() => setOpenGroup(g.id)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  onClick={() => setOpenGroup(isOpen ? null : g.id)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-1 ${linkBase(active)}`}
                >
                  {g.label[language]}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-slate-800 bg-[#0A1128] p-1.5 shadow-xl shadow-black/40"
                    >
                      {g.items.map((item) => {
                        const a = isActive(pathname, item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenGroup(null)}
                            aria-current={a ? 'page' : undefined}
                            className={`block rounded-lg px-3 py-2 text-sm font-deva transition-colors ${
                              a ? 'bg-amber-400/10 text-amber-400' : 'text-slate-300 hover:bg-slate-800/60 hover:text-amber-400'
                            }`}
                          >
                            {item.label[language]}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <Link href={INSURANCE.href} aria-current={isActive(pathname, INSURANCE.href) ? 'page' : undefined} className={linkBase(isActive(pathname, INSURANCE.href))}>
            {INSURANCE.label[language]}
          </Link>
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
            <Menu className="h-5 w-5" />
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
                <Logo onClick={() => setOpen(false)} />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable nav list — grouped accordion. min-h-0 lets the flex
                  child actually scroll when content exceeds the viewport. */}
              <div className="-mr-2 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-2">
                <Link
                  href={HOME.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, HOME.href) ? 'page' : undefined}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium font-deva transition-colors ${
                    isActive(pathname, HOME.href) ? 'bg-amber-400/10 text-amber-400' : 'text-slate-300 hover:bg-slate-800/60 hover:text-amber-400'
                  }`}
                >
                  {HOME.label[language]}
                </Link>

                {GROUPS.map((g) => {
                  const isExp = expanded === g.id;
                  const active = groupActive(pathname, g);
                  return (
                    <div key={g.id}>
                      <button
                        onClick={() => setExpanded(isExp ? null : g.id)}
                        aria-expanded={isExp}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold font-deva transition-colors ${
                          active ? 'text-amber-400' : 'text-slate-300 hover:bg-slate-800/60 hover:text-amber-400'
                        }`}
                      >
                        {g.label[language]}
                        <ChevronDown className={`h-4 w-4 transition-transform ${isExp ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isExp && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            {g.items.map((item) => {
                              const a = isActive(pathname, item.href);
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setOpen(false)}
                                  aria-current={a ? 'page' : undefined}
                                  className={`block rounded-lg py-2.5 pl-8 pr-4 text-sm font-deva transition-colors ${
                                    a ? 'bg-amber-400/10 text-amber-400' : 'text-slate-400 hover:bg-slate-800/60 hover:text-amber-400'
                                  }`}
                                >
                                  {item.label[language]}
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                <Link
                  href={INSURANCE.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, INSURANCE.href) ? 'page' : undefined}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium font-deva transition-colors ${
                    isActive(pathname, INSURANCE.href) ? 'bg-amber-400/10 text-amber-400' : 'text-slate-300 hover:bg-slate-800/60 hover:text-amber-400'
                  }`}
                >
                  {INSURANCE.label[language]}
                </Link>

                <div className="my-2 border-t border-slate-800" />
                {SECONDARY.map((l) => {
                  const a = isActive(pathname, l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={a ? 'page' : undefined}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium font-deva transition-colors ${
                        a ? 'bg-amber-400/10 text-amber-400' : 'text-slate-300 hover:bg-slate-800/60 hover:text-amber-400'
                      }`}
                    >
                      {l.label[language]}
                    </Link>
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
