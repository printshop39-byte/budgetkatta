'use client';
import { sipFunds } from '@/lib/data';
import { useRemoteData } from '@/lib/useRemoteData';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { useCompareStore } from '@/store/compareStore';
import { useLeadFormStore } from '@/store/leadFormStore';
import SIPCalculator from '@/components/calculators/SIPCalculator';
import BrokerOffers from '@/components/BrokerOffers';
import BadgeChip from '@/components/shared/BadgeChip';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import TableSkeleton from '@/components/shared/TableSkeleton';
import CalculatorDisclaimer from '@/components/shared/CalculatorDisclaimer';
import DocumentChecklist from '@/components/shared/DocumentChecklist';
import { sipDocuments } from '@/lib/documentChecklists';
import { Icon } from '@/components/shared/Icon';
import type { SIPFund } from '@/types';

const riskTone = { low: 'success', medium: 'warning', high: 'danger' } as const;

export default function SIPPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const { addItem, items } = useCompareStore();
  const openLead = useLeadFormStore((s) => s.open);
  const { data: funds, loading, source, updatedAt } = useRemoteData<SIPFund>('/api/sip', sipFunds);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-slate-200 md:text-4xl">{t('sip.title')}</h1>
        <p className="mt-2 text-slate-400 font-deva">{t('sip.subtitle')}</p>
        <p className="mx-auto mt-3 flex max-w-2xl items-start justify-center gap-2 rounded-2xl border border-bk-gold/15 bg-bk-gold/5 px-4 py-2.5 text-sm text-slate-400 font-deva">
          <Icon name="tip" className="mt-0.5 h-4 w-4 shrink-0 text-bk-gold" /> {t('sip.intro')}
        </p>
      </header>

      {/* Risk type cards */}
      <div className="mb-8">
        <h2 className="mb-3 font-display text-lg font-bold text-slate-200 font-deva">{t('sip.risk_title')}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { key: 'sip.risk_equity', tone: 'border-rose-200 bg-rose-50 text-rose-700', icon: 'rocket' },
            { key: 'sip.risk_hybrid', tone: 'border-amber-200 bg-amber-50 text-amber-700', icon: 'balance' },
            { key: 'sip.risk_debt', tone: 'border-amber-400/40 bg-amber-400 text-amber-400', icon: 'safety' },
          ].map((r) => (
            <div key={r.key} className={`rounded-2xl border p-4 text-center ${r.tone}`}>
              <span className="inline-flex h-10 w-10 items-center justify-center"><Icon name={r.icon} className="h-6 w-6" /></span>
              <p className="mt-1 text-sm font-semibold font-deva">{t(r.key)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex justify-end">
            <DataSourceBadge source={source} updatedAt={updatedAt} />
          </div>
          {loading ? (
            <TableSkeleton cols={6} />
          ) : (
          <div className="overflow-x-auto glass-card p-0">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-slate-400">
                  <th className="p-3 font-medium">{t('sip.col_fund')}</th>
                  <th className="p-3 font-medium">{t('sip.col_category')}</th>
                  <th className="p-3 font-medium">{t('sip.col_3y')}</th>
                  <th className="p-3 font-medium">{t('sip.col_5y')}</th>
                  <th className="p-3 font-medium">{t('sip.col_risk')}</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {funds.map((fund) => {
                  const inCompare = items.some((i) => i.id === fund.id);
                  return (
                    <tr key={fund.id} className="border-b border-slate-800">
                      <td className="p-3 font-deva text-slate-200">{fund.fundName}</td>
                      <td className="p-3 text-slate-400">{fund.category}</td>
                      <td className="p-3 font-bold text-bk-success">{fund.return3y}%</td>
                      <td className="p-3 font-bold text-bk-gold">{fund.return5y}%</td>
                      <td className="p-3">
                        <BadgeChip tone={riskTone[fund.risk]}>{fund.risk}</BadgeChip>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          disabled={inCompare}
                          onClick={() =>
                            addItem('SIP', {
                              id: fund.id,
                              name: fund.fundName,
                              data: [
                                fund.fundName,
                                fund.category,
                                `${fund.return3y}%`,
                                `${fund.return5y}%`,
                                fund.risk,
                              ],
                            })
                          }
                          className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-800 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-bk-gold/40 hover:text-bk-gold disabled:opacity-40 font-deva"
                        >
                          {inCompare ? <Icon name="tick" className="h-3.5 w-3.5" /> : t('btn.compare')}
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
          <SIPCalculator />
          <CalculatorDisclaimer />
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-xl font-bold text-slate-200 font-deva">{t('doc.section_title')}</h2>
        <DocumentChecklist documents={sipDocuments} />
      </section>

      <BrokerOffers className="!px-0" />

      <div className="mt-10 text-center">
        <button
          onClick={() => openLead({ module: 'SIP', sourcePage: 'SIP_PAGE' })}
          className="rounded-2xl bg-bk-gold px-8 py-3.5 font-bold text-bk-dark shadow-lg shadow-bk-gold/20 transition-colors hover:bg-bk-gold-light font-deva"
        >
          {t('sip.guidance_cta')}
        </button>
      </div>
    </div>
  );
}
