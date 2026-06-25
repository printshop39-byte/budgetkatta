import type { Metadata } from 'next';
import PageShell from '@/components/shared/PageShell';
import BlogList from '@/components/blog/BlogList';
import JsonLd from '@/components/seo/JsonLd';
import { getAllPosts } from '@/lib/blogPosts';
import { APP_URL, SITE_NAME, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Blog — Marathi Financial Guides',
  description:
    'BudgetKatta blog — simple Marathi & English guides on SIP, home loans, emergency funds, insurance and more.',
  path: '/blog',
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  // Blog + ItemList structured data so posts are discoverable in search/AI surfaces.
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} Blog`,
    url: `${APP_URL}/blog`,
    inLanguage: ['mr', 'en'],
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title.mr,
      description: p.excerpt.mr,
      datePublished: p.date,
      url: `${APP_URL}/blog/${p.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={blogSchema} />
      <PageShell titleKey="blog.title" subtitleKey="blog.subtitle">
        <BlogList posts={posts} />
      </PageShell>
    </>
  );
}
