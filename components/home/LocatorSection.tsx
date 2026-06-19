'use client';
// LocatorSection — prominent, discoverable call-out that drives users to the
// Local Finance & Store Locator (/locator). Reused on the homepage and the
// Gadget EMI page so the locator is never buried. Bilingual + dark glass theme.
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Store, MapPin, Wallet, MessageCircle, ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function LocatorSection() {
  const { language } = useLanguageStore();
  const mr = language === 'mr';

  const chips = [
    { icon: MapPin, label: mr ? 'शहर / परिसरानुसार' : 'By City / Area' },
    { icon: Wallet, label: mr ? 'EMI प्रोव्हायडर फिल्टर' : 'EMI provider filter' },
    { icon: MessageCircle, label: mr ? 'थेट WhatsApp संपर्क' : 'Direct WhatsApp contact' },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.35)] md:p-12"
      >
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="relative flex flex-col items-start gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300 font-deva">
              <Store className="h-3.5 w-3.5" />
              {mr ? 'स्थानिक दुकाने' : 'Local Stores'}
            </span>

            <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight text-slate-100 font-deva md:text-3xl">
              {mr
                ? 'जवळचे अधिकृत डीलर्स आणि EMI स्टोअर्स शोधा'
                : 'Find Local Authorised Dealers & EMI Stores'}
            </h2>

            <p className="mt-3 text-slate-400 font-deva">
              {mr
                ? 'तुमच्या शहरातील मोबाईल, बाईक, कॅमेरा व लॅपटॉप दुकाने शोधा — Bajaj Finserv, Airtel Finance, HDFC आणि इतर EMI पर्यायांसह. थेट WhatsApp वर संपर्क साधा.'
                : 'Discover mobile, bike, camera and laptop stores in your city — with Bajaj Finserv, Airtel Finance, HDFC and other EMI options. Reach them directly on WhatsApp.'}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {chips.map((c) => {
                const Icon = c.icon;
                return (
                  <span
                    key={c.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 font-deva"
                  >
                    <Icon className="h-3.5 w-3.5 text-amber-400" />
                    {c.label}
                  </span>
                );
              })}
            </div>
          </div>

          <Link
            href="/locator"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-7 py-3.5 font-bold text-slate-950 shadow-lg shadow-amber-400/20 transition-all duration-300 hover:bg-amber-300 hover:shadow-[0_0_28px_rgba(251,191,36,0.45)] active:scale-95 font-deva"
          >
            {mr ? 'स्टोअर लोकेटर उघडा' : 'Open Store Locator'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
