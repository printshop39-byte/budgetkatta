import type { MetadataRoute } from 'next';
import { APP_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/fds',
    '/loans',
    '/sip',
    '/insurance',
    '/documents',
    '/rates',
    '/credit-score',
    '/cards',
    '/about',
    '/contact',
  ];
  return routes.map((path) => ({
    url: `${APP_URL}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));
}
