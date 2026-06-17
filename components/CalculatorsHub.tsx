"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info, ShieldCheck, Activity, AlertTriangle, Target, RefreshCw, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { scrollToSection } from "@/lib/scroll";
import { useCalculatorStore, type CalculatorType } from "@/store/calculatorStore";
import { useLanguageStore } from "@/store/languageStore";
import { getTranslation } from "@/lib/i18n";

export type { CalculatorType };

// ============================================================
// SIP CALCULATOR
// ============================================================
function SipCalc() {
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(15);
  const language = useLanguageStore((s) => s.language);
  const t = getTranslation(language);
  const en = language === "en";

  const calculateSIP = () => {
    const P = sipMonthly;
    const i = sipRate / 12 / 100;
    const n = sipYears * 12;
    const totalInvested = P * n;
    let totalValue = 0;
    if (i > 0) {
      totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    } else {
      totalValue = totalInvested;
    }
    const wealthGained = Math.max(0, totalValue - totalInvested);
    return {
      totalInvested: Math.round(totalInvested),
      wealthGained: Math.round(wealthGained),
      totalValue: Math.round(totalValue),
    };
  };
  const sipResult = calculateSIP();

  return (
    <motion.div
      key="sip"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-10"
    >
      {/* Inputs */}
      <div className="lg:col-span-7 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-bold text-slate-300">{t("calc.sip.monthly")}</label>
            <span className="text-lg font-extrabold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-400/30">
              {formatCurrency(sipMonthly)}
            </span>
          </div>
          <input
            type="range"
            min="500"
            max="100000"
            step="500"
            value={sipMonthly}
            onChange={(e) => setSipMonthly(Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{en ? "₹500" : "₹५००"}</span>
            <span>{en ? "₹50,000" : "₹५०,०००"}</span>
            <span>{en ? "₹1,00,000" : "₹१,००,०००"}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-bold text-slate-300">{t("calc.sip.return")}</label>
            <span className="text-lg font-extrabold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-400/30">
              {sipRate}%
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="25"
            step="0.5"
            value={sipRate}
            onChange={(e) => setSipRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{en ? "5%" : "५%"}</span>
            <span>{en ? "15%" : "१५%"}</span>
            <span>{en ? "25%" : "२५%"}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-bold text-slate-300">{t("calc.sip.period")}</label>
            <span className="text-lg font-extrabold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-400/30">
              {sipYears} {t("calc.years")}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            value={sipYears}
            onChange={(e) => setSipYears(Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{en ? "1 yr" : "१ वर्ष"}</span>
            <span>{en ? "20 yrs" : "२० वर्षे"}</span>
            <span>{en ? "40 yrs" : "४० वर्षे"}</span>
          </div>
        </div>

        {/* Educational Tip */}
        <div className="bg-amber-500/10 border border-amber-400/30 p-5 rounded-2xl flex items-start space-x-3.5">
          <div className="p-2 bg-amber-500/20 rounded-xl text-amber-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-300">{t("calc.sip.tip_title")}</h4>
            <p className="text-xs text-amber-200/90 leading-relaxed mt-1">
              {t("calc.sip.tip_desc")}
            </p>
          </div>
        </div>
      </div>

      {/* Results & Visual Graphic */}
      <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/80 border border-slate-800 p-8 rounded-3xl">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-200">{t("calc.sip.analysis")}</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2.5 border-b border-slate-800/50">
              <span className="text-sm text-slate-400 font-medium">{t("calc.sip.invested_total")}</span>
              <span className="text-base font-bold text-slate-200">{formatCurrency(sipResult.totalInvested)}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-slate-800/50">
              <span className="text-sm text-slate-400 font-medium">{t("calc.sip.est_return")}</span>
              <span className="text-base font-bold text-amber-400">+{formatCurrency(sipResult.wealthGained)}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-base font-bold text-slate-200">{t("calc.sip.total_value")}</span>
              <span className="text-xl font-extrabold text-amber-300">{formatCurrency(sipResult.totalValue)}</span>
            </div>
          </div>
        </div>

        {/* Circular Donut Chart SVG */}
        <div className="my-6 flex justify-center items-center">
          <div className="relative h-36 w-36">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="10" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#f59e0b"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - sipResult.totalInvested / sipResult.totalValue)}
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#fbbf24"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - sipResult.wealthGained / sipResult.totalValue)}
                style={{
                  transform: `rotate(${360 * (sipResult.totalInvested / sipResult.totalValue)}deg)`,
                  transformOrigin: "50px 50px",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 font-bold uppercase">{t("calc.sip.return_share")}</span>
              <span className="text-sm font-extrabold text-amber-400">
                {Math.round((sipResult.wealthGained / sipResult.totalValue) * 100) || 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-slate-400">{t("calc.sip.legend_invest")} ({Math.round((sipResult.totalInvested / sipResult.totalValue) * 100) || 0}%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="text-slate-400">{t("calc.sip.legend_growth")} ({Math.round((sipResult.wealthGained / sipResult.totalValue) * 100) || 0}%)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// FD CALCULATOR
// ============================================================
function FdCalc() {
  const [fdPrincipal, setFdPrincipal] = useState(100000);
  const [fdRate, setFdRate] = useState(7.1);
  const [fdYears, setFdYears] = useState(5);
  const [fdCompounding, setFdCompounding] = useState(4);
  const language = useLanguageStore((s) => s.language);
  const t = getTranslation(language);
  const en = language === "en";

  const calculateFD = () => {
    const P = fdPrincipal;
    const r = fdRate / 100;
    const t = fdYears;
    const n = fdCompounding;
    const totalValue = P * Math.pow(1 + r / n, n * t);
    const interestEarned = totalValue - P;
    return {
      principal: P,
      interestEarned: Math.round(interestEarned),
      totalValue: Math.round(totalValue),
    };
  };
  const fdResult = calculateFD();

  return (
    <motion.div
      key="fd"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-10"
    >
      {/* Inputs */}
      <div className="lg:col-span-7 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-bold text-slate-300">{t("calc.fd.principal")}</label>
            <span className="text-lg font-extrabold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-400/30">
              {formatCurrency(fdPrincipal)}
            </span>
          </div>
          <input
            type="range"
            min="5000"
            max="5000000"
            step="5000"
            value={fdPrincipal}
            onChange={(e) => setFdPrincipal(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{en ? "₹5,000" : "₹५,०००"}</span>
            <span>{en ? "₹25,00,000" : "₹२५,००,०००"}</span>
            <span>{en ? "₹50,00,000" : "₹५०,००,०००"}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-bold text-slate-300">{t("calc.fd.rate")}</label>
            <span className="text-lg font-extrabold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-400/30">
              {fdRate}%
            </span>
          </div>
          <input
            type="range"
            min="3"
            max="12"
            step="0.1"
            value={fdRate}
            onChange={(e) => setFdRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{en ? "3%" : "३%"}</span>
            <span>{en ? "7.5%" : "७.५%"}</span>
            <span>{en ? "12%" : "१२%"}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-bold text-slate-300">{t("calc.fd.tenure")}</label>
            <span className="text-lg font-extrabold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-400/30">
              {fdYears} {t("calc.years")}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            value={fdYears}
            onChange={(e) => setFdYears(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{en ? "1 yr" : "१ वर्ष"}</span>
            <span>{en ? "12 yrs" : "१२ वर्षे"}</span>
            <span>{en ? "25 yrs" : "२५ वर्षे"}</span>
          </div>
        </div>

        {/* Compounding Frequency Selection */}
        <div>
          <label className="text-base font-bold text-slate-300 block mb-3">{t("calc.fd.compounding")}</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t("calc.fd.monthly"), val: 12 },
              { label: t("calc.fd.quarterly"), val: 4 },
              { label: t("calc.fd.yearly"), val: 1 },
            ].map((freq) => (
              <button
                key={freq.val}
                onClick={() => setFdCompounding(freq.val)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-all ${
                  fdCompounding === freq.val
                    ? "bg-amber-500/15 border-amber-400/40 text-amber-200"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results & Visual Graphic */}
      <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/80 border border-slate-800 p-8 rounded-3xl">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-200">{t("calc.fd.details")}</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2.5 border-b border-slate-800/50">
              <span className="text-sm text-slate-400 font-medium">{t("calc.fd.principal_row")}</span>
              <span className="text-base font-bold text-slate-200">{formatCurrency(fdResult.principal)}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-slate-800/50">
              <span className="text-sm text-slate-400 font-medium">{t("calc.fd.interest_row")}</span>
              <span className="text-base font-bold text-amber-400">+{formatCurrency(fdResult.interestEarned)}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-base font-bold text-slate-200">{t("calc.fd.maturity_row")}</span>
              <span className="text-xl font-extrabold text-amber-300">{formatCurrency(fdResult.totalValue)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar Visualization */}
        <div className="my-6 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>{t("calc.fd.legend_invest")}: {Math.round((fdResult.principal / fdResult.totalValue) * 100)}%</span>
            <span>{t("calc.fd.legend_interest")}: {Math.round((fdResult.interestEarned / fdResult.totalValue) * 100)}%</span>
          </div>
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
            <div style={{ width: `${(fdResult.principal / fdResult.totalValue) * 100}%` }} className="h-full bg-amber-500" />
            <div style={{ width: `${(fdResult.interestEarned / fdResult.totalValue) * 100}%` }} className="h-full bg-amber-400" />
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-400/30 p-4 rounded-2xl flex items-start space-x-3">
          <Info className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-200 leading-relaxed">
            {t("calc.fd.senior_tip")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// LOAN EMI CALCULATOR
// ============================================================
function EmiCalc() {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanYears, setLoanYears] = useState(15);
  const language = useLanguageStore((s) => s.language);
  const t = getTranslation(language);
  const en = language === "en";

  const calculateEMI = () => {
    const P = loanAmount;
    const r = loanRate / 12 / 100;
    const n = loanYears * 12;
    let emi = 0;
    if (r > 0) {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      emi = P / n;
    }
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  };
  const emiResult = calculateEMI();

  return (
    <motion.div
      key="emi"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-10"
    >
      {/* Inputs */}
      <div className="lg:col-span-7 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-bold text-slate-300">{t("calc.emi.amount")}</label>
            <span className="text-lg font-extrabold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-400/30">
              {formatCurrency(loanAmount)}
            </span>
          </div>
          <input
            type="range"
            min="100000"
            max="10000000"
            step="50000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{en ? "₹1 L" : "₹१ लाख"}</span>
            <span>{en ? "₹50 L" : "₹५० लाख"}</span>
            <span>{en ? "₹1 Cr" : "₹१ कोटी"}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-bold text-slate-300">{t("calc.emi.rate")}</label>
            <span className="text-lg font-extrabold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-400/30">
              {loanRate}%
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="20"
            step="0.1"
            value={loanRate}
            onChange={(e) => setLoanRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{en ? "5%" : "५%"}</span>
            <span>{en ? "12.5%" : "१२.५%"}</span>
            <span>{en ? "20%" : "२०%"}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-bold text-slate-300">{t("calc.emi.tenure")}</label>
            <span className="text-lg font-extrabold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-400/30">
              {loanYears} {t("calc.years")}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={loanYears}
            onChange={(e) => setLoanYears(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{en ? "1 yr" : "१ वर्ष"}</span>
            <span>{en ? "15 yrs" : "१५ वर्षे"}</span>
            <span>{en ? "30 yrs" : "३० वर्षे"}</span>
          </div>
        </div>
      </div>

      {/* Results & Visual Graphic */}
      <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/80 border border-slate-800 p-8 rounded-3xl">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-200">{t("calc.emi.analysis")}</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2.5 border-b border-slate-800/50">
              <span className="text-sm text-slate-400 font-medium">{t("calc.emi.monthly")}</span>
              <span className="text-lg font-extrabold text-slate-200">{formatCurrency(emiResult.monthlyEmi)}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-slate-800/50">
              <span className="text-sm text-slate-400 font-medium">{t("calc.emi.principal_total")}</span>
              <span className="text-sm font-bold text-slate-300">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-slate-800/50">
              <span className="text-sm text-slate-400 font-medium">{t("calc.emi.total_interest")}</span>
              <span className="text-sm font-bold text-rose-400">+{formatCurrency(emiResult.totalInterest)}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-base font-bold text-slate-200">{t("calc.emi.total_payment")}</span>
              <span className="text-xl font-extrabold text-blue-300">{formatCurrency(emiResult.totalPayment)}</span>
            </div>
          </div>
        </div>

        {/* Donut chart for Loan vs Interest */}
        <div className="my-6 flex justify-center items-center">
          <div className="relative h-36 w-36">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="10" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#3b82f6"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - loanAmount / emiResult.totalPayment)}
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e11d48"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - emiResult.totalInterest / emiResult.totalPayment)}
                style={{
                  transform: `rotate(${360 * (loanAmount / emiResult.totalPayment)}deg)`,
                  transformOrigin: "50px 50px",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t("calc.emi.interest_share")}</span>
              <span className="text-sm font-extrabold text-rose-400">
                {Math.round((emiResult.totalInterest / emiResult.totalPayment) * 100) || 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 rounded-full bg-blue-400" />
            <span className="text-slate-400">{t("calc.emi.legend_loan")} ({Math.round((loanAmount / emiResult.totalPayment) * 100) || 0}%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="text-slate-400">{t("calc.emi.legend_interest")} ({Math.round((emiResult.totalInterest / emiResult.totalPayment) * 100) || 0}%)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// INSURANCE ADVISOR
// ============================================================
function InsuranceCalc() {
  const [insIncome, setInsIncome] = useState(600000);
  const [insAge, setInsAge] = useState(30);
  const [insDependents, setInsDependents] = useState(3);
  const [insLiabilities, setInsLiabilities] = useState(1000000);
  const language = useLanguageStore((s) => s.language);
  const t = getTranslation(language);
  const en = language === "en";

  const calculateInsurance = () => {
    const termCover = insIncome * 15 + insLiabilities;
    let healthCover = 500000;
    healthCover += insDependents * 100000;
    if (insAge > 45) {
      healthCover += 200000;
    }
    return { termCover, healthCover };
  };
  const insResult = calculateInsurance();

  return (
    <motion.div
      key="insurance"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-10"
    >
      {/* Inputs */}
      <div className="lg:col-span-7 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-bold text-slate-300">{t("calc.ins.income")}</label>
            <span className="text-lg font-extrabold text-rose-300 bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-400/30">
              {formatCurrency(insIncome)}
            </span>
          </div>
          <input
            type="range"
            min="200000"
            max="3000000"
            step="50000"
            value={insIncome}
            onChange={(e) => setInsIncome(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{en ? "₹2 L" : "₹२ लाख"}</span>
            <span>{en ? "₹16 L" : "₹१६ लाख"}</span>
            <span>{en ? "₹30 L" : "₹३० लाख"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-bold text-slate-300 block mb-2.5">{t("calc.ins.age")}</label>
            <input
              type="number"
              value={insAge}
              onChange={(e) => setInsAge(Math.min(80, Math.max(18, Number(e.target.value))))}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 font-bold focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-300 block mb-2.5">{t("calc.ins.dependents")}</label>
            <input
              type="number"
              value={insDependents}
              onChange={(e) => setInsDependents(Math.min(10, Math.max(0, Number(e.target.value))))}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 font-bold focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-300 block mb-2.5">{t("calc.ins.liabilities")}</label>
            <input
              type="number"
              step="50000"
              value={insLiabilities}
              onChange={(e) => setInsLiabilities(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 font-bold focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Educational Advice */}
        <div className="bg-rose-500/10 border border-rose-400/30 p-5 rounded-2xl">
          <h4 className="text-sm font-bold text-rose-300 flex items-center space-x-2">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-400" />
            <span>{t("calc.ins.tip_title")}</span>
          </h4>
          <p className="text-xs text-rose-200/95 leading-relaxed mt-2 whitespace-pre-line">
            {t("calc.ins.tip_desc")}
          </p>
        </div>
      </div>

      {/* Results & Recommendation Card */}
      <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/80 border border-slate-800 p-8 rounded-3xl">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-200">{t("calc.ins.recommended")}</h3>

          {/* Term Insurance Cover Result */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-rose-400/30 shadow-sm space-y-2">
            <div className="flex items-center space-x-2">
              <span className="p-1 bg-rose-500/15 rounded-lg text-rose-300">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-slate-400">{t("calc.ins.term_label")}</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-200">{formatCurrency(insResult.termCover)}</div>
            <p className="text-[11px] text-slate-400">{t("calc.ins.term_note")}</p>
          </div>

          {/* Health Insurance Cover Result */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-amber-400/30 shadow-sm space-y-2">
            <div className="flex items-center space-x-2">
              <span className="p-1 bg-amber-500/15 rounded-lg text-amber-300">
                <Activity className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-slate-400">{t("calc.ins.health_label")}</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-200">{formatCurrency(insResult.healthCover)}</div>
            <p className="text-[11px] text-slate-400">{t("calc.ins.health_note")}</p>
          </div>
        </div>

        <div className="mt-6">
          <a
            href="#health-quiz"
            onClick={() => scrollToSection("health-quiz")}
            className="w-full py-3 px-4 rounded-2xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-amber-500 transition-all text-center shadow-sm shadow-amber-500/30"
          >
            <span>{t("calc.ins.cta")}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// 50/30/20 BUDGET PLANNER
// ============================================================
function BudgetPlanner() {
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [customNeeds, setCustomNeeds] = useState({ rent: 12000, groc: 8000, bills: 4000, debt: 2000 });
  const [customWants, setCustomWants] = useState({ dining: 4000, shopping: 3000, travel: 2000, hobbies: 2000 });
  const [customSavings, setCustomSavings] = useState({ sip: 5000, fd: 3000, gold: 2000 });
  const language = useLanguageStore((s) => s.language);
  const t = getTranslation(language);
  const en = language === "en";

  const totalNeedsSpent = customNeeds.rent + customNeeds.groc + customNeeds.bills + customNeeds.debt;
  const totalWantsSpent = customWants.dining + customWants.shopping + customWants.travel + customWants.hobbies;
  const totalSavingsSpent = customSavings.sip + customSavings.fd + customSavings.gold;

  const targetNeeds = monthlyIncome * 0.5;
  const targetWants = monthlyIncome * 0.3;
  const targetSavings = monthlyIncome * 0.2;

  return (
    <motion.div
      key="budget"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-10"
    >
      {/* Inputs */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-bold text-slate-300">{t("calc.budget.income")}</label>
            <span className="text-lg font-extrabold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-400/30">
              {formatCurrency(monthlyIncome)}
            </span>
          </div>
          <input
            type="range"
            min="10000"
            max="500000"
            step="5000"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{en ? "₹10,000" : "₹१०,०००"}</span>
            <span>{en ? "₹2,50,000" : "₹२,५०,०००"}</span>
            <span>{en ? "₹5,00,000" : "₹५,००,०००"}</span>
          </div>
        </div>

        {/* Sub-category breakdowns */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t("calc.budget.section_title")}</h3>

          {/* Category: Needs */}
          <div className="bg-indigo-500/10 border border-indigo-400/30 p-4.5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-bold text-indigo-200">{t("calc.budget.needs")}</span>
              <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-lg">
                {t("calc.budget.limit")}: {formatCurrency(targetNeeds)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400">{t("calc.budget.rent_label")}</label>
                <input
                  type="number"
                  value={customNeeds.rent}
                  onChange={(e) => setCustomNeeds({ ...customNeeds, rent: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">{t("calc.budget.groc_label")}</label>
                <input
                  type="number"
                  value={customNeeds.groc}
                  onChange={(e) => setCustomNeeds({ ...customNeeds, groc: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl font-bold"
                />
              </div>
            </div>
          </div>

          {/* Category: Wants */}
          <div className="bg-amber-500/10 border border-amber-400/30 p-4.5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-bold text-amber-200">{t("calc.budget.wants")}</span>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-lg">
                {t("calc.budget.limit")}: {formatCurrency(targetWants)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400">{t("calc.budget.dining_label")}</label>
                <input
                  type="number"
                  value={customWants.dining}
                  onChange={(e) => setCustomWants({ ...customWants, dining: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">{t("calc.budget.shop_label")}</label>
                <input
                  type="number"
                  value={customWants.shopping}
                  onChange={(e) => setCustomWants({ ...customWants, shopping: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl font-bold"
                />
              </div>
            </div>
          </div>

          {/* Category: Savings */}
          <div className="bg-yellow-500/10 border border-yellow-400/30 p-4.5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm font-bold text-yellow-200">{t("calc.budget.savings")}</span>
              <span className="text-[11px] font-bold text-yellow-300 bg-yellow-500/15 px-2 py-0.5 rounded-lg">
                {t("calc.budget.target")} {formatCurrency(targetSavings)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400">{t("calc.budget.sip_label")}</label>
                <input
                  type="number"
                  value={customSavings.sip}
                  onChange={(e) => setCustomSavings({ ...customSavings, sip: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">{t("calc.budget.fd_label")}</label>
                <input
                  type="number"
                  value={customSavings.fd}
                  onChange={(e) => setCustomSavings({ ...customSavings, fd: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results & Interactive Budget Status */}
      <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950/80 border border-slate-800 p-8 rounded-3xl">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-200">{t("calc.budget.compare_title")}</h3>

          <div className="space-y-5">
            {/* Needs Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-indigo-200">{t("calc.budget.needs_lbl")}</span>
                <span className={totalNeedsSpent > targetNeeds ? "text-rose-400" : "text-amber-400"}>
                  {t("calc.budget.spent")}: {formatCurrency(totalNeedsSpent)} / {formatCurrency(targetNeeds)}
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (totalNeedsSpent / targetNeeds) * 100)}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    totalNeedsSpent > targetNeeds ? "bg-rose-500" : "bg-indigo-600"
                  }`}
                />
              </div>
              {totalNeedsSpent > targetNeeds && (
                <p className="text-[11px] text-rose-400 font-semibold">{t("calc.budget.needs_over")}</p>
              )}
            </div>

            {/* Wants Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-amber-200">{t("calc.budget.wants_lbl")}</span>
                <span className={totalWantsSpent > targetWants ? "text-rose-400" : "text-amber-400"}>
                  {t("calc.budget.spent")}: {formatCurrency(totalWantsSpent)} / {formatCurrency(targetWants)}
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (totalWantsSpent / targetWants) * 100)}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    totalWantsSpent > targetWants ? "bg-rose-500" : "bg-amber-500"
                  }`}
                />
              </div>
              {totalWantsSpent > targetWants && (
                <p className="text-[11px] text-rose-400 font-semibold">{t("calc.budget.wants_over")}</p>
              )}
            </div>

            {/* Savings Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-yellow-200">{t("calc.budget.savings_lbl")}</span>
                <span className={totalSavingsSpent < targetSavings ? "text-amber-300" : "text-amber-400"}>
                  {t("calc.budget.saved")}: {formatCurrency(totalSavingsSpent)} / {formatCurrency(targetSavings)}
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (totalSavingsSpent / targetSavings) * 100)}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    totalSavingsSpent < targetSavings ? "bg-amber-400" : "bg-amber-400"
                  }`}
                />
              </div>
              {totalSavingsSpent < targetSavings ? (
                <p className="text-[11px] text-amber-300 font-semibold">{t("calc.budget.savings_low")}</p>
              ) : (
                <p className="text-[11px] text-amber-400 font-semibold">{t("calc.budget.savings_ok")}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-slate-800/50 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase block">{t("calc.budget.balance")}</span>
            <span className="text-lg font-extrabold text-slate-200">
              {formatCurrency(Math.max(0, monthlyIncome - totalNeedsSpent - totalWantsSpent - totalSavingsSpent))}
            </span>
          </div>
          <button
            onClick={() => {
              setCustomNeeds({ rent: 12000, groc: 8000, bills: 4000, debt: 2000 });
              setCustomWants({ dining: 4000, shopping: 3000, travel: 2000, hobbies: 2000 });
              setCustomSavings({ sip: 5000, fd: 3000, gold: 2000 });
            }}
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t("calc.budget.reset")}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// GOAL PLANNER
// ============================================================
function GoalPlanner() {
  const [goalType, setGoalType] = useState<"home" | "car" | "child" | "retirement">("home");
  const [goalAmount, setGoalAmount] = useState(3000000);
  const [goalYears, setGoalYears] = useState(10);
  const [riskProfile, setRiskProfile] = useState<"low" | "medium" | "high">("medium");
  const language = useLanguageStore((s) => s.language);
  const t = getTranslation(language);
  const en = language === "en";

  const calculateGoalSIP = () => {
    let expectedRate = 12;
    if (riskProfile === "low") expectedRate = 7.5;
    if (riskProfile === "high") expectedRate = 15;

    const i = expectedRate / 12 / 100;
    const n = goalYears * 12;

    let requiredSip = 0;
    if (i > 0) {
      const factor = ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      requiredSip = goalAmount / factor;
    } else {
      requiredSip = goalAmount / n;
    }

    return { requiredSip: Math.round(requiredSip), expectedRate, futureValue: goalAmount };
  };
  const goalResult = calculateGoalSIP();

  const goals = [
    { id: "home", emoji: "🏠", label: t("calc.goal.home"), val: 3000000 },
    { id: "car", emoji: "🚗", label: t("calc.goal.car"), val: 800000 },
    { id: "child", emoji: "🎓", label: t("calc.goal.child"), val: 1500000 },
    { id: "retirement", emoji: "🌴", label: t("calc.goal.retirement"), val: 5000000 },
  ];

  const risks = [
    { id: "low", label: t("calc.goal.risk_low"), desc: t("calc.goal.risk_low_desc") },
    { id: "medium", label: t("calc.goal.risk_med"), desc: t("calc.goal.risk_med_desc") },
    { id: "high", label: t("calc.goal.risk_high"), desc: t("calc.goal.risk_high_desc") },
  ];

  return (
    <motion.div
      key="goal"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-10"
    >
      {/* Inputs */}
      <div className="lg:col-span-7 space-y-8">
        {/* Goal Type */}
        <div>
          <label className="text-base font-bold text-slate-300 block mb-3.5">{t("calc.goal.select")}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => {
                  setGoalType(goal.id as "home" | "car" | "child" | "retirement");
                  setGoalAmount(goal.val);
                }}
                className={`px-4 py-4 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center space-y-2 ${
                  goalType === goal.id
                    ? "bg-violet-500/15 border-violet-400/40 text-violet-200 shadow-sm"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="text-2xl">{goal.emoji}</span>
                <span>{goal.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-bold text-slate-300">{t("calc.goal.amount")}</label>
            <span className="text-lg font-extrabold text-violet-300 bg-violet-500/10 px-3 py-1 rounded-xl border border-violet-400/30">
              {formatCurrency(goalAmount)}
            </span>
          </div>
          <input
            type="range"
            min="200000"
            max="20000000"
            step="100000"
            value={goalAmount}
            onChange={(e) => setGoalAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{en ? "₹2 L" : "₹२ लाख"}</span>
            <span>{en ? "₹1 Cr" : "₹१ कोटी"}</span>
            <span>{en ? "₹2 Cr" : "₹२ कोटी"}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-bold text-slate-300">{t("calc.goal.tenure")}</label>
            <span className="text-lg font-extrabold text-violet-300 bg-violet-500/10 px-3 py-1 rounded-xl border border-violet-400/30">
              {goalYears} {t("calc.years")}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={goalYears}
            onChange={(e) => setGoalYears(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-400"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{en ? "1 yr" : "१ वर्ष"}</span>
            <span>{en ? "15 yrs" : "१५ वर्षे"}</span>
            <span>{en ? "30 yrs" : "३० वर्षे"}</span>
          </div>
        </div>

        {/* Risk profile selection */}
        <div>
          <label className="text-base font-bold text-slate-300 block mb-3">{t("calc.goal.risk_title")}</label>
          <div className="grid grid-cols-3 gap-3">
            {risks.map((risk) => (
              <button
                key={risk.id}
                onClick={() => setRiskProfile(risk.id as "low" | "medium" | "high")}
                className={`px-4 py-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                  riskProfile === risk.id
                    ? "bg-violet-500/15 border-violet-400/40 text-violet-200"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="text-xs font-bold">{risk.label}</span>
                <span className="text-[10px] text-slate-400 font-medium mt-1">{risk.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results & Recommendation Card */}
      <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/80 border border-slate-800 p-8 rounded-3xl">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-200">{t("calc.goal.formula")}</h3>

          <div className="bg-slate-900 p-6 rounded-2xl border border-violet-400/30 shadow-sm text-center space-y-4">
            <div className="inline-flex p-3 bg-violet-500/15 rounded-2xl text-violet-300">
              <Target className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase block">{t("calc.goal.required_sip")}</span>
              <span className="text-2xl md:text-3xl font-extrabold text-violet-300 block">
                {formatCurrency(goalResult.requiredSip)}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              {en ? (
                <>
                  At an estimated <strong>{goalResult.expectedRate}%</strong> annual return, investing this amount monthly for <strong>{goalYears} years</strong> can fulfil your goal of {formatCurrency(goalAmount)}.
                </>
              ) : (
                <>
                  अंदाजे <strong>{goalResult.expectedRate}%</strong> वार्षिक परताव्याच्या दराने दरमहा एवढी गुंतवणूक केल्यास <strong>{goalYears} वर्षांत</strong> तुमचे {formatCurrency(goalAmount)} चे स्वप्न पूर्ण होऊ शकते.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="bg-violet-500/10 border border-violet-400/30 p-4.5 rounded-2xl space-y-2 mt-6">
          <h4 className="text-xs font-bold text-violet-300">{t("calc.goal.rec_title")}</h4>
          <p className="text-[11px] text-violet-200/95 leading-relaxed">
            {riskProfile === "high" && t("calc.goal.rec_high")}
            {riskProfile === "medium" && t("calc.goal.rec_med")}
            {riskProfile === "low" && t("calc.goal.rec_low")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// CALCULATORS HUB (tab switcher + active calculator)
// ============================================================
export default function CalculatorsHub() {
  const { activeTab, setActiveTab } = useCalculatorStore();
  const language = useLanguageStore((s) => s.language);
  const t = getTranslation(language);

  return (
    <section id="calculators" className="py-20 px-6 bg-slate-950/60 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-widest">{t("calc.eyebrow")}</span>
          <h2 className="text-3xl/[1.4] md:text-4xl/[1.4] font-extrabold text-slate-100 mt-4 tracking-normal">
            {t("calc.title")}
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            {t("calc.subtitle")}
          </p>
        </div>

        {/* Elegant Tab Switcher (Glassmorphic Pill) */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-2 bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-2 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] max-w-full overflow-x-auto">
            {[
              { id: "sip", label: t("calc.tab.sip"), color: "text-amber-300"},
              { id: "fd", label: t("calc.tab.fd"), color: "text-amber-300" },
              { id: "emi", label: t("calc.tab.emi"), color: "text-blue-300" },
              { id: "insurance", label: t("calc.tab.insurance"), color: "text-rose-300" },
              { id: "budget", label: t("calc.tab.budget"), color: "text-indigo-300" },
              { id: "goal", label: t("calc.tab.goal"), color: "text-violet-300" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CalculatorType)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30"
                    : "text-slate-400 hover:text-amber-300 hover:bg-slate-900/90 hover:shadow-[0_0_16px_rgba(251,191,36,0.15)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calculator Output Container with Glassmorphism */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.4)] p-6 md:p-10">
          <AnimatePresence mode="wait">
            {activeTab === "sip" && <SipCalc key="sip" />}
            {activeTab === "fd" && <FdCalc key="fd" />}
            {activeTab === "emi" && <EmiCalc key="emi" />}
            {activeTab === "insurance" && <InsuranceCalc key="insurance" />}
            {activeTab === "budget" && <BudgetPlanner key="budget" />}
            {activeTab === "goal" && <GoalPlanner key="goal" />}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
