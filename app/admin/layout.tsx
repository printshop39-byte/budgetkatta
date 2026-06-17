import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Admin',
  description: 'BudgetKatta admin overview.',
  path: '/admin',
  noindex: true, // never index the admin area
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
