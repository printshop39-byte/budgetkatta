"use client";

import Link from "next/link";
import { ArrowRight, Armchair, Building2, Calculator, FileCheck, Home, KeyRound, Landmark, ShieldCheck } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { track } from "@/lib/analytics";
import HeroEstimator from "@/components/home/HeroEstimator";

// Narrowed home-finance hero (2026-07). INTERIM NAMING: the readiness check runs
// the generic personal-finance engine, so it is labelled "Financial Readiness
// for a Home Goal" (not a completed score / not property-specific eligibility).
// The right-column card is a LIVE estimator (components/home/HeroEstimator) —
// an estimate from the visitor's own inputs, labelled as not a bank result.
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
  ctaEmi: string;
  trust: string[];
};

const HERO_COPY: Record<"mr" | "en", HeroCopy> = {
  mr: {
    eyebrow: "Home Loan ते गृहप्रवेश — संपूर्ण माहिती",
    titleStart: "आपल्या घराचे स्वप्न, बजेटमध्ये घर;",
    titleAccent: "स्मार्ट Home Loan सह गृहप्रवेशापर्यंत!",
    description:
      "योग्य गृहकर्ज, बँकांची तुलना, RERA प्रकल्प तपासणी आणि अंतर्गत सजावट — संपूर्ण नियोजन एकाच ठिकाणी.",
    ctaPrimary: "Home Loan माहिती पाहा",
    ctaSecondary: "प्रकल्प कसा तपासायचा",
    ctaEmi: "माझी EMI मोजा",
    trust: [
      "Card आवश्यक नाही",
      "OTP किंवा Password विचारत नाही",
      "हा credit score किंवा loan approval नाही",
      "तुमच्या संमतीशिवाय माहिती share केली जात नाही",
    ],
  },
  en: {
    eyebrow: "Home Loan to housewarming — the complete guide",
    titleStart: "Your dream home, within budget;",
    titleAccent: "with a smart Home Loan, right to housewarming!",
    description:
      "The right home loan, bank comparison, RERA project checks and interior planning — all in one place.",
    ctaPrimary: "See Home Loan info",
    ctaSecondary: "How to check a project",
    ctaEmi: "Calculate my EMI",
    trust: [
      "No card required",
      "We never ask for OTPs or passwords",
      "This is not a credit score or loan approval",
      "Your information is not shared without consent",
    ],
  },
};

export default function HeroSection() {
  const language = useLanguageStore((s) => s.language);
  const t = HERO_COPY[language] ?? HERO_COPY.mr;


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
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-2">
            <Link
              href="/loans/home-loan"
              onClick={() => track("homepage_primary_cta_clicked", { cta: "hero_primary" })}
              className="group px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.55)] hover:scale-[1.03] transition-all duration-300 flex items-center justify-center space-x-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              <span>{t.ctaPrimary}</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/projects"
              onClick={() => track("homepage_primary_cta_clicked", { cta: "hero_secondary_projects" })}
              className="group px-8 py-4 rounded-full bg-slate-900/70 backdrop-blur-md border border-slate-800 text-slate-300 font-semibold text-base hover:bg-slate-900 hover:border-amber-400/50 hover:text-amber-300 hover:scale-[1.03] transition-all duration-300 flex items-center justify-center space-x-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              <Building2 className="h-5 w-5 text-amber-400" />
              <span>{t.ctaSecondary}</span>
            </Link>

            <Link
              href="/calculators"
              onClick={() => track("homepage_primary_cta_clicked", { cta: "hero_emi" })}
              className="group px-8 py-4 rounded-full bg-slate-900/70 backdrop-blur-md border border-slate-800 text-slate-300 font-semibold text-base hover:bg-slate-900 hover:border-amber-400/50 hover:text-amber-300 hover:scale-[1.03] transition-all duration-300 flex items-center justify-center space-x-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              <Calculator className="h-5 w-5 text-amber-400" />
              <span>{t.ctaEmi}</span>
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

        {/* Right Column — LIVE micro-calculator (replaces the static "preview" card) */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 to-yellow-500/10 rounded-[40px] filter blur-3xl -z-10" />
          <HeroEstimator />
        </div>
      </div>

      {/* Home Loan -> housewarming journey. Home Loan is step 1 and visually primary. */}
      <JourneyStrip language={language} />
    </section>
  );
}

const JOURNEY = [
  { href: "/loans/home-loan", Icon: Landmark, label: { mr: "Home Loan", en: "Home Loan" } },
  { href: "/projects", Icon: FileCheck, label: { mr: "RERA व कागदपत्रे", en: "RERA & documents" } },
  { href: "/home-setup#kitchen", Icon: Armchair, label: { mr: "किचन व फर्निचर", en: "Kitchen & furniture" } },
  { href: "/home-setup#setup", Icon: KeyRound, label: { mr: "गृहप्रवेश", en: "Move-in" } },
] as const;

function JourneyStrip({ language }: { language: "mr" | "en" }) {
  return (
    <ol
      aria-label={language === "mr" ? "Home Loan ते गृहप्रवेश" : "Home Loan to move-in"}
      className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-2.5 border-t border-slate-800/80 pt-6 sm:grid-cols-4"
    >
      {JOURNEY.map(({ href, Icon, label }, i) => (
        <li key={href}>
          <Link
            href={href}
            className={`flex min-h-[44px] items-center gap-2.5 rounded-xl border p-3 text-left transition-colors ${
              i === 0
                ? "border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/15"
                : "border-slate-800 bg-slate-900/60 hover:border-amber-400/40"
            }`}
          >
            <span className={`rounded-lg p-2 ${i === 0 ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300"}`}>
              <Icon className="h-4 w-4" />
            </span>
            <span>
              <span className={`block text-[10px] font-bold uppercase ${i === 0 ? "text-amber-400" : "text-slate-400"}`}>
                {language === "mr" ? `टप्पा ${i + 1}` : `Step ${i + 1}`}
              </span>
              <span className={`block text-xs ${i === 0 ? "font-extrabold text-white" : "font-semibold text-slate-200"}`}>{label[language]}</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
