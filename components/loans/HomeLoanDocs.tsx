'use client';
// HomeLoanDocs — applicant-profile checklist for /loans/home-loan. The generic
// page used to show only the salaried list; banks ask different income proof
// from business owners and co-applicants, so the user picks the profile.
import { useState } from 'react';
import { FileText } from 'lucide-react';
import DocumentChecklist from '@/components/shared/DocumentChecklist';
import { useLanguageStore } from '@/store/languageStore';
import { getDocuments, homeProfileOptions, type ProfileType } from '@/lib/documentChecklists';

export default function HomeLoanDocs() {
  const lang = useLanguageStore((s) => s.language) === 'mr' ? 'mr' : 'en';
  const mr = lang === 'mr';
  const [profile, setProfile] = useState<ProfileType>('SALARIED');
  const documents = getDocuments('HOME_LOAN', profile);

  return (
    <section id="applicant-docs" className="mt-10 scroll-mt-24">
      <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-slate-100 font-deva">
        <FileText className="h-5 w-5 text-amber-400" />
        {mr ? 'अर्जदाराच्या प्रकारानुसार कागदपत्रे' : 'Documents by applicant type'}
      </h2>
      <div role="tablist" aria-label={mr ? 'अर्जदाराचा प्रकार' : 'Applicant type'} className="mb-4 flex flex-wrap gap-2">
        {homeProfileOptions.map((o) => (
          <button
            key={o.value}
            role="tab"
            type="button"
            aria-selected={profile === o.value}
            onClick={() => setProfile(o.value)}
            className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold font-deva transition-colors ${
              profile === o.value ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-amber-400/40'
            }`}
          >
            {o.label[lang]}
          </button>
        ))}
      </div>
      <DocumentChecklist documents={documents} />
      <p className="mt-3 text-xs text-slate-500 font-deva">
        {mr
          ? 'ही सर्वसाधारण यादी आहे. प्रत्येक बँकेची स्वतःची checklist लागू असते — अर्जापूर्वी बँकेकडून अंतिम यादी घ्या.'
          : 'This is a general list. Each lender applies its own checklist — get the final list from the bank before applying.'}
      </p>
    </section>
  );
}
