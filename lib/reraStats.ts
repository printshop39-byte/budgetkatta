// lib/reraStats.ts — district-wise count of NEW MahaRERA-approved projects,
// western Maharashtra. Supplied by the site owner (rera-western-maharashtra.html,
// 2026-10); not independently re-verified. `null` = district figure not available.
// Update the numbers here when new MahaRERA figures are published.

export type ReraYear = 'fy26' | 'fy24';
export type ReraDistrict = 'Pune' | 'Kolhapur' | 'Satara' | 'Sangli' | 'Solapur';

export const RERA_DISTRICTS: { id: ReraDistrict; mr: string; en: string }[] = [
  { id: 'Pune', mr: 'पुणे', en: 'Pune' },
  { id: 'Kolhapur', mr: 'कोल्हापूर', en: 'Kolhapur' },
  { id: 'Satara', mr: 'सातारा', en: 'Satara' },
  { id: 'Sangli', mr: 'सांगली', en: 'Sangli' },
  { id: 'Solapur', mr: 'सोलापूर', en: 'Solapur' },
];

export const RERA_COUNTS: Record<ReraYear, Record<ReraDistrict, number | null>> = {
  fy26: { Pune: 3150, Kolhapur: 145, Satara: 145, Sangli: null, Solapur: null },
  fy24: { Pune: 1172, Kolhapur: 85, Satara: 66, Sangli: 53, Solapur: 39 },
};

export const RERA_YEAR_LABEL: Record<ReraYear, { mr: string; en: string }> = {
  fy26: { mr: '२०२५-२६', en: 'FY 2025-26' },
  fy24: { mr: '२०२३-२४', en: 'FY 2023-24' },
};

export const RERA_STATS_UPDATED = '2026-10';
export const MAHARERA_HOME_URL = 'https://maharera.maharashtra.gov.in/';

/** % growth FY24 -> FY26, or null when either year is missing/zero-based. */
export function reraGrowth(d: ReraDistrict): number | null {
  const a = RERA_COUNTS.fy24[d];
  const b = RERA_COUNTS.fy26[d];
  if (a == null || b == null || a === 0) return null;
  return Math.round(((b - a) / a) * 100);
}

/** MahaRERA project numbers: "P" followed by 11 digits (e.g. P52100012345). */
export const RERA_NUMBER_RE = /^P\d{11}$/;

export function normalizeReraNumber(input: string): string {
  return input.trim().toUpperCase();
}
