'use client';
// /loans/women — dedicated page for women borrowers: home-loan perks (stamp
// duty, lower rate, tax), government + bank business schemes, and an eligibility
// finder. Content comes from lib/schemes.ts so this stays a thin renderer.
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Sparkles, GraduationCap } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { useLeadFormStore } from '@/store/leadFormStore';
import { womenSchemes, womenHomeLoanPerks, womenFinder } from '@/lib/schemes';
import SchemeCard from '@/components/schemes/SchemeCard';
import SchemeFinder from '@/components/schemes/SchemeFinder';
import LenderComparison from '@/components/schemes/LenderComparison';
import { womenLenders, WOMEN_LENDERS_UPDATED, WOMEN_AGGREGATOR_LINK } from '@/lib/womenLenders';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function WomenLoansPage() {
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
        / <span className="text-slate-300">{mr ? 'महिलांसाठी कर्ज' : 'Loans for women'}</span>
      </nav>

      {/* Hero */}
      <motion.header initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
            <Users className="h-6 w-6" />
          </span>
          <h1 className="font-display text-3xl font-extrabold text-slate-100 font-deva md:text-4xl">
            {mr ? 'महिलांसाठी कर्ज व व्यवसाय योजना' : 'Loans & business schemes for women'}
          </h1>
        </div>
        <p className="mt-3 max-w-2xl text-slate-300 font-deva">
          {mr
            ? 'गृहकर्जातील stamp duty सूट, कमी व्याजदर आणि महिलांसाठीच्या सरकारी व बँक योजना — मराठीत सोपं मार्गदर्शन.'
            : 'Stamp-duty concession on home loans, lower interest rates and government + bank schemes for women — simple guidance in Marathi.'}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => scrollTo('women-finder')}
            className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-500 font-deva"
          >
            {mr ? 'माझ्यासाठी best योजना दाखवा' : 'Show the best scheme for me'}
          </button>
          <button
            onClick={() => openLead({ module: 'LOAN', product: 'Women Loan', sourcePage: 'WOMEN_LOANS_HERO' })}
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-2.5 text-sm font-bold text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-400 font-deva"
          >
            {mr ? 'मला कर्ज हवे आहे' : 'I need a loan'}
          </button>
        </div>
      </motion.header>

      {/* तुम्ही महिला आहात का? — विशेष फायदे */}
      <section className="mb-12">
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h2 className="font-display text-xl font-bold text-slate-100 font-deva">
            {mr ? 'तुम्ही महिला आहात का? तुमच्यासाठी विशेष फायदे' : 'Are you a woman? Special benefits for you'}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {womenHomeLoanPerks.map((p, i) => (
            <motion.div
              key={p.title.en}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card glass-card-gold flex flex-col gap-2 p-5"
            >
              <span className="text-2xl">{p.icon}</span>
              <h3 className="font-bold text-amber-300 font-deva">{p.title[lang]}</h3>
              <p className="text-xs leading-relaxed text-slate-400 font-deva">{p.detail[lang]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* सरकारी + बँक योजना */}
      <section className="mb-12">
        <h2 className="mb-5 font-display text-xl font-bold text-slate-100 font-deva">
          {mr ? 'सरकारी व बँक योजना' : 'Government & bank schemes'}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {womenSchemes.map((s, i) => (
            <SchemeCard key={s.id} s={s} index={i} />
          ))}
        </div>
        <LenderComparison
          className="mt-6"
          title={{ mr: 'व्यवसाय कर्ज लेंडर तुलना', en: 'Business loan lender comparison' }}
          lenders={womenLenders}
          aggregatorLink={WOMEN_AGGREGATOR_LINK}
          aggregatorCta={{
            mr: 'सर्व बँका/NBFC ची तुलना करा — एकाच ठिकाणी',
            en: 'Compare all banks/NBFCs — in one place',
          }}
          updated={WOMEN_LENDERS_UPDATED}
        />
      </section>

      {/* Eligibility finder */}
      <section className="mb-12">
        <h2 className="mb-5 font-display text-xl font-bold text-slate-100 font-deva">
          {mr ? 'तुमच्यासाठी कोणती योजना? (पात्रता तपासा)' : 'Which scheme suits you? (check eligibility)'}
        </h2>
        <SchemeFinder
          id="women-finder"
          questions={womenFinder}
          schemes={womenSchemes}
          accentLabel={{ mr: 'महिला योजना Finder', en: 'Women Loan Finder' }}
        />
      </section>

      {/* Cross-link */}
      <Link
        href="/education-loan"
        className="mb-10 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 transition-colors hover:border-amber-400/40"
      >
        <GraduationCap className="h-6 w-6 text-amber-400" />
        <span className="text-sm font-semibold text-slate-200 font-deva">
          {mr ? 'विद्यार्थ्यांसाठी Education Loan + Scholarship पाहा →' : 'See Education Loan + Scholarship for students →'}
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
