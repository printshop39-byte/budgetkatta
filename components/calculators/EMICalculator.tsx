'use client';
import { useState } from 'react';
import { calculateEMI, formatINR } from '@/lib/calculators';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import InterestButton from '@/components/lead/InterestButton';

export default function EMICalculator() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(120);
  const [result, setResult] = useState<ReturnType<typeof calculateEMI> | null>(null);

  function handleCalculate() {
    setResult(calculateEMI(principal, rate, tenure));
  }

  return (
    <div className="glass-card glass-card-gold space-y-5 p-6">
      <h3 className="font-display text-xl font-bold text-slate-800">{t('loan.emi_title')}</h3>

      <div className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-slate-600 font-deva">{t('loan.amount')}</label>
            <span className="text-sm font-bold text-bk-gold">{formatINR(principal)}</span>
          </div>
          <input
            type="range"
            min={100000}
            max={10000000}
            step={100000}
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>

        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-slate-600 font-deva">{t('loan.rate')}</label>
            <span className="text-sm font-bold text-bk-gold">{rate}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={24}
            step={0.25}
            value={rate}
            onChange={(e) => setRate(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>

        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-slate-600 font-deva">{t('loan.tenure_month')}</label>
            <span className="text-sm font-bold text-bk-gold">{tenure}</span>
          </div>
          <input
            type="range"
            min={12}
            max={360}
            step={12}
            value={tenure}
            onChange={(e) => setTenure(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full rounded-xl bg-bk-gold py-3 font-bold text-bk-dark transition-colors hover:bg-bk-gold-light font-deva"
      >
        {t('loan.calculate')}
      </button>

      {result && (
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { label: t('loan.monthly_emi'), value: formatINR(result.emi) },
            { label: t('loan.total_interest'), value: formatINR(result.totalInterest) },
            { label: t('loan.total_amount'), value: formatINR(result.totalAmount) },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-slate-900/[0.035] p-3 text-center">
              <p className="text-base font-bold text-bk-gold">{item.value}</p>
              <p className="mt-1 text-xs text-slate-500 font-deva">{item.label}</p>
            </div>
          ))}
          <div className="col-span-3">
            <InterestButton module="LOAN" sourcePage="EMI_CALCULATOR" full />
          </div>
        </div>
      )}
    </div>
  );
}
