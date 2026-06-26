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

      {result && (() => {
        const investedPct = Math.round((result.invested / result.maturityValue) * 100);
        const returnsPct = 100 - investedPct;
        return (
          <div className="space-y-4 pt-2">
            {/* Maturity hero */}
            <div className="rounded-2xl bg-slate-800/60 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-slate-400">{t('sip.maturity')}</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-bk-success">
                {formatINR(result.maturityValue)}
              </p>
            </div>

            {/* Invested vs Wealth split bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-indigo-300 font-deva">{t('sip.invested')}</span>
                <span className="text-bk-success font-deva">{t('sip.returns')}</span>
              </div>
              <div className="mt-1.5 flex h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full bg-indigo-400" style={{ width: `${investedPct}%` }} />
                <div className="h-full bg-bk-success" style={{ width: `${returnsPct}%` }} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-100">{formatINR(result.invested)}</p>
                    <p className="text-xs text-slate-400 font-deva">{t('sip.invested')} ({investedPct}%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-bk-success" />
                  <div>
                    <p className="text-sm font-bold text-slate-100">{formatINR(result.estimatedReturns)}</p>
                    <p className="text-xs text-slate-400 font-deva">{t('sip.returns')} ({returnsPct}%)</p>
                  </div>
                </div>
              </div>
            </div>

            <InterestButton module="SIP" sourcePage="SIP_CALCULATOR" full />
          </div>
        );
      })()}
    </div>
  );
}
