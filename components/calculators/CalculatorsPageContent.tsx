'use client';
import { useLanguageStore } from '@/store/languageStore';
import HomeCalculators from '@/components/calculators/HomeCalculators';

export default function CalculatorsPageContent() {
  const lang = useLanguageStore((s) => s.language) === 'mr' ? 'mr' : 'en';
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-slate-100 md:text-4xl font-deva">
          {lang === 'mr' ? 'घर खरेदी कॅल्क्युलेटर' : 'Home Buying Calculators'}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400 font-deva">
          {lang === 'mr'
            ? 'EMI, पात्रतेचा अंदाज, Down Payment, खरेदी खर्च, Loan Transfer आणि घर सजवण्याचे बजेट.'
            : 'EMI, eligibility estimate, down payment, purchase cost, loan transfer and home-setup budget.'}
        </p>
      </header>
      <HomeCalculators />
    </div>
  );
}
