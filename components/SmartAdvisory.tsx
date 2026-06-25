"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, HelpCircle as QuestionIcon, RefreshCw, ArrowRight, Sparkles } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { getTranslation } from "@/lib/i18n";

export default function SmartAdvisory() {
  const [userQuery, setUserQuery] = useState("");
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [showEmptyHint, setShowEmptyHint] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const language = useLanguageStore((s) => s.language);
  const t = getTranslation(language);

  const handleSmartQuery = (e: FormEvent) => {
    e.preventDefault();
    // Empty query: give clear feedback (focus + hint) instead of a dead click.
    if (!userQuery.trim()) {
      setShowEmptyHint(true);
      textareaRef.current?.focus();
      return;
    }
    setShowEmptyHint(false);

    setChatLoading(true);
    setChatResponse(null);

    setTimeout(() => {
      const query = userQuery.toLowerCase();
      let response = "";

      if (query.includes("गुंतवणूक") || query.includes("investment") || query.includes("कुठे") || query.includes("invest")) {
        response = t("adv.resp_investment");
      } else if (query.includes("कर्ज") || query.includes("loan") || query.includes("emi")) {
        response = t("adv.resp_loan");
      } else if (query.includes("विमा") || query.includes("insurance")) {
        response = t("adv.resp_ins");
      } else if (query.includes("बचत") || query.includes("saving") || query.includes("खर्च") || query.includes("budget")) {
        response = t("adv.resp_save");
      } else {
        response = t("adv.resp_default");
      }

      setChatResponse(response);
      setChatLoading(false);
    }, 900);
  };

  return (
    <section id="budget-section" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Information */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-widest">
            {t("adv.eyebrow")}
          </span>
          <h2 className="text-3xl/[1.4] md:text-4xl/[1.4] font-extrabold text-slate-100 tracking-normal">
            {t("adv.title")}
          </h2>
          <p className="text-slate-400 leading-relaxed text-base">
            {t("adv.desc")}
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-bold text-slate-200">{t("adv.bullet1_title")}</span>
                <p className="text-xs text-slate-400">{t("adv.bullet1_desc")}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-bold text-slate-200">{t("adv.bullet2_title")}</span>
                <p className="text-xs text-slate-400">{t("adv.bullet2_desc")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Query Box */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 p-8 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-400/30">
                <QuestionIcon className="h-5 w-5 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">{t("adv.ask_title")}</h3>
            </div>

            <form onSubmit={handleSmartQuery} className="space-y-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={3}
                  placeholder={t("adv.placeholder")}
                  value={userQuery}
                  onChange={(e) => {
                    setUserQuery(e.target.value);
                    if (showEmptyHint) setShowEmptyHint(false);
                  }}
                  className="w-full px-5 py-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:bg-slate-950 text-sm font-medium transition-all resize-none"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-bold ${showEmptyHint ? "text-rose-300" : "text-slate-400"}`}>
                  {showEmptyHint ? t("adv.empty_hint") : t("adv.hint")}
                </span>
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-400 text-slate-950 font-bold text-xs transition-all shadow-sm shadow-amber-500/30 flex items-center space-x-1.5"
                >
                  {chatLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>{t("adv.searching")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("adv.get_advice")}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Chat Response Display */}
            <AnimatePresence mode="wait">
              {chatResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-amber-500/10 border border-amber-400/30 p-5 rounded-2xl space-y-2.5"
                >
                  <div className="flex items-center space-x-1.5">
                    <span className="p-1 bg-amber-500/20 rounded-lg text-amber-300">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-xs font-bold text-amber-300">{t("adv.answer_label")}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{chatResponse}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Compliance: this tool gives general educational info, not advice. */}
            <p className="text-[10px] leading-relaxed text-slate-500 font-deva">
              ⚠️ {t("adv.disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
