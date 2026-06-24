import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import PopularTools from '@/components/home/PopularTools';
import BentoGrid from '@/components/BentoGrid';
import CalculatorsHub from '@/components/CalculatorsHub';
import BrokerOffers from '@/components/BrokerOffers';
import LocatorSection from '@/components/home/LocatorSection';
import FinancialHealthQuiz from '@/components/FinancialHealthQuiz';
import SmartAdvisory from '@/components/SmartAdvisory';
import EducationHub from '@/components/EducationHub';
import FAQ from '@/components/FAQ';

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
      <BentoGrid />
      <CalculatorsHub />
      <LocatorSection />
      <BrokerOffers />
      <FinancialHealthQuiz />
      <SmartAdvisory />
      <EducationHub />
      <FAQ />
    </div>
  );
}
