"use client";
// app/theme-preview/page.tsx — THROWAWAY preview of the proposed light
// "60-30-10" theme applied to INTERNAL pages: calculator (2-col + donut),
// blog callouts, and a comparison table (slate header + zebra). Not linked
// anywhere; safe to delete. Dark Navbar/Footer from the root layout still
// wrap this — a real migration would re-theme those too.
import { useState } from "react";
import { Calculator, TrendingUp, ArrowRight, AlertTriangle, Info, Check } from "lucide-react";

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

// Palette (matches the user's spec) ----------------------------------------
const C = {
  bg: "#F8FAFC",
  ink: "#0F172A",
  slate: "#1E293B",
  body: "#334155",
  orange: "#FF6B00",
  amber: "#F59E0B",
  blue: "#2563EB",
  green: "#16A34A",
  border: "#E2E8F0",
  zebra: "#F1F5F9",
  calloutYellow: "#FEF3C7",
  calloutBlue: "#EFF6FF",
};

const fdRows = [
  { bank: "SBI", reg: "6.80", sr: "7.30", best: false },
  { bank: "HDFC Bank", reg: "7.00", sr: "7.50", best: false },
  { bank: "Bajaj Finance", reg: "7.40", sr: "7.65", best: true },
  { bank: "Axis Bank", reg: "7.10", sr: "7.60", best: false },
  { bank: "Post Office", reg: "7.10", sr: "7.10", best: false },
];

