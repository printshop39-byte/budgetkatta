'use client';
import { useState } from 'react';
import Link from 'next/link';
import { fdRates } from '@/lib/data';
import { useRemoteData } from '@/lib/useRemoteData';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useCompareStore } from '@/store/compareStore';
import { useLeadFormStore } from '@/store/leadFormStore';
import FDCalculator from '@/components/calculators/FDCalculator';
import BadgeChip from '@/components/shared/BadgeChip';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import TableSkeleton from '@/components/shared/TableSkeleton';
import CalculatorDisclaimer from '@/components/shared/CalculatorDisclaimer';
import DocumentChecklist from '@/components/shared/DocumentChecklist';
import JsonLd from '@/components/seo/JsonLd';
import { Lock, FileText, Check } from 'lucide-react';
import { fdDocuments } from '@/lib/documentChecklists';
import type { FDRate } from '@/types';

type Filter = 'all' | 'govt' | 'private';
type Tenure = 'all' | '12' | '36' | '60';

type Bi = { mr: string; en: string };
const FD_FAQ: { q: Bi; a: Bi }[] = [
  {
    q: { mr: 'FD वर सध्या किती व्याज मिळते?', en: 'How much interest does an FD pay now?' },
    a: {
      mr: 'बहुतांश बँकांत साधारण ६% ते ८% दरम्यान, बँक व मुदतीनुसार. वरील तक्त्यात बँकनिहाय ताजे दर पाहा.',
      en: 'Roughly 6%–8% at most banks, depending on the bank and tenure. See the bank-wise table above for current rates.',
    },
  },
  {
    q: { mr: 'ज्येष्ठ नागरिकांना जास्त दर मिळतो का?', en: 'Do senior citizens get a higher rate?' },
    a: {
      mr: 'होय, सहसा ०.२५% ते ०.५०% अधिक व्याज मिळते. तक्त्यात ज्येष्ठ नागरिक दर वेगळा दाखवला आहे.',
      en: 'Yes, usually 0.25%–0.50% extra. The table shows the senior-citizen rate separately.',
    },
  },
  {
    q: { mr: 'FD मुदतीपूर्वी मोडता येते का?', en: 'Can I break an FD before maturity?' },
    a: {
      mr: 'होय, पण सहसा ०.५% ते १% दंड (penalty) लागतो आणि लागू व्याजदर कमी होतो. Tax-saving FD ला ५ वर्षांचा lock-in असतो.',
      en: 'Yes, but typically with a 0.5%–1% penalty and a lower applicable rate. Tax-saving FDs have a 5-year lock-in.',
    },
  },
  {
    q: { mr: 'FD वर कर (tax) लागतो का?', en: 'Is FD interest taxable?' },
    a: {
      mr: 'होय. व्याज तुमच्या उत्पन्नात गणले जाते व slab नुसार करपात्र असते. वर्षाला ₹40,000 (ज्येष्ठ ₹50,000) पेक्षा जास्त व्याजावर बँक TDS कापते.',
      en: 'Yes. Interest is added to your income and taxed per your slab. Banks deduct TDS on interest above ₹40,000/yr (₹50,000 for seniors).',
    },
  },
  {
    q: { mr: 'Tax-saving FD म्हणजे काय?', en: 'What is a tax-saving FD?' },
    a: {
      mr: '५ वर्षांची विशेष FD जिच्यात ₹1.5 लाखांपर्यंत 80C वजावट मिळते. परंतु ५ वर्षांपूर्वी पैसे काढता येत नाहीत.',
      en: 'A special 5-year FD that gives an 80C deduction up to ₹1.5 lakh, but the money is locked in for 5 years.',
    },
  },
];

