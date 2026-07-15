'use client';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { CONTACT_EMAIL } from '@/lib/config';
import TrustSection from '@/components/trust/TrustSection';
import Logo from '@/components/layout/Logo';

// Footer navigation narrowed to the home-finance focus (2026-07). Investment /
// generic-loan links (FD, SIP, gold/personal/vehicle loans, health/term
// insurance) are removed from the footer so they don't compete with the
// homepage focus; those ROUTES still work and stay linked from their own legacy
// pages. Home-finance labels are inlined bilingually (no lib/i18n.ts edits).
type FLink = { href: string; label: { mr: string; en: string } };

const homeFinanceLinks: FLink[] = [
  { href: '/loans/home-loan', label: { mr: 'गृहकर्ज', en: 'Home Loan' } },
  { href: '/loans#loan-calc', label: { mr: 'EMI कॅल्क्युलेटर', en: 'EMI Calculator' } },
  { href: '/#buy-build-transfer', label: { mr: 'गृह-वित्त मार्गदर्शक', en: 'Home Finance Guide' } },
  { href: '/#home-insurance', label: { mr: 'गृह विमा मार्गदर्शक', en: 'Home Insurance Guide' } },
  { href: '/documents', label: { mr: 'मालमत्ता कागदपत्रे', en: 'Property Documents' } },
];

const companyLinks: FLink[] = [
  { href: '/contact', label: { mr: 'संपर्क', en: 'Contact' } },
  { href: '/about', label: { mr: 'आमच्याबद्दल', en: 'About Us' } },
  { href: '/privacy', label: { mr: 'गोपनीयता धोरण', en: 'Privacy' } },
  { href: '/disclaimer', label: { mr: 'अस्वीकरण', en: 'Disclaimer' } },
  { href: '/affiliate-disclosure', label: { mr: 'जाहिरात व कमिशन धोरण', en: 'Affiliate Disclosure' } },
  { href: '/terms', label: { mr: 'अटी व शर्ती', en: 'Terms' } },
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
          <p className="bk-security-note flex items-start justify-center gap-2 text-center text-sm font-semibold leading-relaxed text-rose-200 font-deva sm:justify-start sm:text-left">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            {language === 'mr'
              ? 'सुरक्षा सतर्कता: बजेटकट्टा तुमच्याकडे कधीही मोबाईल OTP, पासवर्ड किंवा वैयक्तिक कागदपत्रांची (Personal Documents) मागणी करत नाही. कृपया तुमची खाजगी माहिती कोणासोबतही शेअर करू नका.'
              : 'Security Warning: BudgetKatta will NEVER ask for your mobile OTP, passwords, or personal identity documents. Please do not share sensitive information with anyone.'}
          </p>
        </div>
      </div>
      <div className="bg-[#050814] px-4 pb-12 pt-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-slate-400 font-deva">
              {language === 'mr'
                ? 'महाराष्ट्रासाठी गृहकर्ज, property budget व गृह विमा यांची सोपी, शैक्षणिक माहिती व साधने.'
                : 'Simple, educational home-loan, property-budget & home-insurance tools for Maharashtra.'}
            </p>
            <p className="mt-3 text-xs text-amber-400/80 font-deva">{t('footer.tagline')}</p>
          </div>

          <FooterColumn title={language === 'mr' ? 'गृह वित्त' : 'Home Finance'}>
            {homeFinanceLinks.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label[language]}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t('footer.col_company')}>
            {companyLinks.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label[language]}
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

        {/* Affiliate disclosure — required for ASCI / affiliate-network transparency. */}
        <p className="mx-auto mt-10 max-w-6xl border-t border-slate-800 pt-6 text-xs leading-relaxed text-slate-500 font-deva">
          {t('footer.affiliate_disclosure')}
        </p>

        <div className="mx-auto mt-4 flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
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
  const cls = 'block break-words text-sm text-slate-400 transition-colors hover:text-amber-400 font-deva';
  // Same-page hash target → plain <a> (scroll, no RSC fetch); route → next/link.
  return (
    <li>
      {href.startsWith('/#') ? (
        <a href={href} className={cls}>
          {children}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {children}
        </Link>
      )}
    </li>
  );
}
