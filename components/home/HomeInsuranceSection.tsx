'use client';
// HomeInsuranceSection — home/property insurance, educational only. Shows the
// kinds of home cover, the home-insurance vs home-loan-protection distinction,
// and coverage / exclusions / claims-document checklists. NO health/motor/travel
// insurance, NO "best policy" claims, NO affiliate links, NO lead capture in
// this phase. Carries an IRDAI disclaimer.
//
// SELF-CONTAINED THEMING: the global light re-skin (app/globals.css) recolours
// slate/amber text but NOT rose/emerald/sky, so those accent colours are set
// INLINE from the theme store (light-on-dark, deep-on-light). The section is
// therefore readable in both themes WITHOUT relying on any (uncommitted)
// text-rose light-mode rule — same inline-colour pattern used by CalculatorsHub.
import type { LucideIcon } from 'lucide-react';
import { ShieldCheck, Building2, Sofa, Landmark, Check, X, FileText, AlertTriangle } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';
import { HOME_INSURANCE as HI, pick } from '@/lib/homeFinanceContent';

const TYPE_ICONS = [Building2, Sofa, Landmark];

// Accent colours the global re-skin does NOT handle. Light shades are 700-level
// so they stay legible on the white light-mode card; dark shades are 300/400.
const ACCENT = {
  emerald: { dark: '#34d399', light: '#047857' }, // emerald-400 / emerald-700
  rose: { dark: '#fb7185', light: '#be123c' }, //     rose-400 / rose-700
  sky: { dark: '#7dd3fc', light: '#0369a1' }, //      sky-300 / sky-700
} as const;

export default function HomeInsuranceSection() {
  const lang = useLanguageStore((s) => s.language);
  const dark = useThemeStore((s) => s.theme) === 'dark';
  const accent = (tone: keyof typeof ACCENT) => (dark ? ACCENT[tone].dark : ACCENT[tone].light);

  return (
    <section id="home-insurance" className="mx-auto max-w-7xl px-6 py-20 scroll-mt-20 border-t border-slate-800">
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
          <ShieldCheck className="h-3.5 w-3.5" /> {pick(HI.eyebrow, lang)}
        </span>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold leading-[1.3] text-slate-50 md:text-4xl">
          {pick(HI.title, lang)}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">{pick(HI.intro, lang)}</p>
      </div>

      {/* Types of home cover — amber badge (amber text is re-skinned globally) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {HI.types.map((tp, i) => {
          const Icon = TYPE_ICONS[i] ?? Building2;
          return (
            <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/15 text-amber-300">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-100">{pick(tp.title, lang)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{pick(tp.desc, lang)}</p>
            </div>
          );
        })}
      </div>

      {/* Home insurance vs home-loan protection — sky heading (inline colour) */}
      <div className="mt-6 rounded-2xl border border-sky-400/25 bg-sky-400/5 p-6">
        <h3 className="text-sm font-bold" style={{ color: accent('sky') }}>{pick(HI.vsTitle, lang)}</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
          <p className="text-sm leading-relaxed text-slate-300">
            <strong className="text-slate-100">{lang === 'mr' ? 'गृह विमा: ' : 'Home insurance: '}</strong>
            {pick(HI.vsHomeInsurance, lang)}
          </p>
          <p className="text-sm leading-relaxed text-slate-300">
            <strong className="text-slate-100">{lang === 'mr' ? 'कर्ज-संरक्षण: ' : 'Loan protection: '}</strong>
            {pick(HI.vsLoanProtection, lang)}
          </p>
        </div>
      </div>

      {/* Three checklists */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <ChecklistCard tone="emerald" Icon={Check} title={pick(HI.coverage.title, lang)} items={HI.coverage.items[lang]} accent={accent('emerald')} />
        <ChecklistCard tone="rose" Icon={X} title={pick(HI.exclusions.title, lang)} items={HI.exclusions.items[lang]} accent={accent('rose')} />
        <ChecklistCard tone="amber" Icon={FileText} title={pick(HI.claims.title, lang)} items={HI.claims.items[lang]} />
      </div>

      {/* IRDAI / educational disclaimer — amber (re-skinned) */}
      <div className="mt-6 rounded-2xl border-l-4 border-amber-400/50 bg-slate-900/50 p-5">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-400">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
          {pick(HI.disclaimer, lang)}
        </p>
      </div>
    </section>
  );
}

function ChecklistCard({
  tone,
  Icon,
  title,
  items,
  accent,
}: {
  tone: 'emerald' | 'rose' | 'amber';
  Icon: LucideIcon;
  title: string;
  items: string[];
  /** Inline accent colour for rose/emerald (theme-aware). Omitted for amber, which uses the global re-skin. */
  accent?: string;
}) {
  // Tinted badge background/border only (filled tints are theme-agnostic); text
  // colour comes from `accent` (rose/emerald) or the amber utility (re-skinned).
  const tintCls = {
    emerald: 'border-emerald-400/25 bg-emerald-500/10',
    rose: 'border-rose-400/25 bg-rose-500/10',
    amber: 'border-amber-400/25 bg-amber-500/10 text-amber-300',
  }[tone];
  const colorStyle = accent ? { color: accent } : undefined;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${tintCls}`} style={colorStyle}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-bold text-slate-100">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm leading-relaxed text-slate-300">
            <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tone === 'amber' ? 'text-amber-400' : ''}`} style={colorStyle} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
