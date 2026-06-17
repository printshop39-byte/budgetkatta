import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'संपर्क करा | संपर्क करें',
  description:
    'बजेट कट्टाशी संपर्क साधा — FD, कर्ज, SIP किंवा विम्याबाबत मदतीसाठी | बजट कट्टा से संपर्क करें। support@budgetkatta.in',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
