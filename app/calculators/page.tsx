import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import CalculatorsPageContent from '@/components/calculators/CalculatorsPageContent';

export const metadata: Metadata = pageMetadata({
  title: 'Home Loan कॅल्क्युलेटर | EMI, पात्रता, Down Payment',
  description: 'Home Loan EMI, कर्ज पात्रतेचा अंदाज, Down Payment, खरेदी खर्च, Property Loan EMI, Loan Transfer तुलना आणि Interior बजेट.',
  path: '/calculators',
});

export default function CalculatorsPage() {
  return <CalculatorsPageContent />;
}
