'use client';
// LeadFormModal — bilingual "I am interested" capture form.
// Collects Name, Mobile, City, Module, Selected product, Language and submits
// to /api/leads (which persists + forwards to n8n). UI never blocks on webhook
// failure: on a well-formed submit we always show the success state.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeadFormStore } from '@/store/leadFormStore';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { submitLead } from '@/lib/leadAutomation';
import type { LeadModule } from '@/types';

const moduleLabelKey: Record<LeadModule, string> = {
  FD: 'fd.title',
  LOAN: 'loan.title',
  SIP: 'sip.title',
  INSURANCE: 'ins.title',
  GENERAL: 'nav.home',
  CONTACT: 'nav.contact',
};

export default function LeadFormModal() {
  const { isOpen, module, product, sourcePage, close } = useLeadFormStore();
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  // Reset the form each time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setName('');
      setPhone('');
      setCity('');
      setError('');
      setSending(false);
      setDone(false);
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError(t('lead.err_name'));
    if (!/^\d{10}$/.test(phone.trim())) return setError(t('lead.err_phone'));
    setError('');
    setSending(true);

    const ok = await submitLead({
      userName: name.trim(),
      phone: phone.trim(),
      city: city.trim() || undefined,
      selectedLanguage: language,
      interestedModule: module,
      selectedProduct: product,
      sourcePage: sourcePage || 'LEAD_FORM',
      timestamp: new Date().toISOString(),
    });

    setSending(false);
    // The server returns ok even if n8n/DB are down (UI isn't blocked on those).
    // We only surface an error if the request itself failed (e.g. offline / 4xx/5xx).
    if (ok) setDone(true);
    else setError(t('lead.fail'));
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={close}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl glass-card glass-card-gold p-6 sm:rounded-3xl"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-800">{t('lead.title')}</h3>
                <p className="mt-1 text-sm text-slate-500 font-deva">{t('lead.subtitle')}</p>
              </div>
              <button
                onClick={close}
                aria-label={t('btn.close')}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900/[0.035] hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            {done ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <span className="text-4xl">✅</span>
                <p className="text-slate-800 font-deva">{t('lead.success')}</p>
                <button
                  onClick={close}
                  className="mt-2 rounded-xl bg-bk-gold px-5 py-2.5 font-bold text-bk-dark transition-colors hover:bg-bk-gold-light font-deva"
                >
                  {t('btn.close')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Context chips */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-bk-gold/30 bg-bk-gold/10 px-2.5 py-1 text-bk-gold font-deva">
                    {t('lead.module')}: {t(moduleLabelKey[module])}
                  </span>
                  {product && (
                    <span className="rounded-full border border-slate-200 bg-slate-900/[0.035] px-2.5 py-1 text-slate-600 font-deva">
                      {product}
                    </span>
                  )}
                </div>

                <Field label={t('lead.name')}>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('lead.name_ph')}
                    className="bk-input"
                    autoFocus
                  />
                </Field>

                <Field label={t('lead.phone')}>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    inputMode="numeric"
                    placeholder={t('lead.phone_ph')}
                    className="bk-input"
                  />
                </Field>

                <Field label={t('lead.city')}>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={t('lead.city_ph')}
                    className="bk-input"
                  />
                </Field>

                {error && <p className="text-sm text-red-400 font-deva">{error}</p>}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-xl bg-bk-gold py-3 font-bold text-bk-dark transition-all duration-300 hover:bg-bk-gold-light hover:shadow-[0_0_24px_rgba(13,148,136,0.4)] disabled:opacity-60 disabled:hover:shadow-none font-deva"
                >
                  {sending ? t('lead.sending') : t('lead.submit')}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-600 font-deva">{label}</span>
      {children}
    </label>
  );
}
