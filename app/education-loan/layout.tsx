import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'विद्यार्थ्यांसाठी Education Loan व Scholarship | Student Loan Guide 2026',
  description:
    'PM विद्यालक्ष्मी (विनातारण), Vidya Lakshmi portal, CSIS व्याज अनुदान, MahaDBT scholarship, परदेशी शिक्षण कर्ज (Credila, Avanse, InCred) व 80E करसवलत — आणि मराठीतील पहिला Moratorium EMI calculator. Education loan without collateral 2026, explained in Marathi.',
  path: '/education-loan',
});

export default function StudentLoansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
