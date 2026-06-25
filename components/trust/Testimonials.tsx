'use client';
// Testimonials — social-proof cards from real (or, until replaced, sample) users.
// Bilingual via languageStore. Sample entries carry a small "उदाहरण / sample" tag
// so placeholder content is never passed off as a verified review.
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { testimonials } from '@/lib/testimonials';

export default function Testimonials({ className = '' }: { className?: string }) {
  const { language } = useLanguageStore();
  const mr = language === 'mr';

  if (testimonials.length === 0) return null;

  return (
    <section
      className={`mx-auto max-w-6xl px-4 py-12 ${className}`}
      aria-label={mr ? 'वापरकर्त्यांचे अनुभव' : 'User stories'}
    >
      <div className="mb-7 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-300 font-deva">
          {mr ? 'वापरकर्त्यांचे अनुभव' : 'User Stories'}
        </span>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-100 md:text-3xl font-deva">
          {mr ? 'लोक BudgetKatta बद्दल काय म्हणतात' : 'What people say about BudgetKatta'}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {testimonials.map((tm, i) => (
          <motion.figure
            key={tm.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card flex h-full flex-col gap-3 p-5"
          >
            <div className="flex items-center justify-between">
              <Quote className="h-6 w-6 text-amber-400/70" />
              <div className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <blockquote className="flex-1 text-sm leading-relaxed text-slate-200 font-deva">
              “{tm.quote[language]}”
            </blockquote>

            <figcaption className="flex items-center gap-3 border-t border-white/10 pt-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-sm font-bold text-amber-300">
                {tm.name.charAt(0)}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-slate-100 font-deva">{tm.name}</span>
                <span className="block text-xs text-slate-400 font-deva">
                  {tm.role[language]} · {tm.location[language]}
                </span>
              </span>
              {tm.sample && (
                <span className="ml-auto shrink-0 rounded-full border border-slate-600 bg-slate-800/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-400 font-deva">
                  {mr ? 'उदाहरण' : 'sample'}
                </span>
              )}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
