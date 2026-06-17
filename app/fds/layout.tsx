import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'मुदत ठेव (FD) दर | सावधि जमा दरें',
  description:
    'सर्व प्रमुख बँकांचे सर्वोत्तम FD दर पाहा आणि तुलना करा | सभी प्रमुख बैंकों की सर्वश्रेष्ठ FD दरें। परिपक्वता कॅल्क्युलेटर वापरा.',
  path: '/fds',
});

export default function FdsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
