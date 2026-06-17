'use client';
import { useState } from 'react';
import { calculateFDMaturity, formatINR } from '@/lib/calculators';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import InterestButton from '@/components/lead/InterestButton';

export default function FDCalculator() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [senior, setSenior] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof calculateFDMaturity> | null>(null);

  function handleCalculate() {
    setResult(calculateFDMaturity(amount, rate, years, senior));
  }

  return (
    <div className="glass-card glass-card-gold space-y-5 p-6">
      <h3 className="font-display text-xl font-bold text-white">{t('fd.calc_title')}</h3>

      <div className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-white/70 font-deva">{t('fd.amount')}</label>
            <span className="text-sm font-bold text-bk-gold">{formatINR(amount)}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={5000000}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>

        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-white/70 font-deva">{t('fd.rate')}</label>
            <span className="text-sm font-bold text-bk-gold">{rate}%</span>
          </div>
          <input
            type="range"
            min={3}
            max={12}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>

        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-white/70 font-deva">{t('fd.tenure')}</label>
            <span className="text-sm font-bold text-bk-gold">{years}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={years}
            onChange={(e) => setYears(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-white/70 font-deva">
          <input
            type="checkbox"
            checked={senior}
            onChange={(e) => setSenior(e.target.checked)}
            className="h-4 w-4 accent-bk-gold"
          />
          {t('fd.senior_toggle')}
        </label>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full rounded-xl bg-bk-gold py-3 font-bold text-bk-dark transition-colors hover:bg-bk-gold-light font-deva"
      >
        {t('fd.calculate')}
      </button>

      {result && (
        <div className="grid grid-cols-2 gap-3 pt-2">
          {[
            { label: t('fd.maturity'), value: formatINR(result.maturityAmount) },
            { label: t('fd.interest_earned'), value: formatINR(result.totalInterest) },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white/5 p-3 text-center">
              <p className="text-lg font-bold text-bk-gold">{item.value}</p>
              <p className="mt-1 text-xs text-white/60 font-deva">{item.label}</p>
            </div>
          ))}
          <div className="col-span-2">
            <InterestButton module="FD" sourcePage="FD_CALCULATOR" full />
          </div>
        </div>
      )}
    </div>
  );
}
