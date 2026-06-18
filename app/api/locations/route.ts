// app/api/locations/route.ts — hierarchical location lookup for the directory,
// served live from the MongoDB `Institution` collection.
//
//   GET /api/locations                          → distinct districts (string[])
//   GET /api/locations?district=<d>             → distinct cities in that district
//   GET /api/locations?district=<d>&city=<c>    → branch records for district+city
//   GET /api/locations?q=<spoken transcript>    → fuzzy { matched, district?, city? }
import { NextResponse } from 'next/server';
import { getDistricts, getCities, getBranches, searchLocations } from '@/lib/locations';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district');
  const city = searchParams.get('city');
  const q = searchParams.get('q');
  const filter = searchParams.get('filter') === 'payments' ? 'payments' : 'main'; // default main

  try {
    if (q !== null) {
      const match = await searchLocations(q);
      return NextResponse.json({ ok: true, level: 'search', match });
    }
    if (district && city) {
      const data = await getBranches(district, city, filter);
      return NextResponse.json({ ok: true, level: 'branches', filter, count: data.length, data });
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
