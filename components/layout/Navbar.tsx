'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

// Primary links shown in the desktop navbar.
const primaryLinks = [
  { href: '/', key: 'nav.home' },
  { href: '/fds', key: 'nav.fd' },
  { href: '/loans', key: 'nav.loans' },
  { href: '/sip', key: 'nav.sip' },
  { href: '/insurance', key: 'nav.insurance' },
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
];

// Extra links shown only in the mobile menu.
const mobileExtraLinks = [
  { href: '/privacy', key: 'nav.privacy' },
  { href: '/terms', key: 'nav.terms' },
];

export default function Navbar() {
  const { language, setLanguage } = useLanguageStore();
  const t = getTranslation(language);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bk-dark/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="font-display text-lg font-bold text-white">
            Budget<span className="text-bk-gold">Katta</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-bk-gold font-deva"
            >
              {t(l.key)}
            </Link>
          ))}
        </div>

        {/* Language switcher + mobile toggle */}
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-white/10">
            {(['mr', 'hi'] as const).map((lng) => (
              <button
                key={lng}
                onClick={() => setLanguage(lng)}
                aria-pressed={language === lng}
                aria-label={lng === 'mr' ? 'मराठी भाषा' : 'हिंदी भाषा'}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  language === lng ? 'bg-bk-gold text-bk-dark' : 'text-white/60 hover:text-white'
                }`}
              >
                {lng === 'mr' ? 'मराठी' : 'हिंदी'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-2 text-white/70 hover:bg-white/5 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 px-4 py-2 lg:hidden">
          {[...primaryLinks, ...mobileExtraLinks].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-bk-gold font-deva"
            >
              {t(l.key)}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
