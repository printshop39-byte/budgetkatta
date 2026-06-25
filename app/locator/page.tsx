'use client';
// Local Finance & Store Locator — TEMPORARILY HIDDEN.
//
// The previous listing shipped with sample/demo stores and placeholder WhatsApp
// numbers, which is unsafe on a live site (users could message real strangers).
// Until verified store data (real names + real WhatsApp numbers) is available we
// show a "coming soon" page here. The filters/cards and sample data remain in
// git history and in lib/localStores.ts for when real listings are added.
import { Store } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function LocatorPage() {
  const mr = useLanguageStore((s) => s.language) === 'mr';

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
        <Store className="h-8 w-8" />
      </div>
      <h1 className="font-display text-3xl font-extrabold text-slate-100 font-deva">
        {mr ? 'स्टोअर लोकेटर लवकरच येत आहे' : 'Store Locator — coming soon'}
      </h1>
      <p className="mt-3 leading-relaxed text-slate-400 font-deva">
        {mr
          ? 'आम्ही तुमच्या शहरातील EMI/फायनान्स देणाऱ्या verified दुकानांची यादी तयार करत आहोत. ती लवकरच इथे उपलब्ध होईल.'
          : 'We are building a verified list of stores offering EMI/finance in your city. It will be available here soon.'}
      </p>
    </div>
  );
}
