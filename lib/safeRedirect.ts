// lib/safeRedirect.ts — guard against open redirects. Only same-origin RELATIVE
// paths are allowed as post-login redirect targets; anything else → fallback.
export function safeInternalPath(url: string | null | undefined, fallback = '/account'): string {
  if (!url || url[0] !== '/') return fallback; // reject absolute/scheme URLs
  // Reject protocol-relative ("//host"), backslash tricks ("/\host"), and
  // leading-whitespace variants that browsers may normalize to external URLs.
  const c = url[1];
  if (c === '/' || c === '\\' || c === '\t' || c === '\n' || c === '\r' || c === ' ') return fallback;
  return url;
}
