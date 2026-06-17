'use client';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import TrustSection from '@/components/trust/TrustSection';

const productLinks = [
  { href: '/fds', key: 'nav.fd' },
  { href: '/loans', key: 'nav.loans' },
  { href: '/sip', key: 'nav.sip' },
  { href: '/insurance', key: 'nav.insurance' },
];

const companyLinks = [
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
  { href: '/privacy', key: 'nav.privacy' },
  { href: '/terms', key: 'nav.terms' },
  { href: '/disclaimer', key: 'nav.disclaimer' },
];

const trustItems = ['trust.secure', 'trust.transparent', 'trust.ai', 'trust.no_hidden'];

export default function Footer() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <footer>
      <TrustSection />
      <div className="border-t border-white/5 bg-bk-dark px-4 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="font-display text-lg font-bold text-white">
                Budget<span className="text-bk-gold">Katta</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/55 font-deva">{t('footer.desc')}</p>
            <p className="mt-3 text-xs text-bk-gold/80 font-deva">{t('footer.tagline')}</p>
          </div>

          {/* Products */}
          <FooterColumn title={t('footer.col_products')}>
            {productLinks.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {t(l.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Company */}
          <FooterColumn title={t('footer.col_company')}>
            {companyLinks.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {t(l.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Trust */}
          <FooterColumn title={t('footer.col_trust')}>
            {trustItems.map((k) => (
              <li key={k} className="text-sm text-white/55 font-deva">
                {t(k)}
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/40 font-deva">{t('footer.rights')}</p>
          <a
            href="mailto:support@budgetkatta.in"
            className="text-xs text-white/50 transition-colors hover:text-bk-gold"
          >
            support@budgetkatta.in
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-white font-deva">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-white/55 transition-colors hover:text-bk-gold font-deva">
        {children}
      </Link>
    </li>
  );
}
