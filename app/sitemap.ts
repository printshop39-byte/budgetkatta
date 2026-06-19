import type { MetadataRoute } from 'next';
import { APP_URL } from '@/lib/seo';
import { getDistricts } from '@/lib/locations';

// Static routes plus the per-loan and guide content pages. District landing
// pages are appended live from the DB when available.
const STATIC_ROUTES = [
  '',
  '/fds',
  '/loans',
  '/sip',
  '/insurance',
  '/gadget-emi',
  '/documents',
  '/rates',
  '/credit-score',
  '/cards',
  '/directory',
  '/locator',
  '/guides/payments-bank',
  '/about',
  '/contact',
];

const LOAN_TYPES = ['home-loan', 'personal-loan', 'vehicle-loan', 'education-loan', 'gold-loan', 'business-loan'];

const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${APP_URL}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));

  for (const type of LOAN_TYPES) {
    entries.push({ url: `${APP_URL}/loans/${type}`, changeFrequency: 'monthly', priority: 0.6 });
  }

  // District landing pages (best-effort — empty when the DB is unavailable).
  try {
    const districts = await getDistricts();
    for (const d of districts) {
      entries.push({ url: `${APP_URL}/directory/${toSlug(d)}`, changeFrequency: 'monthly', priority: 0.6 });
    }
  } catch {
    /* DB unavailable at build — ship the static entries only */
  }

  return entries;
}
