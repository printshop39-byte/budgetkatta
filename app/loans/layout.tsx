import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'कर्ज योजना | लोन योजनाएं',
  description:
    'गृहकर्ज, वैयक्तिक, वाहन व शैक्षणिक कर्जाचे व्याजदर व तुलना | होम, पर्सनल, वाहन और एजुकेशन लोन की तुलना। EMI कॅल्क्युलेटर.',
  path: '/loans',
});

export default function LoansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
