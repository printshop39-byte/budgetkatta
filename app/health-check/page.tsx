import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import HealthCheckIntro from '@/components/health/HealthCheckIntro';
import MoneyHealthCheck from '@/components/health/MoneyHealthCheck';

export const metadata: Metadata = pageMetadata({
  title: 'घराच्या ध्येयासाठी आर्थिक तयारी | Financial Readiness for a Home Goal',
  description:
    'उत्पन्न, खर्च, EMI, बचत व आर्थिक संरक्षणावर आधारित प्राथमिक शैक्षणिक अंदाज — घराच्या ध्येयासाठी तुमची आर्थिक तयारी. हा property-specific eligibility report, CIBIL score किंवा loan sanction नाही. Free educational estimate for Maharashtra.',
  path: '/health-check',
});

export default function HealthCheckPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <HealthCheckIntro />
      <MoneyHealthCheck />
    </div>
  );
}
