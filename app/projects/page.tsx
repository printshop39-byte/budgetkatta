import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import ProjectFinder from '@/components/projects/ProjectFinder';

export const metadata: Metadata = pageMetadata({
  title: 'कर्जासाठी पात्र RERA प्रकल्प | BudgetKatta',
  description: 'Home Loan उपलब्ध असू शकणारे RERA नोंदणीकृत प्रकल्प — किंमत, RERA क्रमांक, बँका आणि अधिकृत स्रोतासह.',
  path: '/projects',
});

export default function ProjectsPage() {
  return <ProjectFinder />;
}
