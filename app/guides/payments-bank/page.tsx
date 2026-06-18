import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, Info } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'पेमेंट्स बँक म्हणजे काय? | What is a Payments Bank?',
  description:
    'पेमेंट्स बँक म्हणजे काय, ती काय करू शकते आणि काय करू शकत नाही? Fino, Airtel व India Post (IPPB) पेमेंट्स बँकांची सोपी माहिती मराठीत.',
  path: '/guides/payments-bank',
});

const canDo = [
  { mr: '₹२ लाखांपर्यंत बचत/चालू खाते उघडणे', en: 'Open savings/current accounts up to ₹2 lakh' },
  { mr: 'पैसे पाठवणे व स्वीकारणे (UPI, IMPS, NEFT)', en: 'Send & receive money (UPI, IMPS, NEFT)' },
  { mr: 'डेबिट कार्ड व मोबाईल बँकिंग', en: 'Debit card and mobile banking' },
  { mr: 'बिल भरणा, रिचार्ज व पैसे काढणे/भरणे', en: 'Bill payments, recharges, cash deposit/withdrawal' },
];

const cannotDo = [
  { mr: 'कर्ज (Loan) किंवा क्रेडिट कार्ड देणे', en: 'Give loans or credit cards' },
  { mr: '₹२ लाखांपेक्षा जास्त ठेव ठेवणे', en: 'Hold deposits above ₹2 lakh' },
  { mr: 'मुदत ठेव (FD) किंवा RD उघडणे', en: 'Open fixed deposits (FD) or RDs' },
  { mr: 'NRI खाती हाताळणे', en: 'Handle NRI accounts' },
];

const providers = [
  { name: 'India Post Payments Bank (IPPB)', desc: { mr: 'टपाल खात्याची पेमेंट्स बँक — ग्रामीण भागात पोस्टमनमार्फत सेवा.', en: 'India Post’s payments bank — doorstep service via postmen in rural areas.' } },
  { name: 'Airtel Payments Bank', desc: { mr: 'एअरटेलची पेमेंट्स बँक — रिटेल आउटलेट्स व मोबाईलद्वारे.', en: 'Airtel’s payments bank — via retail outlets and mobile.' } },
  { name: 'Fino Payments Bank', desc: { mr: 'किरकोळ दुकानांमधील सेवा केंद्रांद्वारे (BC) बँकिंग.', en: 'Banking through merchant/BC service points.' } },
];

export default function PaymentsBankGuide() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-4 text-sm text-slate-400 font-deva">
        <Link href="/directory" className="hover:text-amber-300">
          बँक डिरेक्टरी
        </Link>{' '}
        / <span className="text-slate-300">पेमेंट्स बँक मार्गदर्शन</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-slate-100 font-deva md:text-4xl">
          पेमेंट्स बँक म्हणजे काय?
        </h1>
        <p className="mt-3 text-slate-300 font-deva">
          पेमेंट्स बँक ही RBI-परवानाधारक बँक आहे जी मर्यादित सेवा देते. ती पैसे ठेवणे, पाठवणे व भरणा यासाठी
          उपयुक्त आहे — पण ती <strong className="text-slate-100">पूर्ण बँक नाही</strong>. कर्ज किंवा FD यासारख्या
          सेवा ती देऊ शकत नाही.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
          <h2 className="mb-3 flex items-center gap-2 font-bold text-emerald-200 font-deva">
            <Check className="h-5 w-5" /> काय करू शकते
          </h2>
          <ul className="space-y-2">
            {canDo.map((c) => (
              <li key={c.en} className="flex items-start gap-2 text-sm text-slate-200 font-deva">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                {c.mr}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5">
          <h2 className="mb-3 flex items-center gap-2 font-bold text-rose-200 font-deva">
            <X className="h-5 w-5" /> काय करू शकत नाही
          </h2>
          <ul className="space-y-2">
            {cannotDo.map((c) => (
              <li key={c.en} className="flex items-start gap-2 text-sm text-slate-200 font-deva">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                {c.mr}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 font-display text-xl font-bold text-slate-100 font-deva">
          भारतातील प्रमुख पेमेंट्स बँका
        </h2>
        <div className="space-y-3">
          {providers.map((p) => (
            <div key={p.name} className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-4">
              <p className="font-bold text-slate-100 font-deva">{p.name}</p>
              <p className="mt-1 text-sm text-slate-400 font-deva">{p.desc.mr}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 flex items-start gap-2.5 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
        <p className="text-sm leading-relaxed text-amber-100 font-deva">
          संपूर्ण बँकिंगसाठी (कर्ज, FD, मोठ्या ठेवी) मुख्य बँक निवडा.{' '}
          <Link href="/directory" className="font-bold underline">
            बँक डिरेक्टरीवर जा →
          </Link>
        </p>
      </div>
    </div>
  );
}
