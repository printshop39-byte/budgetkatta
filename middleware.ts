// middleware.ts — route protection using the EDGE-SAFE auth config.
// The `authorized` callback (lib/auth.config.ts) decides access; unauthorized
// requests to protected paths are redirected to the sign-in page by Auth.js.
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/account/:path*',
    '/onboarding/:path*',
    '/memory/:path*',
    '/admin/:path*',
  ],
};
