'use client';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import TrustSection from '@/components/trust/TrustSection';

const links = [
  { href: '/fds', key: 'nav.fd' },
  { href: '/loans', key: 'nav.loans' },
  { href: '/sip', key: 'nav.sip' },
  { href: '/insurance', key: 'nav.insurance' },
];

export default function Footer() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <footer>
      <TrustSection />
      <div className="border-t border-white/5 bg-bk-dark px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="font-display text-lg font-bold text-white">
              Budget<span className="text-bk-gold">Katta</span>
            </p>
            <p className="mt-1 text-sm text-white/50 font-deva">{t('footer.tagline')}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-white/60 transition-colors hover:text-bk-gold font-deva"
              >
                {t(l.key)}
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-white/40 font-deva">{t('footer.rights')}</p>
      </div>
    </footer>
  );
}
