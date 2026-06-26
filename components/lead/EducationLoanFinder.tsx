'use client';
// EducationLoanFinder — lead-generation form for education financing. Captures
// course, study location, loan amount, family income, admission status, city +
// contact, then submits via submitLead() to /api/leads (persist + n8n forward
// to a partner/DSA). This is the lead-gen model: richer per-student data than a
// generic banner click, so partner payouts are higher and more realistic.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';
import { submitLead } from '@/lib/leadAutomation';
import { useLanguageStore } from '@/store/languageStore';
import type { Bi } from '@/types';

type Field = { key: string; label: Bi; options: Bi[] };

const FIELDS: Field[] = [
  {
    key: 'course',
    label: { mr: 'कोर्स', en: 'Course' },
    options: [
      { mr: 'डिप्लोमा', en: 'Diploma' },
      { mr: 'पदवी (Graduation)', en: 'Graduation' },
      { mr: 'पदव्युत्तर (PG)', en: 'Post-graduation (PG)' },
      { mr: 'व्यावसायिक (Medical/Eng)', en: 'Professional (Medical/Eng)' },
      { mr: 'Skill / ITI', en: 'Skill / ITI' },
    ],
  },
  {
    key: 'location',
    label: { mr: 'शिक्षण कुठे?', en: 'Study where?' },
    options: [
      { mr: 'भारतात', en: 'In India' },
      { mr: 'परदेशात', en: 'Abroad' },
    ],
  },
  {
    key: 'amount',
    label: { mr: 'कर्ज रक्कम', en: 'Loan amount' },
    options: [
      { mr: '₹4 लाखांपर्यंत', en: 'Up to ₹4 lakh' },
      { mr: '₹4 – ₹7.5 लाख', en: '₹4 – ₹7.5 lakh' },
      { mr: '₹7.5 – ₹20 लाख', en: '₹7.5 – ₹20 lakh' },
      { mr: '₹20 – ₹50 लाख', en: '₹20 – ₹50 lakh' },
      { mr: '₹50 लाखांपेक्षा जास्त', en: 'Above ₹50 lakh' },
    ],
  },
  {
    key: 'income',
    label: { mr: 'कुटुंबाचे वार्षिक उत्पन्न', en: 'Family annual income' },
    options: [
      { mr: '₹4.5 लाखांपेक्षा कमी', en: 'Below ₹4.5 lakh' },
      { mr: '₹4.5 – ₹8 लाख', en: '₹4.5 – ₹8 lakh' },
      { mr: '₹8 लाखांपेक्षा जास्त', en: 'Above ₹8 lakh' },
    ],
  },
  {
    key: 'admission',
    label: { mr: 'प्रवेश स्थिती', en: 'Admission status' },
    options: [
      { mr: 'प्रवेश निश्चित', en: 'Confirmed' },
      { mr: 'निकालाची वाट', en: 'Awaiting result' },
      { mr: 'फक्त माहिती घेतोय', en: 'Just exploring' },
    ],
  },
];

