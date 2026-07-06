// app/(app)/layout.tsx — wraps only the authenticated member area in the
// next-auth SessionProvider, so public/SEO pages don't pay the auth client
// bundle + a session fetch on every load.
import Providers from '@/components/auth/Providers';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
