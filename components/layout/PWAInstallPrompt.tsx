'use client';
// PWAInstallPrompt — a dismissible "Add to Home Screen" banner.
//
// On Chrome/Edge/Android we capture the `beforeinstallprompt` event and trigger
// the native install flow on tap. iOS Safari has no such event, so for an iOS
// device that is not already installed we show the manual Share → "Add to Home
// Screen" hint instead. Dismissal is remembered in localStorage so we don't nag.
import { useEffect, useState } from 'react';
import { Download, X, Share } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

const DISMISS_KEY = 'bk-a2hs-dismissed';

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function PWAInstallPrompt() {
  const { language } = useLanguageStore();
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Respect a previous dismissal and don't show when already installed.
    if (localStorage.getItem(DISMISS_KEY) === '1') return;
    const standalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', onBIP);

    // iOS: no beforeinstallprompt — detect iPhone/iPad and offer the manual hint.
    const ua = window.navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua);
    if (isIos) {
      setIosHint(true);
      setVisible(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', onBIP);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* storage unavailable — just hide for this session */
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {
      /* ignore */
    }
    setDeferred(null);
    dismiss();
  };

  if (!visible) return null;

  const mr = language === 'mr';

  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-2xl border border-amber-400/30 bg-slate-900/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:inset-x-auto sm:right-4">
      <button
        onClick={dismiss}
        aria-label={mr ? 'बंद करा' : 'Dismiss'}
        className="absolute right-2.5 top-2.5 rounded-full p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-200"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
          <Download className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-100 font-deva">
            {mr ? 'BudgetKatta ॲपसारखे वापरा' : 'Use BudgetKatta like an app'}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-slate-400 font-deva">
            {mr
              ? 'होम स्क्रीनवर जोडा — ऑफलाइनही जलद उघडेल, ॲप स्टोअरची गरज नाही.'
              : 'Add it to your home screen — opens fast even offline, no app store needed.'}
          </p>

          {iosHint ? (
            <p className="mt-2 inline-flex flex-wrap items-center gap-1 text-[11px] font-semibold text-amber-300 font-deva">
              {mr ? 'Safari मध्ये' : 'In Safari, tap'}
              <Share className="h-3.5 w-3.5" />
              {mr ? '→ "Add to Home Screen" निवडा' : '→ "Add to Home Screen"'}
            </p>
          ) : (
            <button
              onClick={install}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-500 font-deva"
            >
              <Download className="h-4 w-4" />
              {mr ? 'होम स्क्रीनवर जोडा' : 'Add to Home Screen'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
