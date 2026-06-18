'use client';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { CONTACT_EMAIL } from '@/lib/config';
import TrustSection from '@/components/trust/TrustSection';

const productLinks = [
  { href: '/fds', key: 'nav.fd' },
  { href: '/loans', key: 'loan.home' },
  { href: '/loans', key: 'loan.personal' },
  { href: '/loans', key: 'loan.vehicle' },
  { href: '/loans', key: 'loan.education' },
  { href: '/loans', key: 'loan.gold' },
  { href: '/sip', key: 'nav.sip' },
  { href: '/insurance', key: 'ins.health' },
  { href: '/insurance', key: 'ins.term' },
];

const toolLinks = [
  { href: '/fds', key: 'tools.fd' },
  { href: '/loans', key: 'tools.emi' },
  { href: '/sip', key: 'tools.sip' },
  { href: '/insurance', key: 'tools.ins' },
  { href: '/documents', key: 'tools.docs' },
];

const companyLinks = [
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
  { href: '/privacy', key: 'nav.privacy' },
  { href: '/terms', key: 'nav.terms' },
  { href: '/disclaimer', key: 'nav.disclaimer' },
];

const trustItems = ['trust.secure', 'trust.transparent', 'trust.ai', 'trust.educational', 'trust.no_hidden'];

export default function Footer() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <footer>
      <TrustSection />
      {/* Security disclaimer banner */}
      <div className="border-t border-slate-800 bg-[#050814] px-4 pt-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
          <p className="bk-security-note text-center text-sm font-semibold leading-relaxed text-rose-200 font-deva sm:text-left">
            {language === 'mr'
              ? '🔒 सुरक्षा सतर्कता: बजेटकट्टा तुमच्याकडे कधीही मोबाईल OTP, पासवर्ड किंवा वैयक्तिक कागदपत्रांची (Personal Documents) मागणी करत नाही. कृपया तुमची खाजगी माहिती कोणासोबतही शेअर करू नका.'
              : '🔒 Security Warning: BudgetKatta will NEVER ask for your mobile OTP, passwords, or personal identity documents. Please do not share sensitive information with anyone.'}
          </p>
        </div>
      </div>
      <div className="bg-[#050814] px-4 pb-12 pt-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="font-display text-lg font-bold text-slate-200">
                Budget<span className="text-amber-400">Katta</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-400 font-deva">{t('footer.desc')}</p>
            <p className="mt-3 text-xs text-amber-400/80 font-deva">{t('footer.tagline')}</p>
          </div>

          <FooterColumn title={t('footer.col_products')}>
            {productLinks.map((l, i) => (
              <FooterLink key={l.key + i} href={l.href}>
                {t(l.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t('tools.title')}>
            {toolLinks.map((l) => (
              <FooterLink key={l.key} href={l.href}>
                {t(l.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t('footer.col_company')}>
            {companyLinks.map((l) => (
              <FooterLink key={l.key} href={l.href}>
                {t(l.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t('footer.col_trust')}>
            {trustItems.map((k) => (
              <li key={k} className="text-sm text-slate-400 font-deva">
                {t(k)}
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-400 font-deva">{t('footer.rights')}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-xs text-slate-400 transition-colors hover:text-amber-400"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <h3 className="mb-3 text-sm font-semibold text-slate-200 font-deva break-words">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="block break-words text-sm text-slate-400 transition-colors hover:text-amber-400 font-deva">
        {children}
      </Link>
    </li>
  );
}
