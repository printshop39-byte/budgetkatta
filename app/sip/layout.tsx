import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'SIP / म्युच्युअल फंड | म्यूचुअल फंड',
  description:
    'दीर्घकालीन संपत्ती निर्माणासाठी सर्वोत्तम SIP फंड व परतावा | लंबी अवधि के लिए सर्वश्रेष्ठ म्यूचुअल फंड। SIP कॅल्क्युलेटर वापरा.',
  path: '/sip',
});

export default function SipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
