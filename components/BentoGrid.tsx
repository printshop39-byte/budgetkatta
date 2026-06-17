"use client";

import { motion } from "framer-motion";
import { TrendingUp, Landmark, PieChart, ShieldCheck, ArrowRight } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import { useCalculatorStore, type CalculatorType } from "@/store/calculatorStore";

export default function BentoGrid() {
  const setActiveTab = useCalculatorStore((s) => s.setActiveTab);

  const cards = [
    {
      id: "sip",
      title: "म्युच्युअल फंड (SIP) कट्टा",
      desc: "चक्रवाढ व्याजाची (Power of Compounding) जादू पहा. दरमहा छोटी बचत करून करोडपती होण्याचे स्वप्न कसे पूर्ण करायचे ते मोजा.",
      accent: "from-emerald-500/10 to-teal-500/5 hover:border-emerald-200/80 text-emerald-700",
      badge: "१२-१५% सरासरी परतावा",
      icon: <TrendingUp className="h-7 w-7 text-emerald-600" />,
      stat: "₹५०० पासून सुरुवात",
    },
    {
      id: "fd",
      title: "मुदत ठेव (FD) कट्टा",
      desc: "बँक किंवा पोस्ट ऑफिसमधील मुदत ठेव गुंतवणुकीवर मिळणारे हमखास व्याज आणि मॅच्युरिटी रक्कम एका क्लिकवर अचूक मोजा.",
      accent: "from-amber-500/10 to-yellow-500/5 hover:border-amber-200/80 text-amber-700",
      badge: "७.८% पर्यंत व्याजदर",
      icon: <Landmark className="h-7 w-7 text-amber-600" />,
      stat: "हमीभाव परतावा",
    },
    {
      id: "emi",
      title: "कर्ज हप्ता (EMI) कट्टा",
      desc: "गृहकर्ज, वाहन कर्ज किंवा वैयक्तिक कर्ज घेण्यापूर्वी त्याचा मासिक हप्ता (EMI) आणि एकूण द्यावे लागणारे व्याज सहज तपासा.",
      accent: "from-blue-500/10 to-sky-500/5 hover:border-blue-200/80 text-blue-700",
      badge: "अचूक हप्ता विभागणी",
      icon: <PieChart className="h-7 w-7 text-blue-600" />,
      stat: "व्याज दर तुलना",
    },
    {
      id: "insurance",
      title: "विमा सल्ला कट्टा",
      desc: "तुमच्या पश्यात कुटुंबाला सुरक्षित ठेवण्यासाठी योग्य टर्म इन्शुरन्स कव्हर आणि वाढत्या खर्चात आरोग्याचे संरक्षण करण्यासाठी आरोग्य विमा निवडा.",
      accent: "from-rose-500/10 to-red-500/5 hover:border-rose-200/80 text-rose-700",
      badge: "कुटुंब सुरक्षा नियोजन",
      icon: <ShieldCheck className="h-7 w-7 text-rose-600" />,
      stat: "१५ पट उत्पन्न संरक्षण",
    },
  ];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-100">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">आमची प्रमुख डिजिटल साधने</h2>
        <p className="text-slate-600 mt-3 text-base">
          तुमच्या विविध आर्थिक गरजांचे विश्लेषण करण्यासाठी खालीलपैकी कोणत्याही कट्ट्यावर क्लिक करा.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 100 }}
            onClick={() => {
              setActiveTab(card.id as CalculatorType);
              scrollToSection("calculators");
            }}
            className={`relative bg-gradient-to-br ${card.accent} p-7 rounded-[28px] border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-[0_15px_35px_rgba(0,0,0,0.05)] transition-all group flex flex-col justify-between`}
          >
            <div>
              {/* Header of Bento Card */}
              <div className="flex justify-between items-start mb-6">
                <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-white/80 rounded-full border border-slate-200/60">
                  {card.badge}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-800 mb-2.5 tracking-tight">{card.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200/30">
              <span className="text-xs font-semibold text-slate-400">{card.stat}</span>
              <span className="flex h-7 w-7 rounded-full bg-white items-center justify-center shadow-sm text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
