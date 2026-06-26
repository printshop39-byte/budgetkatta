import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'महिला व विद्यार्थी कर्ज योजना | Women & Student Loan Schemes',
  description:
    'महिलांसाठी मुद्रा, Stand-Up India, PMEGP, MAVIM व विद्यार्थ्यांसाठी PM विद्यालक्ष्मी, JanSamarth, MahaDBT scholarship — मराठीत सोपं मार्गदर्शन व eligibility finder. Women business loans and student education loan + scholarship schemes explained in Marathi.',
  path: '/schemes',
});

export default function SchemesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
