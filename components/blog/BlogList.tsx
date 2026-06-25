'use client';
// BlogList — card grid of blog posts, bilingual via languageStore.
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import type { BlogPost } from '@/lib/blogPosts';

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const { language } = useLanguageStore();
  const mr = language === 'mr';

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <motion.article
          key={post.slug}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="glass-card flex h-full flex-col gap-3 p-5"
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 font-bold text-amber-300 font-deva">
              {post.tag[language]}
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="h-3 w-3" />
              {post.readMins} {mr ? 'मिनिटे' : 'min'}
            </span>
          </div>

          <h2 className="font-display text-lg font-bold leading-snug text-slate-100 font-deva">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-amber-300">
              {post.title[language]}
            </Link>
          </h2>

          <p className="flex-1 text-sm leading-relaxed text-slate-400 font-deva">{post.excerpt[language]}</p>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500 font-deva">{post.dateDisplay[language]}</span>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 transition-colors hover:text-amber-200 font-deva"
            >
              {mr ? 'वाचा' : 'Read'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
