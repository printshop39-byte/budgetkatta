import type { ReactNode } from 'react';

type Tone = 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const toneMap: Record<Tone, string> = {
  gold: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
  success: 'bg-amber-400/10 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  danger: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  info: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  neutral: 'bg-slate-900 text-slate-400 border-slate-800',
};

export default function BadgeChip({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneMap[tone]}`}
    >
      {children}
    </span>
  );
}
