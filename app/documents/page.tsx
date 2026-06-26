'use client';
import { useState } from 'react';
import Link from 'next/link';
import PageShell from '@/components/shared/PageShell';
import DocumentChecklist from '@/components/shared/DocumentChecklist';
import AffiliateBanner from '@/components/AffiliateBanner';
import { Download } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useLeadFormStore } from '@/store/leadFormStore';
import {
  getDocuments,
  productOptions,
  profileOptions,
  type ProductType,
  type ProfileType,
} from '@/lib/documentChecklists';
import type { LeadModule } from '@/types';

function moduleFor(product: ProductType): LeadModule {
  if (product === 'FD') return 'FD';
  if (product === 'SIP') return 'SIP';
  if (product.endsWith('INSURANCE')) return 'INSURANCE';
  return 'LOAN';
}

export default function DocumentsPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const openLead = useLeadFormStore((s) => s.open);

  const [product, setProduct] = useState<ProductType>('HOME_LOAN');
  const [profile, setProfile] = useState<ProfileType>('SALARIED');
  const [showDownloadNote, setShowDownloadNote] = useState(false);

  const documents = getDocuments(product, profile);
  const productLabel = productOptions.find((p) => p.value === product)?.label[language] ?? '';

  return (
    <PageShell titleKey="doc.title" subtitleKey="doc.subtitle">
      {/* Selectors */}
      <div className="glass-card glass-card-gold grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400 font-deva">{t('doc.product')}</span>
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value as ProductType)}
            className="bk-input"
          >
            {productOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-bk-card">
                {o.label[language]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400 font-deva">{t('doc.profile')}</span>
          <select
            value={profile}
            onChange={(e) => setProfile(e.target.value as ProfileType)}
            className="bk-input"
          >
            {profileOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-bk-card">
                {o.label[language]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => setShowDownloadNote((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 px-5 py-2.5 text-sm font-bold text-slate-300 transition-colors hover:border-bk-gold/40 hover:text-bk-gold font-deva"
        >
          <Download className="h-4 w-4" /> {t('doc.download')}
        </button>
        <button
          onClick={() =>
            openLead({ module: moduleFor(product), product: productLabel, sourcePage: 'DOCUMENTS_PAGE' })
          }
          className="rounded-xl bg-bk-gold px-5 py-2.5 text-sm font-bold text-bk-dark transition-colors hover:bg-bk-gold-light font-deva"
        >
          {t('doc.need_help')}
        </button>
      </div>
      {showDownloadNote && (
        <p className="mt-2 text-xs text-slate-400 font-deva">{t('doc.download_soon')}</p>
      )}

      {/* Checklist */}
      <div className="mt-8">
        <DocumentChecklist documents={documents} />
      </div>

      {/* Quick links to the dedicated per-loan checklist pages */}
      <div className="mt-8">
        <p className="mb-2 text-sm font-semibold text-slate-300 font-deva">
          {language === 'mr' ? 'कर्ज प्रकारानुसार चेकलिस्ट' : 'Checklists by loan type'}
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/loans/home-loan', label: { mr: 'गृहकर्ज', en: 'Home Loan' } },
            { href: '/loans/personal-loan', label: { mr: 'वैयक्तिक कर्ज', en: 'Personal Loan' } },
            { href: '/loans/vehicle-loan', label: { mr: 'वाहन कर्ज', en: 'Auto Loan' } },
            { href: '/loans/education-loan', label: { mr: 'शैक्षणिक कर्ज', en: 'Education Loan' } },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-bk-gold/40 hover:text-bk-gold font-deva"
            >
              {l.label[language]}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <AffiliateBanner variant="loan" />
      </div>
    </PageShell>
  );
}
