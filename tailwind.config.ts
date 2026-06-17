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
      },
      fontFamily: {
        display: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
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
