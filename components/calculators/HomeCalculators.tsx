'use client';
// HomeCalculators — the seven blueprint calculators on one page. Estimates only:
// every tab repeats that this is not a bank decision. Rates / fees that vary by
// bank or state are editable inputs, never hidden constants.
import { useMemo, useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { calculateEMI, formatINR } from '@/lib/calculators';
import {
  compareTransfer,
  estimateDownPayment,
  estimateEligibility,
  estimatePurchaseCost,
  splitSetupBudget,
  amortizationByYear,
  type SetupTier,
} from '@/lib/homeCalc';
import { SETUP_LABELS } from '@/lib/homeSetupContent';
import type { Bi } from '@/lib/homeFinanceContent';

type TabId = 'emi' | 'eligibility' | 'down' | 'cost' | 'property' | 'transfer' | 'setup';

const TABS: { id: TabId; label: Bi }[] = [
  { id: 'emi', label: { mr: 'Home Loan EMI', en: 'Home Loan EMI' } },
  { id: 'eligibility', label: { mr: 'कर्ज पात्रता', en: 'Eligibility' } },
  { id: 'down', label: { mr: 'Down Payment', en: 'Down Payment' } },
  { id: 'cost', label: { mr: 'खरेदी खर्च', en: 'Purchase Cost' } },
  { id: 'property', label: { mr: 'Property Loan EMI', en: 'Property Loan EMI' } },
  { id: 'transfer', label: { mr: 'Loan Transfer', en: 'Loan Transfer' } },
  { id: 'setup', label: { mr: 'Kitchen/Interior बजेट', en: 'Kitchen / Interior Budget' } },
];

const COPY = {
  disclaimer: {
    mr: 'हा फक्त अंदाज आहे. बँकेची अंतिम पात्रता, व्याजदर आणि मंजुरी बँकेच्या तपासणीवर अवलंबून असते.',
    en: 'This is an estimate only. Final eligibility, rate and approval depend on the bank’s own checks.',
  },
  emi: { mr: 'मासिक EMI', en: 'Monthly EMI' },
  totalInterest: { mr: 'एकूण व्याज', en: 'Total interest' },
  totalPay: { mr: 'एकूण परतफेड', en: 'Total repayment' },
};

function Num({
  label,
  value,
  onChange,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-400 font-deva">
        {label}
        {suffix ? ` (${suffix})` : ''}
      </span>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bk-input"
      />
    </label>
  );
}

function Result({ label, value, big = false }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs text-slate-400 font-deva">{label}</p>
      <p className={`mt-1 font-display font-extrabold text-amber-400 ${big ? 'text-3xl' : 'text-xl'}`}>{value}</p>
    </div>
  );
}

function Donut({ principal, interest, lang }: { principal: number; interest: number; lang: 'mr' | 'en' }) {
  const total = principal + interest;
  const R = 40;
  const C = 2 * Math.PI * R;
  const pShare = total > 0 ? principal / total : 0;
  const mr = lang === 'mr';
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative h-40 w-40 shrink-0" role="img" aria-label={`${mr ? 'मुद्दल' : 'Principal'} ${Math.round(pShare * 100)}%, ${mr ? 'व्याज' : 'Interest'} ${Math.round((1 - pShare) * 100)}%`}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" stroke="#F59E0B" strokeWidth="12" />
          <circle cx="50" cy="50" r={R} fill="none" stroke="#60A5FA" strokeWidth="12" strokeDasharray={`${C * pShare} ${C}`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] text-slate-400 font-deva">{mr ? 'मुद्दल' : 'Principal'}</span>
          <span className="font-display text-xl font-extrabold text-slate-100">{Math.round(pShare * 100)}%</span>
        </div>
      </div>
      <ul className="w-full space-y-2 text-sm">
        <li className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <span className="flex items-center gap-2 text-slate-300 font-deva"><span className="h-3 w-3 rounded-full bg-[#60A5FA]" />{mr ? 'मुद्दल' : 'Principal'}</span>
          <span className="font-bold text-slate-100">{formatINR(principal)}</span>
        </li>
        <li className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <span className="flex items-center gap-2 text-slate-300 font-deva"><span className="h-3 w-3 rounded-full bg-[#F59E0B]" />{mr ? 'एकूण व्याज' : 'Total interest'}</span>
          <span className="font-bold text-slate-100">{formatINR(interest)}</span>
        </li>
      </ul>
    </div>
  );
}

