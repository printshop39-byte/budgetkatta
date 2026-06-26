import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'महिलांसाठी कर्ज व व्यवसाय योजना | Women Loan Schemes Maharashtra',
  description:
    'महिलांसाठी गृहकर्ज stamp duty 1% सूट (महाराष्ट्र), Stand-Up India, मुद्रा, महिला उद्यम निधी, अन्नपूर्णा, MAVIM, PMEGP व सरकारी अनुदान योजना — मराठीत सोपं मार्गदर्शन व eligibility finder. Women business & home loan schemes with subsidies, explained in Marathi.',
  path: '/loans/women',
});

export default function WomenLoansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
