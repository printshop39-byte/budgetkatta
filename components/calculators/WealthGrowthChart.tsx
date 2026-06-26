"use client";
// WealthGrowthChart — premium green area+line growth chart (Total Wealth vs
// Invested Principal) used by the calculators. Light-themed (sits on a white
// card). Pure SVG; re-renders on prop change so dragging a slider updates it
// continuously. Colors follow the BudgetKatta palette: wealth = brand green,
// invested = amber.
import { useMemo, useRef, useState } from "react";

const GREEN = "#16A34A";
const AMBER = "#F59E0B";

const inrShort = (n: number) => {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(1).replace(/\.0$/, "") + " कोटी";
  if (n >= 1e5) return "₹" + Math.round(n / 1e5) + " लाख";
  if (n >= 1e3) return "₹" + Math.round(n / 1e3) + "K";
  return "₹" + Math.round(n);
};

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

const W = 620, H = 240, PL = 56, PR = 16, PT = 16, PB = 30;
const x0 = PL, x1 = W - PR, yTop = PT, yBot = H - PB;

type Props = {
  monthly: number;
  rate: number;
  years: number;
  dark?: boolean;
  labels?: { wealth: string; invested: string };
};

export default function WealthGrowthChart({ monthly, rate, years, dark = false, labels }: Props) {
  const GRID = dark ? "#334155" : "#E2E8F0";
  const MUTED = dark ? "#94A3B8" : "#64748B";
  const DOT_BORDER = dark ? "#1E293B" : "#FFFFFF";
  const LEGEND = dark ? "#CBD5E1" : "#334155";
  const fillOpacity = dark ? "0.28" : "0.20";
  const TT_BG = dark ? "#0B1220" : "#FFFFFF";
  const TT_BORDER = dark ? "#334155" : "#E2E8F0";
  const TT_TEXT = dark ? "#E2E8F0" : "#0F172A";

  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const svgX = ((e.clientX - r.left) / r.width) * W;
    const yr = Math.round(((svgX - x0) / (x1 - x0)) * years);
    setHover(Math.max(0, Math.min(years, yr)));
  };

  const { wealth, principal, max } = useMemo(() => {
    const i = rate / 100 / 12;
    const wAt = (y: number) => (y === 0 ? 0 : monthly * ((Math.pow(1 + i, y * 12) - 1) / i) * (1 + i));
    const pAt = (y: number) => monthly * 12 * y;
    const w = Array.from({ length: years + 1 }, (_, y) => wAt(y));
    const p = Array.from({ length: years + 1 }, (_, y) => pAt(y));
    return { wealth: w, principal: p, max: w[years] || 1 };
  }, [monthly, rate, years]);

  const xFor = (y: number) => x0 + (y / years) * (x1 - x0);
  const yFor = (v: number) => yBot - (v / max) * (yBot - yTop);

  const wealthPts = wealth.map((v, y) => ({ x: xFor(y), y: yFor(v) }));
  const principalPts = principal.map((v, y) => ({ x: xFor(y), y: yFor(v) }));
  const wealthLine = smoothPath(wealthPts);
  const wealthArea = `${wealthLine} L ${x1.toFixed(2)} ${yBot} L ${x0.toFixed(2)} ${yBot} Z`;
  const principalLine = smoothPath(principalPts);

  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const xTicks = Array.from(
    new Set([0, Math.round(years * 0.25), Math.round(years * 0.5), Math.round(years * 0.75), years])
  );
  // show dots only when not too crowded
  const showDots = years <= 20;

  const L = labels ?? { wealth: "एकूण संपत्ती", invested: "गुंतवलेली रक्कम" };

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ overflow: "visible" }}
        role="img"
        aria-label="संपत्ती वाढीचा आलेख"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="wgcFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GREEN} stopOpacity={fillOpacity} />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </linearGradient>
          <filter id="wgcShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={GREEN} floodOpacity="0.28" />
          </filter>
        </defs>

        {yTicks.map((t) => {
          const y = yBot - t * (yBot - yTop);
          return (
            <g key={t}>
              <line x1={x0} y1={y} x2={x1} y2={y} stroke={GRID} strokeWidth="1" strokeDasharray="4 4" />
              <text x={x0 - 10} y={y + 4} textAnchor="end" fontSize="11" fill={MUTED}>{inrShort(t * max)}</text>
            </g>
          );
        })}

        {xTicks.map((y) => (
          <text key={y} x={xFor(y)} y={yBot + 20} textAnchor="middle" fontSize="11" fill={MUTED}>वर्ष {y}</text>
        ))}

        <path d={principalLine} fill="none" stroke={AMBER} strokeWidth="2.5" strokeDasharray="5 4" strokeLinecap="round" />
        <path d={wealthArea} fill="url(#wgcFill)" stroke="none" />
        <path d={wealthLine} fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" filter="url(#wgcShadow)" />

        {showDots &&
          principalPts.map((p, idx) => <circle key={`p${idx}`} cx={p.x} cy={p.y} r="3" fill={AMBER} />)}
        {showDots &&
          wealthPts.map((p, idx) => (
            <circle key={`w${idx}`} cx={p.x} cy={p.y} r="4" fill={GREEN} stroke={DOT_BORDER} strokeWidth="1.5" />
          ))}

        {/* End-point emphasis: soft halo on the final wealth value */}
        <circle cx={wealthPts[years].x} cy={wealthPts[years].y} r="9" fill={GREEN} opacity="0.18" />
        <circle cx={wealthPts[years].x} cy={wealthPts[years].y} r="4.5" fill={GREEN} stroke={DOT_BORDER} strokeWidth="2" />

        {/* Hover crosshair + tooltip */}
        {hover !== null && (() => {
          const hx = xFor(hover);
          const wy = yFor(wealth[hover]);
          const py = yFor(principal[hover]);
          const boxW = 134, boxH = 56, pad = 8;
          const tx = Math.max(x0, Math.min(x1 - boxW, hx - boxW / 2));
          const ty = yTop;
          return (
            <g pointerEvents="none">
              <line x1={hx} y1={yTop} x2={hx} y2={yBot} stroke={MUTED} strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
              <circle cx={hx} cy={py} r="4" fill={AMBER} stroke={DOT_BORDER} strokeWidth="1.5" />
              <circle cx={hx} cy={wy} r="5" fill={GREEN} stroke={DOT_BORDER} strokeWidth="2" />
              <rect x={tx} y={ty} width={boxW} height={boxH} rx="8" fill={TT_BG} stroke={TT_BORDER} strokeWidth="1" />
              <text x={tx + pad} y={ty + 16} fontSize="11" fontWeight="600" fill={TT_TEXT}>वर्ष {hover}</text>
              <text x={tx + pad} y={ty + 32} fontSize="11" fill={GREEN}>● {inrShort(wealth[hover])}</text>
              <text x={tx + pad} y={ty + 48} fontSize="11" fill={AMBER}>● {inrShort(principal[hover])}</text>
            </g>
          );
        })()}

        {/* Transparent overlay to reliably capture pointer across the plot */}
        <rect x={x0} y={yTop} width={x1 - x0} height={yBot - yTop} fill="transparent" style={{ pointerEvents: "all" }} />
      </svg>

      <div className="mt-2 flex items-center justify-center gap-5 text-xs font-deva" style={{ color: LEGEND }}>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: GREEN }} /> {L.wealth}</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: AMBER }} /> {L.invested}</span>
      </div>
    </div>
  );
}
