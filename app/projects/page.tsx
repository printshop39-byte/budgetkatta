import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import ReraStats from '@/components/projects/ReraStats';
import ProjectGuide from '@/components/projects/ProjectGuide';

export const metadata: Metadata = pageMetadata({
  title: 'चालू प्रकल्प कसा तपासायचा | MahaRERA | BudgetKatta',
  description: 'MahaRERA वर जिल्हा निवडून प्रकल्प कसा तपासायचा, पूर्णत्व दिनांकावरून चालू/संपलेले ओळखा आणि RERA क्रमांक तपासा.',
  path: '/projects',
});

export default function ProjectsPage() {
  return (
    <>
      <ProjectGuide />
      <ReraStats />
    </>
  );
}
