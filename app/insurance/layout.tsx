import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'विमा योजना | बीमा योजनाएं',
  description:
    'आरोग्य, जीवन आणि वाहन विम्याची माहिती व प्रीमियम अंदाज | स्वास्थ्य, जीवन और वाहन बीमा की तुलना। प्रीमियम कॅल्क्युलेटर.',
  path: '/insurance',
});

export default function InsuranceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
