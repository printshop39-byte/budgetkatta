import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import PaymentsBankGuideContent from '@/components/guides/PaymentsBankGuideContent';

export const metadata: Metadata = pageMetadata({
  title: 'पेमेंट्स बँक म्हणजे काय? | What is a Payments Bank?',
  description:
    'पेमेंट्स बँक म्हणजे काय, ती काय करू शकते आणि काय करू शकत नाही? Fino, Airtel व India Post (IPPB) पेमेंट्स बँकांची सोपी माहिती मराठी व इंग्रजीत.',
  path: '/guides/payments-bank',
});

export default function PaymentsBankGuide() {
  return <PaymentsBankGuideContent />;
}
