import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
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
