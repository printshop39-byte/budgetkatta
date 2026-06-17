"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronRight, Star } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

const quizQuestions = [
  {
    q: "तुमच्या उत्पन्नातून तुम्ही दरमहा किती टक्के बचत करता?",
    options: [
      { text: "१०% पेक्षा कमी", score: 10 },
      { text: "१०% ते २०%", score: 20 },
      { text: "२०% ते ३०%", score: 30 },
      { text: "३०% पेक्षा जास्त", score: 40 },
    ],
  },
  {
    q: "तुमच्याकडे किती महिन्यांचा आणीबाणीचा निधी (Emergency Fund) उपलब्ध आहे?",
    options: [
      { text: "काहीच नाही", score: 0 },
      { text: "१ ते २ महिन्यांचा", score: 15 },
      { text: "३ ते ५ महिन्यांचा", score: 30 },
      { text: "६ महिने किंवा त्यापेक्षा जास्त", score: 40 },
    ],
  },
  {
    q: "तुम्ही तुमच्या आयुष्याचा (Term Insurance) आणि आरोग्याचा (Health Insurance) विमा उतरवला आहे का?",
    options: [
      { text: "दोन्हीही नाही", score: 0 },
      { text: "फक्त आरोग्य विमा आहे", score: 15 },
      { text: "फक्त टर्म विमा आहे", score: 15 },
      { text: "होय, दोन्ही योग्य कव्हरसह उपलब्ध आहेत", score: 40 },
    ],
  },
  {
    q: "तुमच्या एकूण उत्पन्नाच्या तुलनेत तुमचा कर्ज हप्ता (EMI) किती आहे?",
    options: [
      { text: "माझ्यावर कोणतेही कर्ज नाही", score: 40 },
      { text: "उत्पन्नाच्या ३०% पेक्षा कमी", score: 30 },
      { text: "उत्पन्नाच्या ३०% ते ५०%", score: 15 },
      { text: "उत्पन्नाच्या ५०% पेक्षा जास्त (चिंतेची बाब)", score: 5 },
    ],
  },
  {
    q: "गुंतवणुकीबद्दल तुमचे ज्ञान आणि नियोजन कसे आहे?",
    options: [
      { text: "मी फक्त बँकेत किंवा सुरक्षित ठिकाणी पैसे ठेवतो", score: 15 },
      { text: "मी म्युच्युअल फंड आणि शेअर्समध्ये नियमित गुंतवणूक करतो", score: 40 },
      { text: "नुकतीच सुरुवात केली आहे, अजून खूप शिकायचे आहे", score: 25 },
      { text: "गुंतवणूक करत नाही, सर्व पैसे खर्च होतात", score: 5 },
    ],
  },
];

export default function FinancialHealthQuiz() {
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);

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
    if (score >= 85) return { label: "उत्कृष्ट (Excellent)", color: "text-amber-300 bg-amber-500/10 border-amber-400/30", desc: "तुमचे आर्थिक नियोजन अत्यंत उत्कृष्ट आहे! तुम्ही आर्थिक स्वातंत्र्याच्या (Financial Freedom) अगदी जवळ आहात. अशीच शिस्त कायम ठेवा." };
    if (score >= 60) return { label: "चांगले (Good)", color: "text-amber-300 bg-amber-500/10 border-amber-400/30", desc: "तुमची आर्थिक स्थिती चांगली आहे, पण अजून काही गोष्टींमध्ये सुधारणा होऊ शकते. जसे की आणीबाणीचा निधी वाढवणे किंवा विम्याचे योग्य नियोजन करणे." };
    if (score >= 40) return { label: "मध्यम (Average)", color: "text-yellow-300 bg-yellow-500/10 border-yellow-400/30", desc: "तुमच्या नियोजनात काही त्रुटी आहेत. मासिक खर्च नियंत्रित करणे आणि बचतीचे प्रमाण वाढवून योग्य ठिकाणी गुंतवणूक करणे गरजेचे आहे." };
    return { label: "धोकादायक (Needs Attention)", color: "text-rose-300 bg-rose-500/10 border-rose-400/30", desc: "तुमचे आर्थिक नियोजन अत्यंत चिंताजनक आहे. कर्ज कमी करणे, तातडीने आणीबाणीचा निधी तयार करणे आणि वायफळ खर्च रोखणे तुमच्यासाठी गरजेचे आहे." };
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
              आरोग्य तपासणी
            </span>
            <h2 className="text-3xl/[1.4] md:text-4xl/[1.4] font-extrabold tracking-normal">
              तुमचे आर्थिक आरोग्य (Financial Health) मोजा!
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              फक्त ५ सोप्या प्रश्नांची उत्तरे द्या आणि मिळवा तुमचा आर्थिक आरोग्य स्कोअर. हे तुम्हाला समजण्यास मदत करेल की तुम्ही योग्य दिशेने जात आहात की नाही!
            </p>

            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              </div>
              <span className="text-xs text-slate-400">१०,०००+ हून अधिक लोकांनी चाचणी घेतली आहे</span>
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
                    <h3 className="text-xl font-bold">आर्थिक आरोग्य स्कोअर मिळवा</h3>
                    <p className="text-xs text-slate-400 mt-1">सर्व उत्तरे गोपनीय ठेवण्यात येतील</p>
                  </div>
                  <button
                    onClick={() => setQuizStep(1)}
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/30 transition-all transform hover:scale-102"
                  >
                    चाचणी सुरू करा
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
                    <span className="text-[10px] font-bold text-amber-300 uppercase">प्रश्न {quizStep} पैकी {quizQuestions.length}</span>
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
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-2">चाचणीचा निकाल</span>
                    <h3 className="text-xl font-bold text-white">तुमचा आर्थिक आरोग्य स्कोअर</h3>
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
                      <span className="text-[10px] font-bold text-amber-300">१०० पैकी</span>
                    </div>
                  </div>

                  {/* Status Badge & Description */}
                  <div className={`p-4 rounded-2xl border text-left space-y-1.5 ${getHealthStatus(calculateHealthScore()).color}`}>
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      आर्थिक स्थिती: {getHealthStatus(calculateHealthScore()).label}
                    </span>
                    <p className="text-[11px] leading-relaxed opacity-95">{getHealthStatus(calculateHealthScore()).desc}</p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={resetQuiz}
                      className="flex-1 py-3 bg-slate-900/5 border border-white/10 hover:bg-slate-900/10 text-white rounded-full font-bold text-xs transition-all"
                    >
                      पुन्हा चाचणी द्या
                    </button>
                    <button
                      onClick={() => {
                        scrollToSection("calculators");
                        setQuizStep(0);
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 rounded-full font-bold text-xs shadow-md shadow-amber-500/30 transition-all"
                    >
                      नियोजन सुरू करा
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
