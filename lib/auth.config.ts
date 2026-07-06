// lib/auth.config.ts — EDGE-SAFE base Auth.js config (no DB / Node-only imports).
// Used by middleware.ts to protect routes. The full config (lib/auth.ts) extends
// this with the Credentials provider + DB-touching callbacks that must run in the
// Node runtime. This split is the required pattern for Auth.js v5 + Mongoose.
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

/** Path prefixes that require a signed-in member. */
export const PROTECTED_PREFIXES = ['/dashboard', '/account', '/onboarding', '/memory', '/admin'];

export const authConfig = {
  session: { strategy: 'jwt' },
  trustHost: true,
  pages: { signIn: '/signin' },
  // Google is edge-safe. The Credentials (phone-OTP) provider is added only in
  // the full Node-runtime config because its authorize() touches the database.
  providers: [Google({ allowDangerousEmailAccountLinking: true })],
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isProtected = PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(p + '/'));
      if (!isProtected) return true;
      return Boolean(auth?.user); // false → Auth.js redirects to pages.signIn
    },
    jwt({ token, user }) {
      if (user) {
        token.uid = user.appUserId ?? user.id;
        token.roles = user.roles ?? ['member'];
        if (user.phone) token.phone = user.phone;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // Auth.js v5's JWT type carries an `unknown` index signature; our
        // augmentation lives on next-auth/jwt, so narrow on read here.
        if (token.uid) session.user.id = token.uid as string;
        session.user.roles = (token.roles as string[] | undefined) ?? ['member'];
        if (token.phone) session.user.phone = token.phone as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
