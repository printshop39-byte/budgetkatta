# 🏆 BudgetKatta — Premium Fintech Website Improvement Guide
**Version 2.0 | Full-Stack Next.js 14 | AI-Powered | Bilingual (मराठी + हिंदी)**

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Design System](#3-design-system)
4. [Folder Structure](#4-folder-structure)
5. [Language i18n System](#5-language-i18n-system)
6. [AI 3D Bot — Floating3DGuide](#6-ai-3d-bot--floating3dguide)
7. [Interactive Calculators](#7-interactive-calculators)
8. [Compare Feature — CompareDrawer](#8-compare-feature--comparedrawer)
9. [Lead Automation — n8n Integration](#9-lead-automation--n8n-integration)
10. [Trust & Disclaimer Section](#10-trust--disclaimer-section)
11. [Performance & Mobile Optimization](#11-performance--mobile-optimization)
12. [Database Schema — MongoDB Atlas](#12-database-schema--mongodb-atlas)
13. [AI Integration Roadmap](#13-ai-integration-roadmap)
14. [Environment Variables](#14-environment-variables)
15. [Component Checklist](#15-component-checklist)
16. [UX Copy — Bilingual Strings](#16-ux-copy--bilingual-strings)
17. [SEO & Analytics](#17-seo--analytics)
18. [Deployment Guide](#18-deployment-guide)

---

## 1. Project Overview

**BudgetKatta** is a premium bilingual fintech information platform targeting Marathi and Hindi-speaking users across Maharashtra and India. The goal is to make financial information (FD, Loans, SIP, Insurance) accessible, interactive, and AI-powered — not just a static information website.

### Core Pillars

| Pillar | Description |
|---|---|
| 🌐 Bilingual | मराठी + हिंदी with clean i18n architecture |
| 🤖 AI-Powered | 3D Bot + Gemini API + Voice Assistant (Vapi) |
| 📊 Interactive | Calculators, Compare Drawer, Live Filters |
| 🔗 Automated | n8n Lead Capture → CRM → WhatsApp → Email |
| 🎨 Premium Design | Glassmorphism + Warm Gold + Dark Theme |
| 📱 Mobile-First | Lightweight mobile bot, responsive layout |

### Target Audience
- Marathi-speaking users in Maharashtra (Tier 2/3 cities)
- Hindi-speaking users across India
- Age group: 25–55 years
- Interested in: FD, Home Loan, SIP, Health Insurance

---

## 2. Tech Stack & Architecture

### Frontend
```
Next.js 14 (App Router)
TypeScript
Tailwind CSS 3.4
Framer Motion (animations)
Spline (3D Bot — desktop only)
React Hook Form (calculators)
Zustand (global state — language, compare items)
```

### Backend / Database
```
Next.js API Routes
MongoDB Atlas + Mongoose
Vercel Serverless Functions
```

### AI & Automation
```
Google Gemini API (chatbot responses)
Vapi.ai (voice assistant)
n8n (lead automation webhook)
```

### Third-Party
```
Razorpay (future payments)
WhatsApp Business API (via n8n)
Google Sheets API (via n8n)
```

---

## 3. Design System

### Color Palette

```css
/* === BudgetKatta Design Tokens === */

:root {
  /* Primary Background */
  --bg-dark:         #0A0E1A;   /* Deep Navy Black — main background */
  --bg-card:         #111827;   /* Dark Card Background */
  --bg-glass:        rgba(255, 255, 255, 0.05);  /* Glassmorphism */

  /* Brand Accent */
  --gold-primary:    #F5A623;   /* Warm Gold — CTA, highlights */
  --gold-light:      #FFD166;   /* Light Gold — hover states */
  --gold-muted:      #B8861A;   /* Dark Gold — borders, subtle */

  /* Text */
  --text-primary:    #F9FAFB;   /* White — headings */
  --text-secondary:  #9CA3AF;   /* Gray — body text */
  --text-muted:      #6B7280;   /* Muted — placeholders */

  /* Status Colors */
  --success:         #10B981;   /* Green — positive rates, badges */
  --warning:         #FBBF24;   /* Amber — medium risk */
  --danger:          #EF4444;   /* Red — high risk, alerts */
  --info:            #3B82F6;   /* Blue — info chips */

  /* Borders */
  --border-glass:    rgba(255, 255, 255, 0.08);
  --border-gold:     rgba(245, 166, 35, 0.3);
}
```

### Typography

```css
/* Font Stack */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap');

/* For Marathi/Hindi Devanagari text */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');

:root {
  --font-display:  'Poppins', sans-serif;       /* Headings, CTAs */
  --font-body:     'Inter', sans-serif;          /* Body, data */
  --font-deva:     'Noto Sans Devanagari', sans-serif;  /* Marathi/Hindi */
}

/* Type Scale */
--text-xs:    0.75rem;    /* 12px — badges, labels */
--text-sm:    0.875rem;   /* 14px — captions */
--text-base:  1rem;       /* 16px — body */
--text-lg:    1.125rem;   /* 18px — lead text */
--text-xl:    1.25rem;    /* 20px — card titles */
--text-2xl:   1.5rem;     /* 24px — section titles */
--text-3xl:   1.875rem;   /* 30px — page titles */
--text-4xl:   2.25rem;    /* 36px — hero headline */
--text-5xl:   3rem;       /* 48px — display */
```

### Glassmorphism Card Mixin

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Gold accent border variant */
.glass-card-gold {
  border: 1px solid rgba(245, 166, 35, 0.25);
  box-shadow: 0 8px 32px rgba(245, 166, 35, 0.08);
}
```

### Tailwind Config Extension

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'bk-dark':    '#0A0E1A',
        'bk-card':    '#111827',
        'bk-gold':    '#F5A623',
        'bk-gold-light': '#FFD166',
        'bk-success': '#10B981',
        'bk-danger':  '#EF4444',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        deva:    ['Noto Sans Devanagari', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      animation: {
        'float':      'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'fade-up':    'fadeUp 0.5s ease-out',
        'slide-in':   'slideIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245,166,35,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(245,166,35,0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
      },
    },
  },
};
```

---

## 4. Folder Structure

```
budgetkatta/
├── app/
│   ├── layout.tsx                    # Root layout with i18n provider
│   ├── page.tsx                      # Home page
│   ├── fd/
│   │   └── page.tsx                  # FD Rates page
│   ├── loans/
│   │   └── page.tsx                  # Loans page
│   ├── sip/
│   │   └── page.tsx                  # SIP / Mutual Funds page
│   ├── insurance/
│   │   └── page.tsx                  # Insurance page
│   └── api/
│       ├── leads/
│       │   └── route.ts              # Lead capture API
│       ├── chat/
│       │   └── route.ts              # Gemini chatbot API
│       └── rates/
│           └── route.ts              # FD/Loan rates API
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                # Navbar with language switcher
│   │   └── Footer.tsx                # Footer with trust + disclaimer
│   │
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   └── ModuleCards.tsx
│   │
│   ├── shared/
│   │   ├── GlassCard.tsx             # Reusable glass card
│   │   ├── GoldButton.tsx            # Primary CTA button
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   └── BadgeChip.tsx
│   │
│   ├── calculators/
│   │   ├── FDCalculator.tsx          # FD Maturity Calculator
│   │   ├── EMICalculator.tsx         # EMI Calculator
│   │   ├── SIPCalculator.tsx         # SIP Returns Calculator
│   │   └── InsuranceEstimator.tsx    # Insurance Premium Estimator
│   │
│   ├── compare/
│   │   └── CompareDrawer.tsx         # Comparison drawer (all modules)
│   │
│   ├── bot/
│   │   └── Floating3DGuide.tsx       # AI 3D Bot (desktop + mobile)
│   │
│   └── trust/
│       └── TrustSection.tsx          # Trust badges + disclaimer
│
├── lib/
│   ├── i18n.ts                       # Language dictionaries (mr/hi)
│   ├── leadAutomation.ts             # n8n lead payload sender
│   ├── gemini.ts                     # Gemini API client (placeholder)
│   ├── vapi.ts                       # Vapi voice assistant (placeholder)
│   └── mongodb.ts                    # MongoDB connection
│
├── store/
│   ├── languageStore.ts              # Zustand — active language
│   └── compareStore.ts              # Zustand — items to compare
│
├── models/
│   ├── Lead.ts                       # Lead schema
│   ├── FDRate.ts                     # FD rate schema
│   ├── LoanProduct.ts               # Loan product schema
│   ├── SIPFund.ts                   # SIP fund schema
│   └── Insurance.ts                 # Insurance plan schema
│
├── types/
│   └── index.ts                      # All TypeScript interfaces
│
├── public/
│   ├── bot-avatar.png               # Compact mobile bot avatar
│   └── trust-icons/                 # Trust badge SVG icons
│
└── .env.local                        # Environment variables
```

---

## 5. Language i18n System

### `/lib/i18n.ts` — Full Dictionary

```typescript
// lib/i18n.ts
// Architecture: add new languages by adding a new key block below.
// Usage: const t = useTranslation(); t('hero.title')

export type Language = 'mr' | 'hi';

export const i18n: Record<Language, Record<string, string>> = {

  // ============================================================
  // मराठी (Marathi)
  // ============================================================
  mr: {
    // --- Navbar ---
    'nav.home':          'मुख्यपृष्ठ',
    'nav.fd':            'ठेव (FD)',
    'nav.loans':         'कर्ज',
    'nav.sip':           'SIP',
    'nav.insurance':     'विमा',
    'nav.compare':       'तुलना करा',
    'nav.language':      'भाषा',

    // --- Hero Section ---
    'hero.badge':        '🏆 महाराष्ट्रातील #1 आर्थिक मार्गदर्शक',
    'hero.title':        'स्मार्ट गुंतवणूक,\nसुरक्षित भविष्य',
    'hero.subtitle':     'FD, कर्ज, SIP आणि विम्याच्या सर्वोत्तम योजना एकाच ठिकाणी. AI सहाय्यित मार्गदर्शन.',
    'hero.cta_primary':  'आता सुरुवात करा',
    'hero.cta_secondary':'कॅल्क्युलेटर वापरा',
    'hero.stat_banks':   'बँका',
    'hero.stat_users':   'वापरकर्ते',
    'hero.stat_rate':    'सर्वोच्च FD दर',

    // --- FD Page ---
    'fd.title':          'मुदत ठेव (FD) दर',
    'fd.subtitle':       'सर्व प्रमुख बँकांचे सर्वोत्तम FD दर',
    'fd.filter_all':     'सर्व बँका',
    'fd.filter_govt':    'सरकारी बँका',
    'fd.filter_private': 'खाजगी बँका',
    'fd.col_bank':       'बँक',
    'fd.col_tenure':     'कालावधी',
    'fd.col_regular':    'सामान्य दर',
    'fd.col_senior':     'ज्येष्ठ नागरिक दर',
    'fd.calc_title':     'FD परिपक्वता कॅल्क्युलेटर',
    'fd.amount':         'ठेव रक्कम (₹)',
    'fd.rate':           'व्याजदर (%)',
    'fd.tenure':         'कालावधी (वर्षे)',
    'fd.senior_toggle':  'ज्येष्ठ नागरिक आहात का?',
    'fd.maturity':       'परिपक्वता रक्कम',
    'fd.interest_earned':'एकूण व्याज',
    'fd.calculate':      'गणना करा',
    'fd.compare':        'तुलना करा',
    'fd.interested':     'मला स्वारस्य आहे',

    // --- Loan Page ---
    'loan.title':        'कर्ज योजना',
    'loan.subtitle':     'सर्वोत्तम कर्ज दर आणि अटी',
    'loan.home':         'गृहकर्ज',
    'loan.personal':     'वैयक्तिक कर्ज',
    'loan.vehicle':      'वाहन कर्ज',
    'loan.business':     'व्यवसाय कर्ज',
    'loan.education':    'शैक्षणिक कर्ज',
    'loan.col_bank':     'बँक',
    'loan.col_roi':      'व्याजदर',
    'loan.col_fee':      'प्रक्रिया शुल्क',
    'loan.col_tenure':   'कमाल कालावधी',
    'loan.emi_title':    'EMI कॅल्क्युलेटर',
    'loan.amount':       'कर्ज रक्कम (₹)',
    'loan.rate':         'व्याजदर (%)',
    'loan.tenure_month': 'कालावधी (महिने)',
    'loan.monthly_emi':  'मासिक EMI',
    'loan.total_interest':'एकूण व्याज',
    'loan.total_amount': 'एकूण परतफेड',
    'loan.calculate':    'EMI गणना करा',

    // --- SIP Page ---
    'sip.title':         'SIP / म्युच्युअल फंड',
    'sip.subtitle':      'दीर्घकालीन संपत्ती निर्माणासाठी सर्वोत्तम फंड',
    'sip.col_fund':      'फंडाचे नाव',
    'sip.col_category':  'प्रकार',
    'sip.col_3y':        '3 वर्षे परतावा',
    'sip.col_5y':        '5 वर्षे परतावा',
    'sip.col_risk':      'जोखीम',
    'sip.calc_title':    'SIP परतावा कॅल्क्युलेटर',
    'sip.monthly_invest':'मासिक गुंतवणूक (₹)',
    'sip.tenure_year':   'कालावधी (वर्षे)',
    'sip.expected_return':'अपेक्षित वार्षिक परतावा (%)',
    'sip.invested':      'गुंतवलेली रक्कम',
    'sip.returns':       'अंदाजे परतावा',
    'sip.maturity':      'अपेक्षित परिपक्वता रक्कम',

    // --- Insurance Page ---
    'ins.title':         'विमा योजना',
    'ins.subtitle':      'आरोग्य, जीवन आणि वाहन विम्याच्या सर्वोत्तम योजना',
    'ins.health':        'आरोग्य विमा',
    'ins.life':          'जीवन विमा',
    'ins.vehicle':       'वाहन विमा',
    'ins.col_company':   'कंपनी',
    'ins.col_plan':      'योजनेचे नाव',
    'ins.col_premium':   'वार्षिक प्रीमियम',
    'ins.col_features':  'मुख्य वैशिष्ट्ये',
    'ins.est_title':     'प्रीमियम अंदाज',
    'ins.age':           'वय',
    'ins.cover':         'विमा संरक्षण (₹)',
    'ins.type':          'विम्याचा प्रकार',
    'ins.policy_term':   'पॉलिसी कालावधी (वर्षे)',
    'ins.est_premium':   'अंदाजे वार्षिक प्रीमियम',
    'ins.suggested_cover':'सुचविलेले संरक्षण',

    // --- Buttons ---
    'btn.apply':         'अर्ज करा',
    'btn.learn_more':    'अधिक जाणून घ्या',
    'btn.compare':       'तुलना करा',
    'btn.interested':    'मला स्वारस्य आहे',
    'btn.clear':         'साफ करा',
    'btn.close':         'बंद करा',
    'btn.calculate':     'गणना करा',
    'btn.voice':         'व्हॉइस सहाय्यक',

    // --- Bot ---
    'bot.greeting':      'नमस्कार! मी बजेट कट्टाचा स्मार्ट गाईड आहे. तुम्हाला गुंतवणूक, कर्ज, SIP की विम्याची माहिती हवी आहे?',
    'bot.quick_fd':      'FD माहिती',
    'bot.quick_loan':    'कर्ज माहिती',
    'bot.quick_sip':     'SIP माहिती',
    'bot.quick_ins':     'विमा माहिती',
    'bot.voice_btn':     'व्हॉइस सहाय्यक',
    'bot.type_here':     'येथे लिहा...',
    'bot.send':          'पाठवा',

    // --- Trust Section ---
    'trust.secure':      'सुरक्षित माहिती',
    'trust.transparent': 'पारदर्शक तुलना',
    'trust.ai':          'AI-सहाय्यित मार्गदर्शन',
    'trust.updated':     'नियमित अपडेट्स',
    'trust.no_hidden':   'कोणतेही छुपे शुल्क नाहीत',
    'trust.disclaimer':  'ही माहिती केवळ शैक्षणिक आणि माहितीपर उद्देशासाठी दिलेली आहे. कोणताही आर्थिक निर्णय घेण्यापूर्वी संबंधित बँक, विमा कंपनी, म्युच्युअल फंड संस्था किंवा प्रमाणित आर्थिक सल्लागाराशी संपर्क साधावा.',

    // --- Loading & Empty States ---
    'state.loading':     'माहिती लोड होत आहे...',
    'state.empty':       'माहिती उपलब्ध नाही',
    'state.error':       'काहीतरी चुकले. पुन्हा प्रयत्न करा.',
    'state.no_results':  'कोणताही निकाल सापडला नाही',

    // --- Footer ---
    'footer.tagline':    'महाराष्ट्राचा विश्वासू आर्थिक मार्गदर्शक',
    'footer.rights':     '© 2025 बजेट कट्टा. सर्व हक्क राखीव.',
  },

  // ============================================================
  // हिंदी (Hindi)
  // ============================================================
  hi: {
    // --- Navbar ---
    'nav.home':          'होम',
    'nav.fd':            'FD जमा',
    'nav.loans':         'लोन',
    'nav.sip':           'SIP',
    'nav.insurance':     'बीमा',
    'nav.compare':       'तुलना करें',
    'nav.language':      'भाषा',

    // --- Hero Section ---
    'hero.badge':        '🏆 भारत का #1 वित्तीय मार्गदर्शक',
    'hero.title':        'स्मार्ट निवेश,\nसुरक्षित भविष्य',
    'hero.subtitle':     'FD, लोन, SIP और बीमा की सर्वश्रेष्ठ योजनाएं एक ही जगह। AI-सहायता प्राप्त मार्गदर्शन।',
    'hero.cta_primary':  'अभी शुरू करें',
    'hero.cta_secondary':'कैलकुलेटर उपयोग करें',
    'hero.stat_banks':   'बैंक',
    'hero.stat_users':   'उपयोगकर्ता',
    'hero.stat_rate':    'सर्वोच्च FD दर',

    // --- FD Page ---
    'fd.title':          'सावधि जमा (FD) दरें',
    'fd.subtitle':       'सभी प्रमुख बैंकों की सर्वश्रेष्ठ FD दरें',
    'fd.filter_all':     'सभी बैंक',
    'fd.filter_govt':    'सरकारी बैंक',
    'fd.filter_private': 'निजी बैंक',
    'fd.col_bank':       'बैंक',
    'fd.col_tenure':     'अवधि',
    'fd.col_regular':    'सामान्य दर',
    'fd.col_senior':     'वरिष्ठ नागरिक दर',
    'fd.calc_title':     'FD परिपक्वता कैलकुलेटर',
    'fd.amount':         'जमा राशि (₹)',
    'fd.rate':           'ब्याज दर (%)',
    'fd.tenure':         'अवधि (वर्ष)',
    'fd.senior_toggle':  'क्या आप वरिष्ठ नागरिक हैं?',
    'fd.maturity':       'परिपक्वता राशि',
    'fd.interest_earned':'कुल ब्याज',
    'fd.calculate':      'गणना करें',
    'fd.compare':        'तुलना करें',
    'fd.interested':     'मुझे रुचि है',

    // --- Loan Page ---
    'loan.title':        'लोन योजनाएं',
    'loan.subtitle':     'सर्वश्रेष्ठ ऋण दर और शर्तें',
    'loan.home':         'होम लोन',
    'loan.personal':     'पर्सनल लोन',
    'loan.vehicle':      'वाहन लोन',
    'loan.business':     'बिजनेस लोन',
    'loan.education':    'एजुकेशन लोन',
    'loan.col_bank':     'बैंक',
    'loan.col_roi':      'ब्याज दर',
    'loan.col_fee':      'प्रोसेसिंग शुल्क',
    'loan.col_tenure':   'अधिकतम अवधि',
    'loan.emi_title':    'EMI कैलकुलेटर',
    'loan.amount':       'लोन राशि (₹)',
    'loan.rate':         'ब्याज दर (%)',
    'loan.tenure_month': 'अवधि (महीने)',
    'loan.monthly_emi':  'मासिक EMI',
    'loan.total_interest':'कुल ब्याज',
    'loan.total_amount': 'कुल भुगतान',
    'loan.calculate':    'EMI गणना करें',

    // --- SIP Page ---
    'sip.title':         'SIP / म्यूचुअल फंड',
    'sip.subtitle':      'दीर्घकालीन संपत्ति निर्माण के लिए सर्वश्रेष्ठ फंड',
    'sip.col_fund':      'फंड का नाम',
    'sip.col_category':  'श्रेणी',
    'sip.col_3y':        '3 वर्ष रिटर्न',
    'sip.col_5y':        '5 वर्ष रिटर्न',
    'sip.col_risk':      'जोखिम',
    'sip.calc_title':    'SIP रिटर्न कैलकुलेटर',
    'sip.monthly_invest':'मासिक निवेश (₹)',
    'sip.tenure_year':   'अवधि (वर्ष)',
    'sip.expected_return':'अपेक्षित वार्षिक रिटर्न (%)',
    'sip.invested':      'निवेश राशि',
    'sip.returns':       'अनुमानित रिटर्न',
    'sip.maturity':      'अपेक्षित परिपक्वता राशि',

    // --- Insurance Page ---
    'ins.title':         'बीमा योजनाएं',
    'ins.subtitle':      'स्वास्थ्य, जीवन और वाहन बीमा की सर्वश्रेष्ठ योजनाएं',
    'ins.health':        'स्वास्थ्य बीमा',
    'ins.life':          'जीवन बीमा',
    'ins.vehicle':       'वाहन बीमा',
    'ins.col_company':   'कंपनी',
    'ins.col_plan':      'योजना का नाम',
    'ins.col_premium':   'वार्षिक प्रीमियम',
    'ins.col_features':  'मुख्य विशेषताएं',
    'ins.est_title':     'प्रीमियम अनुमान',
    'ins.age':           'आयु',
    'ins.cover':         'बीमा कवर (₹)',
    'ins.type':          'बीमा प्रकार',
    'ins.policy_term':   'पॉलिसी अवधि (वर्ष)',
    'ins.est_premium':   'अनुमानित वार्षिक प्रीमियम',
    'ins.suggested_cover':'सुझाया गया कवर',

    // --- Buttons ---
    'btn.apply':         'आवेदन करें',
    'btn.learn_more':    'और जानें',
    'btn.compare':       'तुलना करें',
    'btn.interested':    'मुझे रुचि है',
    'btn.clear':         'साफ करें',
    'btn.close':         'बंद करें',
    'btn.calculate':     'गणना करें',
    'btn.voice':         'वॉइस सहायक',

    // --- Bot ---
    'bot.greeting':      'नमस्ते! मैं बजट कट्टा का स्मार्ट गाइड हूं। आपको निवेश, लोन, SIP या बीमा की जानकारी चाहिए?',
    'bot.quick_fd':      'FD जानकारी',
    'bot.quick_loan':    'लोन जानकारी',
    'bot.quick_sip':     'SIP जानकारी',
    'bot.quick_ins':     'बीमा जानकारी',
    'bot.voice_btn':     'वॉइस सहायक',
    'bot.type_here':     'यहां लिखें...',
    'bot.send':          'भेजें',

    // --- Trust Section ---
    'trust.secure':      'सुरक्षित जानकारी',
    'trust.transparent': 'पारदर्शी तुलना',
    'trust.ai':          'AI-सहायता प्राप्त मार्गदर्शन',
    'trust.updated':     'नियमित अपडेट्स',
    'trust.no_hidden':   'कोई छुपे शुल्क नहीं',
    'trust.disclaimer':  'यह जानकारी केवल शैक्षणिक और सूचनात्मक उद्देश्य के लिए दी गई है। कोई भी वित्तीय निर्णय लेने से पहले संबंधित बैंक, बीमा कंपनी, म्यूचुअल फंड संस्था या प्रमाणित वित्तीय सलाहकार से संपर्क करें।',

    // --- Loading & Empty States ---
    'state.loading':     'जानकारी लोड हो रही है...',
    'state.empty':       'जानकारी उपलब्ध नहीं',
    'state.error':       'कुछ गलत हुआ। फिर से कोशिश करें।',
    'state.no_results':  'कोई परिणाम नहीं मिला',

    // --- Footer ---
    'footer.tagline':    'भारत का भरोसेमंद वित्तीय मार्गदर्शक',
    'footer.rights':     '© 2025 बजट कट्टा। सर्वाधिकार सुरक्षित।',
  },
};

// Hook to use translations
export function getTranslation(lang: Language) {
  return (key: string): string => {
    return i18n[lang][key] ?? key;
  };
}
```

---

## 6. AI 3D Bot — Floating3DGuide

### `/components/bot/Floating3DGuide.tsx`

```tsx
'use client';
// ============================================================
// Floating3DGuide.tsx
// AI-powered 3D Bot — Desktop: Spline | Mobile: Compact Card
// Future integrations:
//   → Gemini API:  sendMessageToAI()
//   → Vapi Voice:  startVoiceAssistant()
//   → n8n Leads:   sendLeadToN8N()
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { sendLeadToN8N } from '@/lib/leadAutomation';

// Load Spline only on desktop to keep mobile lightweight
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="w-full h-40 bg-bk-card rounded-xl animate-pulse" />,
});

interface Message {
  role: 'bot' | 'user';
  text: string;
}

export default function Floating3DGuide() {
  const [isOpen, setIsOpen]       = useState(false);
  const [isMobile, setIsMobile]   = useState(false);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { language } = useLanguageStore();
  const t = getTranslation(language);

  // Detect mobile on client side
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Show greeting on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'bot', text: t('bot.greeting') }]);
    }
  }, [isOpen]);

  // ─────────────────────────────────────────
  // PLACEHOLDER: Connect Gemini API here
  // Replace this with: const res = await geminiClient.generateContent(userMsg)
  // ─────────────────────────────────────────
  async function sendMessageToAI(userMsg: string): Promise<string> {
    // TODO: Connect Gemini API
    // import { geminiClient } from '@/lib/gemini';
    // const result = await geminiClient.generateContent(userMsg);
    // return result.response.text();

    // Demo response for now
    return language === 'mr'
      ? `"${userMsg}" बद्दल तुम्हाला लवकरच माहिती मिळेल. आमचा तज्ञ लवकरच संपर्क करेल.`
      : `"${userMsg}" के बारे में आपको जल्द जानकारी मिलेगी। हमारा विशेषज्ञ जल्द संपर्क करेगा।`;
  }

  // ─────────────────────────────────────────
  // PLACEHOLDER: Connect Vapi Voice here
  // Replace this with: vapiClient.start({ assistantId: process.env.VAPI_ASSISTANT_ID })
  // ─────────────────────────────────────────
  function startVoiceAssistant() {
    // TODO: Connect Vapi
    // import { vapiClient } from '@/lib/vapi';
    // vapiClient.start({ assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID });
    alert(language === 'mr'
      ? 'व्हॉइस सहाय्यक लवकरच उपलब्ध होईल!'
      : 'वॉइस सहायक जल्द उपलब्ध होगा!'
    );
  }

  async function handleSend() {
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Send lead to n8n when user interacts
    // ─────────────────────────────────────
    // PLACEHOLDER: n8n lead capture
    // ─────────────────────────────────────
    sendLeadToN8N({
      selectedLanguage: language,
      interestedModule: 'GENERAL',
      userQuery: userMsg,
      sourcePage: 'CHATBOT',
      timestamp: new Date().toISOString(),
    });

    const reply = await sendMessageToAI(userMsg);
    setIsLoading(false);
    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
  }

  function handleQuickAction(key: string, module: string) {
    const query = t(key);
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    sendLeadToN8N({
      selectedLanguage: language,
      interestedModule: module as any,
      userQuery: query,
      sourcePage: 'BOT_QUICK_ACTION',
      timestamp: new Date().toISOString(),
    });
  }

  const quickActions = [
    { key: 'bot.quick_fd',   module: 'FD',        icon: '🏦' },
    { key: 'bot.quick_loan', module: 'LOAN',      icon: '💰' },
    { key: 'bot.quick_sip',  module: 'SIP',       icon: '📈' },
    { key: 'bot.quick_ins',  module: 'INSURANCE', icon: '🛡️' },
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-bk-gold to-amber-600 shadow-lg shadow-bk-gold/30 flex items-center justify-center text-2xl animate-pulse-gold"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Guide"
      >
        {isOpen ? '✕' : '🤖'}
      </motion.button>

      {/* Chatbot Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 glass-card overflow-hidden"
          >
            {/* 3D Bot — Desktop Only */}
            {!isMobile && (
              <div className="h-36 bg-bk-dark rounded-t-2xl overflow-hidden">
                {/* TODO: Replace with your Spline scene URL */}
                {/* <Spline scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode" /> */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bk-dark to-bk-card">
                  <span className="text-5xl animate-float">🤖</span>
                </div>
              </div>
            )}

            {/* Mobile: Compact Avatar */}
            {isMobile && (
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bk-gold to-amber-600 flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <p className="text-white font-semibold text-sm font-deva">बजेट कट्टा गाईड</p>
                  <p className="text-bk-success text-xs">● Online</p>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="h-48 overflow-y-auto p-3 space-y-2 scroll-smooth">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm font-deva leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-bk-gold text-bk-dark'
                      : 'bg-white/10 text-white'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-xl px-3 py-2">
                    <span className="text-white/60 text-xs animate-pulse">...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-1.5 px-3 pb-2">
              {quickActions.map(action => (
                <button
                  key={action.key}
                  onClick={() => handleQuickAction(action.key, action.module)}
                  className="text-xs bg-white/5 hover:bg-bk-gold/20 border border-white/10 hover:border-bk-gold/40 text-white/80 hover:text-bk-gold rounded-lg px-2 py-1 font-deva transition-all"
                >
                  {action.icon} {t(action.key)}
                </button>
              ))}
              <button
                onClick={startVoiceAssistant}
                className="text-xs bg-bk-gold/10 hover:bg-bk-gold/20 border border-bk-gold/30 text-bk-gold rounded-lg px-2 py-1 font-deva transition-all"
              >
                🎤 {t('btn.voice')}
              </button>
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-white/10">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('bot.type_here')}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-deva placeholder-white/30 outline-none focus:border-bk-gold/50"
              />
              <button
                onClick={handleSend}
                className="w-9 h-9 bg-bk-gold rounded-xl flex items-center justify-center text-bk-dark font-bold hover:bg-bk-gold-light transition-colors"
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

---

## 7. Interactive Calculators

### Calculator Logic — Pure TypeScript Functions

```typescript
// lib/calculators.ts

/** FD Maturity Calculator */
export function calculateFDMaturity(
  principal: number,
  annualRate: number,
  tenureYears: number,
  isSeniorCitizen: boolean = false
): { maturityAmount: number; totalInterest: number } {
  const rate = isSeniorCitizen ? annualRate + 0.5 : annualRate;
  // Compound quarterly: A = P(1 + r/n)^(nt)
  const n = 4; // quarterly compounding
  const r = rate / 100;
  const maturityAmount = principal * Math.pow(1 + r / n, n * tenureYears);
  return {
    maturityAmount: Math.round(maturityAmount),
    totalInterest: Math.round(maturityAmount - principal),
  };
}

/** EMI Calculator */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): { emi: number; totalInterest: number; totalAmount: number } {
  const monthlyRate = annualRate / (12 * 100);
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)
            / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  const totalAmount = Math.round(emi * tenureMonths);
  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalAmount - principal),
    totalAmount,
  };
}

/** SIP Calculator */
export function calculateSIP(
  monthlyInvestment: number,
  annualReturnRate: number,
  tenureYears: number
): { invested: number; estimatedReturns: number; maturityValue: number } {
  const monthlyRate = annualReturnRate / (12 * 100);
  const months = tenureYears * 12;
  const maturityValue = monthlyInvestment
    * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    * (1 + monthlyRate);
  const invested = monthlyInvestment * months;
  return {
    invested,
    estimatedReturns: Math.round(maturityValue - invested),
    maturityValue: Math.round(maturityValue),
  };
}

/** Insurance Premium Estimator — Simplified Range */
export function estimateInsurancePremium(
  age: number,
  coverAmount: number,
  insuranceType: 'health' | 'life' | 'vehicle',
  policyTerm: number
): { minPremium: number; maxPremium: number; suggestedCover: number; riskNote: string } {
  let basePer1Lakh = 300;
  const covers = coverAmount / 100000;

  if (insuranceType === 'health') {
    basePer1Lakh = age < 30 ? 250 : age < 45 ? 400 : age < 55 ? 700 : 1100;
  } else if (insuranceType === 'life') {
    basePer1Lakh = age < 30 ? 80 : age < 40 ? 140 : age < 50 ? 250 : 450;
  } else {
    basePer1Lakh = 180;
  }

  const base = basePer1Lakh * covers;
  return {
    minPremium: Math.round(base * 0.85),
    maxPremium: Math.round(base * 1.25),
    suggestedCover: Math.round(coverAmount * 1.2),
    riskNote: age > 45
      ? 'Medical tests may be required.'
      : 'Standard coverage terms apply.',
  };
}

/** Format currency — Indian style */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
```

### EMI Calculator Component (Sample)

```tsx
// components/calculators/EMICalculator.tsx
'use client';
import { useState } from 'react';
import { calculateEMI, formatINR } from '@/lib/calculators';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

export default function EMICalculator() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate]           = useState(8.5);
  const [tenure, setTenure]       = useState(120);
  const [result, setResult]       = useState<ReturnType<typeof calculateEMI> | null>(null);

  function handleCalculate() {
    setResult(calculateEMI(principal, rate, tenure));
  }

  return (
    <div className="glass-card glass-card-gold p-6 space-y-5">
      <h3 className="text-xl font-display font-bold text-white">{t('loan.emi_title')}</h3>

      {/* Sliders */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-white/70 text-sm font-deva">{t('loan.amount')}</label>
            <span className="text-bk-gold text-sm font-bold">{formatINR(principal)}</span>
          </div>
          <input type="range" min="100000" max="10000000" step="100000"
            value={principal} onChange={(e) => setPrincipal(+e.target.value)}
            className="w-full accent-bk-gold" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-white/70 text-sm font-deva">{t('loan.rate')}</label>
            <span className="text-bk-gold text-sm font-bold">{rate}%</span>
          </div>
          <input type="range" min="5" max="24" step="0.25"
            value={rate} onChange={(e) => setRate(+e.target.value)}
            className="w-full accent-bk-gold" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-white/70 text-sm font-deva">{t('loan.tenure_month')}</label>
            <span className="text-bk-gold text-sm font-bold">{tenure} months</span>
          </div>
          <input type="range" min="12" max="360" step="12"
            value={tenure} onChange={(e) => setTenure(+e.target.value)}
            className="w-full accent-bk-gold" />
        </div>
      </div>

      <button onClick={handleCalculate}
        className="w-full py-3 bg-bk-gold hover:bg-bk-gold-light text-bk-dark font-bold rounded-xl font-deva transition-colors">
        {t('loan.calculate')}
      </button>

      {/* Results */}
      {result && (
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { label: t('loan.monthly_emi'),    value: formatINR(result.emi) },
            { label: t('loan.total_interest'), value: formatINR(result.totalInterest) },
            { label: t('loan.total_amount'),   value: formatINR(result.totalAmount) },
          ].map(item => (
            <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-bk-gold font-bold text-base">{item.value}</p>
              <p className="text-white/60 text-xs font-deva mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 8. Compare Feature — CompareDrawer

### `/components/compare/CompareDrawer.tsx`

```tsx
'use client';
// CompareDrawer.tsx
// Shows selected items side-by-side in a glassmorphism drawer
// Gold highlight = best value in each row

import { useCompareStore } from '@/store/compareStore';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';
import { sendLeadToN8N } from '@/lib/leadAutomation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompareDrawer() {
  const { items, clearCompare, module } = useCompareStore();
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  if (items.length < 2) return null;

  function handleInterested() {
    sendLeadToN8N({
      selectedLanguage: language,
      interestedModule: module,
      userQuery: `Compare: ${items.map((i: any) => i.name).join(' vs ')}`,
      sourcePage: 'COMPARE_DRAWER',
      timestamp: new Date().toISOString(),
    });
  }

  // Define columns per module type
  const columns: Record<string, string[]> = {
    FD:        ['Bank', 'Tenure', 'Regular Rate', 'Senior Rate'],
    LOAN:      ['Bank', 'Type', 'ROI', 'Processing Fee', 'Max Tenure'],
    SIP:       ['Fund', 'Category', '3Y Return', '5Y Return', 'Risk'],
    INSURANCE: ['Company', 'Plan', 'Premium', 'Key Features'],
  };

  const cols = columns[module] ?? [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-40 glass-card rounded-t-3xl p-5 max-h-[60vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold text-white">
            {t('btn.compare')} ({items.length})
          </h3>
          <div className="flex gap-2">
            <button onClick={clearCompare}
              className="text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-colors font-deva">
              {t('btn.clear')}
            </button>
            <button onClick={handleInterested}
              className="text-sm bg-bk-gold hover:bg-bk-gold-light text-bk-dark font-bold px-4 py-1.5 rounded-lg transition-colors font-deva">
              {t('btn.interested')}
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 text-white/50 text-sm font-normal">Field</th>
                {items.map((item: any, i: number) => (
                  <th key={i} className="text-center py-2 text-bk-gold text-sm font-semibold font-deva">
                    {item.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cols.map((col, ci) => (
                <tr key={col} className="border-b border-white/5">
                  <td className="py-2.5 text-white/60 text-sm pr-4">{col}</td>
                  {items.map((item: any, ii: number) => (
                    <td key={ii} className="py-2.5 text-center text-sm text-white font-deva">
                      {item.data?.[ci] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
```

### `/store/compareStore.ts`

```typescript
// store/compareStore.ts
import { create } from 'zustand';

interface CompareItem {
  id:   string;
  name: string;
  data: string[];   // array of column values
}

interface CompareStore {
  module:     string;
  items:      CompareItem[];
  addItem:    (module: string, item: CompareItem) => void;
  removeItem: (id: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  module: '',
  items: [],
  addItem: (module, item) => set((state) => ({
    module,
    items: state.items.find(i => i.id === item.id)
      ? state.items
      : [...state.items.slice(-2), item],  // max 3 items
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id),
  })),
  clearCompare: () => set({ items: [], module: '' }),
}));
```

---

## 9. Lead Automation — n8n Integration

### `/lib/leadAutomation.ts`

```typescript
// lib/leadAutomation.ts
// n8n lead capture ready
// PLACEHOLDER: Connect n8n webhook via NEXT_PUBLIC_N8N_WEBHOOK_URL
//
// n8n Workflow should handle:
//   → Google Sheets: append lead row
//   → CRM: create contact (HubSpot / Zoho)
//   → WhatsApp: send follow-up message via Wati/WABA
//   → Email: send interest summary to team
//   → Notification: internal Slack/Telegram alert
//   → Tags: product interest tagging

export type LeadModule = 'FD' | 'LOAN' | 'SIP' | 'INSURANCE' | 'GENERAL';

export interface LeadPayload {
  userName?:       string;
  phone?:          string;
  selectedLanguage: 'mr' | 'hi';
  interestedModule: LeadModule;
  selectedProduct?: string;
  userQuery?:       string;
  sourcePage:       string;
  timestamp:        string;
}

export async function sendLeadToN8N(payload: LeadPayload): Promise<void> {
  const webhookURL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

  if (!webhookURL) {
    // Development: log to console
    console.info('[BudgetKatta] Lead (n8n not connected):', payload);
    return;
  }

  try {
    await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // Silent fail — don't break user experience if n8n is down
    console.error('[BudgetKatta] Lead send failed:', err);
  }
}
```

---

## 10. Trust & Disclaimer Section

### `/components/trust/TrustSection.tsx`

```tsx
'use client';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/lib/i18n';

const trustIcons = [
  { key: 'trust.secure',      emoji: '🔒' },
  { key: 'trust.transparent', emoji: '📊' },
  { key: 'trust.ai',          emoji: '🤖' },
  { key: 'trust.updated',     emoji: '🔄' },
  { key: 'trust.no_hidden',   emoji: '✅' },
];

export default function TrustSection() {
  const { language } = useLanguageStore();
  const t = getTranslation(language);

  return (
    <section className="bg-bk-card border-t border-white/5 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {trustIcons.map(badge => (
            <div key={badge.key}
              className="glass-card p-4 flex flex-col items-center gap-2 text-center hover:border-bk-gold/30 transition-all">
              <span className="text-2xl">{badge.emoji}</span>
              <p className="text-white/80 text-xs font-deva leading-snug">{t(badge.key)}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="glass-card p-5 border-l-4 border-bk-gold/50">
          <p className="text-xs text-white/50 font-deva leading-relaxed">
            ⚠️ {t('trust.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
}
```

---

## 11. Performance & Mobile Optimization

### Key Rules

```
✅ Use next/dynamic for Spline (desktop only, lazy loaded)
✅ Use next/image for all images (automatic WebP + lazy load)
✅ Use Suspense boundaries around calculators
✅ Framer Motion: use useReducedMotion() hook
✅ Font: subset Noto Sans Devanagari for Marathi/Hindi only
✅ Tailwind: purge unused CSS in production
✅ Avoid layout shift: reserve space for 3D bot before load
✅ Target Lighthouse score: 90+ on mobile
```

### Mobile Bot — Compact Mode

```tsx
// Inside Floating3DGuide.tsx — mobile renders only:
// • Compact 40px avatar (no Spline)
// • Expandable chat panel
// • Same quick actions
// • No heavy canvas animations
// Never auto-open on mobile — wait for user tap
```

### `next.config.ts`

```ts
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
};
export default nextConfig;
```

---

## 12. Database Schema — MongoDB Atlas

```typescript
// models/Lead.ts
import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  userName:        { type: String },
  phone:           { type: String },
  selectedLanguage:{ type: String, enum: ['mr', 'hi'], required: true },
  interestedModule:{ type: String, enum: ['FD','LOAN','SIP','INSURANCE','GENERAL'] },
  selectedProduct: { type: String },
  userQuery:       { type: String },
  sourcePage:      { type: String, required: true },
  timestamp:       { type: Date, default: Date.now },
  status:          { type: String, enum: ['new','contacted','converted'], default: 'new' },
}, { timestamps: true });

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

// ─────────────────────────────────────────
// models/FDRate.ts
const fdRateSchema = new mongoose.Schema({
  bankName:       { type: String, required: true },
  bankType:       { type: String, enum: ['govt','private','cooperative'] },
  logo:           { type: String },
  rates: [{
    tenureLabel:  String,
    tenureMonths: Number,
    regularRate:  Number,
    seniorRate:   Number,
  }],
  updatedAt:      { type: Date, default: Date.now },
});

export const FDRate = mongoose.models.FDRate || mongoose.model('FDRate', fdRateSchema);

// ─────────────────────────────────────────
// models/LoanProduct.ts
const loanSchema = new mongoose.Schema({
  bankName:        { type: String, required: true },
  loanType:        { type: String, enum: ['home','personal','vehicle','business','education'] },
  roiMin:          Number,
  roiMax:          Number,
  processingFee:   String,
  maxTenureMonths: Number,
  collateralRequired: Boolean,
  maxAmount:       Number,
  features:        [String],
  updatedAt:       { type: Date, default: Date.now },
});

export const LoanProduct = mongoose.models.LoanProduct || mongoose.model('LoanProduct', loanSchema);
```

---

## 13. AI Integration Roadmap

### Phase 1 — Current (Demo UI)
- [x] Static bilingual i18n
- [x] Calculator logic
- [x] Chatbot UI with placeholder functions
- [x] n8n lead payload (webhook not connected)
- [x] Compare drawer UI

### Phase 2 — Backend (Week 2–3)
- [ ] MongoDB Atlas — seed FD/Loan/SIP/Insurance data
- [ ] API routes: `/api/rates/fd`, `/api/rates/loans`, `/api/sip`, `/api/insurance`
- [ ] n8n webhook live (Google Sheet + WhatsApp)
- [ ] Lead capture active

### Phase 3 — AI (Week 4–6)
- [ ] Gemini API integration in chatbot
  - File: `/lib/gemini.ts`
  - Endpoint: `/api/chat/route.ts`
  - Prompt: include product context from MongoDB

- [ ] Vapi Voice Assistant
  - File: `/lib/vapi.ts`
  - Assistant: Marathi/Hindi voice persona
  - Trigger: 🎤 button in bot widget

### Phase 4 — Premium (Month 2)
- [ ] User authentication (NextAuth)
- [ ] Saved comparisons per user
- [ ] Email alerts for rate changes
- [ ] MahaRERA + property link (for Sagar's land records integration)

---

## 14. Environment Variables

```env
# .env.local

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/budgetkatta

# n8n Automation
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/budgetkatta-leads

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Vapi Voice Assistant
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id

# Spline 3D Bot
NEXT_PUBLIC_SPLINE_URL=https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode

# App
NEXT_PUBLIC_APP_URL=https://budgetkatta.com
NEXT_PUBLIC_APP_NAME=BudgetKatta
```

---

## 15. Component Checklist

```
LAYOUT
  □ Navbar.tsx                — Language switcher (mr/hi), sticky, blur
  □ Footer.tsx                — Links + TrustSection + Disclaimer

HOME
  □ HeroSection.tsx           — Headline, CTAs, animated stats
  □ ModuleCards.tsx           — FD, Loan, SIP, Insurance cards

SHARED
  □ GlassCard.tsx             — Reusable glass container
  □ GoldButton.tsx            — Primary CTA
  □ BadgeChip.tsx             — Rate badges, risk tags
  □ EmptyState.tsx            — Bilingual empty screen
  □ LoadingSpinner.tsx        — Bilingual loading text

CALCULATORS
  □ FDCalculator.tsx          — Principal, Rate, Tenure, Senior toggle
  □ EMICalculator.tsx         — Amount, Rate, Months (slider UI)
  □ SIPCalculator.tsx         — Monthly, Return %, Tenure
  □ InsuranceEstimator.tsx    — Age, Cover, Type, Term

COMPARE
  □ CompareDrawer.tsx         — Slide-up drawer, table, gold highlights

BOT
  □ Floating3DGuide.tsx       — Desktop Spline + Mobile compact

TRUST
  □ TrustSection.tsx          — 5 badge icons + disclaimer text

PAGES
  □ app/fd/page.tsx
  □ app/loans/page.tsx
  □ app/sip/page.tsx
  □ app/insurance/page.tsx
```

---

## 16. UX Copy — Bilingual Strings

### Quick Reference — Most Used Strings

| Key | मराठी | हिंदी |
|-----|-------|-------|
| Loading | माहिती लोड होत आहे... | जानकारी लोड हो रही है... |
| Empty | माहिती उपलब्ध नाही | जानकारी उपलब्ध नहीं |
| Error | पुन्हा प्रयत्न करा | फिर से कोशिश करें |
| Apply | अर्ज करा | आवेदन करें |
| Compare | तुलना करा | तुलना करें |
| Interested | मला स्वारस्य आहे | मुझे रुचि है |
| Calculate | गणना करा | गणना करें |
| Senior Citizen | ज्येष्ठ नागरिक | वरिष्ठ नागरिक |

---

## 17. SEO & Analytics

### `app/layout.tsx` — Metadata

```tsx
export const metadata: Metadata = {
  title:       'BudgetKatta — स्मार्ट आर्थिक मार्गदर्शक | FD, कर्ज, SIP, विमा',
  description: 'महाराष्ट्रातील सर्वोत्तम FD दर, कर्ज, SIP आणि विमा योजनांची तुलना करा. AI-सहाय्यित मार्गदर्शन.',
  keywords:    ['FD rates Maharashtra', 'best FD rates', 'home loan', 'SIP calculator', 'BudgetKatta'],
  openGraph: {
    title:       'BudgetKatta',
    description: 'Smart Financial Guide for Maharashtra',
    url:         'https://budgetkatta.com',
    siteName:    'BudgetKatta',
    locale:      'mr_IN',
    type:        'website',
  },
  alternates: {
    languages: {
      'mr': '/mr',
      'hi': '/hi',
    },
  },
};
```

---

## 18. Deployment Guide

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Add environment variables in Vercel Dashboard
# Settings → Environment Variables → paste all from .env.local
```

### Checklist Before Launch

```
□ All i18n keys present for both mr and hi
□ n8n webhook URL set in env
□ MongoDB connection tested
□ Lighthouse mobile score > 85
□ Reduced-motion works for animations
□ All calculators tested with edge cases
□ 3D bot shows correct greeting per language
□ Disclaimer text visible on all screen sizes
□ meta tags correct for both Marathi and Hindi pages
□ No hardcoded URLs or API keys in code
```

---

## 💡 Word of the Day

**Word: Vernacular** (व्हर्नॅक्युलर)

**Meaning:** लोकांची स्थानिक भाषा किंवा बोली — The everyday language that local people speak naturally.

**Example:** "BudgetKatta uses the *vernacular* — Marathi and Hindi — so even a small village user can understand financial information without difficulty."

**Why it matters for BudgetKatta:** Financial platforms in India fail because they use English jargon. By using the *vernacular*, you build trust and reach users that big apps ignore.

---

*BudgetKatta IMPROVE.md — v2.0 | Created for Sagar | Kolhapur, Maharashtra*
*Next revision: Add MahaRERA integration for property-linked financial planning*
