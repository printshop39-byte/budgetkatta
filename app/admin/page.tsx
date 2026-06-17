'use client';
// app/admin/page.tsx — admin placeholder, gated by NEXT_PUBLIC_ENABLE_ADMIN=true.
// Shows count cards per collection. No CRUD UI yet — clean structure only.

import { useEffect, useState } from 'react';

const ADMIN_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADMIN === 'true';

interface CardDef {
  key: string;
  title: string;
  icon: string;
  endpoint: string;
}

const cards: CardDef[] = [
  { key: 'fd', title: 'FD Products', icon: '🏦', endpoint: '/api/fd' },
  { key: 'loans', title: 'Loan Products', icon: '💰', endpoint: '/api/loans' },
  { key: 'sip', title: 'SIP Funds', icon: '📈', endpoint: '/api/sip' },
  { key: 'insurance', title: 'Insurance Plans', icon: '🛡️', endpoint: '/api/insurance' },
  { key: 'leads', title: 'Leads', icon: '📥', endpoint: '/api/leads' },
];

export default function AdminPage() {
  const [counts, setCounts] = useState<Record<string, { count: number; source: string }>>({});

  useEffect(() => {
    if (!ADMIN_ENABLED) return;
    cards.forEach((c) => {
      fetch(c.endpoint)
        .then((r) => r.json())
        .then((j) => {
          if (j?.ok) {
            setCounts((prev) => ({
              ...prev,
              [c.key]: { count: j.count ?? 0, source: j.source ?? 'demo' },
            }));
          }
        })
        .catch(() => {});
    });
  }, []);

  if (!ADMIN_ENABLED) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <span className="text-4xl">🔒</span>
        <h1 className="mt-4 font-display text-2xl font-bold text-slate-200">Admin disabled</h1>
        <p className="mt-2 text-slate-400">
          Set <code className="rounded bg-slate-900/[0.05] px-1.5 py-0.5 text-bk-gold">NEXT_PUBLIC_ENABLE_ADMIN=true</code>{' '}
          in <code className="rounded bg-slate-900/[0.05] px-1.5 py-0.5">.env.local</code> and restart to enable.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-slate-200">Admin</h1>
        <p className="mt-2 text-slate-400">
          Data overview. Full CRUD coming later — this is a structural placeholder.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const info = counts[c.key];
          return (
            <div key={c.key} className="glass-card glass-card-gold p-6">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{c.icon}</span>
                {info && (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${
                      info.source === 'mongodb'
                        ? 'border-amber-400/40/30 bg-amber-400/10 text-amber-400'
                        : 'border-slate-800 bg-slate-900/[0.035] text-slate-400'
                    }`}
                  >
                    {info.source}
                  </span>
                )}
              </div>
              <p className="mt-4 font-display text-3xl font-extrabold text-bk-gold">
                {info ? info.count : '—'}
              </p>
              <p className="mt-1 text-sm text-slate-400">{c.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
