import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'अटी व शर्ती | नियम व शर्तें',
  description: 'बजेट कट्टा वापराच्या अटी व शर्ती — शैक्षणिक व माहितीपर आर्थिक तुलना सेवा.',
  path: '/terms',
  noindex: true,
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
