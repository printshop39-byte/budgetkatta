import Link from 'next/link';

// Branded bilingual 404. A mistyped or stale URL lands here instead of a bare
// browser error, with a clear route back to the homepage and the popular tools.
const popular = [
  { href: '/fds', label: 'मुदत ठेव (FD) दर' },
  { href: '/loans', label: 'कर्ज माहिती' },
  { href: '/rates', label: 'व्याज दर' },
  { href: '/directory', label: 'बँक डिरेक्टरी' },
];

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-deva text-7xl font-extrabold text-bk-gold sm:text-8xl">404</p>

      <h1 className="font-deva mt-4 text-2xl font-bold text-slate-100 sm:text-3xl">
        पान सापडले नाही
      </h1>
      <p className="font-deva mt-2 max-w-md text-slate-400">
        तुम्ही शोधत असलेले पान अस्तित्वात नाही किंवा हलवले गेले आहे. | यह पेज मौजूद
        नहीं है या हटा दिया गया है।
      </p>

      <Link
        href="/"
        className="font-deva mt-8 inline-flex items-center justify-center rounded-xl bg-bk-gold px-6 py-3 font-bold text-bk-dark transition-colors hover:bg-bk-gold-light"
      >
        मुख्यपृष्ठावर जा | होम पर जाएं
      </Link>

      <div className="mt-10">
        <p className="font-deva text-sm text-slate-500">लोकप्रिय साधने | लोकप्रिय टूल्स</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {popular.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-deva rounded-lg border border-bk-gold/30 px-4 py-2 text-sm text-bk-gold transition-colors hover:bg-bk-gold/10"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
