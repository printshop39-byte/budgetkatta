import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import ModuleCards from '@/components/home/ModuleCards';

export const metadata: Metadata = {
  // Absolute title so the layout's "%s | BudgetKatta" template isn't doubled.
  title: { absolute: 'BudgetKatta — स्मार्ट आर्थिक मार्गदर्शक | स्मार्ट निवेश, सुरक्षित भविष्य' },
  description:
    'महाराष्ट्रातील सर्वोत्तम FD दर, कर्ज, SIP आणि विमा | भारत का भरोसेमंद वित्तीय मार्गदर्शक। AI-सहाय्यित मार्गदर्शन.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ModuleCards />
    </>
  );
}
