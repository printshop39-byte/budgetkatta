import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'बँक व पतसंस्था डिरेक्टरी | बैंक एवं शाखा डायरेक्टरी',
  description:
    'जिल्हा व शहरानुसार बँका, पतसंस्था व शाखा शोधा — IFSC, पत्ता व RBI अधिकृत स्थिती पाहा | जिले और शहर के अनुसार बैंक, शाखा और IFSC खोजें।',
  path: '/directory',
});

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
