import type { ReactNode } from 'react';

type Tone = 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const toneMap: Record<Tone, string> = {
  gold: 'bg-bk-gold/15 text-bk-gold border-bk-gold/30',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  danger: 'bg-red-500/15 text-red-400 border-red-500/30',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  neutral: 'bg-white/5 text-white/70 border-white/10',
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
