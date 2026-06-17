'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import PageShell from '@/components/shared/PageShell';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { submitLead } from '@/lib/leadAutomation';
import { CONTACT_EMAIL } from '@/lib/config';
import type { LeadModule } from '@/types';

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

const serviceOptions: { value: LeadModule; key: string }[] = [
  { value: 'GENERAL', key: 'contact.general' },
  { value: 'FD', key: 'nav.fd' },
  { value: 'LOAN', key: 'nav.loans' },
  { value: 'SIP', key: 'nav.sip' },
  { value: 'INSURANCE', key: 'nav.insurance' },
];

export default function ContactPage() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [service, setService] = useState<LeadModule>('GENERAL');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError(t('lead.err_name'));
    if (!/^\d{10}$/.test(phone.trim())) return setError(t('lead.err_phone'));
    setError('');
    setSending(true);

    const ok = await submitLead({
      userName: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      city: city.trim() || undefined,
      selectedLanguage: language,
      interestedModule: service,
      userQuery: message.trim() || undefined,
      sourcePage: 'CONTACT_PAGE',
      timestamp: new Date().toISOString(),
    });

    setSending(false);
    if (ok) setDone(true);
    else setError(t('lead.fail'));
  }

  const infoCards = [
    { icon: '✉️', label: t('contact.info_email'), value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { icon: '📍', label: t('contact.info_area'), value: t('contact.info_area_val') },
    { icon: '⏱️', label: t('contact.info_response'), value: t('contact.info_response_val') },
  ];

  return (
    <PageShell titleKey="contact.title" subtitleKey="contact.subtitle">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <div className="glass-card glass-card-gold p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-white">{t('contact.form_title')}</h2>

            {done ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="text-4xl">✅</span>
                <p className="text-white font-deva">{t('lead.success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label={t('lead.name')}>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('lead.name_ph')} className="bk-input" />
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
                  <Field label={t('contact.email')}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('contact.email_ph')} className="bk-input" />
                  </Field>
                  <Field label={t('lead.city')}>
                    <input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t('lead.city_ph')} className="bk-input" />
                  </Field>
                </div>

                <Field label={t('contact.service')}>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value as LeadModule)}
                    className="bk-input"
                  >
                    {serviceOptions.map((o) => (
                      <option key={o.value} value={o.value} className="bg-bk-card">
                        {t(o.key)}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label={t('contact.message')}>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                    placeholder={t('contact.message_ph')}
                    rows={4}
                    className="bk-input resize-y"
                  />
                </Field>

                {error && <p className="text-sm text-red-400 font-deva">{error}</p>}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-xl bg-bk-gold py-3 font-bold text-bk-dark transition-colors hover:bg-bk-gold-light disabled:opacity-60 font-deva"
                >
                  {sending ? t('lead.sending') : t('contact.send')}
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Info column */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 lg:col-span-2"
        >
          <h2 className="font-display text-xl font-bold text-white">{t('contact.info_title')}</h2>
          {infoCards.map((c) => (
            <div key={c.label} className="glass-card flex items-start gap-3 p-4">
              <span className="text-xl">{c.icon}</span>
              <div>
                <p className="text-xs text-white/50 font-deva">{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="text-sm font-semibold text-bk-gold hover:underline">
                    {c.value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-white font-deva">{c.value}</p>
                )}
              </div>
            </div>
          ))}

          {/* WhatsApp CTA — only a real link if env is set */}
          {WHATSAPP ? (
            <a
              href={`https://wa.me/${WHATSAPP.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white transition-colors hover:bg-emerald-500 font-deva"
            >
              💬 {t('contact.whatsapp')}
            </a>
          ) : (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 py-3 text-center text-sm text-emerald-300/80 font-deva">
              💬 {t('contact.whatsapp_soon')}
            </div>
          )}
        </motion.div>
      </div>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-white/70 font-deva">{label}</span>
      {children}
    </label>
  );
}
