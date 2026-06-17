// lib/sanitize.ts — strip control chars and cap length before forwarding user
// input to external services (n8n, Gemini). Preserves Devanagari and emoji.

// Control chars: C0 range (U+0000-U+001F) and DEL (U+007F).
const CONTROL_CHARS = new RegExp('[\\u0000-\\u001F\\u007F]', 'g');

export function sanitizeText(input: unknown, maxLen = 2000): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(CONTROL_CHARS, ' ')
    .replace(/\s{3,}/g, ' ')
    .trim()
    .slice(0, maxLen);
}
