import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light "soft premium" theme. Token names kept for compatibility:
        // bk-dark now reads as the on-accent (white) / light-surface color,
        // bk-card as a light surface, and bk-gold as the teal primary accent.
        'bk-dark': '#ffffff',
        'bk-card': '#ffffff',
        'bk-gold': '#0f766e', // teal-700 — primary accent (good contrast on light)
        'bk-gold-light': '#0d9488', // teal-600 — hover
        'bk-success': '#0f9d6b',
        'bk-danger': '#e11d48',
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
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(13,148,136,0.35)' },
          '50%': { boxShadow: '0 0 0 12px rgba(13,148,136,0)' },
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
