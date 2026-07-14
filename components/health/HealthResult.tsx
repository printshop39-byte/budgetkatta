'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, RotateCcw, ShieldCheck, TriangleAlert, CheckCircle2, Lock } from 'lucide-react';
import type { HealthScoreResult } from '@/lib/healthScore';
import type { Language } from '@/types';
import { RC, pick } from '@/lib/healthCheckContent';
import { track } from '@/lib/analytics';

const STATUS_STYLE: Record<string, { ring: string; text: string; chip: string; label: 'statusGood' | 'statusAttention' | 'statusUrgent'; Icon: typeof CheckCircle2 }> = {
  good: { ring: 'stroke-emerald-400', text: 'text-emerald-300', chip: 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300', label: 'statusGood', Icon: CheckCircle2 },
  needs_attention: { ring: 'stroke-amber-400', text: 'text-amber-300', chip: 'bg-amber-500/10 border-amber-400/30 text-amber-300', label: 'statusAttention', Icon: TriangleAlert },
  urgent: { ring: 'stroke-rose-400', text: 'text-rose-300', chip: 'bg-rose-500/10 border-rose-400/30 text-rose-300', label: 'statusUrgent', Icon: TriangleAlert },
  unknown: { ring: 'stroke-slate-500', text: 'text-slate-400', chip: 'bg-slate-500/10 border-slate-500/30 text-slate-400', label: 'statusAttention', Icon: CheckCircle2 },
};

// Arc colour by band — mirrors the score's overall health.
function bandColor(key: string): string {
  switch (key) {
    case 'excellent':
    case 'strong':
      return '#34d399'; // emerald
    case 'good':
      return '#fbbf24'; // amber
    case 'fair':
      return '#f59e0b'; // darker amber
    default:
      return '#fb7185'; // rose
  }
}

export default function HealthResult({
  result,
  lang,
  onRevise,
}: {
  result: HealthScoreResult;
  lang: Language;
  onRevise: () => void;
}) {
  useEffect(() => {
    // Safe, non-PII funnel events (band + confidence only, never raw figures).
    track('result_viewed', { band: result.band.key, confidence: result.confidence });
  }, [result.band.key, result.confidence]);

  const pct = result.score / result.scoreMax;
  const R = 52;
  const C = 2 * Math.PI * R;
  const dash = C * (1 - pct);
  const color = bandColor(result.band.key);

  const measured = result.pillars.filter((p) => p.value !== null);

  return (
    <div className="space-y-8">
      {/* Score hero */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">{pick(RC.eyebrow, lang)}</span>

        <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
          {/* Dial */}
          <div
            className="relative h-40 w-40 shrink-0"
            role="img"
            aria-label={`${pick(RC.scoreLabel, lang)}: ${result.score} ${pick(RC.outOf, lang)} ${result.scoreMax}`}
          >
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={dash}
                style={{ transition: 'stroke-dashoffset 900ms ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-50 tabular-nums">{result.score}</span>
              <span className="text-[11px] font-semibold text-slate-400">/ {result.scoreMax}</span>
            </div>
          </div>

          {/* Band + confidence */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-slate-50">{lang === 'mr' ? result.band.mr : result.band.en}</h2>
            <p className="mt-1 text-sm text-slate-400">
              {pick(RC.confidence, lang)}:{' '}
              <span className="font-semibold text-slate-200">{pick(RC.confidenceLevels[result.confidence], lang)}</span>
            </p>
            {result.confidence !== 'high' && (
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{pick(RC.confidenceHint, lang)}</p>
            )}
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
              <ShieldCheck className="h-3 w-3 text-amber-400" /> {pick(RC.educationalBadge, lang)}
            </span>
          </div>
        </div>
      </div>

      {/* Top priority + first action */}
      {result.topWarning && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/5 p-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-rose-300">{pick(RC.priority, lang)}</span>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">{pick(result.topWarning, lang)}</p>
          </div>
          <div className="rounded-2xl border border-amber-400/30 bg-amber-500/5 p-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">{pick(RC.firstAction, lang)}</span>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">{result.topAction ? pick(result.topAction, lang) : ''}</p>
            {result.topActionHref && (
              <Link
                href={result.topActionHref}
                onClick={() => track('calculator_clicked_from_report', { from: 'result_top_action' })}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                {pick(RC.openCalculator, lang)} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Breakdown — "Why this score?" */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8">
        <h3 className="text-lg font-bold text-slate-100">{pick(RC.breakdown, lang)}</h3>
        <ul className="mt-5 space-y-4">
          {measured.map((p) => {
            const s = STATUS_STYLE[p.status] ?? STATUS_STYLE.unknown;
            return (
              <li key={p.key} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-100">{lang === 'mr' ? p.label.mr : p.label.en}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${s.chip}`}>
                    <s.Icon className="h-3 w-3" />
                    {pick(RC[s.label], lang)}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{pick(p.explanation, lang)}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                  <span>{pick(p.inputs, lang)}</span>
                  {p.upsidePts > 1 && (
                    <span className={s.text}>+{Math.round(p.upsidePts)} {pick(RC.points, lang)} {pick(RC.upside, lang)}</span>
                  )}
                </div>
                <p className="mt-1.5 text-[10px] leading-relaxed text-slate-600">{pick(p.limitation, lang)}</p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ₹99 plan — structure only; disabled until payments launch (P0 rule). */}
      <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-transparent p-6 md:p-8">
        <h3 className="text-xl font-extrabold text-slate-50">{pick(RC.planTitle, lang)}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{pick(RC.planSub, lang)}</p>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title={pick(RC.planNote, lang)}
          className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-slate-700/60 px-6 py-3 text-sm font-bold text-slate-300"
        >
          <Lock className="h-4 w-4" /> {pick(RC.planCta, lang)}
        </button>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{pick(RC.planNote, lang)}</p>
      </div>

      {/* Revise + disclaimer */}
      <div className="flex flex-col items-start gap-4">
        <button
          type="button"
          onClick={onRevise}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
        >
          <RotateCcw className="h-4 w-4" /> {pick(RC.revise, lang)}
        </button>
        <p className="text-[11px] leading-relaxed text-slate-500">{pick(RC.disclaimer, lang)}</p>
      </div>
    </div>
  );
}
