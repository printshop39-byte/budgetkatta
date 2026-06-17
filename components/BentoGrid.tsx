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
      accent: "from-amber-500/10 to-yellow-500/5 hover:border-amber-400/60 text-amber-300",
      badge: "१२-१५% सरासरी परतावा",
      icon: <TrendingUp className="h-7 w-7 text-amber-400" />,
      stat: "₹५०० पासून सुरुवात",
    },
    {
      id: "fd",
      title: "मुदत ठेव (FD) कट्टा",
      desc: "बँक किंवा पोस्ट ऑफिसमधील मुदत ठेव गुंतवणुकीवर मिळणारे हमखास व्याज आणि मॅच्युरिटी रक्कम एका क्लिकवर अचूक मोजा.",
      accent: "from-yellow-500/10 to-amber-500/5 hover:border-yellow-400/60 text-yellow-300",
      badge: "७.८% पर्यंत व्याजदर",
      icon: <Landmark className="h-7 w-7 text-yellow-400" />,
      stat: "हमीभाव परतावा",
    },
    {
      id: "emi",
      title: "कर्ज हप्ता (EMI) कट्टा",
      desc: "गृहकर्ज, वाहन कर्ज किंवा वैयक्तिक कर्ज घेण्यापूर्वी त्याचा मासिक हप्ता (EMI) आणि एकूण द्यावे लागणारे व्याज सहज तपासा.",
      accent: "from-blue-500/10 to-sky-500/5 hover:border-blue-400/60 text-blue-300",
      badge: "अचूक हप्ता विभागणी",
      icon: <PieChart className="h-7 w-7 text-blue-400" />,
      stat: "व्याज दर तुलना",
    },
    {
      id: "insurance",
      title: "विमा सल्ला कट्टा",
      desc: "तुमच्या पश्यात कुटुंबाला सुरक्षित ठेवण्यासाठी योग्य टर्म इन्शुरन्स कव्हर आणि वाढत्या खर्चात आरोग्याचे संरक्षण करण्यासाठी आरोग्य विमा निवडा.",
      accent: "from-rose-500/10 to-red-500/5 hover:border-rose-400/60 text-rose-300",
      badge: "कुटुंब सुरक्षा नियोजन",
      icon: <ShieldCheck className="h-7 w-7 text-rose-400" />,
      stat: "१५ पट उत्पन्न संरक्षण",
    },
  ];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-800">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-normal leading-[1.4]">आमची प्रमुख डिजिटल साधने</h2>
        <p className="text-slate-400 mt-3 text-base">
          तुमच्या विविध आर्थिक गरजांचे विश्लेषण करण्यासाठी खालीलपैकी कोणत्याही कट्ट्यावर क्लिक करा.
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
