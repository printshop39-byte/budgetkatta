"use client";

import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, Wallet, BookOpen } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import { useCalculatorStore } from "@/store/calculatorStore";

export default function EducationHub() {
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);

  const articles = [
    {
      title: "चक्रवाढ व्याजाची जादू (Power of Compounding)",
      desc: "अल्बर्ट आइनस्टाईन यांनी चक्रवाढ व्याजाला जगातील 'आठवे आश्चर्य' म्हटले होते. जितक्या लवकर तुम्ही गुंतवणूक सुरू कराल, तितकाच तुमचा परतावा महाकाय वेगाने वाढेल.",
      icon: <Sparkles className="h-6 w-6 text-amber-400" />,
      color: "border-amber-400/30 bg-amber-500/5 text-amber-200",
      btnColor: "text-amber-300 hover:bg-amber-500/15",
    },
    {
      title: "महागाईचा राक्षस (Inflation Demon)",
      desc: "बँकेच्या बचत खात्यात पडलेले तुमचे पैसे दरवर्षी महागाईमुळे (सहसा ५-६%) मूल्य गमावत असतात. त्यावर मात करण्यासाठी तुम्हाला महागाईपेक्षा जास्त परतावा देणाऱ्या पर्यायात गुंतवणूक करणे गरजेचे आहे.",
      icon: <AlertTriangle className="h-6 w-6 text-rose-400" />,
      color: "border-rose-400/30 bg-rose-500/5 text-rose-200",
      btnColor: "text-rose-300 hover:bg-rose-500/15",
    },
    {
      title: "आणीबाणीचा निधी (Emergency Fund)",
      desc: "कोणतीही गुंतवणूक सुरू करण्यापूर्वी, तुमच्या ६ महिन्यांच्या घरखर्चाइतकी रक्कम बँकेच्या बचत खात्यात बाजूला ठेवावी. यामुळे अनपेक्षित संकटसमयी कर्ज घेण्याची वेळ येत জরিমানা.",
      icon: <Wallet className="h-6 w-6 text-yellow-400" />,
      color: "border-yellow-400/30 bg-yellow-500/5 text-yellow-200",
      btnColor: "text-yellow-300 hover:bg-yellow-500/15",
    },
    {
      title: "गुंतवणुकीचा 'नियम ७२' (Rule of 72)",
      desc: "तुमचे पैसे किती वर्षांत दुप्पट होतील हे शोधण्याची सोपी पद्धत म्हणजे ७२ ला तुमच्या वार्षिक व्याजदराने भागा. उदा. जर व्याजदर ९% असेल, तर ७२/९ = ८ वर्षात पैसे दुप्पट होतील.",
      icon: <BookOpen className="h-6 w-6 text-blue-400" />,
      color: "border-blue-400/30 bg-blue-500/5 text-blue-200",
      btnColor: "text-blue-300 hover:bg-blue-500/15",
    },
  ];

  return (
    <section id="literacy" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-widest">आर्थिक साक्षरता</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 mt-4 tracking-tight">चला पैशांची भाषा शिकूया!</h2>
        <p className="text-slate-400 mt-3 text-base">
          आर्थिक यश मिळवण्यासाठी योग्य आर्थिक संकल्पना समजून घेणे अत्यंत महत्त्वाचे आहे.
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
              <h3 className="text-lg font-bold text-slate-100 mb-3 tracking-tight leading-snug">{item.title}</h3>
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
                नियोजनासाठी कॅल्क्युलेटर वापरा
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
