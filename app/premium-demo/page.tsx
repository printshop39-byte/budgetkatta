"use client";
// app/premium-demo/page.tsx — THROWAWAY demo: Gemini-style smooth line+area
// wealth-growth chart (Total Wealth vs Total Principal) with gridlines, axis
// labels, legend, premium slider + number inputs, and smoothly counting
// numbers — built with Framer Motion (already a dependency). Safe to delete.
import { useEffect, useMemo } from "react";
import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { TrendingUp, Sparkles } from "lucide-react";

const C = {
  ink: "#0F172A",
  body: "#334155",
  muted: "#64748B",
  blue: "#2563EB",
  gray: "#94A3B8",
  orange: "#FF6B00",
  green: "#16A34A",
  amber: "#F59E0B",
  profitBg: "#F0FDF4",
  profitBorder: "#BBF7D0",
  border: "#E2E8F0",
};

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
// compact ₹ for axis ticks
const inrShort = (n: number) => {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(1).replace(/\.0$/, "") + " कोटी";
  if (n >= 1e5) return "₹" + Math.round(n / 1e5) + " लाख";
  if (n >= 1e3) return "₹" + Math.round(n / 1e3) + "K";
  return "₹" + Math.round(n);
};

function AnimatedINR({ value, className, style }: { value: number; className?: string; style?: React.CSSProperties }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => inr(v));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value, mv]);
  return <motion.span className={className} style={style}>{text}</motion.span>;
}