export default function ThemePreviewPage() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(10);

  const i = 0.12 / 12;
  const n = years * 12;
  const projected = monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const invested = monthly * n;
  const returns = projected - invested;

  // Donut geometry
  const r = 54;
  const circ = 2 * Math.PI * r;
  const investedFrac = invested / projected;
  const investedLen = circ * investedFrac;

  return (
    <div style={{ background: C.bg, color: C.body }} className="w-full">
      <div className="mx-auto max-w-5xl px-6 pb-28 pt-12">
        {/* Preview banner */}
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium"
          style={{ background: "#fff", border: `1px solid ${C.border}`, color: "#64748B" }}
        >
          Design preview — light 60-30-10 theme · /theme-preview
        </div>

        {/* ============ A. CALCULATOR PAGE (2-column) ============ */}
        <h1 className="text-3xl font-extrabold font-deva" style={{ color: C.ink }}>
          SIP कॅल्क्युलेटर
        </h1>
        <p className="mt-1 text-base font-medium font-deva" style={{ color: C.body }}>
          दरमहा गुंतवणुकीतून किती संपत्ती तयार होईल? — नमुना उदाहरण.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left 60% — inputs */}
          <div
            className="lg:col-span-3 rounded-2xl p-6"
            style={{ background: "#fff", border: `1px solid ${C.border}` }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: "#FFF1E6", color: C.orange }}
              >
                <Calculator className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold font-deva" style={{ color: C.ink }}>
                तुमची गुंतवणूक
              </h2>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm font-deva">
                <span style={{ color: C.body }}>दरमहा रक्कम</span>
                <div
                  className="flex items-center rounded-lg px-3 py-1"
                  style={{ background: C.zebra, border: `1px solid ${C.border}` }}
                >
                  <span className="mr-1 text-sm" style={{ color: "#94A3B8" }}>₹</span>
                  <input
                    type="number" min={1000} max={50000} step={500} value={monthly}
                    onChange={(e) => setMonthly(Math.min(50000, Math.max(1000, Number(e.target.value) || 0)))}
                    className="w-20 bg-transparent text-right text-sm font-bold focus:outline-none"
                    style={{ color: C.ink }} aria-label="मासिक रक्कम"
                  />
                </div>
              </div>
              <input
                type="range" min={1000} max={50000} step={500} value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                className="mt-2 w-full" style={{ accentColor: C.orange }} aria-label="मासिक रक्कम स्लायडर"
              />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm font-deva">
                <span style={{ color: C.body }}>कालावधी (वर्षे)</span>
                <div
                  className="flex items-center rounded-lg px-3 py-1"
                  style={{ background: C.zebra, border: `1px solid ${C.border}` }}
                >
                  <input
                    type="number" min={1} max={30} step={1} value={years}
                    onChange={(e) => setYears(Math.min(30, Math.max(1, Number(e.target.value) || 0)))}
                    className="w-10 bg-transparent text-right text-sm font-bold focus:outline-none"
                    style={{ color: C.ink }} aria-label="कालावधी"
                  />
                  <span className="ml-1 text-sm font-deva" style={{ color: "#94A3B8" }}>वर्षे</span>
                </div>
              </div>
              <input
                type="range" min={1} max={30} step={1} value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="mt-2 w-full" style={{ accentColor: C.blue }} aria-label="कालावधी स्लायडर"
              />
            </div>

            <p
              className="mt-6 flex items-start gap-2 rounded-lg p-3 text-xs leading-relaxed font-deva"
              style={{ background: C.calloutYellow, color: "#92400E" }}
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              गुंतवणूक बाजाराच्या जोखमीच्या अधीन आहे. हे फक्त १२% गृहीत धरून केलेले उदाहरण आहे.
            </p>
          </div>

          {/* Right 40% — result + donut */}
          <div
            className="lg:col-span-2 rounded-2xl p-6 text-center"
            style={{ background: "#fff", border: `1px solid ${C.border}` }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide font-deva" style={{ color: "#64748B" }}>
              अंदाजे संपत्ती
            </p>
            <p className="mt-1 text-3xl font-extrabold" style={{ color: C.green }}>{inr(projected)}</p>

            <div className="relative mx-auto mt-4 h-40 w-40">
              <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                <circle cx="70" cy="70" r={r} fill="none" stroke={C.border} strokeWidth="16" />
                <circle
                  cx="70" cy="70" r={r} fill="none" stroke={C.blue} strokeWidth="16"
                  strokeDasharray={`${investedLen} ${circ}`} strokeLinecap="butt"
                  style={{ transition: "stroke-dasharray 0.45s ease-in-out" }}
                />
                <circle
                  cx="70" cy="70" r={r} fill="none" stroke={C.orange} strokeWidth="16"
                  strokeDasharray={`${circ - investedLen} ${circ}`} strokeDashoffset={-investedLen} strokeLinecap="butt"
                  style={{ transition: "stroke-dasharray 0.45s ease-in-out, stroke-dashoffset 0.45s ease-in-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: C.green }}>
                  <TrendingUp className="h-3 w-3" /> +{Math.round((returns / invested) * 100)}%
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-left text-sm">
              <div className="flex items-center justify-between font-deva">
                <span className="inline-flex items-center gap-2" style={{ color: C.body }}>
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: C.blue }} /> गुंतवणूक
                </span>
                <span className="font-bold" style={{ color: C.ink }}>{inr(invested)}</span>
              </div>
              <div className="flex items-center justify-between font-deva">
                <span className="inline-flex items-center gap-2" style={{ color: C.body }}>
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: C.orange }} /> परतावा
                </span>
                <span className="font-bold" style={{ color: C.orange }}>{inr(returns)}</span>
              </div>
            </div>

            <button
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white font-deva"
              style={{ background: C.orange }}
            >
              तज्ज्ञाचा सल्ला मिळवा <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ============ C. COMPARISON TABLE ============ */}
        <h2 className="mt-14 text-2xl font-bold font-deva" style={{ color: C.ink }}>
          FD दरांची तुलना
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.slate }}>
                <th className="px-4 py-3 text-left font-semibold text-white font-deva">बँक</th>
                <th className="px-4 py-3 text-right font-semibold text-white font-deva">सामान्य दर</th>
                <th className="px-4 py-3 text-right font-semibold text-white font-deva">ज्येष्ठ नागरिक</th>
              </tr>
            </thead>
            <tbody>
              {fdRows.map((row, idx) => (
                <tr key={row.bank} style={{ background: idx % 2 === 1 ? C.zebra : "#fff" }}>
                  <td className="px-4 py-3 font-medium font-deva" style={{ color: C.ink }}>
                    {row.bank}
                    {row.best && (
                      <span
                        className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold align-middle"
                        style={{ background: "#FFF1E6", color: C.orange }}
                      >
                        <Check className="h-3 w-3" /> सर्वोत्तम
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: row.best ? C.orange : C.body }}>
                    {row.reg}%
                  </td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: row.best ? C.orange : C.body }}>
                    {row.sr}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ============ B. BLOG / INFO ============ */}
        <h2 className="mt-14 text-2xl font-bold font-deva" style={{ color: C.ink }}>
          SIP म्हणजे काय?
        </h2>
        <p className="mt-3 text-base leading-relaxed font-deva" style={{ color: C.body }}>
          SIP (Systematic Investment Plan) म्हणजे दर महिन्याला ठराविक रक्कम म्युच्युअल फंडात गुंतवणे.
          यामुळे बाजारातील चढ-उतारांचा सरासरी फायदा मिळतो आणि दीर्घकाळात संपत्ती तयार होते. मजकूर
          पूर्ण काळ्याऐवजी <span style={{ color: C.slate, fontWeight: 500 }}>slate-gray</span> रंगात
          ठेवल्याने वाचताना डोळ्यांवर ताण येत नाही.
        </p>

        <div
          className="mt-4 flex items-start gap-2.5 rounded-xl p-4 text-sm leading-relaxed font-deva"
          style={{ background: C.calloutBlue, color: "#1E40AF", borderLeft: `4px solid ${C.blue}` }}
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span><strong>टीप:</strong> लवकर सुरुवात केल्यास चक्रवाढीचा (compounding) फायदा सर्वाधिक मिळतो. दरमहा छोटी रक्कमही मोठी संपत्ती बनवू शकते.</span>
        </div>

        <a
          href="#" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold"
          style={{ color: C.blue }} onClick={(e) => e.preventDefault()}
        >
          संपूर्ण मार्गदर्शक वाचा <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
