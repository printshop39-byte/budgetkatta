"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown as AccordionIcon } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { getTranslation } from "@/lib/i18n";

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const language = useLanguageStore((s) => s.language);
  const t = getTranslation(language);

  const faqs = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
    q: t(`faq.q${i}`),
    a: t(`faq.a${i}`),
  }));

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto border-t border-slate-800">
      <div className="text-center mb-12">
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-widest">{t("faq.eyebrow")}</span>
        <h2 className="text-3xl font-extrabold text-slate-100 mt-4 tracking-normal leading-[1.4]">{t("faq.title")}</h2>
      </div>

      {/* Accordion Cards */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-sm md:text-base font-bold text-slate-200 pr-4">{faq.q}</span>
              <motion.span
                animate={{ rotate: openFaq === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="p-1 bg-slate-800 rounded-lg text-amber-300 flex-shrink-0"
              >
                <AccordionIcon className="h-4.5 w-4.5" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {openFaq === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-slate-400 leading-relaxed border-t border-slate-800 font-medium">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