// Catmull-Rom → cubic bezier; constant command count so Framer Motion can
// interpolate `d` smoothly between states.
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let k = 0; k < pts.length - 1; k++) {
    const p0 = pts[k - 1] || pts[k];
    const p1 = pts[k];
    const p2 = pts[k + 1];
    const p3 = pts[k + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

// plot geometry
const W = 620, H = 260;
const PL = 56, PR = 16, PT = 18, PB = 34;
const x0 = PL, x1 = W - PR, yTop = PT, yBot = H - PB;

export default function PremiumDemoPage() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const YEAR_TABS = [5, 10, 15, 20, 30];

  const { wealth, principal, max } = useMemo(() => {
    const i = rate / 100 / 12;
    const wAt = (y: number) => (y === 0 ? 0 : monthly * ((Math.pow(1 + i, y * 12) - 1) / i) * (1 + i));
    const pAt = (y: number) => monthly * 12 * y;
    const w = Array.from({ length: years + 1 }, (_, y) => wAt(y));
    const p = Array.from({ length: years + 1 }, (_, y) => pAt(y));
    return { wealth: w, principal: p, max: w[years] || 1 };
  }, [monthly, rate, years]);

  const invested = principal[years];
  const gain = wealth[years] - invested;

  const xTicks = Array.from(
    new Set([0, Math.round(years * 0.25), Math.round(years * 0.5), Math.round(years * 0.75), years])
  );

  const xFor = (y: number) => x0 + (y / years) * (x1 - x0);
  const yFor = (v: number) => yBot - (v / max) * (yBot - yTop);

  const wealthPts = wealth.map((v, y) => ({ x: xFor(y), y: yFor(v) }));
  const principalPts = principal.map((v, y) => ({ x: xFor(y), y: yFor(v) }));
  const wealthLine = smoothPath(wealthPts);
  const principalLine = smoothPath(principalPts);
  const wealthArea = `${wealthLine} L ${x1.toFixed(2)} ${yBot} L ${x0.toFixed(2)} ${yBot} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full bg-[#F8FAFC]">
      <style>{`
        .premium-range{ -webkit-appearance:none; appearance:none; height:8px; border-radius:999px;
          background:linear-gradient(90deg,#FFB37A,#FF6B00); outline:none; }
        .premium-range::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none; width:24px; height:24px;
          border-radius:50%; background:radial-gradient(circle at 30% 30%,#fff,#FFE3CC 40%,#FF6B00 100%);
          border:2px solid #fff; box-shadow:0 4px 12px rgba(255,107,0,0.45), 0 0 0 6px rgba(255,107,0,0.12);
          cursor:pointer; transition:transform .15s ease, box-shadow .15s ease; }
        .premium-range:active::-webkit-slider-thumb{ transform:scale(1.18); }
        .premium-range::-moz-range-thumb{ width:22px; height:22px; border:2px solid #fff; border-radius:50%;
          background:#FF6B00; box-shadow:0 4px 12px rgba(255,107,0,0.45); cursor:pointer; }
      `}</style>

      <div className="mx-auto max-w-3xl px-6 pb-32 pt-14">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-medium" style={{ border: `1px solid ${C.border}`, color: C.muted }}>
          <Sparkles className="h-3.5 w-3.5" /> Premium chart demo · /premium-demo
        </div>

        <div className="rounded-[24px] border bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)]" style={{ borderColor: C.border }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.muted }}>BudgetKatta</p>
              <h2 className="mt-0.5 text-xl font-bold font-deva" style={{ color: C.ink }}>संपत्ती वाढीचा अंदाज</h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
              <TrendingUp className="h-3 w-3" /> +{Math.round((gain / Math.max(1, invested)) * 100)}%
            </span>
          </div>

          {/* Chart */}
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" style={{ overflow: "visible" }} role="img" aria-label="संपत्ती वाढीचा आलेख">
            <defs>
              <linearGradient id="wealthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.green} stopOpacity="0.20" />
                <stop offset="100%" stopColor={C.green} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* gridlines + y labels */}
            {ticks.map((t) => {
              const y = yBot - t * (yBot - yTop);
              return (
                <g key={t}>
                  <line x1={x0} y1={y} x2={x1} y2={y} stroke={C.border} strokeWidth="1" strokeDasharray="4 4" />
                  <text x={x0 - 10} y={y + 4} textAnchor="end" fontSize="11" fill={C.muted}>{inrShort(t * max)}</text>
                </g>
              );
            })}

            {/* x labels */}
            {xTicks.map((y) => (
              <text key={y} x={xFor(y)} y={yBot + 20} textAnchor="middle" fontSize="11" fill={C.muted}>वर्ष {y}</text>
            ))}

            {/* invested principal (amber, dashed) */}
            <path d={principalLine} fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" strokeLinecap="round" />

            {/* wealth area + line (green) */}
            <path d={wealthArea} fill="url(#wealthFill)" stroke="none" />
            <path d={wealthLine} fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round" />

            {/* data-point dots */}
            {principalPts.map((p, idx) => (
              <circle key={`p${idx}`} cx={p.x} cy={p.y} r="3" fill={C.amber} />
            ))}
            {wealthPts.map((p, idx) => (
              <circle key={`w${idx}`} cx={p.x} cy={p.y} r="4" fill={C.green} stroke="#fff" strokeWidth="1.5" />
            ))}
          </svg>

          {/* legend */}
          <div className="mt-2 flex items-center justify-center gap-5 text-xs font-deva" style={{ color: C.body }}>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: C.green }} /> एकूण संपत्ती</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: C.amber }} /> गुंतवलेली रक्कम</span>
          </div>

          {/* stats */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={{ background: "#F8FAFC", border: `1px solid ${C.border}` }}>
              <p className="text-xs font-deva" style={{ color: C.muted }}>एकूण गुंतवणूक</p>
              <AnimatedINR value={invested} className="mt-1 block text-xl font-bold" style={{ color: C.ink }} />
            </div>
            <div className="rounded-xl p-4" style={{ background: C.profitBg, border: `1px solid ${C.profitBorder}` }}>
              <p className="text-xs font-deva" style={{ color: "#15803D" }}>अंदाजे नफा</p>
              <AnimatedINR value={gain} className="mt-1 block text-xl font-bold" style={{ color: C.green }} />
            </div>
          </div>

          {/* time period — tabs + slider */}
          <div className="mt-6 border-t pt-5" style={{ borderColor: C.border }}>
            <div className="flex items-center justify-between text-sm font-deva">
              <span style={{ color: C.body }}>कालावधी</span>
              <span className="font-bold" style={{ color: C.ink }}>{years} वर्षे</span>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {YEAR_TABS.map((t) => {
                const active = years === t;
                return (
                  <button
                    key={t}
                    onClick={() => setYears(t)}
                    className="rounded-full px-4 py-1.5 text-sm font-semibold transition-all font-deva"
                    style={
                      active
                        ? { background: C.orange, color: "#fff", boxShadow: "0 4px 12px rgba(255,107,0,0.30)" }
                        : { background: "#fff", color: C.body, border: `1px solid ${C.border}` }
                    }
                    aria-pressed={active}
                  >
                    {t} वर्षे
                  </button>
                );
              })}
            </div>

            <input
              type="range" min={1} max={30} step={1} value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="premium-range mt-3 w-full" aria-label="कालावधी स्लायडर"
            />
          </div>

          {/* inputs */}
          <div className="mt-6 grid grid-cols-1 gap-5 border-t pt-5 sm:grid-cols-2" style={{ borderColor: C.border }}>
            <div>
              <div className="flex items-center justify-between text-sm font-deva">
                <span style={{ color: C.body }}>मासिक गुंतवणूक</span>
                <div className="flex items-center rounded-lg border px-2.5 py-1" style={{ borderColor: C.border }}>
                  <span className="mr-1 text-xs" style={{ color: C.gray }}>₹</span>
                  <input type="number" min={500} max={100000} step={500} value={monthly}
                    onChange={(e) => setMonthly(Math.min(100000, Math.max(500, Number(e.target.value) || 0)))}
                    className="w-20 bg-transparent text-right text-sm font-bold focus:outline-none" style={{ color: C.ink }} aria-label="मासिक गुंतवणूक" />
                </div>
              </div>
              <input type="range" min={500} max={100000} step={500} value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))} className="premium-range mt-3 w-full" aria-label="मासिक गुंतवणूक स्लायडर" />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm font-deva">
                <span style={{ color: C.body }}>वार्षिक परतावा (%)</span>
                <div className="flex items-center rounded-lg border px-2.5 py-1" style={{ borderColor: C.border }}>
                  <input type="number" min={1} max={30} step={0.5} value={rate}
                    onChange={(e) => setRate(Math.min(30, Math.max(1, Number(e.target.value) || 0)))}
                    className="w-12 bg-transparent text-right text-sm font-bold focus:outline-none" style={{ color: C.ink }} aria-label="वार्षिक परतावा" />
                  <span className="ml-1 text-xs" style={{ color: C.gray }}>%</span>
                </div>
              </div>
              <input type="range" min={1} max={30} step={0.5} value={rate}
                onChange={(e) => setRate(Number(e.target.value))} className="premium-range mt-3 w-full" aria-label="वार्षिक परतावा स्लायडर" />
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-deva" style={{ color: C.muted }}>
          स्लायडर/परतावा बदला — रेषा व आकडे smooth (ease-in-out) हलतात.
        </p>
      </div>
    </div>
  );
}
