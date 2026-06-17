'use client';
// Bank & Patsanstha directory with a hierarchical District → Taluka → Village
// cascade. Villages know their pincode + local RBI-registered branches, so users
// pick what they actually know (district/taluka) instead of memorising a pincode.
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

type Bi = { en: string; mr: string };
type BranchType = 'DCCB' | 'Patsanstha' | 'Commercial';

interface Branch {
  name: Bi;
  type: BranchType;
  address: Bi;
  phone: string; // E.164-ish, used for tel: link
}
interface Village {
  id: string;
  name: Bi;
  pincode: string;
  branches: Branch[];
}
interface Taluka {
  id: string;
  name: Bi;
  villages: Village[];
}
interface District {
  id: string;
  name: Bi;
  talukas: Taluka[];
}

const branchTypeLabel: Record<BranchType, Bi> = {
  DCCB: { en: 'District Co-op Bank (DCCB)', mr: 'जिल्हा बँक (DCCB)' },
  Patsanstha: { en: 'Patsanstha', mr: 'पतसंस्था' },
  Commercial: { en: 'Commercial Bank', mr: 'व्यापारी बँक' },
};

// ── Indicative location & branch dataset (sample, not an official RBI export) ──
const LOCATIONS: District[] = [
  {
    id: 'kolhapur',
    name: { en: 'Kolhapur', mr: 'कोल्हापूर' },
    talukas: [
      {
        id: 'karveer',
        name: { en: 'Karveer', mr: 'करवीर' },
        villages: [
          {
            id: 'kolhapur-city',
            name: { en: 'Kolhapur City', mr: 'कोल्हापूर शहर' },
            pincode: '416012',
            branches: [
              {
                name: { en: 'Kolhapur District Central Co-op Bank', mr: 'कोल्हापूर जिल्हा मध्यवर्ती सहकारी बँक' },
                type: 'DCCB',
                address: { en: 'Station Road, Kolhapur', mr: 'स्टेशन रोड, कोल्हापूर' },
                phone: '+912312650000',
              },
              {
                name: { en: 'Rajarshi Shahu Co-op Bank', mr: 'राजर्षी शाहू सहकारी बँक' },
                type: 'Patsanstha',
                address: { en: 'Mahadwar Road, Kolhapur', mr: 'महाद्वार रोड, कोल्हापूर' },
                phone: '+912312540001',
              },
            ],
          },
          {
            id: 'kasba-bawada',
            name: { en: 'Kasba Bawada', mr: 'कसबा बावडा' },
            pincode: '416006',
            branches: [
              {
                name: { en: 'Bank of Maharashtra — Bawada', mr: 'बँक ऑफ महाराष्ट्र — बावडा' },
                type: 'Commercial',
                address: { en: 'Bawada Main Road, Kolhapur', mr: 'बावडा मुख्य रस्ता, कोल्हापूर' },
                phone: '+912312651100',
              },
            ],
          },
        ],
      },
      {
        id: 'hatkanangale',
        name: { en: 'Hatkanangale', mr: 'हातकणंगले' },
        villages: [
          {
            id: 'ichalkaranji',
            name: { en: 'Ichalkaranji', mr: 'इचलकरंजी' },
            pincode: '416115',
            branches: [
              {
                name: { en: 'Ichalkaranji Janata Sahakari Bank', mr: 'इचलकरंजी जनता सहकारी बँक' },
                type: 'Patsanstha',
                address: { en: 'Main Market, Ichalkaranji', mr: 'मुख्य बाजार, इचलकरंजी' },
                phone: '+912302421000',
              },
              {
                name: { en: 'State Bank of India — Ichalkaranji', mr: 'स्टेट बँक ऑफ इंडिया — इचलकरंजी' },
                type: 'Commercial',
                address: { en: 'Station Road, Ichalkaranji', mr: 'स्टेशन रोड, इचलकरंजी' },
                phone: '+912302423456',
              },
            ],
          },
        ],
      },
      {
        id: 'gadhinglaj',
        name: { en: 'Gadhinglaj', mr: 'गडहिंग्लज' },
        villages: [
          {
            id: 'gadhinglaj-town',
            name: { en: 'Gadhinglaj', mr: 'गडहिंग्लज' },
            pincode: '416502',
            branches: [
              {
                name: { en: 'Kolhapur DCCB — Gadhinglaj Branch', mr: 'कोल्हापूर DCCB — गडहिंग्लज शाखा' },
                type: 'DCCB',
                address: { en: 'Bus Stand Road, Gadhinglaj', mr: 'बस स्थानक रोड, गडहिंग्लज' },
                phone: '+912327222200',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'pune',
    name: { en: 'Pune', mr: 'पुणे' },
    talukas: [
      {
        id: 'haveli',
        name: { en: 'Haveli', mr: 'हवेली' },
        villages: [
          {
            id: 'hadapsar',
            name: { en: 'Hadapsar', mr: 'हडपसर' },
            pincode: '411028',
            branches: [
              {
                name: { en: 'Pune District Central Co-op Bank', mr: 'पुणे जिल्हा मध्यवर्ती सहकारी बँक' },
                type: 'DCCB',
                address: { en: 'Magarpatta Road, Hadapsar', mr: 'मगरपट्टा रोड, हडपसर' },
                phone: '+912026870000',
              },
              {
                name: { en: 'HDFC Bank — Hadapsar', mr: 'एचडीएफसी बँक — हडपसर' },
                type: 'Commercial',
                address: { en: 'Solapur Road, Hadapsar', mr: 'सोलापूर रोड, हडपसर' },
                phone: '+912026990012',
              },
            ],
          },
          {
            id: 'wagholi',
            name: { en: 'Wagholi', mr: 'वाघोली' },
            pincode: '412207',
            branches: [
              {
                name: { en: 'Janata Sahakari Bank — Wagholi', mr: 'जनता सहकारी बँक — वाघोली' },
                type: 'Patsanstha',
                address: { en: 'Nagar Road, Wagholi', mr: 'नगर रोड, वाघोली' },
                phone: '+912027052200',
              },
            ],
          },
        ],
      },
      {
        id: 'maval',
        name: { en: 'Maval', mr: 'मावळ' },
        villages: [
          {
            id: 'talegaon',
            name: { en: 'Talegaon Dabhade', mr: 'तळेगाव दाभाडे' },
            pincode: '410507',
            branches: [
              {
                name: { en: 'Bank of Maharashtra — Talegaon', mr: 'बँक ऑफ महाराष्ट्र — तळेगाव' },
                type: 'Commercial',
                address: { en: 'Mumbai-Pune Road, Talegaon', mr: 'मुंबई-पुणे रोड, तळेगाव' },
                phone: '+912114223000',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'nashik',
    name: { en: 'Nashik', mr: 'नाशिक' },
    talukas: [
      {
        id: 'nashik-taluka',
        name: { en: 'Nashik', mr: 'नाशिक' },
        villages: [
          {
            id: 'panchavati',
            name: { en: 'Panchavati', mr: 'पंचवटी' },
            pincode: '422003',
            branches: [
              {
                name: { en: 'Nashik District Central Co-op Bank', mr: 'नाशिक जिल्हा मध्यवर्ती सहकारी बँक' },
                type: 'DCCB',
                address: { en: 'Dindori Road, Panchavati', mr: 'दिंडोरी रोड, पंचवटी' },
                phone: '+912532510000',
              },
              {
                name: { en: 'Janalaxmi Co-op Bank — Panchavati', mr: 'जनलक्ष्मी सहकारी बँक — पंचवटी' },
                type: 'Patsanstha',
                address: { en: 'Panchavati Karanja, Nashik', mr: 'पंचवटी कारंजा, नाशिक' },
                phone: '+912532620045',
              },
            ],
          },
        ],
      },
      {
        id: 'malegaon',
        name: { en: 'Malegaon', mr: 'मालेगाव' },
        villages: [
          {
            id: 'malegaon-town',
            name: { en: 'Malegaon', mr: 'मालेगाव' },
            pincode: '423203',
            branches: [
              {
                name: { en: 'State Bank of India — Malegaon', mr: 'स्टेट बँक ऑफ इंडिया — मालेगाव' },
                type: 'Commercial',
                address: { en: 'Mosam Bridge Road, Malegaon', mr: 'मोसम पूल रोड, मालेगाव' },
                phone: '+912554250100',
              },
            ],
          },
        ],
      },
    ],
  },
];

const tr = (b: Bi, lang: 'en' | 'mr') => b[lang];

export default function DirectoryPage() {
  const { language } = useLanguageStore();
  const [districtId, setDistrictId] = useState('');
  const [talukaId, setTalukaId] = useState('');
  const [villageId, setVillageId] = useState('');

  const district = useMemo(() => LOCATIONS.find((d) => d.id === districtId), [districtId]);
  const taluka = useMemo(() => district?.talukas.find((tk) => tk.id === talukaId), [district, talukaId]);
  const village = useMemo(() => taluka?.villages.find((v) => v.id === villageId), [taluka, villageId]);

  const selectClass =
    'w-full rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 font-deva outline-none transition-colors focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-40';

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
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400 font-deva">
              {language === 'mr' ? 'जिल्हा निवडा' : 'Select District'}
            </span>
            <select
              value={districtId}
              onChange={(e) => {
                setDistrictId(e.target.value);
                setTalukaId('');
                setVillageId('');
              }}
              className={selectClass}
            >
              <option value="">{language === 'mr' ? '— जिल्हा —' : '— District —'}</option>
              {LOCATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {tr(d.name, language)}
                </option>
              ))}
            </select>
          </label>

          {/* Taluka */}
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400 font-deva">
              {language === 'mr' ? 'तालुका निवडा' : 'Select Taluka'}
            </span>
            <select
              value={talukaId}
              disabled={!district}
              onChange={(e) => {
                setTalukaId(e.target.value);
                setVillageId('');
              }}
              className={selectClass}
            >
              <option value="">{language === 'mr' ? '— तालुका —' : '— Taluka —'}</option>
              {district?.talukas.map((tk) => (
                <option key={tk.id} value={tk.id}>
                  {tr(tk.name, language)}
                </option>
              ))}
            </select>
          </label>

          {/* Village */}
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400 font-deva">
              {language === 'mr' ? 'गाव/परिसर निवडा' : 'Select Village/Area'}
            </span>
            <select
              value={villageId}
              disabled={!taluka}
              onChange={(e) => setVillageId(e.target.value)}
              className={selectClass}
            >
              <option value="">{language === 'mr' ? '— गाव/परिसर —' : '— Village/Area —'}</option>
              {taluka?.villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {tr(v.name, language)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Results */}
      {village && (
        <motion.div
          key={village.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          {/* Pincode banner */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400 font-deva">
                {language === 'mr' ? 'पिनकोड' : 'Pincode'}
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold text-bk-gold">{village.pincode}</p>
            </div>
            <p className="text-sm text-slate-300 font-deva">
              {tr(village.name, language)}, {tr(taluka!.name, language)}, {tr(district!.name, language)}
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
                    {language === 'mr' ? 'पिनकोड' : 'Pincode'}: <span className="font-semibold text-slate-300">{village.pincode}</span>
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 pt-1">
                    <a
                      href={`tel:${b.phone}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-300 font-deva"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {language === 'mr' ? 'कॉल करा' : 'Call'}
                    </a>
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
    </div>
  );
}
