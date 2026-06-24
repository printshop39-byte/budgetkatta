import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ThemeApplier from '@/components/layout/ThemeApplier';
import Floating3DGuide from '@/components/bot/Floating3DGuide';
import CompareDrawer from '@/components/compare/CompareDrawer';
import LeadFormModal from '@/components/lead/LeadFormModal';
import ServiceWorkerRegister from '@/components/layout/ServiceWorkerRegister';

// Body — Plus Jakarta Sans (brand body typeface)
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

// Display / headings — Outfit (brand display typeface)
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

const deva = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-deva',
  display: 'swap',
});

import { APP_URL, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'BudgetKatta — स्मार्ट आर्थिक मार्गदर्शक | FD, कर्ज, SIP, विमा',
    template: '%s | BudgetKatta',
  },
  description:
    'महाराष्ट्रातील सर्वोत्तम FD दर, कर्ज, SIP आणि विमा योजनांची तुलना करा. AI-सहाय्यित मार्गदर्शन.',
  keywords: ['FD rates Maharashtra', 'best FD rates', 'home loan', 'SIP calculator', 'BudgetKatta'],
  applicationName: SITE_NAME,
  openGraph: {
    title: SITE_NAME,
    description: 'Smart Financial Guide for Maharashtra — FD, Loans, SIP & Insurance',
    url: '/',
    siteName: SITE_NAME,
    locale: 'mr_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Smart Financial Guide for Maharashtra — FD, Loans, SIP & Insurance',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mr" data-theme="dark" suppressHydrationWarning className={`${jakarta.variable} ${outfit.variable} ${deva.variable}`}>
      <head>
        {/* Set the persisted theme before paint to avoid a flash of the wrong palette. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=JSON.parse(localStorage.getItem('bk-theme')||'{}').state;document.documentElement.dataset.theme=(t&&t.theme)||'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#0A1128] to-[#050814] text-slate-200 antialiased">
        <ThemeApplier />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Floating3DGuide />
        <CompareDrawer />
        <LeadFormModal />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
