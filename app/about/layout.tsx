import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'बजेट कट्टा बद्दल | बजट कट्टा के बारे में',
  description:
    'बजेट कट्टा — मराठी आणि हिंदीतील आर्थिक माहिती व तुलना मंच | मराठी और हिंदी में FD, लोन, SIP और बीमा की पारदर्शी तुलना व AI-सहायता प्राप्त मार्गदर्शन.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
