'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { track } from '@/lib/analytics';
import type { Language } from '@/types';

type Bi = { mr: string; en: string };
const pick = (b: Bi, lang: Language) => (lang === 'mr' ? b.mr : b.en);

const COPY = {
  title: { mr: 'तयार आहात? २ मिनिटांत घराच्या ध्येयासाठी तुमची आर्थिक तयारी तपासा.', en: 'Ready? Check your financial readiness for a home goal in about 2 minutes.' } as Bi,
  sub: { mr: 'मोफत, मराठीत — कार्ड, OTP किंवा पासवर्ड लागत नाही. हा eligibility report, CIBIL score किंवा loan sanction नाही.', en: 'Free, in Marathi or English — no card, OTP or password. Not an eligibility report, CIBIL score or loan sanction.' } as Bi,
  cta: { mr: 'घराच्या ध्येयासाठी माझी आर्थिक तयारी तपासा', en: 'Check my financial readiness for a home goal' } as Bi,
};

export default function FinalHealthCTA() {
  const lang = useLanguageStore((s) => s.language);
  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-4xl rounded-3xl border border-amber-400/25 bg-gradient-to-br from-amber-500/10 via-slate-900/40 to-transparent p-8 text-center md:p-12">
        <h2 className="text-2xl font-extrabold leading-snug text-slate-50 md:text-3xl">{pick(COPY.title, lang)}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">{pick(COPY.sub, lang)}</p>
        <Link
          href="/health-check"
          onClick={() => track('homepage_primary_cta_clicked', { cta: 'footer' })}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-8 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
        >
          {pick(COPY.cta, lang)} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
