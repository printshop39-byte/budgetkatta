'use client';
// app/(app)/account/page.tsx — a minimal PROTECTED page (middleware-guarded) that
// proves the auth round-trip: it shows the current session and allows sign-out.
// Real dashboard/profile UIs arrive in later EPICs.
import { useSession, signOut } from 'next-auth/react';
import { useLanguageStore } from '@/store/languageStore';
import { getAuthStrings } from '@/lib/authI18n';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const language = useLanguageStore((s) => s.language);
  const t = getAuthStrings(language);

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center" style={{ color: 'var(--text-muted)' }}>
        {t.loading}
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {t.account_title}
        </h1>
        <dl className="mt-5 space-y-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              {t.signed_in_as}
            </dt>
            <dd style={{ color: 'var(--text-primary)' }}>{user?.name || user?.phone || user?.email || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              {t.role}
            </dt>
            <dd style={{ color: 'var(--text-primary)' }}>{(user?.roles ?? ['member']).join(', ')}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition hover:opacity-90"
          style={{ background: 'var(--text-accent)', color: 'var(--bg-base)' }}
        >
          {t.sign_out}
        </button>
      </div>
    </div>
  );
}
