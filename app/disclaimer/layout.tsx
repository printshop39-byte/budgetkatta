import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'अस्वीकरण | अस्वीकरण',
  description: 'बजेट कट्टा आर्थिक अस्वीकरण — दर, परतावा व प्रीमियम केवळ सूचक आहेत. गुंतवणूक बाजार जोखमीच्या अधीन.',
  path: '/disclaimer',
  noindex: true,
});

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
