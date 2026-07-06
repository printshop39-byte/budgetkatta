// middleware.ts — route protection using the EDGE-SAFE auth config.
// The `authorized` callback (lib/auth.config.ts) decides access; unauthorized
// requests to protected paths are redirected to the sign-in page by Auth.js.
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

export const { auth: middleware } = NextAuth(authConfig);

// NOTE: Next requires a static matcher, so this list is maintained by hand. It
// MUST stay in sync with PROTECTED_PREFIXES in lib/auth.config.ts — the test in
// lib/authConfig.test.ts asserts they match so drift fails CI. The `:path*` form
// also matches the bare prefix (e.g. `/admin`) in Next 14.
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/account/:path*',
    '/onboarding/:path*',
    '/memory/:path*',
    '/admin/:path*',
  ],
};
