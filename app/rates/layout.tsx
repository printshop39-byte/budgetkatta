import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'दर आणि बाजार | दर और बाजार जानकारी',
  description:
    'FD सर्वोच्च दर, कर्ज व्याजदर श्रेणी आणि सोने/चांदी/रेपो दर माहिती | FD, लोन दरें और बाजार जानकारी एक ही जगह.',
  path: '/rates',
});

export default function RatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
