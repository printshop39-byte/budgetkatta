'use client';
// /education-loan — dedicated page for students/parents: PM Vidyalaxmi & govt
// schemes, a loan-type comparison table, the unique moratorium-aware EMI
// calculator, and an eligibility finder. Thin renderer over lib/schemes.ts.
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles, Users, Wallet } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { useLeadFormStore } from '@/store/leadFormStore';
import { studentSchemes, studentLoanTypes, studentPerks, studentFinder } from '@/lib/schemes';
import SchemeCard from '@/components/schemes/SchemeCard';
import SchemeFinder from '@/components/schemes/SchemeFinder';
import MoratoriumCalculator from '@/components/calculators/MoratoriumCalculator';
import LenderComparison from '@/components/schemes/LenderComparison';
import EducationLoanFinder from '@/components/lead/EducationLoanFinder';
import { eduLenders, EDU_LENDERS_UPDATED, EDU_AGGREGATOR_LINK } from '@/lib/eduLenders';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function StudentLoansPage() {
  const { language: lang } = useLanguageStore();
  const openLead = useLeadFormStore((s) => s.open);
  const mr = lang === 'mr';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-slate-400 font-deva">
        <Link href="/loans" className="hover:text-amber-300">
          {mr ? 'कर्ज' : 'Loans'}
        </Link>{' '}
        / <span className="text-slate-300">{mr ? 'विद्यार्थ्यांसाठी कर्ज' : 'Loans for students'}</span>
      </nav>

      {/* Hero */}
      <motion.header initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
            <GraduationCap className="h-6 w-6" />
          </span>
          <h1 className="font-display text-3xl font-extrabold text-slate-100 font-deva md:text-4xl">
            {mr ? 'विद्यार्थ्यांसाठी Education Loan + Scholarship' : 'Education Loan + Scholarship for students'}
          </h1>
        </div>
        <p className="mt-3 max-w-2xl text-slate-300 font-deva">
          {mr
            ? 'PM विद्यालक्ष्मी, परदेशी शिक्षण कर्ज, scholarship व 80E करसवलत — आणि भारतात कुठेच नसलेला Moratorium EMI calculator.'
            : 'PM Vidyalaxmi, abroad education loans, scholarships and 80E tax benefit — plus a moratorium-aware EMI calculator you won’t find elsewhere in Marathi.'}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => scrollTo('calc')}
            className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-500 font-deva"
          >
            {mr ? 'Moratorium EMI मोजा' : 'Calculate moratorium EMI'}
          </button>
          <button
            onClick={() => openLead({ module: 'LOAN', product: 'Education Loan', sourcePage: 'STUDENT_LOANS_HERO' })}
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-2.5 text-sm font-bold text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-400 font-deva"
          >
            {mr ? 'मला Education Loan हवे' : 'I need an education loan' }
          </button>
        </div>
      </motion.header>

      {/* सरकारी योजना + scholarship */}
      <section className="mb-12">
        <h2 className="mb-5 font-display text-xl font-bold text-slate-100 font-deva">
          {mr ? 'सरकारी योजना, scholarship व portal' : 'Government schemes, scholarships & portals'}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studentSchemes.map((s, i) => (
            <SchemeCard key={s.id} s={s} index={i} />
          ))}
        </div>
      </section>

      {/* Loan-type split table */}
      <section className="mb-12">
        <h2 className="mb-5 font-display text-xl font-bold text-slate-100 font-deva">
          {mr ? 'कर्ज प्रकार व तुलना' : 'Loan types & comparison'}
        </h2>
        <div className="overflow-x-auto glass-card p-0">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-400">
                <th className="p-3 font-medium font-deva">{mr ? 'प्रकार' : 'Type'}</th>
                <th className="p-3 font-medium font-deva">{mr ? 'रक्कम' : 'Range'}</th>
                <th className="p-3 font-medium font-deva">{mr ? 'तारण' : 'Collateral'}</th>
                <th className="p-3 font-medium font-deva">{mr ? 'बँका' : 'Banks'}</th>
              </tr>
            </thead>
            <tbody>
              {studentLoanTypes.map((row) => (
                <tr key={row.type.en} className="border-b border-slate-800">
                  <td className="p-3 font-semibold text-slate-200 font-deva">{row.type[lang]}</td>
                  <td className="p-3 font-bold text-bk-gold font-deva">{row.range[lang]}</td>
                  <td className="p-3 text-slate-400 font-deva">{row.collateral[lang]}</td>
                  <td className="p-3 text-slate-400 font-deva">{row.banks[lang]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 80E + benefits */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {studentPerks.map((p) => (
            <div key={p.title.en} className="glass-card glass-card-gold flex flex-col gap-2 p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <h3 className="font-bold text-amber-300 font-deva">{p.title[lang]}</h3>
              </div>
              <p className="text-xs leading-relaxed text-slate-400 font-deva">{p.detail[lang]}</p>
            </div>
          ))}
        </div>
        <LenderComparison
          className="mt-6"
          title={{ mr: 'Education Loan लेंडर तुलना', en: 'Education loan lender comparison' }}
          lenders={eduLenders}
          aggregatorLink={EDU_AGGREGATOR_LINK}
          aggregatorCta={{
            mr: 'सर्व बँकांची तुलना करा (SBI + खाजगी) — एकाच ठिकाणी',
            en: 'Compare all banks (SBI + private) — in one place',
          }}
          updated={EDU_LENDERS_UPDATED}
        />
      </section>

      {/* Moratorium calculator — the unique angle */}
      <section className="mb-12 scroll-mt-20" id="calc-section">
        <h2 className="mb-5 font-display text-xl font-bold text-slate-100 font-deva">
          {mr ? 'Moratorium-aware EMI कॅल्क्युलेटर' : 'Moratorium-aware EMI calculator'}
        </h2>
        <MoratoriumCalculator />
      </section>

      {/* Eligibility finder */}
      <section className="mb-12">
        <h2 className="mb-5 font-display text-xl font-bold text-slate-100 font-deva">
          {mr ? 'तुमच्यासाठी काय तपासायचे? (पात्रता तपासा)' : 'What should you check? (check eligibility)'}
        </h2>
        <SchemeFinder
          id="student-finder"
          questions={studentFinder}
          schemes={studentSchemes}
          accentLabel={{ mr: 'विद्यार्थी Loan Finder', en: 'Student Loan Finder' }}
        />
      </section>

      {/* Lead-gen finder — capture details, forward to a partner/DSA */}
      <section className="mb-10" id="lead">
        <EducationLoanFinder sourcePage="STUDENT_LOANS_PAGE" />
      </section>

      {/* Personal-loan-for-education cross-link (monetisable angle) */}
      <Link
        href="/education-loan/personal-loan-for-education"
        className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-400/25 bg-gradient-to-r from-amber-400/10 to-slate-900/40 p-4 transition-colors hover:border-amber-400/50"
      >
        <Wallet className="h-6 w-6 text-amber-400" />
        <span className="text-sm font-semibold text-slate-200 font-deva">
          {mr
            ? 'Education loan शक्य नाही? शिक्षणासाठी Personal Loan पर्याय पाहा →'
            : 'No education loan? See Personal Loan for Education options →'}
        </span>
      </Link>

      {/* Cross-link */}
      <Link
        href="/loans/women"
        className="mb-10 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 transition-colors hover:border-amber-400/40"
      >
        <Users className="h-6 w-6 text-amber-400" />
        <span className="text-sm font-semibold text-slate-200 font-deva">
          {mr ? 'महिलांसाठी कर्ज व व्यवसाय योजना पाहा →' : 'See loan & business schemes for women →'}
        </span>
      </Link>

      {/* Disclaimer */}
      <p className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs leading-relaxed text-slate-400 font-deva">
        ⚠️{' '}
        {mr
          ? 'ही माहिती फक्त शैक्षणिक उद्देशाने आहे. BudgetKatta कर्ज मंजुरीची हमी देत नाही. अंतिम निर्णयापूर्वी संबंधित बँक, सरकारी portal किंवा आर्थिक सल्लागाराकडे पात्रता, व्याजदर व अटी तपासा.'
          : 'This information is for educational purposes only. BudgetKatta does not guarantee loan approval. Verify eligibility, rates and terms with the relevant bank, official portal or a financial advisor before deciding.'}
      </p>
    </div>
  );
}
