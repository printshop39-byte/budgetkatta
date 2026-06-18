// app/api/locations/route.ts — hierarchical location lookup for the directory,
// served live from the MongoDB `Institution` collection.
//
//   GET /api/locations                          → distinct districts (string[])
//   GET /api/locations?district=<d>             → distinct cities in that district
//   GET /api/locations?district=<d>&city=<c>    → branch records for district+city
//   GET /api/locations?q=<spoken transcript>    → fuzzy { matched, district?, city? }
import { NextResponse } from 'next/server';
import { getDistricts, getCities, getBranches, searchLocations, parseBankFilter } from '@/lib/locations';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district');
  const city = searchParams.get('city');
  const q = searchParams.get('q');
  const filter = parseBankFilter(searchParams.get('filter')); // default 'main'
  const page = Number(searchParams.get('page')) || 0;

  try {
    if (q !== null) {
      const match = await searchLocations(q);
      return NextResponse.json({ ok: true, level: 'search', match });
    }
    if (district && city) {
      const { branches, total, hasMore, page: p } = await getBranches(district, city, filter, page);
      return NextResponse.json({
        ok: true,
        level: 'branches',
        filter,
        page: p,
        total,
        hasMore,
        count: branches.length,
        data: branches,
      });
    }
    if (district) {
      const data = await getCities(district);
      return NextResponse.json({ ok: true, level: 'cities', count: data.length, data });
    }
    const data = await getDistricts();
    return NextResponse.json({ ok: true, level: 'districts', count: data.length, data });
  } catch (err) {
    console.error('[BudgetKatta] /api/locations error:', err);
    return NextResponse.json({ ok: false, error: 'lookup_failed', data: [] }, { status: 500 });
  }
}
