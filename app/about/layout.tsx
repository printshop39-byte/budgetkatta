import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'बजेट कट्टा बद्दल | बजट कट्टा के बारे में',
  description:
    'बजेट कट्टा — मराठी आणि इंग्रजीतील आर्थिक माहिती व तुलना मंच | मराठी आणि इंग्रजीमध्ये FD, कर्ज, SIP आणि विमा यांची पारदर्शक तुलना व AI-सहाय्यित मार्गदर्शन.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
