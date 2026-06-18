'use client';
// Bank & Patsanstha directory — District → City cascade served live from MongoDB
// (the Institution collection populated from the official banking exports).
// Each level is fetched on demand from /api/locations so no data ships in the bundle.
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Loader2, Landmark, Wallet } from 'lucide-react';
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

type Category = 'all' | 'payments-banks' | 'rbi-authorized';

// A Payments Bank is any institution whose name contains "PAYMENTS BANK".
const isPaymentsBank = (name: string) => /payments\s+bank/i.test(name);

const CATEGORY_LABELS: Record<Category, { en: string; mr: string }> = {
  all: { en: 'All Banks', mr: 'सर्व बँका' },
  'payments-banks': { en: 'Payments Banks', mr: 'पेमेंट्स बँका' },
  'rbi-authorized': { en: 'RBI Authorized', mr: 'RBI मान्यताप्राप्त' },
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
  const [category, setCategory] = useState<Category>('all');

  // SEO deep-link: read the category from the URL on mount (?category=payments-banks).
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('category');
    if (c === 'payments-banks' || c === 'rbi-authorized') setCategory(c);
  }, []);

  // Update the URL when the category changes (no navigation / no extra fetch).
  const selectCategory = (c: Category) => {
    setCategory(c);
    const params = new URLSearchParams(window.location.search);
    if (c === 'all') params.delete('category');
    else params.set('category', c);
    const qs = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
  };

  // Counts + filtered view derived purely from the already-loaded city set
  // (capped at 300) — no duplicate data, no extra queries.
  const counts = useMemo(
    () => ({
      all: branches.length,
      'payments-banks': branches.filter((b) => isPaymentsBank(b.name)).length,
      'rbi-authorized': branches.filter((b) => b.isRbiAuthorized).length,
    }),
    [branches],
  );

  const filteredBranches = useMemo(
    () =>
      branches.filter((b) =>
        category === 'payments-banks'
          ? isPaymentsBank(b.name)
          : category === 'rbi-authorized'
            ? b.isRbiAuthorized
            : true,
      ),
    [branches, category],
  );

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

  // Branches for the current district + city.
  useEffect(() => {
    if (!district || !city) {
      setBranches([]);
      return;
    }
    let active = true;
    setLoadingBranches(true);
    fetchLocations({ district, city })
      .then((j) => active && setBranches(j.data ?? []))
      .catch(() => active && setBranches([]))
      .finally(() => active && setLoadingBranches(false));
    return () => {
      active = false;
    };
  }, [district, city]);

  const onDistrictChange = (v: string) => {
    setDistrict(v);
    setCity('');
    setVoiceNote(null);
  };

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

      {/* Category tabs — horizontally scrollable on mobile */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]">
        {(['all', 'payments-banks', 'rbi-authorized'] as Category[]).map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              onClick={() => selectCategory(c)}
              aria-pressed={active}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold font-deva transition-all ${
                active
                  ? 'border-amber-400 bg-amber-400/15 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.25)]'
                  : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-amber-400/40 hover:text-amber-300'
              }`}
            >
              {CATEGORY_LABELS[c][language]}
              {c !== 'all' && counts[c] > 0 ? ` (${counts[c].toLocaleString('en-IN')})` : ''}
            </button>
          );
        })}
      </div>

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
              {language === 'mr' ? 'शहर/तालुका निवडा' : 'Select City / Taluka'}
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
          ) : filteredBranches.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400 font-deva">
              {category === 'payments-banks'
                ? language === 'mr'
                  ? 'या शहरात पेमेंट्स बँक आढळली नाही.'
                  : 'No Payments Banks found in this city.'
                : category === 'rbi-authorized'
                  ? language === 'mr'
                    ? 'या शहरात RBI मान्यताप्राप्त नोंदी नाहीत.'
                    : 'No RBI Authorized records in this city.'
                  : language === 'mr'
                    ? 'या शहरात नोंदी सापडल्या नाहीत.'
                    : 'No records found for this city.'}
            </p>
          ) : (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
                <p className="font-display text-lg font-bold text-slate-100 font-deva">
                  {titleCase(city)}, {titleCase(district)}
                </p>
                <span className="text-sm font-bold text-bk-gold font-deva">
                  {filteredBranches.length}
                  {branches.length === 300 ? '+' : ''} {language === 'mr' ? 'शाखा' : 'branches'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredBranches.map((b, i) => {
                  const mapsQuery = encodeURIComponent(`${b.name} ${b.branch} ${b.address} ${b.pincode}`);
                  return (
                    <div
                      key={i}
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
                          {isPaymentsBank(b.name) && (
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

                      <div className="mt-4 pt-1">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-amber-400/40 hover:text-amber-300 font-deva"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          {language === 'mr' ? 'नकाशावर पहा' : 'View on Map'}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-500 font-deva">
                {language === 'mr'
                  ? 'टीप: शाखा तपशील अधिकृत निर्यात डेटावरून. भेट देण्यापूर्वी संबंधित बँकेकडे पडताळून पहा.'
                  : 'Note: Branch details are from official export data. Please verify with the bank before visiting.'}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Bottom security warning */}
      <div className="mt-10 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
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
