'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { loanProducts } from '@/lib/data';
import { useRemoteData } from '@/lib/useRemoteData';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useLeadFormStore } from '@/store/leadFormStore';
import { loanDetails, loanOrder, type LoanType } from '@/lib/loanDetails';
import { getDocuments, profileOptions, type ProfileType } from '@/lib/documentChecklists';
import CreditCardOffers from '@/components/CreditCardOffers';
import SegmentEntryCards from '@/components/schemes/SegmentEntryCards';
import EMICalculator from '@/components/calculators/EMICalculator';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import DocumentChecklist from '@/components/shared/DocumentChecklist';
import CalculatorDisclaimer from '@/components/shared/CalculatorDisclaimer';
import type { LoanProduct } from '@/types';

const questions = [
  { key: 'loan.q_amount', target: 'loan-calc', icon: '💰' },
  { key: 'loan.q_emi', target: 'loan-calc', icon: '🧮' },
  { key: 'loan.q_approval', target: 'loan-detail', icon: '✅' },
  { key: 'loan.q_docs', target: 'loan-docs', icon: '📄' },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function LoansPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const openLead = useLeadFormStore((s) => s.open);
  const { data: loans, source, updatedAt } = useRemoteData<LoanProduct>('/api/loans', loanProducts);

  const [type, setType] = useState<LoanType>('home');
  const [profile, setProfile] = useState<ProfileType>('SALARIED');

  const detail = loanDetails[type];
  const rows = loans.filter((l) => l.loanType === type);
  const rate = rows.length ? `${Math.min(...rows.map((r) => r.roiMin))}% – ${Math.max(...rows.map((r) => r.roiMax))}%` : '—';
  const fee = rows[0]?.processingFee ?? '—';
  const tenure = rows.length
    ? `${Math.round(Math.max(...rows.map((r) => r.maxTenureMonths)) / 12)} ${language === 'mr' ? 'वर्षे' : 'years'}`
    : '—';
  const documents = getDocuments(detail.product, profile);
  const loanLabel = t(detail.labelKey);

  return (
    <>
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-slate-200 md:text-4xl">{t('loan.title')}</h1>
        <p className="mt-2 text-slate-400 font-deva">{t('easy.emi_first')}</p>
      </header>

      {/* High-intent segment entry cards — women & students */}
      <SegmentEntryCards className="mb-8" />

      {/* Quick question cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {questions.map((q, i) => (
          <motion.button
            key={q.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => scrollTo(q.target)}
            className="glass-card flex items-center gap-2 p-4 text-left transition-all hover:border-bk-gold/40"
          >
            <span className="text-xl">{q.icon}</span>
            <span className="text-sm font-semibold text-slate-300 font-deva">{t(q.key)}</span>
          </motion.button>
        ))}
      </div>

      {/* Loan category tabs */}
      <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {loanOrder.map((lt) => (
          <button
            key={lt}
            onClick={() => setType(lt)}
            className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-deva transition-all ${
              type === lt
                ? 'border-bk-gold bg-bk-gold/15 text-bk-gold'
                : 'border-slate-800 text-slate-400 hover:border-slate-800'
            }`}
          >
            <span className="text-lg">{loanDetails[lt].icon}</span>
            {t(loanDetails[lt].labelKey)}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <motion.div
        key={type}
        id="loan-detail"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card glass-card-gold scroll-mt-20 p-6"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{detail.icon}</span>
          <h2 className="font-display text-xl font-bold text-slate-200 font-deva">{loanLabel}</h2>
          <span className="ml-auto"><DataSourceBadge source={source} updatedAt={updatedAt} /></span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: t('loan.f_rate'), value: rate },
            { label: t('loan.f_fee'), value: fee },
            { label: t('loan.f_tenure'), value: tenure },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-slate-900/[0.035] p-3 text-center">
              <p className="text-base font-bold text-bk-gold">{s.value}</p>
              <p className="mt-1 text-xs text-slate-400 font-deva">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <h3 className="mb-1.5 text-sm font-semibold text-slate-300 font-deva">{t('loan.f_eligibility')}</h3>
            <ul className="space-y-1.5">
              {detail.eligibility.map((e, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-400 font-deva">
                  <span className="text-bk-gold">✓</span>
                  {e[language]}
                </li>
              ))}
            </ul>
            <h3 className="mb-1.5 mt-4 text-sm font-semibold text-slate-300 font-deva">{t('loan.f_who')}</h3>
            <p className="text-sm text-slate-400 font-deva">{detail.who[language]}</p>
          </div>
          <div>
            <h3 className="mb-1.5 text-sm font-semibold text-slate-300 font-deva">{t('loan.f_mistakes')}</h3>
            <ul className="space-y-1.5">
              {detail.mistakes.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-400 font-deva">
                  <span className="text-bk-danger">⚠️</span>
                  {m[language]}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={() => openLead({ module: 'LOAN', product: loanLabel, sourcePage: 'LOANS_PAGE' })}
          className="mt-5 w-full rounded-xl bg-bk-gold py-3 font-bold text-bk-dark transition-colors hover:bg-bk-gold-light font-deva sm:w-auto sm:px-8"
        >
          {t('loan.f_cta')}
        </button>
      </motion.div>

      {/* Documents for this loan */}
      <div id="loan-docs" className="mt-10 scroll-mt-20">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-slate-200 font-deva">{t('loan.f_documents')}</h2>
          <label className="flex items-center gap-2 text-sm text-slate-400 font-deva">
            {t('doc.profile')}
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value as ProfileType)}
              className="rounded-lg border border-slate-800 bg-slate-900/[0.035] px-2 py-1.5 text-sm text-slate-200 outline-none focus:border-bk-gold/50"
            >
              {profileOptions.map((o) => (
                <option key={o.value} value={o.value} className="bg-bk-card">
                  {o.label[language]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <DocumentChecklist documents={documents} />
      </div>

      {/* EMI calculator */}
      <div id="loan-calc" className="mt-10 scroll-mt-20">
        <h2 className="mb-4 font-display text-xl font-bold text-slate-200 font-deva">{t('loan.emi_title')}</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <EMICalculator />
            <CalculatorDisclaimer />
          </div>
          {/* Banks for this loan type */}
          <div className="overflow-x-auto glass-card p-0">
            <table className="w-full min-w-[320px] text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="p-3 font-medium">{t('loan.col_bank')}</th>
                  <th className="p-3 font-medium">{t('loan.col_roi')}</th>
                  <th className="p-3 font-medium">{t('loan.col_fee')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((l) => (
                  <tr key={l.id} className="border-b border-slate-800">
                    <td className="p-3 text-slate-200 font-deva">{l.bankName}</td>
                    <td className="p-3 font-bold text-bk-gold">{l.roiMin}%–{l.roiMax}%</td>
                    <td className="p-3 text-slate-400">{l.processingFee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

      {/* Credit card offers — credit is thematically relevant on the loans page */}
      <CreditCardOffers />
    </>
  );
}
