// lib/locations.ts
// Live data-access layer for the bank directory, backed by the MongoDB
// `Institution` collection (populated from the official banking exports).
//
// Hierarchy: District → City → Branch records.
//   getDistricts()              → distinct districts
//   getCities(district)         → distinct cities in a district
//   getBranches(district, city) → branch records for a district + city
//   searchLocations(q)          → fuzzy district/city/pincode lookup (voice search)
//
// When MONGODB_URI is absent the getters return empty results (rather than
// throwing) so the app degrades gracefully instead of crashing.
import { connectDB, isMongoConfigured } from '@/lib/mongodb';
import { Institution } from '@/models/Institution';

export interface Branch {
  name: string;
  branch: string;
  address: string;
  pincode: string;
  isRbiAuthorized: boolean;
  ifsc: string;
}

export interface LocationMatch {
  matched: boolean;
  district?: string;
  city?: string;
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Distinct districts present in the DB (sorted). */
export async function getDistricts(): Promise<string[]> {
  if (!isMongoConfigured()) return [];
  await connectDB();
  const rows = (await Institution.distinct('district', { district: { $nin: ['', null] } })) as string[];
  return rows.filter(Boolean).sort((a, b) => a.localeCompare(b));
}

/** Distinct cities within a district (sorted). */
export async function getCities(district: string): Promise<string[]> {
  if (!isMongoConfigured() || !district) return [];
  await connectDB();
  const rows = (await Institution.distinct('city', { district, city: { $nin: ['', null] } })) as string[];
  return rows.filter(Boolean).sort((a, b) => a.localeCompare(b));
}

export type BankFilter = 'main' | 'payments';

// "PAYMENTS BANK" anywhere in the institution name (Airtel/Fino/India Post/Jio/Paytm…).
const PAYMENTS_NAME_RE = /payments\s+bank/i;

/**
 * Branch records for a district + city (capped for performance).
 * filter='main'     → primary banks only (Public/Private/Co-op/SFB/RRB) — excludes
 *                     Payments Banks + CSP/BC outlets so the default view isn't flooded.
 * filter='payments' → only Payments Banks (bankGroup or name match).
 */
export async function getBranches(
  district: string,
  city: string,
  filter: BankFilter = 'main',
): Promise<Branch[]> {
  if (!isMongoConfigured() || !district || !city) return [];
  await connectDB();

  const query: Record<string, unknown> = { district, city };
  if (filter === 'payments') {
    query.$or = [{ bankGroup: 'PAYMENTS BANKS' }, { name: PAYMENTS_NAME_RE }];
  } else {
    // main: exclude anything that is a Payments Bank by group OR by name.
    query.bankGroup = { $ne: 'PAYMENTS BANKS' };
    query.name = { $not: PAYMENTS_NAME_RE };
  }

  const docs = await Institution.find(query)
    .select('name branch address pincode isRbiAuthorized ifsc')
    .limit(300)
    .lean();
  return (docs as any[]).map((d) => ({
    name: d.name ?? '',
    branch: d.branch ?? '',
    address: d.address ?? '',
    pincode: d.pincode ?? '',
    isRbiAuthorized: d.isRbiAuthorized !== false,
    ifsc: d.ifsc ?? '',
  }));
}

/**
 * Fuzzy match a spoken/typed query to a district + city. Tries an exact pincode
 * first, then case-insensitive token matches against district / city / bank name.
 */
export async function searchLocations(query: string): Promise<LocationMatch> {
  if (!isMongoConfigured()) return { matched: false };
  const q = (query || '').trim();
  if (!q) return { matched: false };
  await connectDB();

  const pin = (q.match(/\b\d{6}\b/) ?? [])[0];
  if (pin) {
    const doc = (await Institution.findOne({ pincode: pin }).select('district city').lean()) as any;
    if (doc) return { matched: true, district: doc.district, city: doc.city };
  }

  const tokens = q.split(/[\s,./-]+/).filter((tok) => tok.length >= 3);
  for (const tok of tokens) {
    const rx = new RegExp(escapeRegex(tok), 'i');
    const doc = (await Institution.findOne({ $or: [{ district: rx }, { city: rx }, { name: rx }] })
      .select('district city')
      .lean()) as any;
    if (doc) return { matched: true, district: doc.district, city: doc.city };
  }

  return { matched: false };
}
