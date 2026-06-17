// lib/seo.ts — shared metadata helpers. Canonical/OG URLs resolve against
// NEXT_PUBLIC_APP_URL via the root layout's metadataBase.
import type { Metadata } from 'next';

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const SITE_NAME = 'BudgetKatta';

interface PageSeo {
  title: string;
  description: string;
  /** Route path for canonical + OG url, e.g. "/fds". */
  path: string;
  /** Set true for pages that should not be indexed (e.g. /admin). */
  noindex?: boolean;
}

export function pageMetadata({ title, description, path, noindex }: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'mr_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
