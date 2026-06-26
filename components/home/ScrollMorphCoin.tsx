"use client";
// ScrollMorphCoin — Apple-style scroll storytelling that bridges into the
// calculator section: a 3D-styled gold coin rotates as you scroll and a green
// investment-growth chart builds up beneath it. GSAP + ScrollTrigger are
// LAZY-LOADED (dynamic import inside useEffect) so they never touch the
// homepage's initial bundle / FCP. Progressive enhancement: if GSAP or motion
// is unavailable, the static composition below is already a clean illustration.
import { useEffect, useRef } from "react";
import { useLanguageStore } from "@/store/languageStore";

const BARS = [38, 52, 64, 80, 100];

export default function ScrollMorphCoin() {
  const mr = useLanguageStore((s) => s.language) === "mr";
  const sectionRef = useRef<HTMLElement>(null);
  const coinRef = useRef<SVGSVGElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let killed = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (killed || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const bars = barsRef.current?.querySelectorAll<HTMLElement>("[data-bar]") ?? [];

        // Coin spins on its axis through the section (scrubbed to scroll).
        gsap.to(coinRef.current, {
          rotateY: 540,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "bottom 25%", scrub: 1 },
        });

        // Coin gently shrinks & lifts as the chart takes over.
        gsap.to(coinRef.current, {
          scale: 0.82,
          y: -8,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "center 75%", end: "bottom 40%", scrub: 1 },
        });

        // Chart bars rise from the baseline once, when the section enters view.
        gsap.from(bars, {
          scaleY: 0,
          opacity: 0,
          transformOrigin: "bottom",
          stagger: 0.09,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        });
      }, sectionRef);

      ScrollTrigger.refresh();
    })();

    return () => {
      killed = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="mx-auto max-w-3xl px-6 py-12 text-center">
      <span className="text-xs font-bold uppercase tracking-widest text-amber-300/90 font-deva">
        {mr ? "गुंतवणुकीची ताकद" : "The power of investing"}
      </span>
      <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-100 font-deva md:text-3xl">
        {mr ? "तुमचा पैसा वाढताना पाहा" : "Watch your money grow"}
      </h2>

      <div className="relative mx-auto mt-8 flex h-56 w-full max-w-md flex-col items-center justify-end" style={{ perspective: 900 }}>
        {/* 3D gold coin */}
        <svg
          ref={coinRef}
          viewBox="0 0 100 100"
          className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 drop-shadow-[0_8px_24px_rgba(245,158,11,0.45)]"
          style={{ transformStyle: "preserve-3d" }}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="coinFace" cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="55%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#coinFace)" stroke="#FCD34D" strokeWidth="3" />
          <circle cx="50" cy="50" r="37" fill="none" stroke="#B45309" strokeOpacity="0.5" strokeWidth="2" />
          <text x="50" y="66" textAnchor="middle" fontSize="46" fontWeight="800" fill="#7C2D12">₹</text>
        </svg>

        {/* Investment growth chart */}
        <div ref={barsRef} className="flex h-40 items-end justify-center gap-2.5">
          {BARS.map((h, i) => (
            <div
              key={i}
              data-bar
              style={{ height: `${h}%` }}
              className="w-9 rounded-t-xl bg-gradient-to-t from-[#16A34A] to-[#4ADE80] shadow-[0_6px_16px_rgba(22,163,74,0.30)]"
            />
          ))}
        </div>
        <div className="mt-3 h-px w-full max-w-xs bg-slate-700/60" />
      </div>
    </section>
  );
}
