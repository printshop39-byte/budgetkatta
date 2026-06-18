'use client';
// Bank & Patsanstha directory — District → City cascade served live from MongoDB
// (the Institution collection populated from the official banking exports).
// Each level is fetched on demand from /api/locations so no data ships in the bundle.
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AffiliateBanner from '@/components/AffiliateBanner';
import { MapPin, ShieldCheck, Loader2, Landmark, Wallet, Search, Copy, Check, Info } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import VoiceSearchAgent from '@/components/directory/VoiceSearchAgent';

interface Branch {
  name: string;
  branch: string;
  address: string;
  pincode: string;
  isRbiAuthorized: boolean;
  ifsc: string;
}

// DB values are stored in upper-case English; present them title-cased.
const titleCase = (s: string) =>
  s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bM Corp\b/i, '(M Corp.)');

// Server-side bank category (kept in sync with lib/locations BankFilter). The
// API narrows results to one category; 'main' (Public/Private) is the default.
type BankFilter = 'main' | 'cooperative' | 'sfb' | 'rrb' | 'payments';
const BANK_FILTERS: BankFilter[] = ['main', 'cooperative', 'sfb', 'rrb', 'payments'];

const FILTER_LABELS: Record<BankFilter, { en: string; mr: string }> = {
  main: { en: 'Main Banks', mr: 'मुख्य बँका' },
  cooperative: { en: 'Co-operative', mr: 'सहकारी बँका' },
  sfb: { en: 'Small Finance', mr: 'स्मॉल फायनान्स' },
  rrb: { en: 'Regional Rural', mr: 'ग्रामीण बँका' },
  payments: { en: 'Payments Banks', mr: 'पेमेंट्स बँका' },
};

async function fetchLocations(params: Record<string, string>): Promise<any> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/locations${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('location fetch failed');
  return res.json();
}

