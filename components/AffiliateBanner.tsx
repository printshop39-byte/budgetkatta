'use client';
// AffiliateBanner — reusable, clearly-labelled promotional card for affiliate
// offers (Demat account, credit card, etc.). Bilingual via languageStore, blends
// with the dark glass theme but stands out with an amber CTA. Carries an explicit
// "Ad / जाहिरात" label for transparency.
//
// NOTE: `href`s in the presets are placeholders ('#') — replace them with real
// affiliate/referral URLs before going live.
import { motion } from 'framer-motion';
import { LineChart, CreditCard, Landmark, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

type Bi = { mr: string; en: string };
export type AffiliateVariant = 'demat' | 'creditCard' | 'loan' | 'insurance';

const PRESETS: Record<
  AffiliateVariant,
  { icon: typeof LineChart; title: Bi; desc: Bi; cta: Bi; href: string }
> = {
  demat: {
    icon: LineChart,
    title: { mr: 'मोफत डिमॅट खाते उघडा', en: 'Open a Free Demat Account' },
    desc: {
      mr: 'शेअर्स व म्युच्युअल फंडात गुंतवणूक सुरू करा — झिरो अकाउंट ओपनिंग फी.',
      en: 'Start investing in stocks & mutual funds — zero account-opening fee.',
    },
    cta: { mr: 'खाते उघडा', en: 'Open Account' },
    href: '#',
  },
  creditCard: {
    icon: CreditCard,
    title: { mr: 'क्रेडिट कार्डसाठी अर्ज करा', en: 'Apply for a Credit Card' },
    desc: {
      mr: 'रिवॉर्ड्स व कॅशबॅकसह तुमच्यासाठी योग्य कार्ड निवडा.',
      en: 'Pick the right card for you with rewards and cashback.',
    },
    cta: { mr: 'अर्ज करा', en: 'Apply Now' },
    href: '#',
  },
  loan: {
    icon: Landmark,
    title: { mr: 'झटपट वैयक्तिक कर्ज', en: 'Quick Personal Loan' },
    desc: {
      mr: 'स्पर्धात्मक व्याजदरात तुमची पात्रता काही मिनिटांत तपासा.',
      en: 'Check your eligibility in minutes at competitive rates.',
    },
    cta: { mr: 'पात्रता तपासा', en: 'Check Eligibility' },
    href: '#',
  },
  insurance: {
    icon: ShieldCheck,
    title: { mr: 'आरोग्य विमा तुलना करा', en: 'Compare Health Insurance' },
    desc: {
      mr: 'तुमच्या कुटुंबासाठी योग्य प्लॅन कमी प्रीमियममध्ये शोधा.',
      en: 'Find the right plan for your family at a low premium.',
    },
    cta: { mr: 'प्लॅन पाहा', en: 'View Plans' },
    href: '#',
  },
};

interface AffiliateBannerProps {
  variant?: AffiliateVariant;
  /** Override the preset destination with a real affiliate URL. */
  href?: string;
  className?: string;
}

export default function AffiliateBanner({ variant = 'demat', href, className = '' }: AffiliateBannerProps) {
  const { language } = useLanguageStore();
  const preset = PRESETS[variant];
  const Icon = preset.icon;
  const target = href ?? preset.href;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass-card glass-card-gold relative flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between ${className}`}
      aria-label={language === 'mr' ? 'जाहिरात' : 'Advertisement'}
    >
      <span className="absolute right-3 top-3 rounded-full border border-slate-700 bg-slate-900/70 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500 font-deva">
        {language === 'mr' ? 'जाहिरात' : 'Ad'}
      </span>

      <div className="flex items-start gap-3 pr-10 sm:pr-0">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-slate-100 font-deva">{preset.title[language]}</p>
          <p className="mt-0.5 text-xs text-slate-400 font-deva">{preset.desc[language]}</p>
        </div>
      </div>

      <a
        href={target}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-500 font-deva sm:w-auto"
      >
        {preset.cta[language]}
        <ArrowRight className="h-4 w-4" />
      </a>
    </motion.aside>
  );
}
