import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'क्रेडिट व डेबिट कार्ड मार्गदर्शन | कार्ड गाइड',
  description:
    'क्रेडिट कार्ड व डेबिट कार्डमधील फरक, कोणासाठी कोणते कार्ड, आवश्यक कागदपत्रे व शुल्क | कार्ड आसान भाषा में समझें.',
  path: '/cards',
});

export default function CardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
