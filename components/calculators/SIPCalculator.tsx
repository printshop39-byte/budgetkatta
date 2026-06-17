'use client';
import { useState } from 'react';
import { calculateSIP, formatINR } from '@/lib/calculators';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import InterestButton from '@/components/lead/InterestButton';

export default function SIPCalculator() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);
  const [returnRate, setReturnRate] = useState(12);
  const [result, setResult] = useState<ReturnType<typeof calculateSIP> | null>(null);

  function handleCalculate() {
    setResult(calculateSIP(monthly, returnRate, years));
  }

  return (
    <div className="glass-card glass-card-gold space-y-5 p-6">
      <h3 className="font-display text-xl font-bold text-slate-100">{t('sip.calc_title')}</h3>

      <div className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-slate-400 font-deva">{t('sip.monthly_invest')}</label>
            <span className="text-sm font-bold text-bk-gold">{formatINR(monthly)}</span>
          </div>
          <input
            type="range"
            min={500}
            max={100000}
            step={500}
            value={monthly}
            onChange={(e) => setMonthly(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>

        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-slate-400 font-deva">{t('sip.tenure_year')}</label>
            <span className="text-sm font-bold text-bk-gold">{years}</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>

        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-slate-400 font-deva">{t('sip.expected_return')}</label>
            <span className="text-sm font-bold text-bk-gold">{returnRate}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={20}
            step={0.5}
            value={returnRate}
            onChange={(e) => setReturnRate(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full rounded-xl bg-bk-gold py-3 font-bold text-bk-dark transition-colors hover:bg-bk-gold-light font-deva"
      >
        {t('btn.calculate')}
      </button>

      {result && (
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { label: t('sip.invested'), value: formatINR(result.invested) },
            { label: t('sip.returns'), value: formatINR(result.estimatedReturns) },
            { label: t('sip.maturity'), value: formatINR(result.maturityValue) },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-slate-800/60 p-3 text-center">
              <p className="text-base font-bold text-bk-gold">{item.value}</p>
              <p className="mt-1 text-xs text-slate-400 font-deva">{item.label}</p>
            </div>
          ))}
          <div className="col-span-3">
            <InterestButton module="SIP" sourcePage="SIP_CALCULATOR" full />
          </div>
        </div>
      )}
    </div>
  );
}
