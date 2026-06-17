import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/config';

export const metadata: Metadata = pageMetadata({
  title: 'संपर्क करा | संपर्क करें',
  description: `बजेट कट्टाशी संपर्क साधा — FD, कर्ज, SIP किंवा विम्याबाबत मदतीसाठी | बजट कट्टा से संपर्क करें। ${CONTACT_EMAIL}`,
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
