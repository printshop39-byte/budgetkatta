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

export type BankFilter = 'main' | 'cooperative' | 'sfb' | 'rrb' | 'payments';

export const BANK_FILTERS: BankFilter[] = ['main', 'cooperative', 'sfb', 'rrb', 'payments'];

const isBankFilter = (v: string | null): v is BankFilter =>
  v !== null && (BANK_FILTERS as string[]).includes(v);

export const parseBankFilter = (v: string | null): BankFilter => (isBankFilter(v) ? v : 'main');

// Best-effort category detection. The official export's `bankGroup` values are
// not perfectly standardised, so each category matches `bankGroup` OR the bank
// `name`. Tune these patterns once the real bankGroup distribution is known.
const CATEGORY_RE: Record<Exclude<BankFilter, 'main'>, RegExp> = {
  payments: /payments?\s*bank/i,
  cooperative: /co.?op|sahakari|nagari|urban\s+co|mahila\s+(co|bank)|patsanstha|pat\s*sanstha/i,
  sfb: /small\s*finance/i,
  rrb: /regional\s*rural|gramin|grameen|gramीण|gramin\s*bank/i,
};

const PAGE_SIZE = 60;

/** Build the Mongo query fragment that selects a single bank category. */
function categoryClause(filter: BankFilter): Record<string, unknown> {
  if (filter === 'main') {
    // Primary commercial (Public/Private): exclude every specialised category.
    const negatives = [CATEGORY_RE.payments, CATEGORY_RE.cooperative, CATEGORY_RE.sfb, CATEGORY_RE.rrb];
    return {
      $and: negatives.map((re) => ({ name: { $not: re }, bankGroup: { $not: re } })),
    };
  }
  const re = CATEGORY_RE[filter];
  return { $or: [{ bankGroup: re }, { name: re }] };
}

export interface BranchPage {
  branches: Branch[];
  total: number;
  hasMore: boolean;
  page: number;
}

/**
 * Paginated branch records for a district + city, narrowed to a bank category.
 *   main        → primary commercial (Public/Private)
 *   cooperative → co-operative banks / patsanstha
 *   sfb         → small finance banks
 *   rrb         → regional rural banks
 *   payments    → payments banks / service points
 */
export async function getBranches(
  district: string,
  city: string,
  filter: BankFilter = 'main',
  page = 0,
): Promise<BranchPage> {
  if (!isMongoConfigured() || !district || !city) return { branches: [], total: 0, hasMore: false, page: 0 };
  await connectDB();

  const query: Record<string, unknown> = { district, city, ...categoryClause(filter) };
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 0;

  const [docs, total] = await Promise.all([
    Institution.find(query)
      .select('name branch address pincode isRbiAuthorized ifsc')
      .skip(safePage * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Institution.countDocuments(query),
  ]);

  const branches = (docs as any[]).map((d) => ({
    name: d.name ?? '',
    branch: d.branch ?? '',
    address: d.address ?? '',
    pincode: d.pincode ?? '',
    isRbiAuthorized: d.isRbiAuthorized !== false,
    ifsc: d.ifsc ?? '',
  }));

  return { branches, total, hasMore: (safePage + 1) * PAGE_SIZE < total, page: safePage };
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
