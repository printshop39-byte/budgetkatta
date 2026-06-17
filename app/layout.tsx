import type { Metadata } from 'next';
import { Inter, Poppins, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Floating3DGuide from '@/components/bot/Floating3DGuide';
import CompareDrawer from '@/components/compare/CompareDrawer';
import LeadFormModal from '@/components/lead/LeadFormModal';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-poppins',
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
    <html lang="mr" className={`${inter.variable} ${poppins.variable} ${deva.variable}`}>
      <body className="min-h-screen bg-bk-dark antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Floating3DGuide />
        <CompareDrawer />
        <LeadFormModal />
      </body>
    </html>
  );
}
