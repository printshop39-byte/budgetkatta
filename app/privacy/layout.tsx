import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'गोपनीयता धोरण | गोपनीयता नीति',
  description: 'बजेट कट्टा गोपनीयता धोरण — आम्ही कोणती माहिती गोळा करतो आणि ती कशी वापरली जाते.',
  path: '/privacy',
  noindex: true,
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
