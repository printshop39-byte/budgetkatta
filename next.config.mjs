import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Security headers (Sprint 1 · EPIC 4). Closes the audit finding "no security
// headers". The non-CSP headers are enforced immediately (safe, no breakage
// risk). CSP ships in *Report-Only* mode first so we collect violations from
// real traffic (incl. the analytics being added this sprint) before enforcing.
//
// Permissions-Policy deliberately allows `self` for microphone (directory voice
// search) and geolocation (store locator) — do NOT tighten these to () or those
// features break.
const cspReportOnly = [
  "default-src 'self'",
  // Next.js injects a small inline bootstrap + we set the theme pre-paint inline;
  // analytics loaders are added consent-gated this sprint.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com https://c.clarity.ms",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms https://connect.facebook.net",
  "frame-src 'self' https://prod.spline.design",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(self), geolocation=(self), payment=(), browsing-topics=()',
  },
  // Report-Only: observe violations without breaking anything. Promote to
  // `Content-Security-Policy` once the report queue is clean.
  { key: 'Content-Security-Policy-Report-Only', value: cspReportOnly },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // Education-loan pages moved to the keyword-exact /education-loan tree.
  // Permanent (301) redirects preserve any existing links / SEO equity.
  async redirects() {
    return [
      { source: '/loans/students', destination: '/education-loan', permanent: true },
      {
        source: '/loans/students/personal-loan',
        destination: '/education-loan/personal-loan-for-education',
        permanent: true,
      },
      // The thin /schemes hub is superseded by the rich /loans/women +
      // /education-loan pages (now linked directly from the nav).
      { source: '/schemes', destination: '/loans/women', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config) => {
    // @splinetool/react-spline ships an "exports" map with only an "import"
    // condition (no "default"/"require"), which Next's webpack fails to match
    // in some resolution contexts ("Package path ./next is not exported").
    // Alias the specifier straight to the built ESM file to bypass the gate.
    config.resolve.alias['@splinetool/react-spline/next$'] = path.resolve(
      __dirname,
      'node_modules/@splinetool/react-spline/dist/react-spline-next.js'
    );
    return config;
  },
};

export default nextConfig;
