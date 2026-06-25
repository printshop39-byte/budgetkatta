'use client';
// BlogPostView — renders a single post's typed blocks, bilingual via languageStore.
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import type { BlogPost } from '@/lib/blogPosts';

export default function BlogPostView({ post }: { post: BlogPost }) {
  const { language } = useLanguageStore();
  const mr = language === 'mr';

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition-colors hover:text-amber-300 font-deva"
      >
        <ArrowLeft className="h-4 w-4" />
        {mr ? 'सर्व लेख' : 'All articles'}
      </Link>

      <header className="mt-5 space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 font-bold text-amber-300 font-deva">
            {post.tag[language]}
          </span>
          <span className="text-slate-500 font-deva">{post.dateDisplay[language]}</span>
          <span className="flex items-center gap-1 text-slate-500">
            <Clock className="h-3 w-3" />
            {post.readMins} {mr ? 'मिनिटे' : 'min'}
          </span>
        </div>
        <h1 className="font-display text-3xl font-extrabold leading-tight text-slate-100 md:text-4xl font-deva">
          {post.title[language]}
        </h1>
        <p className="text-base leading-relaxed text-slate-400 font-deva">{post.excerpt[language]}</p>
      </header>

      <div className="mt-8 space-y-5">
        {post.body.map((block, i) => {
          if (block.type === 'h2') {
            return (
              <h2 key={i} className="font-display text-xl font-bold text-slate-100 font-deva">
                {block[language]}
              </h2>
            );
          }
          if (block.type === 'ul') {
            return (
              <ul key={i} className="space-y-2">
                {block[language].map((item, j) => (
                  <li key={j} className="flex gap-2 text-sm leading-relaxed text-slate-300 font-deva">
                    <span className="mt-1 text-amber-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className="text-sm leading-relaxed text-slate-300 md:text-base font-deva">
              {block[language]}
            </p>
          );
        })}
      </div>

      {/* Educational-only note, consistent with the rest of the site. */}
      <p className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs leading-relaxed text-slate-500 font-deva">
        ⚠️{' '}
        {mr
          ? 'ही माहिती केवळ शैक्षणिक उद्देशासाठी आहे, वैयक्तिक आर्थिक सल्ला नाही. निर्णयापूर्वी संबंधित तज्ज्ञाचा सल्ला घ्या.'
          : 'This information is for educational purposes only, not personalised financial advice. Consult a relevant expert before deciding.'}
      </p>
    </article>
  );
}