function LoanEmi({ rateDefault, lang, noteKey }: { rateDefault: number; lang: 'mr' | 'en'; noteKey?: Bi }) {
  const [amount, setAmount] = useState(4_000_000);
  const [rate, setRate] = useState(rateDefault);
  const [years, setYears] = useState(20);
  const r = useMemo(() => calculateEMI(amount, rate, Math.max(1, Math.round(years * 12))), [amount, rate, years]);
  const L = (b: Bi) => b[lang];
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly');
  const rows = useMemo(() => amortizationByYear(amount, rate, Math.max(1, Math.round(years * 12))), [amount, rate, years]);
  return (
    <div className="space-y-5">
      {noteKey && <p className="text-sm text-slate-400 font-deva">{L(noteKey)}</p>}
      <div className="grid gap-4 sm:grid-cols-3">
        <Num label={lang === 'mr' ? 'कर्ज रक्कम' : 'Loan amount'} suffix="₹" value={amount} onChange={setAmount} step={50_000} />
        <Num label={lang === 'mr' ? 'व्याजदर (वार्षिक)' : 'Interest rate (p.a.)'} suffix="%" value={rate} onChange={setRate} step={0.05} />
        <Num label={lang === 'mr' ? 'कालावधी' : 'Tenure'} suffix={lang === 'mr' ? 'वर्षे' : 'years'} value={years} onChange={setYears} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label={L(COPY.emi)} value={formatINR(r.emi)} />
        <Result label={L(COPY.totalInterest)} value={formatINR(r.totalInterest)} />
        <Result label={L(COPY.totalPay)} value={formatINR(r.totalAmount)} />
      </div>
      <Donut principal={amount} interest={r.totalInterest} lang={lang} />

      <div>
        <div role="group" aria-label={lang === 'mr' ? 'दृश्य' : 'View'} className="mb-3 inline-flex rounded-full bg-slate-900/70 p-1">
          {(['monthly', 'yearly'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`min-h-[44px] rounded-full px-4 text-sm font-semibold font-deva ${view === v ? 'bg-amber-400 text-slate-950' : 'text-slate-300'}`}
            >
              {v === 'monthly' ? (lang === 'mr' ? 'मासिक' : 'Monthly') : lang === 'mr' ? 'वार्षिक तक्ता' : 'Yearly schedule'}
            </button>
          ))}
        </div>
        {view === 'monthly' ? (
          <p className="text-sm text-slate-300 font-deva">
            {lang === 'mr'
              ? `दरमहा ${formatINR(r.emi)} प्रमाणे ${Math.round(years * 12)} हप्ते. सुरुवातीला हप्त्यातील व्याजाचा वाटा जास्त असतो, नंतर कमी होतो.`
              : `${Math.round(years * 12)} instalments of ${formatINR(r.emi)}. The interest share of each instalment is higher early on and falls later.`}
          </p>
        ) : (
          <div className="max-h-72 overflow-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-900 text-xs text-slate-400">
                <tr>
                  <th className="px-3 py-2 text-left font-deva">{lang === 'mr' ? 'वर्ष' : 'Year'}</th>
                  <th className="px-3 py-2 text-right font-deva">{lang === 'mr' ? 'मुद्दल' : 'Principal'}</th>
                  <th className="px-3 py-2 text-right font-deva">{lang === 'mr' ? 'व्याज' : 'Interest'}</th>
                  <th className="px-3 py-2 text-right font-deva">{lang === 'mr' ? 'शिल्लक' : 'Balance'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {rows.map((row) => (
                  <tr key={row.year}>
                    <td className="px-3 py-2">{row.year}</td>
                    <td className="px-3 py-2 text-right">{formatINR(row.principal)}</td>
                    <td className="px-3 py-2 text-right">{formatINR(row.interest)}</td>
                    <td className="px-3 py-2 text-right">{formatINR(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Eligibility({ lang }: { lang: 'mr' | 'en' }) {
  const [income, setIncome] = useState(100_000);
  const [existing, setExisting] = useState(0);
  const [rate, setRate] = useState(8.75);
  const [years, setYears] = useState(20);
  const [foir, setFoir] = useState(50);
  const r = useMemo(
    () => estimateEligibility({ monthlyIncome: income, existingEmi: existing, annualRate: rate, tenureMonths: years * 12, foir: foir / 100 }),
    [income, existing, rate, years, foir],
  );
  const mr = lang === 'mr';
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Num label={mr ? 'मासिक उत्पन्न' : 'Monthly income'} suffix="₹" value={income} onChange={setIncome} step={5000} />
        <Num label={mr ? 'सध्याचे मासिक EMI' : 'Existing monthly EMIs'} suffix="₹" value={existing} onChange={setExisting} step={1000} />
        <Num label={mr ? 'अपेक्षित व्याजदर' : 'Assumed rate'} suffix="%" value={rate} onChange={setRate} step={0.05} />
        <Num label={mr ? 'कालावधी' : 'Tenure'} suffix={mr ? 'वर्षे' : 'years'} value={years} onChange={setYears} />
        <Num label={mr ? 'उत्पन्नातील EMI मर्यादा (अंदाज)' : 'EMI share of income (assumed)'} suffix="%" value={foir} onChange={setFoir} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Result big label={mr ? 'अंदाजे कर्ज मर्यादा' : 'Indicative loan limit'} value={formatINR(r.loanAmount)} />
        <Result label={mr ? 'परवडणारा नवीन EMI' : 'Affordable new EMI'} value={formatINR(r.affordableEmi)} />
      </div>
      <p className="text-xs text-slate-500 font-deva">
        {mr
          ? 'बँका उत्पन्न, वय, CIBIL, मालमत्ता मूल्य आणि स्वतःची धोरणे पाहतात — त्यामुळे प्रत्यक्ष मर्यादा वेगळी असू शकते.'
          : 'Banks look at income, age, credit score, property value and their own policy — the actual limit can differ.'}
      </p>
    </div>
  );
}

function DownPayment({ lang }: { lang: 'mr' | 'en' }) {
  const [price, setPrice] = useState(6_000_000);
  const [margin, setMargin] = useState(20);
  const [savings, setSavings] = useState(800_000);
  const r = useMemo(() => estimateDownPayment({ propertyPrice: price, marginPercent: margin }), [price, margin]);
  const gap = r.downPayment - savings;
  const mr = lang === 'mr';
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Num label={mr ? 'घराची किंमत' : 'Property price'} suffix="₹" value={price} onChange={setPrice} step={100_000} />
        <Num label={mr ? 'स्वतःचा वाटा (अंदाज)' : 'Own contribution (assumed)'} suffix="%" value={margin} onChange={setMargin} />
        <Num label={mr ? 'आधीची बचत' : 'Savings you have'} suffix="₹" value={savings} onChange={setSavings} step={50_000} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label="Down Payment" value={formatINR(r.downPayment)} />
        <Result label={mr ? 'कर्ज लागेल' : 'Loan needed'} value={formatINR(r.loanNeeded)} />
        <Result
          label={gap > 0 ? (mr ? 'अजून साठवावे' : 'Still to save') : mr ? 'बचत पुरेशी' : 'Savings cover it'}
          value={gap > 0 ? formatINR(gap) : formatINR(Math.abs(gap)) + (mr ? ' शिल्लक' : ' spare')}
        />
      </div>
      <p className="text-xs text-slate-500 font-deva">
        {mr ? 'किमान स्वतःचा वाटा बँक व कर्जाच्या रकमेनुसार ठरतो — बँकेकडून तपासा.' : 'The minimum own contribution is set by the bank — confirm with them.'}
      </p>
    </div>
  );
}

function PurchaseCost({ lang }: { lang: 'mr' | 'en' }) {
  const [price, setPrice] = useState(6_000_000);
  const [stamp, setStamp] = useState(6);
  const [reg, setReg] = useState(1);
  const [cap, setCap] = useState(30_000);
  const [gst, setGst] = useState(0);
  const [other, setOther] = useState(100_000);
  const r = useMemo(
    () =>
      estimatePurchaseCost({
        propertyPrice: price,
        stampDutyPercent: stamp,
        registrationPercent: reg,
        registrationCap: cap,
        gstPercent: gst,
        otherCosts: other,
      }),
    [price, stamp, reg, cap, gst, other],
  );
  const mr = lang === 'mr';
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Num label={mr ? 'घराची किंमत' : 'Property price'} suffix="₹" value={price} onChange={setPrice} step={100_000} />
        <Num label="Stamp duty" suffix="%" value={stamp} onChange={setStamp} step={0.25} />
        <Num label={mr ? 'नोंदणी शुल्क' : 'Registration'} suffix="%" value={reg} onChange={setReg} step={0.25} />
        <Num label={mr ? 'नोंदणी शुल्क कमाल (0 = मर्यादा नाही)' : 'Registration cap (0 = none)'} suffix="₹" value={cap} onChange={setCap} step={1000} />
        <Num label="GST" suffix="%" value={gst} onChange={setGst} step={0.5} />
        <Num label={mr ? 'वकील/ब्रोकरेज/इतर' : 'Legal / brokerage / other'} suffix="₹" value={other} onChange={setOther} step={10_000} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result big label={mr ? 'एकूण सुरुवातीचा खर्च' : 'All-in cost'} value={formatINR(r.total)} />
        <Result label={mr ? "Stamp duty + नोंदणी" : "Stamp duty + registration"} value={formatINR(r.stampDuty + r.registration)} />
        <Result label={mr ? 'किमतीवर अतिरिक्त' : 'Extra over price'} value={formatINR(r.extra)} />
      </div>
      <p className="text-xs text-slate-500 font-deva">
        {mr
          ? 'दर शहर, मालमत्ता प्रकार व खरेदीदारानुसार बदलतात. वरील टक्केवारी तुम्ही बदलू शकता — अधिकृत दर IGR Maharashtra वर तपासा.'
          : 'Rates vary by city, property type and buyer. Edit the percentages above and confirm official rates on IGR Maharashtra.'}
      </p>
    </div>
  );
}

function Transfer({ lang }: { lang: 'mr' | 'en' }) {
  const [out, setOut] = useState(4_000_000);
  const [cur, setCur] = useState(9.25);
  const [nw, setNw] = useState(8.5);
  const [years, setYears] = useState(15);
  const [cost, setCost] = useState(30_000);
  const r = useMemo(
    () => compareTransfer({ outstanding: out, currentRate: cur, newRate: nw, remainingMonths: Math.max(1, Math.round(years * 12)), switchingCost: cost }),
    [out, cur, nw, years, cost],
  );
  const mr = lang === 'mr';
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Num label={mr ? 'उर्वरित कर्ज' : 'Outstanding loan'} suffix="₹" value={out} onChange={setOut} step={50_000} />
        <Num label={mr ? 'सध्याचा दर' : 'Current rate'} suffix="%" value={cur} onChange={setCur} step={0.05} />
        <Num label={mr ? 'नवीन बँकेचा दर' : 'New rate'} suffix="%" value={nw} onChange={setNw} step={0.05} />
        <Num label={mr ? 'उर्वरित कालावधी' : 'Remaining tenure'} suffix={mr ? 'वर्षे' : 'years'} value={years} onChange={setYears} />
        <Num label={mr ? 'हस्तांतरण खर्च (शुल्क + कायदेशीर)' : 'Switching cost (fees + legal)'} suffix="₹" value={cost} onChange={setCost} step={5000} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Result label={mr ? 'सध्याचा EMI' : 'Current EMI'} value={formatINR(r.current.emi)} />
        <Result label={mr ? 'नवीन EMI' : 'New EMI'} value={formatINR(r.next.emi)} />
        <Result label={mr ? 'व्याजातील फरक' : 'Interest difference'} value={formatINR(r.interestSaving)} />
        <Result
          big
          label={mr ? 'खर्च वजा केल्यानंतर' : 'After switching cost'}
          value={(r.netSaving >= 0 ? '+' : '−') + formatINR(Math.abs(r.netSaving))}
        />
      </div>
      <p className="text-sm text-slate-300 font-deva">
        {r.breakEvenMonths === null
          ? mr
            ? 'नवीन दर कमी नसल्यामुळे हस्तांतरणाचा फायदा दिसत नाही.'
            : 'The new rate is not lower, so moving shows no saving.'
          : mr
            ? `खर्च वसूल होण्यास अंदाजे ${r.breakEvenMonths} महिने लागतील.`
            : `The switching cost pays back in about ${r.breakEvenMonths} months.`}
      </p>
    </div>
  );
}

function SetupBudget({ lang }: { lang: 'mr' | 'en' }) {
  const [total, setTotal] = useState(800_000);
  const [tier, setTier] = useState<SetupTier>('medium');
  const rows = useMemo(() => splitSetupBudget(total, tier), [total, tier]);
  const mr = lang === 'mr';
  const tiers: { id: SetupTier; label: Bi }[] = [
    { id: 'basic', label: { mr: 'साधे', en: 'Basic' } },
    { id: 'medium', label: { mr: 'मध्यम', en: 'Medium' } },
    { id: 'full', label: { mr: 'विस्तृत', en: 'Full' } },
  ];
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Num label={mr ? 'एकूण बजेट' : 'Total budget'} suffix="₹" value={total} onChange={setTotal} step={50_000} />
        <div>
          <span className="mb-1 block text-sm text-slate-400 font-deva">{mr ? 'बजेट प्रकार' : 'Budget level'}</span>
          <div className="flex gap-2">
            {tiers.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTier(t.id)}
                aria-pressed={tier === t.id}
                className={`min-h-[44px] flex-1 rounded-xl border px-3 text-sm font-semibold font-deva ${
                  tier === t.id ? 'border-amber-400 bg-amber-400/10 text-amber-400' : 'border-slate-800 text-slate-300'
                }`}
              >
                {t.label[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ul className="divide-y divide-slate-800 rounded-xl border border-slate-800">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm text-slate-300 font-deva">
              {SETUP_LABELS[row.key][lang]} <span className="text-slate-500">· {row.share}%</span>
            </span>
            <span className="font-semibold text-amber-400">{formatINR(row.amount)}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-500 font-deva">
        {mr
          ? 'ही फक्त नियोजनासाठी वाटणी आहे, बाजारभाव नाही. प्रत्यक्ष कोट्स किमान ३ कंत्राटदारांकडून घ्या.'
          : 'This is a planning split, not market prices. Get actual quotes from at least 3 contractors.'}
      </p>
    </div>
  );
}

export default function HomeCalculators({ initialTab = 'emi' }: { initialTab?: TabId }) {
  const lang = useLanguageStore((s) => s.language) === 'mr' ? 'mr' : 'en';
  const [tab, setTab] = useState<TabId>(initialTab);

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Calculators" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-[44px] shrink-0 rounded-full border px-4 text-sm font-semibold font-deva transition-colors ${
              tab === t.id ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-amber-400/40'
            }`}
          >
            {t.label[lang]}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="glass-card glass-card-gold p-5">
        {tab === 'emi' && <LoanEmi lang={lang} rateDefault={8.75} />}
        {tab === 'eligibility' && <Eligibility lang={lang} />}
        {tab === 'down' && <DownPayment lang={lang} />}
        {tab === 'cost' && <PurchaseCost lang={lang} />}
        {tab === 'property' && (
          <LoanEmi
            lang={lang}
            rateDefault={9.5}
            noteKey={{
              mr: 'मालमत्तेवरील कर्जाचा व्याजदर सहसा गृहकर्जापेक्षा वेगळा असतो — तुमच्या बँकेचा दर टाका.',
              en: 'Loan-against-property rates usually differ from home-loan rates — enter your bank’s rate.',
            }}
          />
        )}
        {tab === 'transfer' && <Transfer lang={lang} />}
        {tab === 'setup' && <SetupBudget lang={lang} />}
      </div>

      <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-center text-sm text-amber-200 font-deva">
        {COPY.disclaimer[lang]}
      </p>
    </div>
  );
}
