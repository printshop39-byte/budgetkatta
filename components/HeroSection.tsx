"use client";

import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Check, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { scrollToSection } from "@/lib/scroll";

export default function HeroSection() {
  return (
    <section id="home" className="pt-8 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, delay: 0.1 }}
          className="lg:col-span-7 space-y-8"
        >
          {/* Soft Premium Pill Tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-slate-900/70 backdrop-blur-md border border-amber-400/20 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-300 tracking-wide">
              ✨ महाराष्ट्राचे लाडके आर्थिक व्यासपीठ
            </span>
          </div>

          {/* Beautiful Headline in Marathi with gradient */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.25]">
            तुमच्या पैशांसाठी{" "}
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 pb-2">
              सोपी, पारदर्शक आणि स्मार्ट
            </span>{" "}
            माहिती!
          </h1>

          <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-normal max-w-2xl">
            बजेटकट्टा सोबत मिळवा मुदत ठेव (FD), म्युच्युअल फंड (SIP), कर्ज (EMI) आणि विम्याचे अचूक मार्गदर्शन. आर्थिकदृष्ट्या सक्षम बना, मराठीत अगदी सोप्या भाषेत!
          </p>

          {/* Features Bullet Points with Glass Styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {[
              "१००% विनामूल्य व कोणतीही छुप्या फी नाही",
              "फक्त एका क्लिकवर अचूक आकडेमोड",
              "५०/३०/२० बजेटिंगचा सोपा सल्लागार",
              "वैयक्तिक आर्थिक ध्येयांचे अचूक नियोजन",
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-slate-300 bg-slate-900/40 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-slate-800">
                <div className="h-5 w-5 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-400/30">
                  <Check className="h-3 w-3 text-amber-400" />
                </div>
                <span className="text-sm font-medium">{bullet}</span>
              </div>
            ))}
          </div>

          {/* CTA Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <motion.button
              onClick={() => scrollToSection("calculators")}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.55)] transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>आत्ताच मोजा</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </motion.button>

            <motion.button
              onClick={() => scrollToSection("health-quiz")}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group px-8 py-4 rounded-full bg-slate-900/70 backdrop-blur-md border border-slate-800 text-slate-300 font-semibold text-base hover:bg-slate-900 hover:border-amber-400/50 hover:text-amber-300 hover:shadow-[0_0_22px_rgba(251,191,36,0.25)] transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Activity className="h-5 w-5 text-amber-400 transition-all duration-300 group-hover:drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]" />
              <span>आरोग्य स्कोअर तपासा</span>
            </motion.button>
          </div>

          {/* Micro-Social Proof */}
          <div className="pt-6 flex items-center space-x-6">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80",
              ].map((avatar, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" />
              ))}
            </div>
            <div className="text-sm">
              <p className="font-bold text-slate-200">५०,०००+ मराठी बांधव</p>
              <p className="text-slate-400 text-xs">बजेटकट्टाचा दरमहा वापर करत आहेत</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Premium 3D-like Dashboard Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 60, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          {/* Outer Glowing Rings */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 to-yellow-500/10 rounded-[40px] filter blur-3xl -z-10" />

          {/* Core Interactive Floating 3D Widget Container */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            whileHover={{ rotateY: 12, rotateX: -6, scale: 1.03, transition: { duration: 0.3 } }}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            className="relative bg-slate-900/75 backdrop-blur-2xl border border-slate-800 p-8 rounded-[36px] shadow-[0_20px_50px_rgba(251,191,36,0.08)] cursor-pointer overflow-hidden group"
          >
            {/* Card Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Portfolio</span>
              </div>
              <div className="px-2.5 py-1 bg-amber-500/10 rounded-full text-[10px] font-bold text-amber-300 flex items-center space-x-1 border border-amber-400/30">
                <TrendingUp className="h-3 w-3" />
                <span>+२४.८% वार्षिक</span>
              </div>
            </div>

            {/* Balance & SVG Chart Area */}
            <div className="space-y-1 mb-8">
              <span className="text-xs text-slate-400 font-medium">एकूण अंदाजे संपत्ती (१० वर्षानंतर)</span>
              <div className="text-3xl font-extrabold text-slate-50 tracking-tight">{formatCurrency(1840938)}</div>
              <p className="text-xs text-slate-400 font-medium">दरमहा ₹१०,००० च्या बचतीची ताकद</p>
            </div>

            {/* Dynamic SVG Sparkline Graph */}
            <div className="w-full h-32 relative mb-6">
              <svg className="w-full h-full" viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(30, 41, 59, 0.8)" strokeWidth="1" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(30, 41, 59, 0.8)" strokeWidth="1" />
                <line x1="0" y1="90" x2="300" y2="90" stroke="rgba(30, 41, 59, 0.8)" strokeWidth="1" />
                <path
                  d="M 0 120 C 30 110, 60 90, 90 85 C 120 80, 150 50, 180 40 C 210 30, 240 15, 300 5 L 300 120 L 0 120 Z"
                  fill="url(#sparkline-grad)"
                  opacity="0.3"
                />
                <path
                  d="M 0 120 C 30 110, 60 90, 90 85 C 120 80, 150 50, 180 40 C 210 30, 240 15, 300 5"
                  stroke="url(#sparkline-stroke)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="180" cy="40" r="5" fill="#fbbf24" stroke="#0f172a" strokeWidth="2.5" />
                <circle cx="300" cy="5" r="6" fill="#eab308" stroke="#0f172a" strokeWidth="2.5" />
                <defs>
                  <linearGradient id="sparkline-grad" x1="150" y1="0" x2="150" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="sparkline-stroke" x1="0" y1="60" x2="300" y2="60" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#eab308" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Micro badge inside graph */}
              <div className="absolute top-1/3 left-[62%] -translate-x-1/2 bg-slate-950/90 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-lg shadow-md flex items-center space-x-1 border border-amber-400/30">
                <span>५ वर्ष: ₹७.८ लाख</span>
              </div>
            </div>

            {/* Bottom Quick Breakdown */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">गुंतवलेली रक्कम</span>
                <span className="text-sm font-bold text-slate-300">{formatCurrency(1200000)}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">मिळालेला परतावा</span>
                <span className="text-sm font-bold text-amber-400 flex items-center space-x-0.5">
                  <span>{formatCurrency(640938)}</span>
                </span>
              </div>
            </div>

            {/* Floating Element 1: Golden 3D Coin */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 15, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
              style={{ transform: "translateZ(30px)" }}
              className="absolute top-12 right-10 h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center shadow-[0_10px_25px_rgba(245,158,11,0.5)] border border-amber-300"
            >
              <span className="font-extrabold text-amber-900 text-sm">₹</span>
            </motion.div>

            {/* Floating Element 2: Small Dark Premium Card */}
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1.2 }}
              style={{ transform: "translateZ(40px)" }}
              className="absolute bottom-28 left-[-15px] bg-slate-950 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800/80 w-36 hidden sm:block"
            >
              <div className="flex justify-between items-center mb-2.5">
                <div className="h-4 w-6 bg-slate-700 rounded-sm" />
                <span className="text-[9px] font-bold text-slate-400">BudgetKatta</span>
              </div>
              <div className="text-xs font-mono tracking-widest text-slate-300">•••• 4820</div>
              <div className="text-[9px] text-amber-400 font-semibold mt-1">Platinum Member</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
