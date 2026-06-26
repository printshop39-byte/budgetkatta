// themeTransition.ts — Apple-style "fluid ripple" theme switch. Uses the native
// View Transitions API to expand a circular reveal of the new theme from the
// exact click coordinates. Gracefully falls back to an instant switch when the
// API is unavailable or the user prefers reduced motion. Zero dependencies.
import type { Theme } from "@/store/themeStore";

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export function rippleToggleTheme(
  coords: { clientX: number; clientY: number },
  current: Theme,
  setTheme: (t: Theme) => void,
): void {
  const next: Theme = current === "dark" ? "light" : "dark";

  // data-theme drives the palette; set it synchronously so the View Transition
  // snapshot captures the new theme, then sync the persisted store.
  const apply = () => {
    document.documentElement.dataset.theme = next;
    setTheme(next);
  };

  const doc = document as ViewTransitionDoc;
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || typeof doc.startViewTransition !== "function") {
    apply();
    return;
  }

  const x = coords.clientX;
  const y = coords.clientY;
  const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const transition = doc.startViewTransition(() => apply());
  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
        },
        {
          duration: 480,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {
      /* transition aborted — palette already applied */
    });
}
