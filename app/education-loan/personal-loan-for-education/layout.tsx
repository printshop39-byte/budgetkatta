import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'शिक्षणासाठी Personal Loan | Personal Loan for Education 2026',
  description:
    'Education loan शक्य नसेल तर शिक्षणासाठी personal loan — fees, laptop, coaching व funding gap साठी विनातारण पर्याय. Bajaj, Tata Capital, Money View तुलना + 1-मिनिट eligibility finder. Personal loan for education explained in Marathi.',
  path: '/education-loan/personal-loan-for-education',
});

export default function PersonalLoanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
