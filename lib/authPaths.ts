// lib/authPaths.ts — route-protection path constants. No framework imports, so
// they're trivially unit-testable and safe to share. MUST stay in sync with the
// static `config.matcher` in middleware.ts (asserted by lib/authConfig.test.ts).

/** Path prefixes that require a signed-in member. */
export const PROTECTED_PREFIXES = ['/dashboard', '/account', '/onboarding', '/memory', '/admin'];

/** Prefixes that additionally require the `admin` role (authorization, not just auth). */
export const ADMIN_PREFIXES = ['/admin'];

export function underPrefix(path: string, prefixes: string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(p + '/'));
}
