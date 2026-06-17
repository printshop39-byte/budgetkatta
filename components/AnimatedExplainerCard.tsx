'use client';
// AnimatedExplainerCard — lightweight, animated 3-step explainer.
// • CSS/Framer-Motion animated icon by default (no heavy video).
// • Architecture is Spline/Lottie-ready: pass `visual` to override the default
//   animated icon with a lazy-loaded 3D/Lottie node when desired.
// • Mobile-light: animation is CSS-driven and respects prefers-reduced-motion.

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import type { Explainer } from '@/lib/explainers';

export default function AnimatedExplainerCard({
  explainer,
  visual,
}: {
  explainer: Explainer;
  visual?: ReactNode;
}) {
  const { language } = useLanguageStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card flex h-full flex-col gap-4 p-5"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-bk-gold/20 to-bk-card">
          <span className="pointer-events-none absolute h-8 w-8 rounded-full bg-bk-gold/20 blur-md animate-pulse-gold" />
          {visual ?? <span className="relative text-2xl animate-float">{explainer.icon}</span>}
        </div>
        <h3 className="font-display text-base font-bold text-slate-800 font-deva">
          {explainer.title[language]}
        </h3>
      </div>

      <ol className="space-y-2.5">
        {explainer.steps.map((step, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-bk-gold/15 text-xs font-bold text-bk-gold">
              {i + 1}
            </span>
            <span className="text-sm text-slate-600 font-deva">{step[language]}</span>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}
