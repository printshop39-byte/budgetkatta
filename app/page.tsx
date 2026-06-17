import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import BentoGrid from '@/components/BentoGrid';
import CalculatorsHub from '@/components/CalculatorsHub';
import FinancialHealthQuiz from '@/components/FinancialHealthQuiz';
import SmartAdvisory from '@/components/SmartAdvisory';
import EducationHub from '@/components/EducationHub';
import FAQ from '@/components/FAQ';

export const metadata: Metadata = {
  title: { absolute: 'BudgetKatta — स्मार्ट आर्थिक मार्गदर्शक | स्मार्ट निवेश, सुरक्षित भविष्य' },
  description:
    'महाराष्ट्रातील सर्वोत्तम FD दर, कर्ज, SIP आणि विमा | भारत का भरोसेमंद वित्तीय मार्गदर्शक। AI-सहाय्यित मार्गदर्शन.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden selection:bg-teal-200 selection:text-teal-900">
      {/* Background decorations (premium organic blobs) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-100/30 rounded-full filter blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[400px] h-[400px] bg-emerald-100/20 rounded-full filter blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[1000px] left-[-100px] w-[600px] h-[600px] bg-sky-100/20 rounded-full filter blur-[140px] -z-10 pointer-events-none" />

      <HeroSection />
      <BentoGrid />
      <CalculatorsHub />
      <FinancialHealthQuiz />
      <SmartAdvisory />
      <EducationHub />
      <FAQ />
    </div>
  );
}
