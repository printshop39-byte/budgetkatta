'use client';
// GadgetEMISection — the full Gadget & Lifestyle EMI experience: a category
// tab bar (Bike, Car, Mobile, Laptop, Camera, Gimbal/Accessories) driving a
// reusable EMI calculator and a per-category "Recommended Accessories" block.
//
// Everything is data-driven from lib/gadgetCategories — adding a category there
// makes a new tab appear automatically.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import {
  GADGET_CATEGORIES,
  getGadgetCategory,
  type GadgetCategoryId,
} from '@/lib/gadgetCategories';
import GadgetEMICalculator from '@/components/calculators/GadgetEMICalculator';
import RecommendedAccessories from '@/components/gadget/RecommendedAccessories';
import CalculatorDisclaimer from '@/components/shared/CalculatorDisclaimer';

export default function GadgetEMISection() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const [activeId, setActiveId] = useState<GadgetCategoryId>(GADGET_CATEGORIES[0].id);
  const active = getGadgetCategory(activeId);

  return (
    <div className="space-y-8">
      {/* Category tabs */}
      <div
        role="tablist"
        aria-label={t('gadget.category')}
        className="flex flex-wrap justify-center gap-2"
      >
        {GADGET_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const selected = cat.id === activeId;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(cat.id)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all font-deva ${
                selected
                  ? 'border-bk-gold/50 bg-bk-gold/10 text-bk-gold shadow-[0_0_18px_rgba(251,191,36,0.18)]'
                  : 'border-slate-800 text-slate-400 hover:border-bk-gold/30 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.label[language]}
            </button>
          );
        })}
      </div>

      {/* Active category tagline */}
      <motion.p
        key={active.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex max-w-2xl items-start justify-center gap-2 rounded-2xl border border-bk-gold/15 bg-bk-gold/5 px-4 py-2.5 text-center text-sm text-slate-400 font-deva"
      >
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-bk-gold" /> {active.tagline[language]}
      </motion.p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Calculator */}
        <div className="lg:col-span-2">
          <GadgetEMICalculator
            defaults={active.defaults}
            ranges={active.ranges}
            resetKey={active.id}
            sourcePage={`GADGET_EMI_${active.id.toUpperCase()}`}
          />
          <CalculatorDisclaimer />
        </div>

        {/* Recommended accessories */}
        <div className="lg:col-span-3">
          <RecommendedAccessories accessories={active.accessories} />
        </div>
      </div>
    </div>
  );
}