export default function EducationLoanFinder({
  id = 'edu-lead',
  sourcePage = 'STUDENT_LOAN_FINDER',
  className = '',
}: {
  id?: string;
  sourcePage?: string;
  className?: string;
}) {
  const { language: lang } = useLanguageStore();
  const mr = lang === 'mr';

  // selected option INDEX per field (default 0)
  const [sel, setSel] = useState<Record<string, number>>(
    Object.fromEntries(FIELDS.map((f) => [f.key, 0]))
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError(mr ? 'कृपया नाव टाका.' : 'Please enter your name.');
    if (!/^\d{10}$/.test(phone.trim())) return setError(mr ? '१० अंकी मोबाईल नंबर टाका.' : 'Enter a 10-digit mobile number.');
    if (!consent) return setError(mr ? 'पुढे जाण्यासाठी संमती द्या.' : 'Please give consent to proceed.');
    setError('');
    setSending(true);

    // Pack the finder answers into userQuery (English labels for partner/DSA).
    const summary = FIELDS.map((f) => `${f.label.en}: ${f.options[sel[f.key]].en}`).join(' | ');

    const ok = await submitLead({
      userName: name.trim(),
      phone: phone.trim(),
      city: city.trim() || undefined,
      selectedLanguage: lang,
      interestedModule: 'LOAN',
      selectedProduct: 'Education Loan (lead)',
      userQuery: summary,
      sourcePage,
      timestamp: new Date().toISOString(),
    });

    setSending(false);
    if (ok) setDone(true);
    else setError(mr ? 'पाठवण्यात अडचण आली. पुन्हा प्रयत्न करा.' : 'Could not submit. Please try again.');
  }

  if (done) {
    return (
      <div id={id} className={`glass-card glass-card-gold flex flex-col items-center gap-3 p-8 text-center scroll-mt-20 ${className}`}>
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        <p className="font-bold text-slate-100 font-deva">
          {mr ? 'धन्यवाद! तुमची माहिती मिळाली.' : 'Thank you! We have your details.'}
        </p>
        <p className="max-w-md text-sm text-slate-400 font-deva">
          {mr
            ? 'आमचे partner/bank लवकरच तुमच्याशी संपर्क करून योग्य education loan / scholarship पर्यायांबद्दल मार्गदर्शन करतील.'
            : 'Our partner/bank will reach out shortly to guide you on the right education loan / scholarship options.'}
        </p>
      </div>
    );
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={`glass-card glass-card-gold space-y-4 p-6 scroll-mt-20 ${className}`}
    >
      <div>
        <h3 className="font-display text-lg font-bold text-slate-100 font-deva">
          {mr ? 'Education Loan / Scholarship साठी योग्य option शोधा' : 'Find the right Education Loan / Scholarship option'}
        </h3>
        <p className="mt-1 text-sm text-slate-400 font-deva">
          {mr
            ? 'फक्त १ मिनिटात eligibility तपासा — official bank/partner कडून पुढील मार्गदर्शन मिळवा.'
            : 'Check eligibility in 1 minute — get next-step guidance from an official bank/partner.'}
        </p>
      </div>

      {/* Finder selects */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="block text-sm">
            <span className="mb-1 block text-slate-400 font-deva">{f.label[lang]}</span>
            <select
              value={sel[f.key]}
              onChange={(e) => setSel((s) => ({ ...s, [f.key]: +e.target.value }))}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-slate-200 outline-none focus:border-amber-400/50 font-deva"
            >
              {f.options.map((o, i) => (
                <option key={i} value={i} className="bg-bk-card">
                  {o[lang]}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={mr ? 'तुमचे नाव' : 'Your name'}
          className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-slate-200 outline-none placeholder:text-slate-500 focus:border-amber-400/50 font-deva"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          inputMode="numeric"
          placeholder={mr ? 'मोबाईल (१० अंकी)' : 'Mobile (10-digit)'}
          className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-slate-200 outline-none placeholder:text-slate-500 focus:border-amber-400/50 font-deva"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={mr ? 'शहर (ऐच्छिक)' : 'City (optional)'}
          className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-slate-200 outline-none placeholder:text-slate-500 focus:border-amber-400/50 font-deva"
        />
      </div>

      <label className="flex items-start gap-2 text-xs text-slate-400 font-deva">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-amber-400"
        />
        <span>
          {mr
            ? 'मी BudgetKatta व त्याच्या verified partners कडून माझ्या निवडलेल्या product बद्दल call / WhatsApp / email मिळण्यास संमती देतो.'
            : 'I consent to receive calls / WhatsApp / email from BudgetKatta and its verified partners about my selected product.'}
        </span>
      </label>

      {error && <p className="text-sm text-rose-400 font-deva">{error}</p>}

      <motion.button
        type="submit"
        disabled={sending}
        whileTap={{ scale: 0.98 }}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-500 disabled:opacity-60 font-deva"
      >
        <Send className="h-4 w-4" />
        {sending ? (mr ? 'पाठवत आहे…' : 'Submitting…') : mr ? 'माझे पर्याय मिळवा' : 'Get my options'}
      </motion.button>

      <p className="text-[11px] leading-relaxed text-slate-500 font-deva">
        {mr
          ? 'BudgetKatta स्वतः कर्ज देत नाही. आम्ही फक्त माहिती, comparison व partner referral देतो. अंतिम approval bank/NBFC च्या नियमांनुसार होईल.'
          : 'BudgetKatta does not lend. We only provide information, comparison and partner referrals. Final approval depends on the bank/NBFC’s rules.'}
      </p>
    </form>
  );
}
