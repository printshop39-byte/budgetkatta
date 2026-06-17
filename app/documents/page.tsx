'use client';
import { useState } from 'react';
import PageShell from '@/components/shared/PageShell';
import DocumentChecklist from '@/components/shared/DocumentChecklist';
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
          <span className="mb-1 block text-sm text-white/70 font-deva">{t('doc.product')}</span>
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
          <span className="mb-1 block text-sm text-white/70 font-deva">{t('doc.profile')}</span>
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
          className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-bold text-white/80 transition-colors hover:border-bk-gold/40 hover:text-bk-gold font-deva"
        >
          ⬇️ {t('doc.download')}
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
        <p className="mt-2 text-xs text-white/45 font-deva">{t('doc.download_soon')}</p>
      )}

      {/* Checklist */}
      <div className="mt-8">
        <DocumentChecklist documents={documents} />
      </div>
    </PageShell>
  );
}
