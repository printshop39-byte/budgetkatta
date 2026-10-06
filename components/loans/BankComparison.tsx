'use client';
import { ExternalLink, Info } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { track } from '@/lib/analytics';
import { BANKS_PENDING, BANK_DISCLAIMER, BANK_NOTE, BANK_RATES, formatRateRange } from '@/lib/bankRates';

export default function BankComparison() {
  const mr = useLanguageStore((s) => s.language) === 'mr';
  const L = (b: { mr: string; en: string } | null) => (b ? (mr ? b.mr : b.en) : mr ? 'बँकेकडून तपासा' : 'Check with bank');
  return (
    <section id="banks" className="mt-10 scroll-mt-24">
      <h2 className="mb-1 font-display text-xl font-bold text-slate-100 font-deva">
        {mr ? 'बँकांची तुलना — Home Loan' : 'Bank comparison — Home Loan'}
      </h2>
      <p className="mb-4 text-sm text-slate-400 font-deva">{BANK_NOTE[mr ? 'mr' : 'en']}</p>

      <div className="space-y-3">
        {BANK_RATES.map((b) => (
          <article key={b.id} className="glass-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg font-bold text-slate-100">{b.bank}</h3>
              <p className="font-display text-xl font-extrabold text-amber-400">
                {formatRateRange(b.rateMin, b.rateMax)}{' '}
                <span className="text-xs font-medium text-slate-400">{mr ? 'वार्षिक' : 'p.a.'}</span>
                <span className="ml-2 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 font-deva">
                  {b.rateKind === 'from' ? (mr ? 'सुरुवातीचा दर' : 'Starting rate') : mr ? 'दराची श्रेणी' : 'Rate range'}
                </span>
              </p>
              {b.rateNote && <p className="w-full text-xs text-slate-400 font-deva">{b.rateNote[mr ? 'mr' : 'en']}</p>}
            </div>
            <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500 font-deva">{mr ? 'शुल्क' : 'Fees'}</dt>
                <dd className="text-slate-300 font-deva">{L(b.fee)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 font-deva">{mr ? 'कालावधी' : 'Tenure'}</dt>
                <dd className="text-slate-300 font-deva">
                  {b.maxTenureYears ? (mr ? `${b.maxTenureYears} वर्षांपर्यंत` : `Up to ${b.maxTenureYears} years`) : L(null)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-slate-500 font-deva">{mr ? 'अटी' : 'Terms'}</dt>
                <dd className="text-slate-300 font-deva">{L(b.terms)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-slate-500">
              <a
                href={b.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('official_source_click', { source: b.id })}
                className="inline-flex items-center gap-1 text-amber-400 underline"
              >
                {mr ? 'अधिकृत स्रोत' : 'Official source'} <ExternalLink className="h-3 w-3" />
              </a>{' '}
              {b.feeSourceUrl && (
                <>
                  {' · '}
                  <a href={b.feeSourceUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">
                    {mr ? 'शुल्काचा स्रोत' : 'Fee source'}
                  </a>
                </>
              )}{' '}
              · {mr ? 'पडताळणी' : 'Verified'}: {b.verifiedOn}
            </p>
          </article>
        ))}
      </div>

      <p role="note" className="mt-4 flex gap-2 rounded-xl border border-amber-400/30 bg-amber-400/5 p-3 text-sm font-semibold text-amber-200 font-deva">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        {BANK_DISCLAIMER[mr ? 'mr' : 'en']}
      </p>

      {BANKS_PENDING.length > 0 && <p className="mt-4 text-sm text-slate-400 font-deva">
        {mr ? 'लवकरच (अधिकृत दर पडताळल्यानंतर): ' : 'Coming once official rates are verified: '}
        {BANKS_PENDING.map((b, i) => (
          <span key={b.bank}>
            {i > 0 && ', '}
            <a href={b.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">
              {b.bank}
            </a>
          </span>
        ))}
      </p>}
    </section>
  );
}
