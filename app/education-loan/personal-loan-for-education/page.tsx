'use client';
// /education-loan/personal-loan-for-education — "Personal Loan for Education". When a direct
// education loan is slow or rejected, a personal loan can cover fees, laptop,
// coaching or a funding gap. This is the most affiliate-monetisable angle, so it
// carries the lender comparison + the lead-gen finder form.
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet, GraduationCap, AlertTriangle } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import LenderComparison from '@/components/schemes/LenderComparison';
import EducationLoanFinder from '@/components/lead/EducationLoanFinder';
import { personalLoanLenders, PL_LENDERS_UPDATED, PL_AGGREGATOR_LINK } from '@/lib/personalLoanLenders';

const WHEN_USE = [
  {
    mr: 'Education loan मंजुरीस उशीर होतोय व fees ची मुदत जवळ आहे',
    en: 'The education loan is delayed and the fee deadline is near',
  },
  {
    mr: 'लहान रक्कम हवी (laptop, coaching, exam, travel)',
    en: 'You need a smaller amount (laptop, coaching, exam, travel)',
  },
  {
    mr: 'Collateral किंवा co-applicant नाही, पण उत्पन्नाचा पुरावा आहे',
    en: 'No collateral/co-applicant, but you have income proof',
  },
];

export default function PersonalLoanForEducationPage() {
  const { language: lang } = useLanguageStore();
  const mr = lang === 'mr';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-slate-400 font-deva">
        <Link href="/loans" className="hover:text-amber-300">
          {mr ? 'कर्ज' : 'Loans'}
        </Link>{' '}
        /{' '}
        <Link href="/education-loan" className="hover:text-amber-300">
          {mr ? 'विद्यार्थ्यांसाठी कर्ज' : 'Student loans'}
        </Link>{' '}
        / <span className="text-slate-300">{mr ? 'Personal Loan for Education' : 'Personal Loan for Education'}</span>
      </nav>

      {/* Hero */}
      <motion.header initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
            <Wallet className="h-6 w-6" />
          </span>
          <h1 className="font-display text-3xl font-extrabold text-slate-100 font-deva md:text-4xl">
            {mr ? 'शिक्षणासाठी Personal Loan' : 'Personal Loan for Education'}
          </h1>
        </div>
        <p className="mt-3 max-w-2xl text-slate-300 font-deva">
          {mr
            ? 'Education loan शक्य नसेल किंवा उशीर होत असेल, तर fees, laptop, coaching किंवा funding gap साठी personal loan हा जलद पर्याय आहे — विनातारण व झटपट.'
            : 'When an education loan isn’t possible or is delayed, a personal loan is a fast option for fees, laptop, coaching or a funding gap — collateral-free and quick.'}
        </p>
      </motion.header>

      {/* When to use */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-xl font-bold text-slate-100 font-deva">
          {mr ? 'हा पर्याय केव्हा योग्य?' : 'When does this make sense?'}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {WHEN_USE.map((w, i) => (
            <motion.div
              key={w.en}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card flex items-start gap-2 p-4 text-sm text-slate-300 font-deva"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              {w[lang]}
            </motion.div>
          ))}
        </div>
        {/* Honest caution — personal loans cost more than education loans */}
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-xs leading-relaxed text-slate-300 font-deva">
            {mr
              ? 'लक्षात ठेवा: personal loan चा व्याजदर education loan पेक्षा जास्त असतो आणि 80E करसवलत मिळत नाही. शक्य असल्यास आधी education loan तपासा.'
              : 'Note: a personal loan costs more than an education loan and gets no 80E tax benefit. If possible, check an education loan first.'}
          </p>
        </div>
      </section>

      {/* Lender comparison */}
      <section className="mb-10">
        <LenderComparison
          title={{ mr: 'Personal Loan लेंडर तुलना', en: 'Personal loan lender comparison' }}
          lenders={personalLoanLenders}
          aggregatorLink={PL_AGGREGATOR_LINK}
          aggregatorCta={{
            mr: 'सर्व personal loan पर्यायांची तुलना करा — एकाच ठिकाणी',
            en: 'Compare all personal-loan options — in one place',
          }}
          updated={PL_LENDERS_UPDATED}
        />
      </section>

      {/* Lead-gen finder */}
      <section className="mb-10">
        <EducationLoanFinder id="edu-lead" sourcePage="PERSONAL_LOAN_FOR_EDUCATION" />
      </section>

      {/* Cross-link back */}
      <Link
        href="/education-loan"
        className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 transition-colors hover:border-amber-400/40"
      >
        <GraduationCap className="h-6 w-6 text-amber-400" />
        <span className="text-sm font-semibold text-slate-200 font-deva">
          {mr ? '← Education Loan, scholarship व सरकारी योजना पाहा' : '← See education loans, scholarships & govt schemes'}
        </span>
      </Link>
    </div>
  );
}
