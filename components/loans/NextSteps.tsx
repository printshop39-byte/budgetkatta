'use client';
// NextSteps — the home-buying journey from this page: budget -> project check ->
// documents -> lender comparison. Plain links; no claims beyond what each target
// page already shows.
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import type { Bi } from '@/lib/homeFinanceContent';

const STEPS: { href: string; title: Bi; desc: Bi }[] = [
  {
    href: '/calculators',
    title: { mr: '१. बजेट व EMI ठरवा', en: '1. Fix your budget and EMI' },
    desc: { mr: 'EMI, पात्रतेचा अंदाज, Down Payment आणि खरेदीचा एकूण खर्च.', en: 'EMI, eligibility estimate, down payment and total purchase cost.' },
  },
  {
    href: '/projects',
    title: { mr: '२. प्रकल्प MahaRERA वर तपासा', en: '2. Check the project on MahaRERA' },
    desc: { mr: 'चालू प्रकल्प कसा तपासायचा आणि RERA क्रमांक कसा पडताळायचा.', en: 'How to check an ongoing project and verify a RERA number.' },
  },
  {
    href: '#property-docs',
    title: { mr: '३. मालमत्तेची कागदपत्रे तपासा', en: '3. Verify the property documents' },
    desc: { mr: 'नवीन, तयार, रिसेल किंवा प्लॉटनुसार मालकी व मंजुरीची कागदपत्रे.', en: 'Title and approval documents for new, ready, resale or plot.' },
  },
  {
    href: '#banks',
    title: { mr: '४. बँकांची तुलना करा', en: '4. Compare lenders' },
    desc: { mr: 'दर, शुल्क व अटी — अधिकृत स्रोतासह.', en: 'Rates, fees and terms — with official sources.' },
  },
  {
    href: '/documents',
    title: { mr: '५. अर्जासाठी कागदपत्रे तयार करा', en: '5. Prepare your application documents' },
    desc: { mr: 'खरेदी, बांधकाम, Property Loan किंवा Loan Transfer — तुमच्या प्रोफाइलनुसार.', en: 'Buy, build, property loan or loan transfer — by your profile.' },
  },
];

export default function NextSteps() {
  const mr = useLanguageStore((s) => s.language) === 'mr';
  const lang = mr ? 'mr' : 'en';
  return (
    <section id="next-steps" className="mt-10 scroll-mt-24">
      <h2 className="mb-3 font-display text-xl font-bold text-slate-100 font-deva">
        {mr ? 'घर घेण्याचा पुढचा मार्ग' : 'Your next steps to buy a home'}
      </h2>
      <ol className="grid gap-3 sm:grid-cols-2">
        {STEPS.map((s) => {
          const cls = 'glass-card group flex min-h-[44px] items-start justify-between gap-3 p-4 transition-colors hover:border-amber-400/50';
          const body = (
            <>
              <span>
                <span className="block text-sm font-bold text-slate-100 font-deva">{s.title[lang]}</span>
                <span className="mt-1 block text-xs text-slate-400 font-deva">{s.desc[lang]}</span>
              </span>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-amber-400 transition-transform group-hover:translate-x-0.5" />
            </>
          );
          return (
            <li key={s.href}>
              {s.href.startsWith('#') ? (
                <a href={s.href} className={cls}>{body}</a>
              ) : (
                <Link href={s.href} className={cls}>{body}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
