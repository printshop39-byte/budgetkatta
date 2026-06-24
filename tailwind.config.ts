import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark premium fintech theme with amber/yellow accents.
        // Legacy token names kept for compatibility:
        //   bk-dark  -> slate-950 base
        //   bk-card  -> slate-900 surface
        //   bk-gold  -> amber-400 primary accent
        'bk-dark': '#020617',      // slate-950
        'bk-card': '#0f172a',      // slate-900
        'bk-gold': '#fbbf24',      // amber-400 — primary accent
        'bk-gold-light': '#fcd34d', // amber-300 — hover
        'bk-success': '#34d399',
        'bk-danger': '#f43f5e',

        // ── Brand palette (BudgetKatta brand board) ──────────────────
        // Available as named tokens (bg-bk-green, text-bk-orange, etc.).
        'bk-green': '#27AE60',        // Savings Green — primary / CTA / icon
        'bk-green-tint': '#E6F7EE',   // green tint surface
        'bk-orange': '#FF7A29',       // Energy Orange — deals / badges / alerts
        'bk-orange-tint': '#FFF0E6',  // orange tint surface
        'bk-navy': '#1B2B4B',         // Trust Navy — headlines / dark bg
        'bk-mint': '#ECF2ED',         // Mint Cream — background / cards
      },
      fontFamily: {
        // Brand typefaces: Outfit (display/headings) + Plus Jakarta Sans (body).
        display: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
        body: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
        deva: ['var(--font-deva)', 'Noto Sans Devanagari', 'sans-serif'],
      },
      // Non-standard utilities used by the reference design (h-4.5, p-4.5, scale-102).
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      scale: {
        '102': '1.02',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(251,191,36,0.45)' },
          '50%': { boxShadow: '0 0 0 12px rgba(251,191,36,0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