export default function FDPage() {
  const { language } = useLanguageStore();
  const mr = language === 'mr';
  const t = getTranslation(language);
  const { addItem, items } = useCompareStore();
  const openLead = useLeadFormStore((s) => s.open);
  const [filter, setFilter] = useState<Filter>('all');
  const [tenure, setTenure] = useState<Tenure>('all');
  const { data: banks, loading, source, updatedAt } = useRemoteData<FDRate>('/api/fd', fdRates);

  const filtered = banks.filter((b) => filter === 'all' || b.bankType === filter);

  const filters: { value: Filter; key: string }[] = [
    { value: 'all', key: 'fd.filter_all' },
    { value: 'govt', key: 'fd.filter_govt' },
    { value: 'private', key: 'fd.filter_private' },
  ];
  const tenures: { value: Tenure; label: string }[] = [
    { value: 'all', label: t('fd.tenure_all') },
    { value: '12', label: '1Y' },
    { value: '36', label: '3Y' },
    { value: '60', label: '5Y' },
  ];

  // Pick the rate row for the chosen tenure, else the best regular rate.
  function pickRate(bank: FDRate) {
    if (tenure !== 'all') {
      const match = bank.rates.find((r) => r.tenureMonths === Number(tenure));
      if (match) return match;
    }
    return bank.rates.reduce((a, b) => (b.regularRate > a.regularRate ? b : a));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-slate-200 md:text-4xl">{t('fd.hero_title')}</h1>
        <p className="mt-2 text-slate-400 font-deva">{t('fd.subtitle')}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40/25 bg-amber-400/10 px-3 py-1 text-xs text-amber-400 font-deva">
          <Lock className="h-3.5 w-3.5" /> {t('fd.trust_signal')}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-deva transition-all ${
                    filter === f.value
                      ? 'border-bk-gold bg-bk-gold/15 text-bk-gold'
                      : 'border-slate-800 text-slate-400 hover:border-slate-800'
                  }`}
                >
                  {t(f.key)}
                </button>
              ))}
            </div>
            <DataSourceBadge source={source} updatedAt={updatedAt} />
          </div>

          {/* Tenure chips */}
          <div className="mb-4 flex flex-wrap gap-2">
            {tenures.map((tn) => (
              <button
                key={tn.value}
                onClick={() => setTenure(tn.value)}
                className={`rounded-full border px-3 py-1 text-xs font-deva transition-all ${
                  tenure === tn.value
                    ? 'border-bk-gold bg-bk-gold/15 text-bk-gold'
                    : 'border-slate-800 text-slate-400 hover:border-slate-800'
                }`}
              >
                {tn.label}
              </button>
            ))}
          </div>

          {loading ? (
            <TableSkeleton cols={6} />
          ) : (
            <div className="overflow-x-auto glass-card rounded-3xl p-0">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-slate-400">
                    <th className="p-4 font-medium">{t('fd.col_bank')}</th>
                    <th className="p-4 font-medium">{t('fd.col_tenure')}</th>
                    <th className="p-4 font-medium">{t('fd.col_regular')}</th>
                    <th className="p-4 font-medium">{t('fd.col_senior')}</th>
                    <th className="p-4 font-medium">{t('fd.col_docs')}</th>
                    <th className="p-4 font-medium">{t('fd.col_action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((bank) => {
                    const row = pickRate(bank);
                    const inCompare = items.some((i) => i.id === bank.id);
                    return (
                      <tr key={bank.id} className="border-b border-slate-800">
                        <td className="p-4 font-deva text-slate-200">
                          {bank.bankName}
                          <div className="mt-1">
                            <BadgeChip tone={bank.bankType === 'govt' ? 'info' : 'neutral'}>
                              {bank.bankType === 'govt' ? t('fd.filter_govt') : t('fd.filter_private')}
                            </BadgeChip>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400">{row.tenureLabel}</td>
                        <td className="p-4 font-bold text-bk-gold">{row.regularRate}%</td>
                        <td className="p-4 font-bold text-bk-success">{row.seniorRate}%</td>
                        <td className="p-4">
                          <Link href="/documents" className="inline-flex items-center gap-1 text-xs text-bk-gold/80 hover:text-bk-gold" aria-label={t('fd.col_docs')}>
                            <FileText className="h-3.5 w-3.5" /> {t('btn.learn_more')}
                          </Link>
                        </td>
                        <td className="p-4">
                          <button
                            disabled={inCompare}
                            onClick={() =>
                              addItem('FD', {
                                id: bank.id,
                                name: bank.bankName,
                                data: [bank.bankName, row.tenureLabel, `${row.regularRate}%`, `${row.seniorRate}%`],
                              })
                            }
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-800 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-bk-gold/40 hover:text-bk-gold disabled:opacity-40 font-deva"
                          >
                            {inCompare ? <Check className="h-3.5 w-3.5" /> : t('btn.compare')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <FDCalculator />
          <CalculatorDisclaimer />
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-xl font-bold text-slate-200 font-deva">{t('doc.section_title')}</h2>
        <DocumentChecklist documents={fdDocuments} />
      </section>

      {/* Tax on FD */}
      <section className="mt-12">
        <h2 className="mb-4 font-display text-xl font-bold text-slate-200 font-deva">
          {mr ? 'FD वरील कर (Tax on FD)' : 'Tax on FD'}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              mr: 'FD चे व्याज तुमच्या उत्पन्नात गणले जाते व तुमच्या income-tax slab नुसार करपात्र असते.',
              en: "FD interest is added to your income and taxed as per your income-tax slab.",
            },
            {
              mr: 'एका बँकेतील व्याज वर्षाला ₹40,000 (ज्येष्ठ नागरिक ₹50,000) पेक्षा जास्त असल्यास बँक 10% TDS कापते (PAN नसल्यास 20%).',
              en: 'If interest in a bank exceeds ₹40,000/yr (₹50,000 for seniors), the bank deducts 10% TDS (20% without PAN).',
            },
            {
              mr: 'उत्पन्न करपात्र मर्यादेखाली असल्यास Form 15G / 15H देऊन TDS टाळता येतो.',
              en: 'If your income is below the taxable limit, submit Form 15G / 15H to avoid TDS.',
            },
            {
              mr: '5-वर्षांच्या Tax-saving FD मध्ये ₹1.5 लाखांपर्यंत 80C वजावट मिळते (lock-in 5 वर्षे).',
              en: 'A 5-year tax-saving FD gets an 80C deduction up to ₹1.5 lakh (5-year lock-in).',
            },
          ].map((p, i) => (
            <div key={i} className="glass-card flex items-start gap-2 p-4 text-sm text-slate-300 font-deva">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              {p[language]}
            </div>
          ))}
        </div>
      </section>

      {/* FD vs SIP */}
      <section className="mt-12">
        <h2 className="mb-4 font-display text-xl font-bold text-slate-200 font-deva">
          {mr ? 'FD की SIP? (तुलना)' : 'FD vs SIP'}
        </h2>
        <div className="overflow-x-auto glass-card p-0">
          <table className="w-full min-w-[460px] text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-400">
                <th className="p-3 font-medium font-deva">{mr ? 'मुद्दा' : 'Aspect'}</th>
                <th className="p-3 font-medium font-deva">FD</th>
                <th className="p-3 font-medium font-deva">SIP (Equity MF)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { a: { mr: 'परतावा', en: 'Returns' }, fd: { mr: 'निश्चित ~6–8%', en: 'Fixed ~6–8%' }, sip: { mr: 'बाजाराशी निगडित ~10–12%*', en: 'Market-linked ~10–12%*' } },
                { a: { mr: 'जोखीम', en: 'Risk' }, fd: { mr: 'कमी', en: 'Low' }, sip: { mr: 'जास्त (दीर्घकाळात कमी)', en: 'Higher (lower over long term)' } },
                { a: { mr: 'Liquidity', en: 'Liquidity' }, fd: { mr: 'मुदतपूर्व मोडल्यास दंड', en: 'Penalty on premature exit' }, sip: { mr: 'कधीही (ELSS वगळता)', en: 'Anytime (except ELSS)' } },
                { a: { mr: 'कर', en: 'Tax' }, fd: { mr: 'slab नुसार', en: 'As per slab' }, sip: { mr: 'LTCG 12.5% (>₹1.25L)', en: 'LTCG 12.5% (>₹1.25L)' } },
                { a: { mr: 'योग्य कोणासाठी', en: 'Best for' }, fd: { mr: 'सुरक्षित, अल्प-मध्यम मुदत', en: 'Safety, short–mid term' }, sip: { mr: 'दीर्घकालीन wealth', en: 'Long-term wealth' } },
              ].map((r) => (
                <tr key={r.a.en} className="border-b border-slate-800 last:border-0">
                  <td className="p-3 font-semibold text-slate-200 font-deva">{r.a[language]}</td>
                  <td className="p-3 text-bk-gold font-deva">{r.fd[language]}</td>
                  <td className="p-3 text-slate-300 font-deva">{r.sip[language]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-400 font-deva">
          {mr
            ? 'सुरक्षितता हवी → FD; दीर्घकालीन वाढ हवी → SIP. अनेकजण दोन्ही एकत्र ठेवून संतुलन साधतात. '
            : 'Want safety → FD; want long-term growth → SIP. Many keep both for balance. '}
          <Link href="/sip" className="font-semibold text-amber-300 hover:underline">
            {mr ? 'SIP कॅल्क्युलेटर वापरा →' : 'Try the SIP calculator →'}
          </Link>
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="mb-4 font-display text-xl font-bold text-slate-200 font-deva">
          {mr ? 'वारंवार विचारले जाणारे प्रश्न' : 'Frequently asked questions'}
        </h2>
        <div className="space-y-3">
          {FD_FAQ.map((f, i) => (
            <details key={i} className="glass-card group p-4">
              <summary className="cursor-pointer list-none font-semibold text-slate-200 font-deva marker:hidden">
                {f.q[language]}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-400 font-deva">{f.a[language]}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-10 text-center">
        <button
          onClick={() => openLead({ module: 'FD', sourcePage: 'FD_PAGE' })}
          className="rounded-2xl bg-bk-gold px-8 py-3.5 font-bold text-bk-dark shadow-lg shadow-bk-gold/20 transition-colors hover:bg-bk-gold-light font-deva"
        >
          {t('fd.guidance_cta')}
        </button>
      </div>

      {/* FAQ structured data (Marathi) for rich results / AI answer surfaces. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FD_FAQ.map((f) => ({
            '@type': 'Question',
            name: f.q.mr,
            acceptedAnswer: { '@type': 'Answer', text: f.a.mr },
          })),
        }}
      />
    </div>
  );
}
