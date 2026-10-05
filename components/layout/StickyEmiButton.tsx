'use client';
// Mobile-only sticky quick-bar (md:hidden). Home Loan is the site's core, so it
// is always one tap away: "गृहकर्ज" + "EMI मोजा". On /loans/home-loan the Home
// Loan button is dropped (already there); hidden on /calculators and /admin.
// No interest-rate claim is shown here — rates live, dated and sourced, on the
// bank comparison.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, Landmark } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function StickyEmiButton() {
  const pathname = usePathname() || '/';
  const mr = useLanguageStore((s) => s.language) === 'mr';
  if (pathname.startsWith('/calculators') || pathname.startsWith('/admin')) return null;
  const onHomeLoan = pathname.startsWith('/loans/home-loan');
  return (
    <div className="fixed bottom-4 left-4 right-20 z-30 flex gap-2 md:hidden">
      {!onHomeLoan && (
        <Link
          href="/loans/home-loan"
          className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-amber-400 px-4 font-bold text-slate-950 shadow-lg shadow-amber-500/30 font-deva"
        >
          <Landmark className="h-5 w-5" />
          {mr ? 'गृहकर्ज' : 'Home Loan'}
        </Link>
      )}
      <Link
        href="/calculators"
        className={`flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full px-4 font-bold shadow-lg font-deva ${
          onHomeLoan ? 'bg-amber-400 text-slate-950 shadow-amber-500/30' : 'border border-amber-400/60 bg-slate-950/90 text-amber-300 shadow-black/30'
        }`}
      >
        <Calculator className="h-5 w-5" />
        {mr ? 'EMI मोजा' : 'Calculate EMI'}
      </Link>
    </div>
  );
}
