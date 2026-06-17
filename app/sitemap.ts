import type { MetadataRoute } from 'next';
import { APP_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/fds', '/loans', '/sip', '/insurance'];
  return routes.map((path) => ({
    url: `${APP_URL}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));
}
