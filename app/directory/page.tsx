'use client';
// Bank & Patsanstha directory — District → Taluka → Village cascade.
// Data is fetched on demand from /api/locations (server-driven, so the 36-district
// dataset never ships in the client bundle). Each level loads only when needed.
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, ShieldCheck, Loader2 } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import VoiceSearchAgent from '@/components/directory/VoiceSearchAgent';

type Bi = { en: string; mr: string };
type BranchType = 'DCCB' | 'Patsanstha' | 'Commercial';
type Ref = { id: string; name: Bi };
interface Branch {
  name: Bi;
  type: BranchType;
  address: Bi;
  phone?: string;
}
interface Village {
  id: string;
  name: Bi;
  pincode: string;
  branches: Branch[];
}

const branchTypeLabel: Record<BranchType, Bi> = {
  DCCB: { en: 'District Co-op Bank (DCCB)', mr: 'जिल्हा बँक (DCCB)' },
  Patsanstha: { en: 'Patsanstha', mr: 'पतसंस्था' },
  Commercial: { en: 'Commercial Bank', mr: 'व्यापारी बँक' },
};

const tr = (b: Bi, lang: 'en' | 'mr') => b[lang];

async function fetchLocations(params: Record<string, string>): Promise<any[]> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/locations${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('location fetch failed');
  const json = await res.json();
  return json.data ?? [];
}

