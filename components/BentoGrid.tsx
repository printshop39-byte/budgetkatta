"use client";

import { motion } from "framer-motion";
import { TrendingUp, Landmark, PieChart, ShieldCheck, ArrowRight } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import { useCalculatorStore, type CalculatorType } from "@/store/calculatorStore";
import { useLanguageStore } from "@/store/languageStore";
import { getTranslation } from "@/lib/i18n";

export default function BentoGrid() {
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);
  const language = useLanguageStore((s) => s.language);
  const t = getTranslation(language);

  const cards = [
    {
      id: "sip",
      title: t("bento.sip.title"),
      desc: t("bento.sip.desc"),
      accent: "from-amber-500/10 to-yellow-500/5 hover:border-amber-400/60 text-amber-300",
      badge: t("bento.sip.badge"),
      icon: <TrendingUp className="h-7 w-7 text-amber-400" />,
      stat: t("bento.sip.stat"),
    },
    {
      id: "fd",
      title: t("bento.fd.title"),
      desc: t("bento.fd.desc"),
      accent: "from-yellow-500/10 to-amber-500/5 hover:border-yellow-400/60 text-yellow-300",
      badge: t("bento.fd.badge"),
      icon: <Landmark className="h-7 w-7 text-yellow-400" />,
      stat: t("bento.fd.stat"),
    },
    {
      id: "emi",
      title: t("bento.emi.title"),
      desc: t("bento.emi.desc"),
      accent: "from-blue-500/10 to-sky-500/5 hover:border-blue-400/60 text-blue-300",
      badge: t("bento.emi.badge"),
      icon: <PieChart className="h-7 w-7 text-blue-400" />,
      stat: t("bento.emi.stat"),
    },
    {
      id: "insurance",
      title: t("bento.ins.title"),
      desc: t("bento.ins.desc"),
      accent: "from-rose-500/10 to-red-500/5 hover:border-rose-400/60 text-rose-300",
      badge: t("bento.ins.badge"),
      icon: <ShieldCheck className="h-7 w-7 text-rose-400" />,
      stat: t("bento.ins.stat"),
    },
  ];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-normal leading-[1.4]">{t("bento.title")}</h2>
        <p className="text-slate-400 mt-3 text-base">
          {t("bento.subtitle")}
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ y: -6, scale: 1.02, boxShadow: "0px 0px 24px rgba(251,191,36,0.25)" }}
            transition={{ type: "spring", stiffness: 100 }}
            onClick={() => {
              setActiveTab(card.id as CalculatorType);
              scrollToSection("calculators");
            }}
            className={`relative bg-gradient-to-br ${card.accent} p-7 rounded-[28px] border border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.3)] cursor-pointer hover:border-amber-400/50 transition-all duration-300 group flex flex-col justify-between`}
          >
            <div>
              {/* Header of Bento Card */}
              <div className="flex justify-between items-start mb-6">
                <div className="p-3.5 bg-slate-900 rounded-2xl shadow-sm border border-slate-800 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_18px_rgba(251,191,36,0.3)]">
                  {card.icon}
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-900/80 text-slate-300 rounded-full border border-slate-800">
                  {card.badge}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-100 mb-2.5 tracking-normal leading-[1.4]">{card.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800/60">
              <span className="text-xs font-semibold text-slate-400">{card.stat}</span>
              <span className="flex h-7 w-7 rounded-full bg-slate-900 items-center justify-center shadow-sm text-slate-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
