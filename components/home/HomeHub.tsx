'use client';
// HomeHub — the five blueprint areas as large, tappable cards right under the
// hero. Static render (no entrance animation) so it is visible without JS.
import Link from 'next/link';
import { Building2, Calculator, FileText, Hammer, Landmark } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import type { Bi } from '@/lib/homeFinanceContent';

const HUB: { href: string; icon: typeof Landmark; title: Bi; desc: Bi }[] = [
  {
    href: '/loans/home-loan',
    icon: Landmark,
    title: { mr: 'Home Loan आणि Property Loan', en: 'Home Loan & Property Loan' },
    desc: { mr: 'पात्रता, EMI, शुल्क, कर्ज हस्तांतरण आणि बँकांची तुलना.', en: 'Eligibility, EMI, fees, loan transfer and bank comparison.' },
  },
  {
    href: '/projects',
    icon: Building2,
    title: { mr: 'कर्जासाठी पात्र प्रकल्प', en: 'Eligible Projects' },
    desc: { mr: 'RERA क्रमांक, किंमत, परिसर आणि कर्ज देणाऱ्या बँका.', en: 'RERA number, price, locality and lending banks.' },
  },
  {
    href: '/calculators',
    icon: Calculator,
    title: { mr: 'EMI व पात्रता कॅल्क्युलेटर', en: 'EMI & Eligibility Calculators' },
    desc: { mr: 'EMI, कर्ज पात्रता, Down Payment आणि खरेदी खर्च.', en: 'EMI, eligibility, down payment and purchase cost.' },
  },
  {
    href: '/home-setup',
    icon: Hammer,
    title: { mr: 'Kitchen, Furniture आणि Interior', en: 'Kitchen, Furniture & Interior' },
    desc: { mr: 'घर तयार करण्याची checklist, प्रश्न आणि बजेट.', en: 'Home-setup checklists, questions and budget.' },
  },
  {
    href: '/documents',
    icon: FileText,
    title: { mr: 'कागदपत्रे व मार्गदर्शन', en: 'Documents & Guidance' },
    desc: { mr: 'तुमच्या प्रोफाइलनुसार कागदपत्रांची यादी.', en: 'A document list matched to your profile.' },
  },
];

export default function HomeHub() {
  const lang = useLanguageStore((s) => s.language) === 'mr' ? 'mr' : 'en';
  return (
    <section aria-label={lang === 'mr' ? 'मुख्य विभाग' : 'Main sections'} className="mx-auto max-w-7xl px-6 pb-16">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HUB.map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="glass-card group flex min-h-[44px] items-start gap-4 p-5 transition-colors hover:border-amber-400/50"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
              <Icon className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-display text-lg font-bold text-slate-100 font-deva">{title[lang]}</span>
              <span className="mt-1 block text-sm text-slate-400 font-deva">{desc[lang]}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
