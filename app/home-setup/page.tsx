import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import HomeSetupContent from '@/components/homesetup/HomeSetupContent';

export const metadata: Metadata = pageMetadata({
  title: 'Kitchen, Furniture आणि Interior मार्गदर्शन | BudgetKatta',
  description: 'घर घेतल्यानंतर Kitchen, Furniture, Home Setup आणि Interior साठी checklist, प्रश्न आणि बजेट नियोजन.',
  path: '/home-setup',
});

export default function HomeSetupPage() {
  return <HomeSetupContent />;
}
