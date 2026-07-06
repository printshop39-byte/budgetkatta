'use client';
// app/signin/page.tsx — bilingual sign-in: Google + phone-OTP (two steps).
// Themed via CSS variables so it works in both light and dark automatically.
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useLanguageStore } from '@/store/languageStore';
import { getAuthStrings } from '@/lib/authI18n';
import { safeInternalPath } from '@/lib/safeRedirect';

function SignInInner() {
  const router = useRouter();
  const params = useSearchParams();
  // Validated to a same-origin relative path — prevents open-redirect phishing.
  const callbackUrl = safeInternalPath(params.get('callbackUrl'));
  const language = useLanguageStore((s) => s.language);
  const t = getAuthStrings(language);

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const phoneValid = /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));
  const otpValid = /^\d{6}$/.test(otp);

  async function sendOtp() {
    if (!phoneValid) return setError(t.err_phone);
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(res.status === 429 ? t.err_rate : t.err_generic);
        return;
      }
      setDevOtp(data.devOtp ?? null);
      setStep('otp');
    } catch {
      setError(t.err_generic);
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    if (!otpValid) return setError(t.err_otp);
    setError('');
    setLoading(true);
    try {
      const res = await signIn('phone-otp', { phone, otp, redirect: false });
      if (res?.error) {
        setError(t.err_otp);
        return;
      }
      router.push(callbackUrl);
    } catch {
      setError(t.err_generic);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-surface-2)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-default)',
  };
  const primaryStyle: React.CSSProperties = {
    background: 'var(--text-accent)',
    color: 'var(--bg-base)',
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {t.title}
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          {t.subtitle}
        </p>

        {/* Google */}
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition hover:opacity-90"
          style={{ border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
        >
          {t.google}
        </button>

        <div className="my-5 flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1" style={{ background: 'var(--border-default)' }} />
          <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {t.or}
          </span>
          <span className="h-px flex-1" style={{ background: 'var(--border-default)' }} />
        </div>

        {step === 'phone' ? (
          <div>
            <label htmlFor="bk-phone" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {t.phone_label}
            </label>
            <input
              id="bk-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && phoneValid && sendOtp()}
              placeholder={t.phone_placeholder}
              className="mt-1 w-full rounded-xl px-4 py-3 text-base outline-none focus:ring-2"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={!phoneValid || loading}
              className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={primaryStyle}
            >
              {loading ? t.sending : t.send_otp}
            </button>
          </div>
        ) : (
          <div>
            <label htmlFor="bk-otp" className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {t.otp_label}
            </label>
            <input
              id="bk-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && otpValid && verify()}
              placeholder={t.otp_placeholder}
              className="mt-1 w-full rounded-xl px-4 py-3 text-center text-lg tracking-[0.4em] outline-none focus:ring-2"
              style={inputStyle}
            />
            {devOtp && (
              <p className="mt-2 text-xs" style={{ color: 'var(--text-accent)' }}>
                {t.dev_hint} <b>{devOtp}</b>
              </p>
            )}
            <button
              type="button"
              onClick={verify}
              disabled={!otpValid || loading}
              className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={primaryStyle}
            >
              {loading ? t.verifying : t.verify}
            </button>
            <div className="mt-3 flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
              <button type="button" onClick={() => { setStep('phone'); setOtp(''); setError(''); }} className="hover:underline">
                {t.change_number}
              </button>
              <button type="button" onClick={sendOtp} disabled={loading} className="hover:underline disabled:opacity-50">
                {t.resend}
              </button>
            </div>
          </div>
        )}

        <p aria-live="polite" className="mt-3 min-h-[1.25rem] text-sm" style={{ color: '#f87171' }}>
          {error}
        </p>

        <p className="mt-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          {t.privacy_note}
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInInner />
    </Suspense>
  );
}
