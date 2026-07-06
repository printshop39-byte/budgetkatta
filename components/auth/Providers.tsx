'use client';
// components/auth/Providers.tsx — client SessionProvider so components can call
// useSession()/signIn()/signOut(). Wraps the app's main content in the layout.
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
