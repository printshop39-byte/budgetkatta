"use client";

import Link from "next/link";
import { ArrowRight, Calculator, ShieldCheck, Home } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { track } from "@/lib/analytics";

// Narrowed home-finance hero (2026-07). INTERIM NAMING: the readiness check runs
// the generic personal-finance engine, so it is labelled "Financial Readiness
// for a Home Goal" (not a completed score / not property-specific eligibility).
// The right-column card is an ILLUSTRATIVE interface preview — its figures are
// hardcoded, NOT calculated from user data — and is prominently labelled as such.
//
// No entrance/opacity animations: content must render visibly in SSR, without
// JS, and under prefers-reduced-motion (no important content at opacity 0).
type HeroCopy = {
  eyebrow: string;
  titleStart: string;
  titleAccent: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trust: string[];
  previewTag: string;
  illustrativeLabel: string;
  readinessLabel: string;
  budgetLabel: string;
  budgetValue: string;
  emiLabel: string;
  emiValue: string;
  downLabel: string;
  downValue: string;
};

const HERO_COPY: Record<"mr" | "en", HeroCopy> = {
  mr: {
    eyebrow: "घर आणि मालमत्ता वित्त नियोजन",
    titleStart: "घर घेण्यापूर्वी तुमचे",
    titleAccent: "सुरक्षित बजेट आणि EMI क्षमता तपासा",
    description:
      "उत्पन्न, सध्याचे EMI, बचत व आर्थिक संरक्षणावर आधारित — घराच्या ध्येयासाठी तुमच्या आर्थिक तयारीचा प्राथमिक शैक्षणिक अंदाज आणि पुढची योग्य कृती समजून घ्या.",
    ctaPrimary: "घराच्या ध्येयासाठी माझी आर्थिक तयारी तपासा — मोफत",
    ctaSecondary: "Home Loan EMI मोजा",
    trust: [
      "Card आवश्यक नाही",
      "OTP किंवा Password विचारत नाही",
      "हा credit score किंवा loan approval नाही",
      "तुमच्या संमतीशिवाय माहिती share केली जात नाही",
    ],
    previewTag: "झलक",
    illustrativeLabel: "केवळ इंटरफेस झलक — तुमच्या माहितीवरून गणना केलेली नाही, हा loan offer नाही.",
    readinessLabel: "घराच्या ध्येयासाठी आर्थिक तयारी",
    budgetLabel: "सुरक्षित property budget",
    budgetValue: "₹42 लाख",
    emiLabel: "कमाल EMI क्षमता",
    emiValue: "₹28,000/महिना",
    downLabel: "आवश्यक down-payment",
    downValue: "₹8.4 लाख",
  },
  en: {
    eyebrow: "Home and property finance planning",
    titleStart: "Check your safe property budget and",
    titleAccent: "EMI capacity before buying a home",
    description:
      "Using your income, existing EMIs, savings and financial protection, get a preliminary educational estimate of your financial readiness for a home goal — and your next practical step.",
    ctaPrimary: "Check My Financial Readiness for a Home Goal — Free",
    ctaSecondary: "Calculate Home Loan EMI",
    trust: [
      "No card required",
      "We never ask for OTPs or passwords",
      "This is not a credit score or loan approval",
      "Your information is not shared without consent",
    ],
    previewTag: "Preview",
    illustrativeLabel: "Illustrative interface preview — not calculated from your data, not a loan offer.",
    readinessLabel: "Financial Readiness for a Home Goal",
    budgetLabel: "Safe property budget",
    budgetValue: "₹42 L",
    emiLabel: "Max EMI capacity",
    emiValue: "₹28,000/mo",
    downLabel: "Down-payment needed",
    downValue: "₹8.4 L",
  },
};

export default function HeroSection() {
  const language = useLanguageStore((s) => s.language);
  const t = HERO_COPY[language] ?? HERO_COPY.mr;

  // Illustrative dial — 640/1000 (hardcoded, NOT computed from user data).
  const R = 46;
  const C = 2 * Math.PI * R;

  return (
    <section id="home" className="pt-8 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-7">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-slate-900/70 backdrop-blur-md border border-amber-400/20 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <Home className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 tracking-wide">{t.eyebrow}</span>
          </div>

          <h1 className="text-4xl/[1.4] md:text-5xl/[1.4] lg:text-6xl/[1.35] font-extrabold text-slate-100 tracking-normal">
            {t.titleStart}{" "}
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 pb-2 leading-[1.4]">
              {t.titleAccent}
            </span>
          </h1>

          <p className="text-lg/[1.7] md:text-xl/[1.7] text-slate-400 font-normal max-w-2xl tracking-normal">
            {t.description}
          </p>

          {/* CTA Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <Link
              href="/health-check"
              onClick={() => track("homepage_primary_cta_clicked", { cta: "hero_primary" })}
              className="group px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.55)] hover:scale-[1.03] transition-all duration-300 flex items-center justify-center space-x-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              <span>{t.ctaPrimary}</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/loans#loan-calc"
              onClick={() => track("homepage_primary_cta_clicked", { cta: "hero_secondary_emi" })}
              className="group px-8 py-4 rounded-full bg-slate-900/70 backdrop-blur-md border border-slate-800 text-slate-300 font-semibold text-base hover:bg-slate-900 hover:border-amber-400/50 hover:text-amber-300 hover:scale-[1.03] transition-all duration-300 flex items-center justify-center space-x-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              <Calculator className="h-5 w-5 text-amber-400" />
              <span>{t.ctaSecondary}</span>
            </Link>
          </div>

          {/* Trust strip — card / OTP / not-a-loan-approval / consent */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-4">
            {t.trust.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400/80" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column — ILLUSTRATIVE interface preview (prominently labelled) */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 to-yellow-500/10 rounded-[40px] filter blur-3xl -z-10" />

          <div className="relative bg-slate-900/75 backdrop-blur-2xl border border-slate-800 p-8 rounded-[36px] shadow-[0_20px_50px_rgba(251,191,36,0.08)] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                {t.previewTag}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> {t.readinessLabel}
              </span>
            </div>

            {/* Prominent illustrative disclaimer — not tucked away */}
            <p className="mb-5 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-[11px] font-medium leading-snug text-slate-300">
              {t.illustrativeLabel}
            </p>

            {/* Illustrative dial + rows (hardcoded, not computed) */}
            <div className="flex items-center gap-6">
              <div className="relative h-28 w-28 shrink-0" role="img" aria-label="Illustrative preview dial, not calculated">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="9" />
                  <circle cx="60" cy="60" r={R} fill="none" stroke="#fbbf24" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - 640 / 1000)} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-50">640</span>
                  <span className="text-[10px] font-semibold text-slate-500">/ 1000</span>
                </div>
              </div>

              <div className="space-y-3" aria-hidden="true">
                <SampleRow label={t.budgetLabel} value={t.budgetValue} />
                <SampleRow label={t.emiLabel} value={t.emiValue} />
                <SampleRow label={t.downLabel} value={t.downValue} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SampleRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-400 leading-tight">{label}</p>
      <p className="text-base font-extrabold text-slate-400/90">{value}</p>
    </div>
  );
}