export default function DirectoryPage() {
  const { language } = useLanguageStore();

  const [districts, setDistricts] = useState<Ref[]>([]);
  const [talukas, setTalukas] = useState<Ref[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  const [districtId, setDistrictId] = useState('');
  const [talukaId, setTalukaId] = useState('');
  const [villageId, setVillageId] = useState('');

  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingTalukas, setLoadingTalukas] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const [voiceNote, setVoiceNote] = useState<{ text: string; ok: boolean } | null>(null);

  // Districts on mount.
  useEffect(() => {
    let active = true;
    setLoadingDistricts(true);
    fetchLocations({})
      .then((data) => active && setDistricts(data))
      .catch(() => active && setDistricts([]))
      .finally(() => active && setLoadingDistricts(false));
    return () => {
      active = false;
    };
  }, []);

  // Fetch talukas for the current district. Child resets live in the change
  // handlers (not here) so a programmatic voice match can set all 3 IDs at once.
  useEffect(() => {
    if (!districtId) {
      setTalukas([]);
      return;
    }
    let active = true;
    setLoadingTalukas(true);
    fetchLocations({ district: districtId })
      .then((data) => active && setTalukas(data))
      .catch(() => active && setTalukas([]))
      .finally(() => active && setLoadingTalukas(false));
    return () => {
      active = false;
    };
  }, [districtId]);

  // Fetch villages for the current district + taluka.
  useEffect(() => {
    if (!districtId || !talukaId) {
      setVillages([]);
      return;
    }
    let active = true;
    setLoadingVillages(true);
    fetchLocations({ district: districtId, taluka: talukaId })
      .then((data) => active && setVillages(data))
      .catch(() => active && setVillages([]))
      .finally(() => active && setLoadingVillages(false));
    return () => {
      active = false;
    };
  }, [districtId, talukaId]);

  // Manual selection handlers own the cascade reset.
  const onDistrictChange = (id: string) => {
    setDistrictId(id);
    setTalukaId('');
    setVillageId('');
    setVoiceNote(null);
  };
  const onTalukaChange = (id: string) => {
    setTalukaId(id);
    setVillageId('');
  };

  // Voice transcript → server fuzzy search → apply the matched chain.
  const handleVoiceResult = async (transcript: string) => {
    try {
      const res = await fetch(`/api/locations?q=${encodeURIComponent(transcript)}`, { cache: 'no-store' });
      const json = await res.json();
      const m = json.match;
      if (m?.matched) {
        setDistrictId(m.districtId);
        setTalukaId(m.talukaId);
        setVillageId(m.villageId);
        const place = m.district ? m.district[language] : '';
        setVoiceNote({ text: (language === 'mr' ? 'दाखवत आहे: ' : 'Showing results for: ') + place, ok: true });
        setTimeout(() => document.getElementById('voice-results')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
      } else {
        setVoiceNote({ text: language === 'mr' ? 'काही जुळले नाही. पुन्हा प्रयत्न करा.' : 'No match found. Please try again.', ok: false });
      }
    } catch {
      setVoiceNote({ text: language === 'mr' ? 'शोध अयशस्वी. पुन्हा प्रयत्न करा.' : 'Search failed. Please try again.', ok: false });
    }
  };

  const village = useMemo(() => villages.find((v) => v.id === villageId), [villages, villageId]);
  const districtName = districts.find((x) => x.id === districtId)?.name;
  const talukaName = talukas.find((x) => x.id === talukaId)?.name;

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
            ? 'पिनकोड माहित नसेल तरी चालेल — जिल्हा, तालुका आणि गाव निवडा.'
            : "Don't know the pincode? Just pick your District, Taluka and Village."}
        </p>
      </header>

      {/* Cascading dropdowns */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* District */}
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 font-deva">
              {language === 'mr' ? 'जिल्हा निवडा' : 'Select District'}
              {loadingDistricts && <Spinner />}
            </span>
            <select
              value={districtId}
              disabled={loadingDistricts}
              onChange={(e) => onDistrictChange(e.target.value)}
              className={selectClass}
            >
              <option value="">{language === 'mr' ? '— जिल्हा —' : '— District —'}</option>
              {districts.map((dd) => (
                <option key={dd.id} value={dd.id}>
                  {tr(dd.name, language)}
                </option>
              ))}
            </select>
          </label>

          {/* Taluka */}
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 font-deva">
              {language === 'mr' ? 'तालुका निवडा' : 'Select Taluka'}
              {loadingTalukas && <Spinner />}
            </span>
            <select
              value={talukaId}
              disabled={!districtId || loadingTalukas}
              onChange={(e) => onTalukaChange(e.target.value)}
              className={selectClass}
            >
              <option value="">{language === 'mr' ? '— तालुका —' : '— Taluka —'}</option>
              {talukas.map((tk) => (
                <option key={tk.id} value={tk.id}>
                  {tr(tk.name, language)}
                </option>
              ))}
            </select>
          </label>

          {/* Village */}
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 font-deva">
              {language === 'mr' ? 'गाव/परिसर निवडा' : 'Select Village/Area'}
              {loadingVillages && <Spinner />}
            </span>
            <select
              value={villageId}
              disabled={!talukaId || loadingVillages}
              onChange={(e) => setVillageId(e.target.value)}
              className={selectClass}
            >
              <option value="">{language === 'mr' ? '— गाव/परिसर —' : '— Village/Area —'}</option>
              {villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {tr(v.name, language)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Results */}
      {village && districtName && talukaName && (
        <motion.div id="voice-results" key={village.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          {/* Pincode banner */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400 font-deva">
                {language === 'mr' ? 'पिनकोड' : 'Pincode'}
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold text-bk-gold">{village.pincode}</p>
            </div>
            <p className="text-sm text-slate-300 font-deva">
              {tr(village.name, language)}, {tr(talukaName, language)}, {tr(districtName, language)}
            </p>
          </div>

          {/* Branch cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {village.branches.map((b, i) => {
              const mapsQuery = encodeURIComponent(`${b.name.en}, ${b.address.en}, ${village.pincode}`);
              return (
                <div
                  key={i}
                  className="flex flex-col rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300 font-deva">
                      <ShieldCheck className="h-3 w-3" />
                      {language === 'mr' ? '🟢 RBI नोंदणीकृत' : '🟢 RBI Authorized'}
                    </span>
                    <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-[10px] font-medium text-slate-400 font-deva">
                      {tr(branchTypeLabel[b.type], language)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 font-deva">{tr(b.name, language)}</h3>
                  <p className="mt-1 text-sm text-slate-400 font-deva">{tr(b.address, language)}</p>
                  <p className="mt-1 text-xs text-slate-400 font-deva">
                    {language === 'mr' ? 'पिनकोड' : 'Pincode'}:{' '}
                    <span className="font-semibold text-slate-300">{village.pincode}</span>
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 pt-1">
                    {b.phone && (
                      <a
                        href={`tel:${b.phone}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-300 font-deva"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {language === 'mr' ? 'कॉल करा' : 'Call'}
                      </a>
                    )}
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

          {/* Honest data note */}
          <p className="mt-4 text-xs leading-relaxed text-slate-500 font-deva">
            {language === 'mr'
              ? 'टीप: ही प्रातिनिधिक नमुना यादी आहे. शाखा, पत्ता व दूरध्वनी क्रमांक भेट देण्यापूर्वी संबंधित बँकेकडे पडताळून पहा.'
              : 'Note: This is a representative sample listing. Please verify the branch, address and phone number with the bank before visiting.'}
          </p>
        </motion.div>
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
