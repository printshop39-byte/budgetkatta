"use client";
// LifestyleGoalVisual — gamified "what your investment becomes" indicator.
// As the monthly amount grows, the asset upgrades scooter → car → villa with
// an ultra-smooth Framer Motion scale-and-fade (AnimatePresence). Gives users
// a real-life feel for their SIP. Framer Motion only (already a dependency).
import { AnimatePresence, motion } from "framer-motion";
import { Bike, Car, Home, type LucideIcon } from "lucide-react";

type Tier = { key: string; Icon: LucideIcon; mr: string; en: string };

function tierFor(monthly: number): Tier {
  if (monthly < 5000) return { key: "bike", Icon: Bike, mr: "स्कूटर / दुचाकीचे स्वप्न", en: "Scooter / two-wheeler" };
  if (monthly < 25000) return { key: "car", Icon: Car, mr: "स्वतःची कार", en: "Your own car" };
  return { key: "villa", Icon: Home, mr: "स्वप्नातील घर", en: "Dream home" };
}

export default function LifestyleGoalVisual({ monthly, en = false, dark = false }: { monthly: number; en?: boolean; dark?: boolean }) {
  const tier = tierFor(monthly);
  const Icon = tier.Icon;

  return (
    <div
      className="flex items-center gap-3 rounded-2xl p-3"
      style={dark ? { background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.20)" } : { background: "#FFF7ED", border: "1px solid #FED7AA" }}
    >
      <div className="relative h-12 w-12 shrink-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={tier.key}
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#FFB37A] to-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/30"
          >
            <Icon className="h-6 w-6" strokeWidth={2} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: dark ? "#FDBA74" : "#9A3412" }}>
          {en ? "Your goal" : "तुमचे ध्येय"}
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={tier.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="truncate text-sm font-bold font-deva"
            style={{ color: dark ? "#FB923C" : "#C2410C" }}
          >
            {en ? tier.en : tier.mr}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
