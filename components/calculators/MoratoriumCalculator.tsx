'use client';
// MoratoriumCalculator — education-loan EMI that accounts for the study-period
// moratorium (course + grace months) during which interest accrues. This is the
// unique angle: a generic EMI calculator ignores the moratorium entirely.
import { useState } from 'react';
import { GraduationCap, Lightbulb, AlertTriangle } from 'lucide-react';
import { calculateEducationLoan, formatINR } from '@/lib/calculators';
import { useLanguageStore } from '@/store/languageStore';
import InterestButton from '@/components/lead/InterestButton';

export default function MoratoriumCalculator() {
  const { language } = useLanguageStore();
  const mr = language === 'mr';

  const [principal, setPrincipal] = useState(800000);
  const [rate, setRate] = useState(9.5);
  const [courseYears, setCourseYears] = useState(4);
  const [graceMonths, setGraceMonths] = useState(12);
  const [repayYears, setRepayYears] = useState(10);

  const r = calculateEducationLoan(principal, rate, courseYears, graceMonths, repayYears);

  const sliders = [
    { label: mr ? 'कर्ज रक्कम' : 'Loan amount', value: formatINR(principal), min: 100000, max: 15000000, step: 50000, val: principal, set: setPrincipal },
    { label: mr ? 'व्याजदर' : 'Interest rate', value: `${rate}%`, min: 7, max: 15, step: 0.25, val: rate, set: setRate },
    { label: mr ? 'कोर्स कालावधी (वर्षे)' : 'Course duration (years)', value: `${courseYears}`, min: 1, max: 6, step: 1, val: courseYears, set: setCourseYears },
    { label: mr ? 'Grace कालावधी (महिने)' : 'Grace period (months)', value: `${graceMonths}`, min: 0, max: 12, step: 6, val: graceMonths, set: setGraceMonths },
    { label: mr ? 'परतफेड मुदत (वर्षे)' : 'Repayment tenure (years)', value: `${repayYears}`, min: 3, max: 15, step: 1, val: repayYears, set: setRepayYears },
  ];

  return (
    <div className="glass-card glass-card-gold space-y-5 p-6" id="calc">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-amber-400" />
        <h3 className="font-display text-xl font-bold text-slate-100 font-deva">
          {mr ? 'Moratorium EMI कॅल्क्युलेटर' : 'Moratorium EMI Calculator'}
        </h3>
      </div>
      <p className="text-xs leading-relaxed text-slate-400 font-deva">
        {mr
          ? 'अभ्यासाच्या काळात (moratorium) हप्ता नसतो, पण व्याज साचत राहते. नोकरी लागल्यानंतरचा खरा EMI येथे पाहा.'
          : 'During the study period (moratorium) you pay no EMI, but interest keeps accruing. See your real EMI after you start working.'}
      </p>

      <div className="space-y-4">
        {sliders.map((s) => (
          <div key={s.label}>
            <div className="mb-1 flex justify-between">
              <label className="text-sm text-slate-400 font-deva">{s.label}</label>
              <span className="text-sm font-bold text-bk-gold">{s.value}</span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.val}
              onChange={(e) => s.set(+e.target.value)}
              className="w-full accent-bk-gold"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        {[
          { label: mr ? 'नोकरीनंतरचा EMI' : 'EMI after job', value: formatINR(r.emi), hi: true },
          { label: mr ? 'Moratorium कालावधी' : 'Moratorium period', value: `${r.moratoriumMonths} ${mr ? 'महिने' : 'months'}` },
          { label: mr ? 'अभ्यासात साचणारे व्याज' : 'Interest accrued in study', value: formatINR(r.accruedInterest) },
          { label: mr ? 'एकूण परतफेड' : 'Total payable', value: formatINR(r.totalPayable) },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl p-3 text-center ${item.hi ? 'bg-amber-400/10 ring-1 ring-amber-400/30' : 'bg-slate-800/60'}`}
          >
            <p className={`text-base font-bold ${item.hi ? 'text-amber-300' : 'text-bk-gold'}`}>{item.value}</p>
            <p className="mt-1 text-xs text-slate-400 font-deva">{item.label}</p>
          </div>
        ))}
      </div>

      <p className="flex items-start gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs leading-relaxed text-slate-400 font-deva">
        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bk-gold" />{' '}
        {mr
          ? `जर तुम्ही अभ्यासादरम्यानच फक्त व्याज भरलं (साधारण ${formatINR(r.interestDuringStudyMonthly)}/महिना), तर हे साचलेलं व्याज टळतं व एकूण खर्च खूप कमी होतो.`
          : `If you service just the interest during study (about ${formatINR(r.interestDuringStudyMonthly)}/month), this accrued interest is avoided and your total cost drops sharply.`}
      </p>

      <InterestButton module="LOAN" product="Education Loan" sourcePage="MORATORIUM_CALCULATOR" full />

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-slate-500 font-deva">
        <AlertTriangle className="h-3 w-3 shrink-0 text-amber-400/80" />
        {mr
          ? 'हा फक्त अंदाज आहे. प्रत्यक्ष disbursal टप्प्याटप्प्याने होतो; अंतिम आकडे बँकेकडून तपासा.'
          : 'Estimate only. Actual disbursal is staggered; confirm final figures with your bank.'}
      </p>
    </div>
  );
}
