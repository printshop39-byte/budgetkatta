'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useLeadFormStore } from '@/store/leadFormStore';
import { useThemeStore } from '@/store/themeStore';
import { rippleToggleTheme } from '@/lib/themeTransition';
import Logo from '@/components/layout/Logo';

// Single source of truth for header navigation (2026-07 home-finance scope) —
// used by BOTH the desktop bar and the mobile drawer so they can never drift
// apart. Narrowed to the six home/property-finance entries; investment/loan
// categories (FD, SIP, gadget/education/women loans, bank directory) are NOT in
// the header now but their routes still work and are reachable via the footer.
// Section links are root-prefixed (`/#buy`) so they navigate to the homepage
// and scroll, from any page. Labels are inlined bilingually so both languages
// always render.
type Leaf = { href: string; label: { mr: string; en: string } };

const NAV: Leaf[] = [
  { href: '/', label: { mr: 'गृह वित्त', en: 'Home Finance' } },
  { href: '/#buy', label: { mr: 'घर घ्या', en: 'Buy a Home' } },
  { href: '/#build', label: { mr: 'घर बांधा', en: 'Build a Home' } },
  { href: '/#transfer', label: { mr: 'कर्ज ट्रान्सफर', en: 'Balance Transfer' } },
  { href: '/#home-insurance', label: { mr: 'गृह विमा', en: 'Home Insurance' } },
  { href: '/#property-tools', label: { mr: 'कॅल्क्युलेटर', en: 'Calculators' } },
];

// Secondary company links — kept out of the desktop bar; shown in the mobile
// drawer (and the footer) only.
const SECONDARY: Leaf[] = [
  { href: '/about', label: { mr: 'आमच्याबद्दल', en: 'About Us' } },
  { href: '/contact', label: { mr: 'संपर्क', en: 'Contact' } },
];

// Exact match for `/`; hash links never mark active (they target the homepage).
const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : !href.startsWith('/#') && (pathname === href || pathname.startsWith(href + '/'));

// Same-page section anchors (`/#buy`) use a plain <a>: on the homepage the
// browser just scrolls (no reload); from another page it navigates to the
// homepage then scrolls. This avoids next/link's client RSC fetch for a
// same-page hash (which logs a "Failed to fetch RSC payload" console error).
// Real route links keep next/link for client-side navigation.
function NavLink({
  href,
  className,
  onClick,
  active,
  children,
}: {
  href: string;
  className: string;
  onClick?: () => void;
  active: boolean;
  children: React.ReactNode;
}) {
  const aria = active ? ('page' as const) : undefined;
  if (href.startsWith('/#')) {
    return (
      <a href={href} onClick={onClick} aria-current={aria} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} aria-current={aria} className={className}>
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { language, setLanguage } = useLanguageStore();
  const t = getTranslation(language);
  const openLead = useLeadFormStore((s) => s.open);
  const { theme, setTheme } = useThemeStore();
  const [open, setOpen] = useState(false); // mobile drawer
  const pathname = usePathname() || '/';

  const linkBase = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-deva transition-colors ${
      active ? 'bg-amber-400/10 text-amber-400' : 'text-slate-400 hover:bg-slate-800/60 hover:text-amber-400'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0A1128]/80 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />

          {/* Desktop links — flat home-finance nav */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <NavLink key={item.href} href={item.href} active={active} className={linkBase(active)}>
                  {item.label[language]}
                </NavLink>
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
              onClick={(e) => rippleToggleTheme(e, theme, setTheme)}
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

              {/* Scrollable nav list. min-h-0 lets the flex child actually
                  scroll when content exceeds the viewport. */}
              <div className="-mr-2 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-2">
                {NAV.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      active={active}
                      onClick={() => setOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium font-deva transition-colors ${
                        active ? 'bg-amber-400/10 text-amber-400' : 'text-slate-300 hover:bg-slate-800/60 hover:text-amber-400'
                      }`}
                    >
                      {item.label[language]}
                    </NavLink>
                  );
                })}

                <div className="my-2 border-t border-slate-800" />
                {SECONDARY.map((l) => {
                  const a = isActive(pathname, l.href);
                  return (
                    <NavLink
                      key={l.href}
                      href={l.href}
                      active={a}
                      onClick={() => setOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium font-deva transition-colors ${
                        a ? 'bg-amber-400/10 text-amber-400' : 'text-slate-300 hover:bg-slate-800/60 hover:text-amber-400'
                      }`}
                    >
                      {l.label[language]}
                    </NavLink>
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
