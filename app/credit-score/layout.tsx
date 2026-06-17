import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'क्रेडिट स्कोअर मार्गदर्शन | क्रेडिट स्कोर गाइड',
  description:
    'क्रेडिट स्कोअर म्हणजे काय, कर्ज मंजुरीसाठी त्याचे महत्त्व आणि तो कसा सुधारावा | क्रेडिट स्कोर आसान भाषा में समझें.',
  path: '/credit-score',
});

export default function CreditScoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
