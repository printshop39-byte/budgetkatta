// lib/config.ts — central site constants.
// Single source of truth for the contact email. Override via env if needed.
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@budgetkatta.in';
