'use client';
import { useState } from 'react';
import { estimateInsurancePremium, formatINR } from '@/lib/calculators';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import InterestButton from '@/components/lead/InterestButton';

export default function InsuranceEstimator() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  const [age, setAge] = useState(30);
  const [cover, setCover] = useState(500000);
  const [type, setType] = useState<'health' | 'life' | 'vehicle'>('health');
  const [term, setTerm] = useState(10);
  const [result, setResult] = useState<ReturnType<typeof estimateInsurancePremium> | null>(null);

  function handleCalculate() {
    setResult(estimateInsurancePremium(age, cover, type, term));
  }

  const typeOptions: { value: 'health' | 'life' | 'vehicle'; key: string }[] = [
    { value: 'health', key: 'ins.health' },
    { value: 'life', key: 'ins.life' },
    { value: 'vehicle', key: 'ins.vehicle' },
  ];

  return (
    <div className="glass-card glass-card-gold space-y-5 p-6">
      <h3 className="font-display text-xl font-bold text-slate-100">{t('ins.est_title')}</h3>

      <div className="space-y-4">
        <div className="flex gap-2">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setType(opt.value)}
              className={`flex-1 rounded-lg border px-2 py-2 text-xs font-deva transition-all ${
                type === opt.value
                  ? 'border-bk-gold bg-bk-gold/15 text-bk-gold'
                  : 'border-slate-800 text-slate-400 hover:border-amber-400/40'
              }`}
            >
              {t(opt.key)}
            </button>
          ))}
        </div>

        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-slate-400 font-deva">{t('ins.age')}</label>
            <span className="text-sm font-bold text-bk-gold">{age}</span>
          </div>
          <input
            type="range"
            min={18}
            max={75}
            step={1}
            value={age}
            onChange={(e) => setAge(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>

        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-slate-400 font-deva">{t('ins.cover')}</label>
            <span className="text-sm font-bold text-bk-gold">{formatINR(cover)}</span>
          </div>
          <input
            type="range"
            min={100000}
            max={10000000}
            step={100000}
            value={cover}
            onChange={(e) => setCover(+e.target.value)}
            className="w-full accent-bk-gold"
          />
        </div>

        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-sm text-slate-400 font-deva">{t('ins.policy_term')}</label>
            <span className="text-sm font-bold text-bk-gold">{term}</span>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={term}
            onChange={(e) => setTerm(+e.target.value)}
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
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-800/60 p-3 text-center">
              <p className="text-base font-bold text-bk-gold">
                {formatINR(result.minPremium)} – {formatINR(result.maxPremium)}
              </p>
              <p className="mt-1 text-xs text-slate-400 font-deva">{t('ins.est_premium')}</p>
            </div>
            <div className="rounded-xl bg-slate-800/60 p-3 text-center">
              <p className="text-base font-bold text-bk-gold">{formatINR(result.suggestedCover)}</p>
              <p className="mt-1 text-xs text-slate-400 font-deva">{t('ins.suggested_cover')}</p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400">{result.riskNote}</p>
          <InterestButton module="INSURANCE" sourcePage="INSURANCE_ESTIMATOR" full />
        </div>
      )}
    </div>
  );
}
