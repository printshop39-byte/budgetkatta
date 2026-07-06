// lib/auth.ts — FULL Auth.js v5 config (Node runtime). Extends the edge-safe
// base (lib/auth.config.ts) with the phone-OTP Credentials provider and the
// Google DB-upsert signIn callback. Exposes handlers/auth/signIn/signOut.
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/lib/auth.config';
import { verifyOtp, normalizePhone } from '@/lib/otp';
import { upsertUserByPhone, upsertUserByGoogle } from '@/lib/userService';
import { isMongoConfigured } from '@/lib/mongodb';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      id: 'phone-otp',
      name: 'Phone OTP',
      credentials: { phone: { label: 'Phone' }, otp: { label: 'OTP' } },
      async authorize(credentials) {
        const phone = normalizePhone(String(credentials?.phone ?? ''));
        const otp = String(credentials?.otp ?? '');
        if (!phone || !/^\d{6}$/.test(otp)) return null;
        if (!(await verifyOtp(phone, otp))) return null;
        const user = await upsertUserByPhone(phone);
        return {
          id: user._id,
          name: user.displayName ?? null,
          phone,
          roles: user.roles,
          locale: user.locale,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const g = await upsertUserByGoogle({
            googleId: account.providerAccountId,
            email: user.email ?? undefined,
            // Only trust the email for account-LINKING if Google verified it.
            emailVerified: (profile as { email_verified?: boolean } | undefined)?.email_verified === true,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
          });
          user.appUserId = g._id;
          user.roles = g.roles;
          user.locale = g.locale;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('[BudgetKatta] Google user upsert failed:', e);
          // If a DB is configured but the write failed, DENY sign-in rather than
          // minting a session keyed on the wrong id. (The synthetic dev-fallback
          // only applies when no DB is configured — handled inside the service.)
          if (isMongoConfigured()) return false;
        }
      }
      return true;
    },
  },
});
