'use client';
// Local Finance & Store Locator — find nearby shops (mobile, bike, camera,
// laptop, …) that offer in-store EMI/finance, filtered by City/Area and Finance
// Provider. Each result card links to the store via a pre-filled WhatsApp
// message asking about product availability. Data is local (lib/localStores).
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, MessageCircle, Search, Store, Wallet } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import {
  LOCAL_STORES,
  CATEGORY_META,
  getStoreCities,
  getFinanceProviders,
} from '@/lib/localStores';

export default function LocatorPage() {
  const { language } = useLanguageStore();
  const mr = language === 'mr';

  const cities = useMemo(() => getStoreCities(), []);
  const providers = useMemo(() => getFinanceProviders(), []);

  const [city, setCity] = useState('');
  const [provider, setProvider] = useState('');
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LOCAL_STORES.filter((s) => {
      if (city && s.city !== city) return false;
      if (provider && !s.financeProviders.includes(provider as never)) return false;
      if (q) {
        const hay = [s.name, s.area, s.city, s.address, CATEGORY_META[s.category].label.en]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [city, provider, query]);

  const resetFilters = () => {
    setCity('');
    setProvider('');
    setQuery('');
  };

  // Pre-filled WhatsApp enquiry about product availability + finance.
  const waLink = (store: (typeof LOCAL_STORES)[number]) => {
    const cat = CATEGORY_META[store.category].label.en;
    const text = mr
      ? `नमस्कार ${store.name}, मला ${cat} खरेदी करायचे आहे. सध्या स्टॉकमध्ये उपलब्ध आहे का आणि EMI/फायनान्स पर्याय मिळेल का? (BudgetKatta वरून)`
      : `Hi ${store.name}, I'm interested in buying a ${cat}. Is it currently available in stock, and do you offer EMI/finance options? (via BudgetKatta)`;
    return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const selectClass =
    'w-full rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 font-deva outline-none transition-colors focus:border-amber-400';

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-slate-100 md:text-4xl font-deva">
          {mr ? 'स्थानिक फायनान्स व स्टोअर लोकेटर' : 'Local Finance & Store Locator'}
        </h1>
        <p className="mt-2 text-slate-400 font-deva">
          {mr
            ? 'तुमच्या शहरातील EMI/फायनान्स देणारी दुकाने शोधा आणि थेट WhatsApp वर संपर्क साधा.'
            : 'Find nearby stores offering EMI/finance and reach them directly on WhatsApp.'}
        </p>
      </header>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* City / Area */}
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 font-deva">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              {mr ? 'शहर / परिसर' : 'City / Area'}
            </span>
            <select value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
              <option value="">{mr ? '— सर्व शहरे —' : '— All Cities —'}</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          {/* Finance Provider */}
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 font-deva">
              <Wallet className="h-3.5 w-3.5 text-amber-400" />
              {mr ? 'फायनान्स प्रोव्हायडर' : 'Finance Provider'}
            </span>
            <select value={provider} onChange={(e) => setProvider(e.target.value)} className={selectClass}>
              <option value="">{mr ? '— सर्व प्रोव्हायडर —' : '— All Providers —'}</option>
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Free-text search */}
        <label className="relative mt-4 block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mr ? 'दुकानाचे नाव किंवा परिसर शोधा' : 'Search by shop name or area'}
            aria-label={mr ? 'दुकान शोधा' : 'Search stores'}
            className="w-full rounded-xl border border-slate-700/60 bg-slate-900/70 py-3 pl-10 pr-4 text-sm text-slate-200 font-deva outline-none transition-colors placeholder:text-slate-500 focus:border-amber-400"
          />
        </label>
      </div>

      {/* Result count + reset */}
      <div className="mb-5 mt-8 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
        <p className="font-display text-lg font-bold text-slate-100 font-deva">
          {results.length} {mr ? 'दुकाने सापडली' : results.length === 1 ? 'store found' : 'stores found'}
        </p>
        {(city || provider || query) && (
          <button
            onClick={resetFilters}
            className="rounded-full border border-slate-700 px-4 py-1.5 text-xs font-bold text-slate-300 transition-colors hover:border-amber-400/40 hover:text-amber-300 font-deva"
          >
            {mr ? 'फिल्टर साफ करा' : 'Clear filters'}
          </button>
        )}
      </div>

      {/* Results grid */}
      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
          <span className="text-4xl opacity-40">🔍</span>
          <p className="text-sm text-slate-400 font-deva">
            {mr
              ? 'या निवडीसाठी दुकान सापडले नाही. फिल्टर बदलून पहा.'
              : 'No stores match your selection. Try changing the filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {results.map((s, i) => {
            const Icon = CATEGORY_META[s.category].icon;
            const mapsQuery = encodeURIComponent(`${s.name} ${s.address}`);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-100 font-deva">
                    <Store className="h-4 w-4 shrink-0 text-amber-400" />
                    {s.name}
                  </h3>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-300 font-deva">
                    <Icon className="h-3 w-3" />
                    {CATEGORY_META[s.category].label[language]}
                  </span>
                </div>

                <p className="flex items-start gap-1.5 text-sm text-slate-400 font-deva">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span>
                    <span className="font-semibold text-slate-300">{s.area}</span>, {s.city}
                    <br />
                    {s.address}
                  </span>
                </p>

                {/* Finance providers */}
                <div className="mt-3">
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 font-deva">
                    {mr ? 'उपलब्ध फायनान्स' : 'Available Finance'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.financeProviders.map((p) => (
                      <span
                        key={p}
                        className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-[11px] font-medium text-slate-300 font-deva"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2 pt-1">
                  <a
                    href={waLink(s)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-emerald-400 font-deva"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {mr ? 'WhatsApp वर संपर्क करा' : 'Contact via WhatsApp'}
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-300 transition-colors hover:border-amber-400/40 hover:text-amber-300 font-deva"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {mr ? 'नकाशा' : 'Map'}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Trust note */}
      <p className="mt-10 text-center text-xs leading-relaxed text-slate-500 font-deva">
        {mr
          ? 'दुकानांची माहिती केवळ संदर्भासाठी आहे. भेट देण्यापूर्वी उपलब्धता, किंमत व EMI अटी दुकानाशी खात्री करा.'
          : 'Store details are for reference only. Please confirm availability, price and EMI terms with the store before visiting.'}
      </p>

      <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
        <p className="bk-security-note text-center text-sm font-semibold leading-relaxed text-rose-200 font-deva">
          {mr
            ? '🔒 सुरक्षा सतर्कता: बजेटकट्टा कधीही मोबाईल OTP किंवा वैयक्तिक कागदपत्रांची मागणी करत नाही.'
            : '🔒 Security Warning: BudgetKatta never asks for mobile OTP or personal documents.'}
        </p>
      </div>
    </div>
  );
}