export default function DirectoryPage() {
  const { language } = useLanguageStore();

  const [districts, setDistricts] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');

  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [voiceNote, setVoiceNote] = useState<{ text: string; ok: boolean } | null>(null);
  const [filter, setFilter] = useState<BankFilter>('main');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Copy IFSC / address to clipboard with brief "copied" feedback.
  const copyText = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  // SEO deep-link on mount: ?filter=<category> and ?d=<district>&c=<city>
  // (the latter set by the /directory/[district] landing pages).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const f = p.get('filter');
    if (f && (BANK_FILTERS as string[]).includes(f)) setFilter(f as BankFilter);
    const d = p.get('d');
    const c = p.get('c');
    if (d) setDistrict(d);
    if (c) setCity(c);
  }, []);

  // Switching category: update URL only. The branches effect re-fetches for the
  // current district/city with the new filter (district + city are preserved).
  const selectFilter = (f: BankFilter) => {
    if (f === filter) return;
    setFilter(f);
    const params = new URLSearchParams(window.location.search);
    if (f === 'main') params.delete('filter');
    else params.set('filter', f);
    const qs = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
  };

  // Districts on mount.
  useEffect(() => {
    let active = true;
    setLoadingDistricts(true);
    fetchLocations({})
      .then((j) => active && setDistricts(j.data ?? []))
      .catch(() => active && setDistricts([]))
      .finally(() => active && setLoadingDistricts(false));
    return () => {
      active = false;
    };
  }, []);

  // Cities for the current district. (Child resets live in the change handlers so
  // a programmatic voice match can set district + city together.)
  useEffect(() => {
    if (!district) {
      setCities([]);
      return;
    }
    let active = true;
    setLoadingCities(true);
    fetchLocations({ district })
      .then((j) => active && setCities(j.data ?? []))
      .catch(() => active && setCities([]))
      .finally(() => active && setLoadingCities(false));
    return () => {
      active = false;
    };
  }, [district]);

  // Branches for the current district + city + category (first page).
  useEffect(() => {
    if (!district || !city) {
      setBranches([]);
      setTotal(0);
      setHasMore(false);
      return;
    }
    let active = true;
    setLoadingBranches(true);
    setPage(0);
    fetchLocations({ district, city, filter, page: '0' })
      .then((j) => {
        if (!active) return;
        setBranches(j.data ?? []);
        setTotal(j.total ?? (j.data?.length ?? 0));
        setHasMore(Boolean(j.hasMore));
      })
      .catch(() => {
        if (!active) return;
        setBranches([]);
        setTotal(0);
        setHasMore(false);
      })
      .finally(() => active && setLoadingBranches(false));
    return () => {
      active = false;
    };
  }, [district, city, filter]);

  // Append the next page of branches ("Load More").
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const next = page + 1;
    setLoadingMore(true);
    try {
      const j = await fetchLocations({ district, city, filter, page: String(next) });
      setBranches((prev) => [...prev, ...(j.data ?? [])]);
      setTotal(j.total ?? total);
      setHasMore(Boolean(j.hasMore));
      setPage(next);
    } catch {
      /* keep what we have */
    } finally {
      setLoadingMore(false);
    }
  };

  const onDistrictChange = (v: string) => {
    setDistrict(v);
    setCity('');
    setQuery('');
    setVoiceNote(null);
  };

  // Client-side narrowing of the city's loaded branches by name / branch /
  // address / IFSC / pincode. Server already scoped to district + city.
  const q = query.trim().toLowerCase();
  const visibleBranches = q
    ? branches.filter((b) =>
        [b.name, b.branch, b.address, b.pincode, b.ifsc]
          .filter(Boolean)
          .some((f) => f.toLowerCase().includes(q))
      )
    : branches;

  // Voice transcript → server fuzzy search → apply matched district + city.
  const handleVoiceResult = async (transcript: string) => {
    try {
      const j = await fetchLocations({ q: transcript });
      const m = j.match;
      if (m?.matched && m.district) {
        setDistrict(m.district);
        setCity(m.city ?? '');
        setVoiceNote({
          text: (language === 'mr' ? 'दाखवत आहे: ' : 'Showing results for: ') + titleCase(m.city || m.district),
          ok: true,
        });
        setTimeout(() => document.getElementById('voice-results')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
      } else {
        setVoiceNote({ text: language === 'mr' ? 'काही जुळले नाही. पुन्हा प्रयत्न करा.' : 'No match found. Please try again.', ok: false });
      }
    } catch {
      setVoiceNote({ text: language === 'mr' ? 'शोध अयशस्वी.' : 'Search failed.', ok: false });
    }
  };

  const selectClass =
    'w-full rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 font-deva outline-none transition-colors focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-40';
  const Spinner = () => <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-slate-100 md:text-4xl font-deva">
          {language === 'mr' ? 'बँक व पतसंस्था डिरेक्टरी' : 'Bank & Patsanstha Directory'}
        </h1>
        <p className="mt-2 text-slate-400 font-deva">
          {language === 'mr'
            ? 'पिनकोड माहित नसेल तरी चालेल — जिल्हा आणि शहर/परिसर निवडा.'
            : "Don't know the pincode? Just pick your District and City/Area."}
        </p>
      </header>

      {/* Universal search — Enter locates a place/pincode (server `q` search);
          typing live-filters the loaded branch list below. */}
      <div className="mb-5">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) handleVoiceResult(query.trim());
            }}
            placeholder={
              language === 'mr'
                ? 'बँकेचे नाव, गाव, IFSC किंवा पिनकोड शोधा'
                : 'Search by Bank Name, Village, IFSC, or Pincode'
            }
            aria-label={language === 'mr' ? 'बँक शोधा' : 'Search banks'}
            className="w-full rounded-xl border border-slate-700/60 bg-slate-900/70 py-3 pl-10 pr-4 text-sm text-slate-200 font-deva outline-none transition-colors placeholder:text-slate-500 focus:border-amber-400"
          />
        </label>
        <p className="mt-1.5 px-1 text-xs text-slate-500 font-deva">
          {language === 'mr'
            ? 'गाव/पिनकोड शोधण्यासाठी Enter दाबा, किंवा खाली जिल्हा व शहर निवडा.'
            : 'Press Enter to find a village/pincode, or pick a district and city below.'}
        </p>
      </div>

      {/* Bank-type tabs — horizontally scrollable on mobile */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]">
        {BANK_FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => selectFilter(f)}
              aria-pressed={active}
              className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2 text-sm font-bold font-deva transition-all ${
                active
                  ? 'border-amber-400 bg-amber-400/15 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.25)]'
                  : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-amber-400/40 hover:text-amber-300'
              }`}
            >
              {FILTER_LABELS[f][language]}
            </button>
          );
        })}
      </div>

      {/* Payments-bank disclaimer — these are not full bank branches */}
      {filter === 'payments' && (
        <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-sky-400/30 bg-sky-400/10 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
          <p className="text-sm leading-relaxed text-sky-100 font-deva">
            {language === 'mr'
              ? 'ही पूर्ण बँक शाखा नसून पेमेंट्स बँक / सेवा केंद्र (CSP/BC) असू शकते. येथे ठेव, कर्ज व काही सेवा मर्यादित असतात — संपूर्ण बँकिंगसाठी मुख्य बँक निवडा. '
              : 'These may be Payments Banks / service points (CSP/BC), not full bank branches. Deposits, loans and some services are limited here — choose Main Banks for full banking. '}
            <Link href="/guides/payments-bank" className="font-bold text-sky-300 underline">
              {language === 'mr' ? 'अधिक माहिती →' : 'Learn more →'}
            </Link>
          </p>
        </div>
      )}

      {/* Cascading dropdowns */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* District */}
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 font-deva">
              {language === 'mr' ? 'जिल्हा निवडा' : 'Select District'}
              {loadingDistricts && <Spinner />}
            </span>
            <select value={district} disabled={loadingDistricts} onChange={(e) => onDistrictChange(e.target.value)} className={selectClass}>
              <option value="">{language === 'mr' ? '— जिल्हा —' : '— District —'}</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {titleCase(d)}
                </option>
              ))}
            </select>
          </label>

          {/* City / Taluka */}
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 font-deva">
              {language === 'mr' ? 'शहर / तालुका निवडा' : 'Select City / Taluka'}
              {loadingCities && <Spinner />}
            </span>
            <select value={city} disabled={!district || loadingCities} onChange={(e) => setCity(e.target.value)} className={selectClass}>
              <option value="">{language === 'mr' ? '— शहर/तालुका —' : '— City / Taluka —'}</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {titleCase(c)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Results */}
      {city && (
        <div id="voice-results" className="mt-8">
          {loadingBranches ? (
            <div className="flex items-center justify-center gap-2 py-12 text-slate-400 font-deva">
              <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
              {language === 'mr' ? 'शाखा शोधत आहे…' : 'Finding branches…'}
            </div>
          ) : branches.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400 font-deva">
              {language === 'mr'
                ? `या शहरात "${FILTER_LABELS[filter].mr}" आढळल्या नाहीत.`
                : `No ${FILTER_LABELS[filter].en} found in this city.`}
            </p>
          ) : (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
                <p className="font-display text-lg font-bold text-slate-100 font-deva">
                  {titleCase(city)}, {titleCase(district)}
                </p>
                <span className="text-sm font-bold text-bk-gold font-deva">
                  {q ? visibleBranches.length : total} {language === 'mr' ? 'शाखा' : 'branches'}
                </span>
              </div>

              {visibleBranches.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400 font-deva">
                  {language === 'mr'
                    ? `"${query}" साठी काही जुळले नाही.`
                    : `No matches for "${query}".`}
                </p>
              ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {visibleBranches.map((b, i) => {
                  const mapsQuery = encodeURIComponent(`${b.name} ${b.branch} ${b.address} ${b.pincode}`);
                  return (
                    <Fragment key={i}>
                    <div
                      className="flex flex-col rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {b.isRbiAuthorized && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300 font-deva">
                              <ShieldCheck className="h-3 w-3" />
                              {language === 'mr' ? '🟢 RBI नोंदणीकृत' : '🟢 RBI Authorized'}
                            </span>
                          )}
                          {filter === 'payments' && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-400/10 px-2.5 py-1 text-[10px] font-bold text-sky-300 font-deva">
                              <Wallet className="h-3 w-3" />
                              {language === 'mr' ? 'पेमेंट्स बँक' : 'Payments Bank'}
                            </span>
                          )}
                        </div>
                        {b.ifsc && (
                          <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 font-mono text-[10px] font-medium text-slate-400">
                            {b.ifsc}
                          </span>
                        )}
                      </div>

                      <h3 className="flex items-center gap-1.5 text-base font-bold text-slate-100 font-deva">
                        <Landmark className="h-4 w-4 shrink-0 text-amber-400" />
                        {b.name}
                      </h3>
                      {b.branch && <p className="mt-0.5 text-sm font-medium text-amber-300/90 font-deva">{b.branch}</p>}
                      {b.address && <p className="mt-1 text-sm text-slate-400 font-deva">{b.address}</p>}
                      {b.pincode && (
                        <p className="mt-1 text-xs text-slate-400 font-deva">
                          {language === 'mr' ? 'पिनकोड' : 'Pincode'}: <span className="font-semibold text-slate-300">{b.pincode}</span>
                        </p>
                      )}

                      {filter === 'payments' && (
                        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 p-2.5">
                          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                          <p className="text-[11px] leading-snug text-amber-200 font-deva">
                            {language === 'mr'
                              ? 'ही पूर्ण बँक शाखा नसून पेमेंट्स बँक/सेवा केंद्र असू शकते.'
                              : 'This may be a Payments Bank/Service Center, not a full-service bank branch.'}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2 pt-1">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-amber-400/40 hover:text-amber-300 font-deva"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          {language === 'mr' ? 'नकाशावर पहा' : 'View on Map'}
                        </a>
                        {b.ifsc && (
                          <button
                            onClick={() => copyText(`ifsc-${i}`, b.ifsc)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-amber-400/40 hover:text-amber-300 font-deva"
                          >
                            {copied === `ifsc-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            {copied === `ifsc-${i}`
                              ? language === 'mr' ? 'कॉपी झाले!' : 'Copied!'
                              : language === 'mr' ? 'IFSC कॉपी' : 'IFSC Copy'}
                          </button>
                        )}
                        {b.address && (
                          <button
                            onClick={() => copyText(`addr-${i}`, [b.name, b.branch, b.address, b.pincode].filter(Boolean).join(', '))}
                            className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-amber-400/40 hover:text-amber-300 font-deva"
                          >
                            {copied === `addr-${i}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                            {copied === `addr-${i}`
                              ? language === 'mr' ? 'कॉपी झाले!' : 'Copied!'
                              : language === 'mr' ? 'पत्ता कॉपी' : 'Address Copy'}
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Affiliate slot after every 10th branch (full-width) */}
                    {(i + 1) % 10 === 0 && (
                      <AffiliateBanner
                        className="md:col-span-2"
                        variant={((i + 1) / 10) % 2 === 0 ? 'creditCard' : 'demat'}
                      />
                    )}
                    </Fragment>
                  );
                })}
              </div>
              )}

              {/* Load More — hidden while a client-side search is active */}
              {!q && hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-6 py-2.5 text-sm font-bold text-amber-300 transition-colors hover:bg-amber-400/20 disabled:opacity-60 font-deva"
                  >
                    {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                    {language === 'mr' ? 'अधिक शाखा पहा' : 'Load More'}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Global trust note — always visible at the bottom of the directory */}
      <p className="mt-10 text-center text-xs leading-relaxed text-slate-500 font-deva">
        {language === 'mr'
          ? 'माहिती RBI/बँकांच्या उपलब्ध डेटावर आधारित आहे. भेट देण्यापूर्वी बँकेशी खात्री करा.'
          : 'Information is based on available RBI/Bank data. Please verify with the bank before visiting.'}
      </p>

      {/* Bottom security warning */}
      <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
        <p className="bk-security-note text-center text-sm font-semibold leading-relaxed text-rose-200 font-deva">
          {language === 'mr'
            ? '🔒 सुरक्षा सतर्कता: बजेटकट्टा कधीही मोबाईल OTP किंवा वैयक्तिक कागदपत्रांची मागणी करत नाही.'
            : '🔒 Security Warning: BudgetKatta never asks for mobile OTP or personal documents.'}
        </p>
      </div>

      {/* Voice-activated AI search */}
      <VoiceSearchAgent language={language} onResult={handleVoiceResult} note={voiceNote} />
    </div>
  );
}
