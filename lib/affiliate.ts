// ── Central affiliate-link configuration ────────────────────────────────────
// All affiliate / referral destinations live here so real URLs can be plugged
// in from one place (or via env, kept out of git). Until a real URL is set, the
// value stays the placeholder '#': the UI then hides/disables the CTA instead of
// rendering a dead link.
//
// To go live, set the corresponding NEXT_PUBLIC_AFF_* env var (see .env.example)
// or replace the fallback string below with your network referral URL.

import type { AffiliateVariant } from '@/components/AffiliateBanner';

export const AFFILIATE_LINKS: Record<AffiliateVariant, string> = {
  demat: process.env.NEXT_PUBLIC_AFF_DEMAT || '#',
  creditCard: process.env.NEXT_PUBLIC_AFF_CREDIT_CARD || '#',
  loan: process.env.NEXT_PUBLIC_AFF_LOAN || '#',
  insurance: process.env.NEXT_PUBLIC_AFF_INSURANCE || '#',
  womenLoan: process.env.NEXT_PUBLIC_AFF_WOMEN_LOAN || '#',
  educationLoan: process.env.NEXT_PUBLIC_AFF_EDU_LOAN || '#',
};

/** A link is "live" only when it is a real, non-placeholder URL. */
export const isLiveLink = (href?: string): boolean => Boolean(href) && href !== '#';

// Amazon Associates tracking tag (e.g. "budgetkatta-21"). When set, append it to
// amazon.in product URLs with `withAmazonTag()`. Required for Amazon commissions.
export const AMAZON_ASSOC_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || '';

/** Append the Amazon Associates tag to an amazon.in URL (no-op if tag unset). */
export function withAmazonTag(url: string): string {
  if (!AMAZON_ASSOC_TAG || !/amazon\./i.test(url)) return url;
  try {
    const u = new URL(url);
    u.searchParams.set('tag', AMAZON_ASSOC_TAG);
    return u.toString();
  } catch {
    return url;
  }
}
