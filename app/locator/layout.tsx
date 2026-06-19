import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'स्थानिक फायनान्स व स्टोअर लोकेटर | Local Finance & Store Locator',
  description:
    'तुमच्या शहरातील EMI/फायनान्स देणारी मोबाईल, बाईक, कॅमेरा व लॅपटॉप दुकाने शोधा | Find nearby stores offering Bajaj Finserv, Airtel Finance, HDFC and other EMI options — contact them on WhatsApp.',
  path: '/locator',
});

export default function LocatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
