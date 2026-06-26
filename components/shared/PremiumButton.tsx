"use client";
// PremiumButton — Apple-style CTA with a hardware-accelerated diagonal gloss
// that glides left→right on hover, plus a tactile spring scale-down on click.
// Uses Framer Motion (already a dependency). Brand-orange by default.
import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type Variant = "primary" | "ghost";

type Props = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  className?: string;
  children?: ReactNode;
};

const BASE =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-bold transition-colors duration-300 will-change-transform";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/25 hover:bg-[#ff7d1f]",
  ghost:
    "border border-slate-300 bg-white/70 text-slate-700 hover:border-[#FF6B00]/50 hover:text-[#FF6B00] dark:border-slate-700 dark:bg-white/5 dark:text-slate-200",
};

export default function PremiumButton({ children, variant = "primary", className = "", ...props }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {/* Diagonal metallic gloss — translated off-screen, glides across on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[150%]"
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
