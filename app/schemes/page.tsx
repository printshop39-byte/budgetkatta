'use client';
// /schemes — a light hub for the two high-intent segments. The deep content
// lives on /loans/women and /loans/students; this page just routes users there
// (and gives the navbar a single landing target) without duplicating content.
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/languageStore';
import { useLeadFormStore } from '@/store/leadFormStore';
import SegmentEntryCards from '@/components/schemes/SegmentEntryCards';

export default function SchemesHubPage() {
  const { language: lang } = useLanguageStore();
  const openLead = useLeadFormStore((s) => s.open);
  const mr = lang === 'mr';

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <motion.header initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-slate-100 font-deva md:text-4xl">
          {mr ? 'महिलांसाठी आणि विद्यार्थ्यांसाठी योग्य कर्ज योजना शोधा' : 'Find the right loan scheme for women & students'}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400 font-deva">
          {mr
            ? 'सरकारी योजना, बँक कर्ज, scholarship आणि subsidy — मराठीत सोपं मार्गदर्शन.'
            : 'Government schemes, bank loans, scholarships and subsidies — simple guidance in Marathi.'}
        </p>
      </motion.header>

      <SegmentEntryCards />

      <div className="mt-8 text-center">
        <button
          onClick={() => openLead({ module: 'GENERAL', sourcePage: 'SCHEMES_HUB' })}
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-2.5 text-sm font-bold text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-400 font-deva"
        >
          {mr ? 'माझ्यासाठी कोणती योजना योग्य? — मार्गदर्शन घ्या' : 'Which scheme is right for me? — Get guidance'}
        </button>
      </div>
    </div>
  );
}
