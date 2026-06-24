import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'SIP / म्युच्युअल फंड | म्यूचुअल फंड',
  description:
    'दीर्घकालीन गुंतवणुकीसाठी SIP फंड तुलना व परतावा अंदाज | लंबी अवधि के लिए म्यूचुअल फंड तुलना। SIP कॅल्क्युलेटर वापरा.',
  path: '/sip',
});

export default function SipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
