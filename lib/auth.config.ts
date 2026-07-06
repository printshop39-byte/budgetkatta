// lib/auth.config.ts — EDGE-SAFE base Auth.js config (no DB / Node-only imports).
// Used by middleware.ts to protect routes. The full config (lib/auth.ts) extends
// this with the Credentials provider + DB-touching callbacks that must run in the
// Node runtime. This split is the required pattern for Auth.js v5 + Mongoose.
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import { PROTECTED_PREFIXES, ADMIN_PREFIXES, underPrefix } from '@/lib/authPaths';

export const authConfig = {
  // Finance app: cap session lifetime (default was 30 days) and refresh at most
  // daily. NOTE: JWT strategy has no server-side revocation — a shorter lifetime
  // is the mitigation until a token denylist lands.
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60, updateAge: 24 * 60 * 60 },
  trustHost: true,
  pages: { signIn: '/signin' },
  // Google is edge-safe. The Credentials (phone-OTP) provider is added only in
  // the full Node-runtime config because its authorize() touches the database.
  // Account linking is handled explicitly (and email-verified-gated) in
  // lib/userService.ts, so we do NOT enable Auth.js's dangerous auto-linking.
  providers: [Google],
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      if (!underPrefix(path, PROTECTED_PREFIXES)) return true;
      if (!auth?.user) return false; // → Auth.js redirects to pages.signIn
      // Authorization: /admin needs the admin role, not merely a logged-in user.
      if (underPrefix(path, ADMIN_PREFIXES) && !(auth.user.roles ?? []).includes('admin')) {
        return false;
      }
      return true;
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
