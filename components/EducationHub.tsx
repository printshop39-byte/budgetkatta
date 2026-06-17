"use client";

import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, Wallet, BookOpen } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import { useCalculatorStore } from "@/store/calculatorStore";
import { useLanguageStore } from "@/store/languageStore";
import { getTranslation } from "@/lib/i18n";

export default function EducationHub() {
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);
  const language = useLanguageStore((s) => s.language);
  const t = getTranslation(language);

  const articles = [
    {
      title: t("edu.a1.title"),
      desc: t("edu.a1.desc"),
      icon: <Sparkles className="h-6 w-6 text-amber-400" />,
      color: "border-amber-400/30 bg-amber-500/5 text-amber-200",
      btnColor: "text-amber-300 hover:bg-amber-500/15",
    },
    {
      title: t("edu.a2.title"),
      desc: t("edu.a2.desc"),
      icon: <AlertTriangle className="h-6 w-6 text-rose-400" />,
      color: "border-rose-400/30 bg-rose-500/5 text-rose-200",
      btnColor: "text-rose-300 hover:bg-rose-500/15",
    },
    {
      title: t("edu.a3.title"),
      desc: t("edu.a3.desc"),
      icon: <Wallet className="h-6 w-6 text-yellow-400" />,
      color: "border-yellow-400/30 bg-yellow-500/5 text-yellow-200",
      btnColor: "text-yellow-300 hover:bg-yellow-500/15",
    },
    {
      title: t("edu.a4.title"),
      desc: t("edu.a4.desc"),
      icon: <BookOpen className="h-6 w-6 text-blue-400" />,
      color: "border-blue-400/30 bg-blue-500/5 text-blue-200",
      btnColor: "text-blue-300 hover:bg-blue-500/15",
    },
  ];

  return (
    <section id="literacy" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-widest">{t("edu.eyebrow")}</span>
        <h2 className="text-3xl/[1.4] md:text-4xl/[1.4] font-extrabold text-slate-100 mt-4 tracking-normal">{t("edu.title")}</h2>
        <p className="text-slate-400 mt-3 text-base">
          {t("edu.subtitle")}
        </p>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 100 }}
            className={`p-6 rounded-3xl border ${item.color} flex flex-col justify-between`}
          >
            <div>
              <div className="inline-flex p-3 bg-slate-900 rounded-2xl shadow-sm border border-slate-800 mb-5">{item.icon}</div>
              <h3 className="text-lg font-bold text-slate-100 mb-3 tracking-normal leading-[1.4]">{item.title}</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">{item.desc}</p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/60">
              <button
                onClick={() => {
                  scrollToSection("calculators");
                  if (idx === 0) setActiveTab("sip");
                  if (idx === 1) setActiveTab("budget");
                  if (idx === 2) setActiveTab("insurance");
                  if (idx === 3) setActiveTab("fd");
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all ${item.btnColor}`}
              >
                {t("edu.btn")}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
