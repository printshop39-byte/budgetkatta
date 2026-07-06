// types/next-auth.d.ts — augment Auth.js session/user/JWT with our app fields.
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      roles?: string[];
      phone?: string;
    } & DefaultSession['user'];
  }

  interface User {
    roles?: string[];
    phone?: string;
    locale?: string;
    /** Set in the Google signIn callback so jwt() can read the app user id. */
    appUserId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid?: string;
    roles?: string[];
    phone?: string;
  }
}
