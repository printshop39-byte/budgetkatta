import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'कागदपत्रे यादी | ज़रूरी दस्तावेज़',
  description:
    'कर्ज, FD, SIP आणि विम्यासाठी लागणारी कागदपत्रे तुमच्या प्रोफाइलनुसार | लोन, FD, SIP और बीमा के लिए ज़रूरी दस्तावेज़ की सूची.',
  path: '/documents',
});

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
