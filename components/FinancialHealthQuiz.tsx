"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronRight, Star, ArrowRight } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import { useLanguageStore } from "@/store/languageStore";
import { getTranslation } from "@/lib/i18n";

// Each quiz question maps to a financial dimension. When the user's answer
// scores below the midpoint (< 20 of 40), we surface a targeted next-step tip
// that deep-links to the relevant tool. quizAnswers[idx] holds that question's
// score (answers are pushed in question order).
const TIP_DIMENSIONS = [
  { idx: 0, key: "savings", href: "/sip" },
  { idx: 1, key: "emergency", href: "/fd" },
  { idx: 2, key: "insurance", href: "/insurance" },
  { idx: 3, key: "debt", href: "/loans" },
  { idx: 4, key: "invest", href: "/sip" },
];

export default function FinancialHealthQuiz() {
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const language = useLanguageStore((s) => s.language);
  const t = getTranslation(language);

  const quizQuestions = [
    {
      q: t("quiz.q1"),
      options: [
        { text: t("quiz.q1.o1"), score: 10 },
        { text: t("quiz.q1.o2"), score: 20 },
        { text: t("quiz.q1.o3"), score: 30 },
        { text: t("quiz.q1.o4"), score: 40 },
      ],
    },
    {
      q: t("quiz.q2"),
      options: [
        { text: t("quiz.q2.o1"), score: 0 },
        { text: t("quiz.q2.o2"), score: 15 },
        { text: t("quiz.q2.o3"), score: 30 },
        { text: t("quiz.q2.o4"), score: 40 },
      ],
    },
    {
      q: t("quiz.q3"),
      options: [
        { text: t("quiz.q3.o1"), score: 0 },
        { text: t("quiz.q3.o2"), score: 15 },
        { text: t("quiz.q3.o3"), score: 15 },
        { text: t("quiz.q3.o4"), score: 40 },
      ],
    },
    {
      q: t("quiz.q4"),
      options: [
        { text: t("quiz.q4.o1"), score: 40 },
        { text: t("quiz.q4.o2"), score: 30 },
        { text: t("quiz.q4.o3"), score: 15 },
        { text: t("quiz.q4.o4"), score: 5 },
      ],
    },
    {
      q: t("quiz.q5"),
      options: [
        { text: t("quiz.q5.o1"), score: 15 },
        { text: t("quiz.q5.o2"), score: 40 },
        { text: t("quiz.q5.o3"), score: 25 },
        { text: t("quiz.q5.o4"), score: 5 },
      ],
    },
  ];

  const handleQuizAnswer = (score: number) => {
    const newAnswers = [...quizAnswers, score];
    setQuizAnswers(newAnswers);
    if (quizStep <= quizQuestions.length) {
      setQuizStep(quizStep + 1);
    }
  };

  const calculateHealthScore = () => {
    const totalScore = quizAnswers.reduce((a, b) => a + b, 0);
    const percentage = Math.round((totalScore / 200) * 100);
    return percentage;
  };

  const getHealthStatus = (score: number) => {
    if (score >= 85) return { label: t("quiz.label_excellent"), color: "text-amber-300 bg-amber-500/10 border-amber-400/30", desc: t("quiz.desc_excellent") };
    if (score >= 60) return { label: t("quiz.label_good"), color: "text-amber-300 bg-amber-500/10 border-amber-400/30", desc: t("quiz.desc_good") };
    if (score >= 40) return { label: t("quiz.label_avg"), color: "text-yellow-300 bg-yellow-500/10 border-yellow-400/30", desc: t("quiz.desc_avg") };
    return { label: t("quiz.label_risk"), color: "text-rose-300 bg-rose-500/10 border-rose-400/30", desc: t("quiz.desc_risk") };
  };

  const resetQuiz = () => {
    setQuizAnswers([]);
    setQuizStep(1);
  };

  return (
    <section id="health-quiz" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 text-white rounded-[40px] p-8 md:p-14 relative overflow-hidden shadow-2xl border border-slate-800">
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/15 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-500/10 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-widest">
              {t("quiz.eyebrow")}
            </span>
            <h2 className="text-3xl/[1.4] md:text-4xl/[1.4] font-extrabold tracking-normal">
              {t("quiz.title")}
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              {t("quiz.desc")}
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              </div>
              <span className="text-xs text-slate-400">{t("quiz.testimonial")}</span>
            </div>
          </div>

          {/* Right Content - Interactive Quiz Widget */}
          <div className="lg:col-span-6 bg-slate-900/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl">
            <AnimatePresence mode="wait">
              {/* Step 0: Start Quiz */}
              {quizStep === 0 && (
                <motion.div
                  key="start"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-6 py-6"
                >
                  <div className="h-16 w-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-300 border border-amber-400/30 shadow-lg shadow-amber-900/30">
                    <Award className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{t("quiz.start_title")}</h3>
                    <p className="text-xs text-slate-400 mt-1">{t("quiz.start_sub")}</p>
                  </div>
                  <button
                    onClick={() => setQuizStep(1)}
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/30 transition-all transform hover:scale-102"
                  >
                    {t("quiz.start_btn")}
                  </button>
                </motion.div>
              )}

              {/* Steps 1 to 5: Questions */}
              {quizStep >= 1 && quizStep <= quizQuestions.length && (
                <motion.div
                  key={`q-${quizStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Progress indicator */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-amber-300 uppercase">{t("quiz.q_prefix")} {quizStep} {t("quiz.q_of")} {quizQuestions.length}</span>
                    <div className="w-1/2 h-1.5 bg-slate-900/10 rounded-full overflow-hidden">
                      <div style={{ width: `${(quizStep / quizQuestions.length) * 100}%` }} className="h-full bg-amber-400 rounded-full" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">{quizQuestions[quizStep - 1].q}</h3>

                  <div className="space-y-3">
                    {quizQuestions[quizStep - 1].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(option.score)}
                        className="w-full p-4 text-left text-xs md:text-sm bg-slate-900/5 border border-white/10 rounded-2xl hover:bg-slate-900/10 hover:border-amber-400 transition-all text-white font-medium flex justify-between items-center"
                      >
                        <span>{option.text}</span>
                        <ChevronRight className="h-4 w-4 text-amber-400" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 6: Results */}
              {quizStep > quizQuestions.length && (
                <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-2">{t("quiz.result_eyebrow")}</span>
                    <h3 className="text-xl font-bold text-white">{t("quiz.result_title")}</h3>
                  </div>

                  {/* Circular Score Gauge */}
                  <div className="relative h-32 w-32 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#fbbf24"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 * (1 - calculateHealthScore() / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-white">{calculateHealthScore()}</span>
                      <span className="text-[10px] font-bold text-amber-300">{t("quiz.out_of")}</span>
                    </div>
                  </div>

                  {/* Status Badge & Description */}
                  <div className={`p-4 rounded-2xl border text-left space-y-1.5 ${getHealthStatus(calculateHealthScore()).color}`}>
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      {t("quiz.status_prefix")}: {getHealthStatus(calculateHealthScore()).label}
                    </span>
                    <p className="text-[11px] leading-relaxed opacity-95">{getHealthStatus(calculateHealthScore()).desc}</p>
                  </div>

                  {/* Personalized next steps — tips for the weakest dimensions */}
                  {(() => {
                    const weak = TIP_DIMENSIONS.map((d) => ({ ...d, score: quizAnswers[d.idx] ?? 0 }))
                      .filter((d) => d.score < 20)
                      .sort((a, b) => a.score - b.score)
                      .slice(0, 3);
                    return (
                      <div className="space-y-2 text-left">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                          {t("quiz.tips_heading")}
                        </p>
                        {weak.length === 0 ? (
                          <p className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-[11px] leading-relaxed text-emerald-200 font-deva">
                            {t("quiz.tip_maintain")}
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {weak.map((d) => (
                              <li
                                key={d.key}
                                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/5 p-3"
                              >
                                <span className="text-[11px] leading-snug text-slate-200 font-deva">
                                  {t(`quiz.tip_${d.key}`)}
                                </span>
                                <Link
                                  href={d.href}
                                  className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-amber-400/15 px-3 py-1.5 text-[11px] font-bold text-amber-300 transition-colors hover:bg-amber-400/25 font-deva"
                                >
                                  {t(`quiz.tip_${d.key}_cta`)}
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })()}

                  <div className="flex space-x-3">
                    <button
                      onClick={resetQuiz}
                      className="flex-1 py-3 bg-slate-900/5 border border-white/10 hover:bg-slate-900/10 text-white rounded-full font-bold text-xs transition-all"
                    >
                      {t("quiz.retry")}
                    </button>
                    <button
                      onClick={() => {
                        scrollToSection("calculators");
                        setQuizStep(0);
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 rounded-full font-bold text-xs shadow-md shadow-amber-500/30 transition-all"
                    >
                      {t("quiz.plan_btn")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
