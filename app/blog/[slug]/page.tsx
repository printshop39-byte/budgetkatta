import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostView from '@/components/blog/BlogPostView';
import JsonLd from '@/components/seo/JsonLd';
import { getPost, getAllSlugs } from '@/lib/blogPosts';
import { APP_URL, SITE_NAME, pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  // Marathi is the primary locale — index the Marathi title/excerpt for search.
  return pageMetadata({
    title: post.title.mr,
    description: post.excerpt.mr,
    path: `/blog/${post.slug}`,
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title.mr,
    description: post.excerpt.mr,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'mr',
    mainEntityOfPage: `${APP_URL}/blog/${post.slug}`,
    author: { '@type': 'Organization', name: SITE_NAME, url: APP_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${APP_URL}/icon-512.png` },
    },
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <BlogPostView post={post} />
    </>
  );
}
