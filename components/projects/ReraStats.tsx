'use client';
// ReraStats — district-wise new MahaRERA approvals (western Maharashtra) plus a
// RERA-number helper that copies the number and opens the OFFICIAL portal. We
// never copy MahaRERA's project list into this site. Bars are plain width
// styles (no animation) so everything renders without JS-driven effects.
import { useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { track } from '@/lib/analytics';
import {
  MAHARERA_HOME_URL,
  RERA_COUNTS,
  RERA_DISTRICTS,
  RERA_NUMBER_RE,
  RERA_STATS_UPDATED,
  RERA_YEAR_LABEL,
  normalizeReraNumber,
  reraGrowth,
  type ReraDistrict,
  type ReraYear,
} from '@/lib/reraStats';

const fmt = (n: number) => n.toLocaleString('en-IN');

export default function ReraStats() {
  const mr = useLanguageStore((s) => s.language) === 'mr';
  const lang = mr ? 'mr' : 'en';
  const [year, setYear] = useState<ReraYear>('fy26');
  const [active, setActive] = useState<ReraDistrict | null>(null);
  const [noPune, setNoPune] = useState(false);
  const [num, setNum] = useState('');
  const [msg, setMsg] = useState('');

  const other: ReraYear = year === 'fy26' ? 'fy24' : 'fy26';
  const counts = RERA_COUNTS[year];
  const pool = RERA_DISTRICTS.filter((d) => counts[d.id] != null && !(noPune && d.id === 'Pune'));
  const max = Math.max(1, ...pool.map((d) => counts[d.id] as number));

  async function check(e: React.FormEvent) {
    e.preventDefault();
    const n = normalizeReraNumber(num);
    if (!RERA_NUMBER_RE.test(n)) {
      setMsg(mr ? 'क्रमांक P + ११ अंक (उदा. P52100012345) किंवा PR/PM + १३ अंक (उदा. PR1150002601102) असा असावा.' : 'Must be P + 11 digits (e.g. P52100012345) or PR/PM + 13 digits (e.g. PR1150002601102).');
      return;
    }
    try {
      await navigator.clipboard.writeText(n);
      setMsg(mr ? `${n} कॉपी झाला. पोर्टलवर Search मध्ये paste करा.` : `${n} copied. Paste it into the portal search.`);
    } catch {
      setMsg(mr ? `पोर्टल उघडत आहे. क्रमांक स्वतः टाइप करा: ${n}` : `Opening the portal. Type the number yourself: ${n}`);
    }
    track('official_source_click', { source: 'maharera_checker' });
    window.open(MAHARERA_HOME_URL, '_blank', 'noopener,noreferrer');
  }

  const detail = (() => {
    if (!active) return mr ? 'कोणत्याही जिल्ह्याच्या कार्डवर क्लिक करा, त्याची माहिती इथे दिसेल.' : 'Select a district card to see its details here.';
    const d = RERA_DISTRICTS.find((x) => x.id === active)!;
    const v = counts[active];
    const g = reraGrowth(active);
    if (v == null)
      return mr
        ? `${d.mr}: ${RERA_YEAR_LABEL[year].mr} चा जिल्हा-आकडा उपलब्ध नाही. MahaRERA पोर्टलवर जिल्हा फिल्टर लावून तपासा.`
        : `${d.en}: the ${RERA_YEAR_LABEL[year].en} district figure is not available. Check the MahaRERA portal with a district filter.`;
    const base = mr ? `${d.mr}: ${RERA_YEAR_LABEL[year].mr} मध्ये ${fmt(v)} नवीन प्रकल्प मंजूर.` : `${d.en}: ${fmt(v)} new projects approved in ${RERA_YEAR_LABEL[year].en}.`;
    const fy24 = RERA_COUNTS.fy24[active];
    return g !== null && fy24 != null
      ? base + (mr ? ` २०२३-२४ (${fmt(fy24)}) पेक्षा ${g}% जास्त.` : ` ${g}% more than FY 2023-24 (${fmt(fy24)}).`)
      : base;
  })();

  return (
    <section className="mx-auto max-w-5xl px-4 pb-14" aria-labelledby="rera-stats-title">
      <h2 id="rera-stats-title" className="font-display text-2xl font-extrabold text-slate-100 font-deva">
        {mr ? 'पश्चिम महाराष्ट्रात किती प्रकल्पांना MahaRERA मंजुरी?' : 'How many projects got MahaRERA approval in western Maharashtra?'}
      </h2>
      <p className="mt-2 max-w-2xl text-slate-400 font-deva">
        {mr
          ? 'घर किंवा प्लॉट घेण्यापूर्वी प्रकल्प MahaRERA मध्ये नोंदणीकृत आहे का ते तपासा. खाली जिल्हानिहाय नवीन मंजूर प्रकल्पांची तुलना आहे.'
          : 'Before buying a home or plot, check the project is registered with MahaRERA. Below is a district-wise comparison of newly approved projects.'}
      </p>

      <div role="group" aria-label={mr ? 'वर्ष निवडा' : 'Select year'} className="mt-5 inline-flex rounded-full bg-slate-900/70 p-1">
        {(['fy26', 'fy24'] as ReraYear[]).map((y) => (
          <button
            key={y}
            type="button"
            aria-pressed={year === y}
            onClick={() => setYear(y)}
            className={`min-h-[44px] rounded-full px-5 text-sm font-semibold ${year === y ? 'bg-amber-400 text-slate-950' : 'text-slate-300'}`}
          >
            {RERA_YEAR_LABEL[y][lang]}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {RERA_DISTRICTS.map((d) => {
          const v = counts[d.id];
          const prev = RERA_COUNTS[other][d.id];
          const g = reraGrowth(d.id);
          return (
            <button
              key={d.id}
              type="button"
              aria-pressed={active === d.id}
              onClick={() => setActive(d.id)}
              className={`glass-card min-h-[44px] p-4 text-left ${active === d.id ? 'ring-2 ring-amber-400' : ''}`}
            >
              <span className="block text-sm font-semibold text-slate-400 font-deva">{d[lang]}</span>
              {v == null ? (
                <span className="mt-1 block py-2 text-base font-semibold text-slate-500 font-deva">{mr ? 'आकडा नाही' : 'No figure'}</span>
              ) : (
                <span className="mt-1 block font-display text-3xl font-extrabold tabular-nums text-slate-100">{fmt(v)}</span>
              )}
              <span className="block text-xs text-slate-500">
                {RERA_YEAR_LABEL[other][lang]}: {prev == null ? '—' : fmt(prev)}
              </span>
              {year === 'fy26' && g !== null && (
                <span className="mt-2 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                  +{g}% {mr ? 'वाढ' : 'growth'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="glass-card mt-5 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-slate-100 font-deva">{mr ? 'जिल्ह्यांची तुलना' : 'District comparison'}</h3>
          <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-slate-300 font-deva">
            <input type="checkbox" checked={noPune} onChange={(e) => setNoPune(e.target.checked)} className="h-5 w-5 accent-amber-400" />
            {mr ? 'पुणे वगळा (इतर जिल्हे नीट दिसतील)' : 'Exclude Pune (so other districts are visible)'}
          </label>
        </div>
        <div className="space-y-2">
          {RERA_DISTRICTS.filter((d) => counts[d.id] != null).map((d) => {
            const v = counts[d.id] as number;
            const excluded = noPune && d.id === 'Pune';
            return (
              <div key={d.id} className={`grid grid-cols-[76px_1fr_64px] items-center gap-3 ${excluded ? 'opacity-30' : ''}`}>
                <span className="text-sm font-semibold text-slate-300 font-deva">{d[lang]}</span>
                <div
                  className="h-5 overflow-hidden rounded-lg bg-slate-800"
                  role="img"
                  aria-label={`${d[lang]} ${v} ${mr ? 'प्रकल्प' : 'projects'}`}
                >
                  <div
                    className={`h-full rounded-lg ${active === d.id ? 'bg-amber-400' : 'bg-sky-400/80'}`}
                    style={{ width: excluded ? '0%' : `${Math.max(2, (v / max) * 100)}%` }}
                  />
                </div>
                <span className="text-right text-sm font-extrabold tabular-nums text-slate-100">{fmt(v)}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 border-t border-slate-800 pt-3 text-sm text-slate-400 font-deva" aria-live="polite">
          {detail}
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4">
        <h3 className="font-display text-lg font-bold text-slate-100 font-deva">{mr ? 'RERA क्रमांक तपासा' : 'Check a RERA number'}</h3>
        <p className="mt-1 text-sm text-slate-400 font-deva">
          {mr
            ? 'प्रकल्प क्रमांक टाका (उदा. P52100012345 किंवा PR1150002601102). तो कॉपी होऊन MahaRERA पोर्टल उघडेल; तिथे Search मध्ये paste करा.'
            : 'Enter the project number (e.g. P52100012345 or PR1150002601102). It is copied and the MahaRERA portal opens; paste it into Search there.'}
        </p>
        <form onSubmit={check} noValidate className="mt-3 flex flex-wrap gap-2">
          <input
            value={num}
            onChange={(e) => setNum(e.target.value)}
            maxLength={15}
            placeholder="P5210XXXXXXX"
            aria-label={mr ? 'MahaRERA प्रकल्प क्रमांक' : 'MahaRERA project number'}
            autoComplete="off"
            className="bk-input min-w-[200px] flex-1 uppercase tracking-wider"
          />
          <button type="submit" className="min-h-[44px] rounded-xl bg-amber-400 px-5 font-bold text-slate-950 hover:bg-amber-300 font-deva">
            {mr ? 'MahaRERA वर तपासा' : 'Check on MahaRERA'}
          </button>
        </form>
        <p role="status" className="mt-2 min-h-[1.4em] text-sm text-amber-200 font-deva">{msg}</p>

        <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900/50 p-3">
          <p className="text-sm font-bold text-slate-100 font-deva">{mr ? 'पोर्टलवर काय जुळवायचे' : 'What to match on the portal'}</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-slate-300 font-deva">
            <li>{mr ? 'प्रकल्पाचे नाव — जाहिरात/करारातील नावाशी जुळते का' : 'Project name — does it match the advertisement / agreement'}</li>
            <li>{mr ? 'बिल्डर (promoter) — नाव तेच आहे का' : 'Builder (promoter) — is it the same name'}</li>
            <li>{mr ? 'नोंदणी व पूर्णत्व तारीख — प्रकल्प चालू आहे की संपलेला' : 'Registration and completion dates — is the project ongoing or finished'}</li>
          </ul>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500 font-deva">
        {mr
          ? `स्रोत: MahaRERA आकडेवारी (FY 2023-24 आणि FY 2025-26 साठी नवीन मंजूर प्रकल्प). सांगली आणि सोलापूरचे २०२५-२६ चे जिल्हा-आकडे उपलब्ध झाले नाहीत. अधिकृत यादी: `
          : `Source: MahaRERA statistics (newly approved projects, FY 2023-24 and FY 2025-26). Sangli and Solapur FY 2025-26 district figures were not available. Official list: `}
        <a href={MAHARERA_HOME_URL} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">
          maharera.maharashtra.gov.in
        </a>
        . {mr ? 'शेवटचे अपडेट' : 'Last updated'}: {RERA_STATS_UPDATED}.
      </p>
    </section>
  );
}
