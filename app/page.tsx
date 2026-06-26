import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import PopularTools from '@/components/home/PopularTools';
import SegmentEntryCards from '@/components/schemes/SegmentEntryCards';
import BentoGrid from '@/components/BentoGrid';
import ScrollMorphCoin from '@/components/home/ScrollMorphCoin';
import CalculatorsHub from '@/components/CalculatorsHub';
import BrokerOffers from '@/components/BrokerOffers';
import CreditCardOffers from '@/components/CreditCardOffers';
import FinancialHealthQuiz from '@/components/FinancialHealthQuiz';
import SmartAdvisory from '@/components/SmartAdvisory';
import EducationHub from '@/components/EducationHub';
import Testimonials from '@/components/trust/Testimonials';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/seo/JsonLd';
import { getTranslation } from '@/lib/i18n';

// FAQ structured data (server-rendered from the Marathi FAQ copy) so the
// homepage is eligible for FAQ rich results / AI answer surfaces.
const tMr = getTranslation('mr');
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
    '@type': 'Question',
    name: tMr(`faq.q${i}`),
    acceptedAnswer: { '@type': 'Answer', text: tMr(`faq.a${i}`) },
  })),
};

export const metadata: Metadata = {
  title: { absolute: 'BudgetKatta — स्मार्ट आर्थिक मार्गदर्शक | स्मार्ट निवेश, सुरक्षित भविष्य' },
  description:
    'महाराष्ट्रातील FD दर, कर्ज, SIP आणि विमा तुलना | भारत का भरोसेमंद वित्तीय मार्गदर्शक। AI-सहाय्यित मार्गदर्शन.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-amber-400/30 selection:text-amber-100">
      {/* Background decorations (premium organic blobs) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full filter blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[400px] h-[400px] bg-yellow-500/10 rounded-full filter blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[1000px] left-[-100px] w-[600px] h-[600px] bg-amber-400/5 rounded-full filter blur-[140px] -z-10 pointer-events-none" />

      <HeroSection />
      <PopularTools />
      {/* High-intent Women/Student loan finder surfaced early (value before offers) */}
      <SegmentEntryCards
        heading={{
          mr: 'महिला व विद्यार्थ्यांसाठी कर्ज योजना',
          en: 'Loan schemes for women & students',
          sub: {
            mr: 'सरकारी योजना, scholarship व subsidy — तुमच्यासाठी योग्य पर्याय शोधा.',
            en: 'Government schemes, scholarships & subsidies — find the right option for you.',
          },
        }}
      />
      <BentoGrid />
      <ScrollMorphCoin />
      <CalculatorsHub />
      {/* Guidance / literacy value first... */}
      <SmartAdvisory />
      <EducationHub />
      {/* ...then affiliate offers, so the site leads with value, not ads */}
      <BrokerOffers />
      <CreditCardOffers />
      <FinancialHealthQuiz />
      <Testimonials />
      <FAQ />
      <JsonLd data={faqSchema} />
    </div>
  );
}
