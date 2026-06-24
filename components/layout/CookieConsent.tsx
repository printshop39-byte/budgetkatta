'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

const STORAGE_KEY = 'bk-cookie-consent';

// Lightweight cookie-consent banner. Records the user's choice in localStorage
// ('accepted' | 'declined') so analytics / affiliate-tracking scripts can gate
// on `localStorage.getItem('bk-cookie-consent') === 'accepted'`. Forward-looking:
// no trackers run today, but this keeps the site aligned with its privacy policy
// and DPDP-style consent expectations.
export default function CookieConsent() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* storage unavailable — stay hidden */
    }
  }, []);

  const choose = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={language === 'mr' ? 'कुकी संमती' : 'Cookie consent'}
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
    >
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-300 font-deva">
          {t('cookie.text')}{' '}
          <Link href="/privacy" className="text-amber-400 underline hover:text-amber-300">
            {t('cookie.learn')}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => choose('declined')}
            className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800 font-deva"
          >
            {t('cookie.decline')}
          </button>
          <button
            onClick={() => choose('accepted')}
            className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-500 font-deva"
          >
            {t('cookie.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
