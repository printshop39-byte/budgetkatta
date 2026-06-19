'use client';
// GadgetEMICalculator — reusable EMI calculator for the Gadget & Lifestyle
// section. Takes Item Price, Down Payment and Interest Rate (plus a tenure
// slider, required for the EMI maths). It is category-agnostic: pass defaults
// and slider ranges, and it self-contains state, validation and results.
//
// Financed amount = Item Price − Down Payment. Reuses the shared calculateEMI
// helper so the maths stays consistent with the loan EMI calculator.
import { useMemo, useState } from 'react';
import { calculateEMI, formatINR } from '@/lib/calculators';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import InterestButton from '@/components/lead/InterestButton';
import type { NumberRange } from '@/lib/gadgetCategories';

interface Props {
  defaults: { price: number; downPayment: number; rate: number; tenureMonths: number };
  ranges: { price: NumberRange; rate: NumberRange; tenure: NumberRange };
  /** Source page tag passed to the lead form for analytics. */
  sourcePage?: string;
  /** Reset internal state when this changes (e.g. switching category). */
  resetKey?: string;
}

export default function GadgetEMICalculator({
  defaults,
  ranges,
  sourcePage = 'GADGET_EMI',
  resetKey,
}: Props) {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  const [price, setPrice] = useState(defaults.price);
  const [downPayment, setDownPayment] = useState(defaults.downPayment);
  const [rate, setRate] = useState(defaults.rate);
  const [tenure, setTenure] = useState(defaults.tenureMonths);

  // Reset to the category's defaults whenever the active category changes.
  // Tracked via resetKey so the component can stay mounted across tabs.
  const [lastKey, setLastKey] = useState(resetKey);
  if (resetKey !== lastKey) {
    setLastKey(resetKey);
    setPrice(defaults.price);
    setDownPayment(defaults.downPayment);
    setRate(defaults.rate);
    setTenure(defaults.tenureMonths);
  }

  // Down payment can never exceed the item price.
  const cappedDown = Math.min(downPayment, price);
  const financed = Math.max(price - cappedDown, 0);

  const result = useMemo(() => {
    if (financed <= 0) return { emi: 0, totalInterest: 0, totalAmount: 0 };
    return calculateEMI(financed, rate, tenure);
  }, [financed, rate, tenure]);

  return (
    <div className="glass-card glass-card-gold space-y-5 p-6">
      <h3 className="font-display text-xl font-bold text-slate-100 font-deva">
        {t('gadget.calc_title')}
      </h3>

      <div className="space-y-4">
        {/* Item Price */}
        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-slate-400 font-deva">{t('gadget.price')}</label>
            <span className="text-sm font-bold text-bk-gold">{formatINR(price)}</span>
          </div>
          <input
            type="range"
            min={ranges.price.min}
            max={ranges.price.max}
            step={ranges.price.step}
            value={price}
            onChange={(e) => setPrice(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>

        {/* Down Payment */}
        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-slate-400 font-deva">{t('gadget.down_payment')}</label>
            <span className="text-sm font-bold text-bk-gold">{formatINR(cappedDown)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={price}
            step={ranges.price.step}
            value={cappedDown}
            onChange={(e) => setDownPayment(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>

        {/* Interest Rate */}
        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-slate-400 font-deva">{t('gadget.rate')}</label>
            <span className="text-sm font-bold text-bk-gold">{rate}%</span>
          </div>
          <input
            type="range"
            min={ranges.rate.min}
            max={ranges.rate.max}
            step={ranges.rate.step}
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>

        {/* Tenure (months) */}
        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-slate-400 font-deva">{t('gadget.tenure')}</label>
            <span className="text-sm font-bold text-bk-gold">
              {tenure} {t('gadget.months')}
            </span>
          </div>
          <input
            type="range"
            min={ranges.tenure.min}
            max={ranges.tenure.max}
            step={ranges.tenure.step}
            value={tenure}
            onChange={(e) => setTenure(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>
      </div>

      {/* Financed amount summary */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5">
        <span className="text-xs text-slate-400 font-deva">{t('gadget.financed')}</span>
        <span className="text-sm font-bold text-slate-100">{formatINR(financed)}</span>
      </div>

      {/* Results — always live, no calculate button needed */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t('gadget.monthly_emi'), value: formatINR(result.emi) },
          { label: t('gadget.total_interest'), value: formatINR(result.totalInterest) },
          { label: t('gadget.total_amount'), value: formatINR(result.totalAmount) },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-slate-800/60 p-3 text-center">
            <p className="text-base font-bold text-bk-gold">{item.value}</p>
            <p className="mt-1 text-xs text-slate-400 font-deva">{item.label}</p>
          </div>
        ))}
      </div>

      <InterestButton module="LOAN" product={t('gadget.calc_title')} sourcePage={sourcePage} full />
    </div>
  );
}
