'use client';
import { useMemo, useState } from 'react';
import { ExternalLink, MapPin, ShieldCheck } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { formatINR } from '@/lib/calculators';
import { EMPTY_FILTERS, MAHARERA_SEARCH_URL, PROJECTS, PROJECT_NOTE, filterProjects, type ProjectFilters } from '@/lib/projects';

export default function ProjectFinder() {
  const lang = useLanguageStore((s) => s.language) === 'mr' ? 'mr' : 'en';
  const mr = lang === 'mr';
  const [f, setF] = useState<ProjectFilters>(EMPTY_FILTERS);

  const cities = useMemo(() => Array.from(new Set(PROJECTS.map((p) => p.city))).sort(), []);
  const types = useMemo(() => Array.from(new Set(PROJECTS.flatMap((p) => p.homeTypes))).sort(), []);
  const results = useMemo(() => filterProjects(PROJECTS, f), [f]);
  const set = <K extends keyof ProjectFilters>(k: K, v: ProjectFilters[K]) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-slate-100 md:text-4xl font-deva">
          {mr ? 'कर्जासाठी पात्र प्रकल्प' : 'Projects Eligible for Home Loan'}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400 font-deva">
          {mr
            ? 'Home Loan उपलब्ध असू शकणारे RERA नोंदणीकृत प्रकल्प शोधा.'
            : 'Find RERA-registered projects where a home loan may be available.'}
        </p>
      </header>

      <p className="mb-5 flex gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-200 font-deva">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        {PROJECT_NOTE[lang]}
      </p>

      <div className="glass-card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <input
          className="bk-input sm:col-span-2 lg:col-span-3"
          placeholder={mr ? 'प्रकल्प, बिल्डर किंवा परिसर शोधा' : 'Search project, builder or area'}
          value={f.query}
          onChange={(e) => set('query', e.target.value)}
          aria-label={mr ? 'शोध' : 'Search'}
        />
        <select className="bk-input" value={f.city} onChange={(e) => set('city', e.target.value)} aria-label={mr ? 'शहर' : 'City'}>
          <option value="">{mr ? 'सर्व शहरे' : 'All cities'}</option>
          {cities.map((c) => (
            <option key={c} value={c} className="bg-bk-card">{c}</option>
          ))}
        </select>
        <select className="bk-input" value={f.homeType} onChange={(e) => set('homeType', e.target.value)} aria-label={mr ? 'घराचा प्रकार' : 'Home type'}>
          <option value="">{mr ? 'सर्व प्रकार' : 'All types'}</option>
          {types.map((c) => (
            <option key={c} value={c} className="bg-bk-card">{c}</option>
          ))}
        </select>
        <select
          className="bk-input"
          value={f.status}
          onChange={(e) => set('status', e.target.value as ProjectFilters['status'])}
          aria-label={mr ? 'स्थिती' : 'Status'}
        >
          <option value="">{mr ? 'Ready / Under Construction' : 'Ready / Under Construction'}</option>
          <option value="ready" className="bg-bk-card">Ready</option>
          <option value="under-construction" className="bg-bk-card">Under Construction</option>
        </select>
        <label className="block">
          <span className="sr-only">{mr ? 'कमाल किंमत' : 'Max price'}</span>
          <input
            type="number"
            min={0}
            step={500_000}
            className="bk-input"
            placeholder={mr ? 'कमाल किंमत ₹' : 'Max price ₹'}
            value={f.maxPrice || ''}
            onChange={(e) => set('maxPrice', Number(e.target.value))}
          />
        </label>
        <label className="flex min-h-[44px] items-center gap-2 text-sm text-slate-300 font-deva">
          <input type="checkbox" checked={f.loanOnly} onChange={(e) => set('loanOnly', e.target.checked)} className="h-5 w-5 accent-amber-400" />
          {mr ? 'बँक कर्ज उपलब्ध असल्याचे नमूद' : 'Bank loan stated as available'}
        </label>
      </div>

      <div className="mt-6 space-y-4" aria-live="polite">
        {PROJECTS.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <h2 className="font-display text-xl font-bold text-slate-100 font-deva">
              {mr ? 'पडताळलेली यादी लवकरच' : 'Verified list coming soon'}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400 font-deva">
              {mr
                ? 'आम्ही फक्त RERA क्रमांक, अधिकृत स्रोत आणि बँकेची माहिती पडताळल्यानंतरच प्रकल्प दाखवतो. तोपर्यंत तुम्ही स्वतः MahaRERA वर प्रकल्पाची नोंदणी तपासू शकता.'
                : 'We list a project only after its RERA number, official source and bank information are verified. Until then you can check any project’s registration on MahaRERA yourself.'}
            </p>
            <a
              href={MAHARERA_SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-amber-400 px-6 font-bold text-slate-950 hover:bg-amber-300 font-deva"
            >
              {mr ? 'MahaRERA वर प्रकल्प तपासा' : 'Check a project on MahaRERA'}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ) : results.length === 0 ? (
          <p className="text-center text-slate-400 font-deva">{mr ? 'या फिल्टरसाठी प्रकल्प सापडले नाहीत.' : 'No projects match these filters.'}</p>
        ) : (
          results.map((p) => (
            <article key={p.id} className="glass-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-100">{p.name}</h2>
                  <p className="text-sm text-slate-400">{p.builder}</p>
                </div>
                <p className="font-display text-xl font-extrabold text-amber-400">
                  {formatINR(p.priceMin)} – {formatINR(p.priceMax)}
                </p>
              </div>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  {p.area}, {p.city}
                  {p.mapUrl && (
                    <a href={p.mapUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-amber-400 underline">
                      {mr ? 'नकाशा' : 'Map'}
                    </a>
                  )}
                </span>
                <span>{p.homeTypes.join(', ')} · {p.sizes} sq ft</span>
                <span>{p.status === 'ready' ? 'Ready' : 'Under Construction'}</span>
              </p>
              <p className="mt-3 inline-block rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-bold text-emerald-300">
                RERA: {p.reraNumber}
              </p>
              <p className="mt-3 text-sm text-slate-300 font-deva">
                {mr ? 'कर्ज उपलब्ध असल्याचे नमूद करणाऱ्या बँका: ' : 'Banks stating loan availability: '}
                {p.loanBanks.length ? p.loanBanks.join(', ') : mr ? 'माहिती नाही' : 'not stated'}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">
                  {mr ? 'अधिकृत स्रोत' : 'Official source'}
                </a>{' '}
                · {mr ? 'पडताळणी' : 'Verified'}: {p.verifiedOn}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
