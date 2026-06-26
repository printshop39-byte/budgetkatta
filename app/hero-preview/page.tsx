"use client";
// app/hero-preview/page.tsx — THROWAWAY design preview of the proposed
// "Clean Off-White" hero direction (light bg + faint grid + soft glow +
// frosted-glass SIP card). Not linked anywhere; safe to delete. The dark
// Navbar/Footer from the root layout still wrap this — adopting the light
// theme for real would mean re-theming those too.
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Activity, ShieldCheck, Lock, Users, TrendingUp } from "lucide-react";

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function HeroPreviewPage() {
  const [monthly, setMonthly] = useState(10000);

  // Simple illustrative SIP future value: 12% p.a., 10 years, monthly compounding.
  const i = 0.12 / 12;
  const n = 120;
  const projected = monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const invested = monthly * n;
  const returns = projected - invested;

  return (
    <section className="relative w-full overflow-hidden bg-[#F4F7FB] pb-32 pt-16 md:pt-24">
      {/* Preview banner */}
      <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-500 shadow-sm backdrop-blur">
        Design preview — Clean Off-White hero · /hero-preview
      </div>

      {/* Faint fine grid lines */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(30,58,95,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,95,0.045) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      {/* Soft glows */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(56,138,221,0.20),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.16),transparent_70%)]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12">
        {/* Left — value proposition */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, delay: 0.05 }}
          className="lg:col-span-7"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-white/75 px-3 py-1.5 text-xs font-semibold text-sky-700 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> मराठी माणसाचा आर्थिक कट्टा
          </span>

          <h1 className="mt-4 text-4xl/[1.35] font-extrabold tracking-normal text-slate-900 md:text-5xl/[1.35] font-deva">
            तुमच्या पैशासाठी <span className="text-amber-600">सोपे, स्मार्ट</span> मार्गदर्शन
          </h1>

          <p className="mt-4 max-w-xl text-lg/[1.7] text-slate-600 font-deva">
            FD, SIP, कर्ज आणि विम्याची अचूक आकडेमोड — मराठीत, अगदी सोप्या भाषेत. आर्थिकदृष्ट्या सक्षम बना.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 text-base font-bold text-amber-950 shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-400 font-deva">
              आत्ताच मोजा <ArrowRight className="h-5 w-5" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-7 py-3.5 text-base font-semibold text-slate-700 backdrop-blur transition-all hover:border-sky-400 hover:text-sky-700 font-deva">
              <Activity className="h-5 w-5 text-sky-600" /> आर्थिक आरोग्य तपासा
            </button>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-deva">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-sky-600" /> १००% विनामूल्य</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-4 w-4 text-sky-600" /> सुरक्षित व पारदर्शक</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-sky-600" /> हजारो मराठी वापरकर्ते</span>
          </div>
        </motion.div>

        {/* Right — frosted-glass SIP card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 60, delay: 0.15 }}
          className="lg:col-span-5"
        >
          <div className="rounded-[24px] border border-white/90 bg-white/60 p-6 shadow-[0_20px_55px_rgba(30,58,95,0.13)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live SIP
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                <TrendingUp className="h-3 w-3" /> +२४.८%
              </span>
            </div>

            <p className="mt-4 text-xs text-slate-500 font-deva">अंदाजे संपत्ती (१० वर्षांनी)</p>
            <p className="mt-0.5 text-3xl font-extrabold text-slate-900">{inr(projected)}</p>

            <svg viewBox="0 0 280 90" className="mt-2 h-20 w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="0" y1="30" x2="280" y2="30" stroke="rgba(15,23,42,0.06)" strokeWidth="1" />
              <line x1="0" y1="60" x2="280" y2="60" stroke="rgba(15,23,42,0.06)" strokeWidth="1" />
              <path d="M0 86 C40 78 70 60 100 54 C140 46 170 26 210 18 C240 12 260 8 280 5 L280 90 L0 90 Z" fill="rgba(245,158,11,0.14)" />
              <path d="M0 86 C40 78 70 60 100 54 C140 46 170 26 210 18 C240 12 260 8 280 5" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
              <circle cx="210" cy="18" r="4.5" fill="#F59E0B" stroke="#fff" strokeWidth="2" />
            </svg>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="whitespace-nowrap text-xs text-slate-500 font-deva">दरमहा रक्कम</span>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1">
                <span className="mr-1 text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  min={1000}
                  max={50000}
                  step={500}
                  value={monthly}
                  onChange={(e) => setMonthly(Math.min(50000, Math.max(1000, Number(e.target.value) || 0)))}
                  className="w-20 bg-transparent text-right text-sm font-bold text-slate-900 focus:outline-none"
                  aria-label="मासिक SIP रक्कम"
                />
              </div>
            </div>
            <input
              type="range"
              min={1000}
              max={50000}
              step={500}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="mt-2 w-full accent-amber-500"
              aria-label="मासिक SIP रक्कम स्लायडर"
            />

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 font-deva">गुंतवणूक</p>
                <p className="mt-0.5 text-sm font-bold text-slate-700">{inr(invested)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 font-deva">परतावा</p>
                <p className="mt-0.5 text-sm font-bold text-amber-600">{inr(returns)}</p>
              </div>
            </div>

            <p className="mt-4 text-[10px] leading-snug text-slate-400 font-deva">
              नमुना उदाहरण (१२% गृहीत) — प्रत्यक्ष पोर्टफोलिओ किंवा हमी परतावा नाही.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
