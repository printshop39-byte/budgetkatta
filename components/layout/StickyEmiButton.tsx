'use client';
// Mobile-only sticky "EMI मोजा" shortcut (blueprint: bottom-of-screen EMI
// button). Hidden on md+ and on the calculators page itself.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function StickyEmiButton() {
  const pathname = usePathname() || '/';
  const mr = useLanguageStore((s) => s.language) === 'mr';
  if (pathname.startsWith('/calculators') || pathname.startsWith('/admin')) return null;
  return (
    <Link
      href="/calculators"
      className="fixed bottom-4 left-4 right-20 z-30 flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-amber-400 px-6 font-bold text-slate-950 shadow-lg shadow-amber-500/30 md:hidden font-deva"
    >
      <Calculator className="h-5 w-5" />
      {mr ? 'EMI मोजा' : 'Calculate EMI'}
    </Link>
  );
}
