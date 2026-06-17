// app/api/locations/route.ts — hierarchical location lookup for the directory.
//
// Levels (driven by query params, so the frontend only fetches what it needs):
//   GET /api/locations                          → all districts
//   GET /api/locations?district=<id>            → talukas of that district
//   GET /api/locations?district=<id>&taluka=<id>→ villages (with pincode + branches)
//
// The data access lives in lib/locations.ts; swapping that layer for MongoDB
// Atlas later requires no changes here.
import { NextResponse } from 'next/server';
import { getDistricts, getTalukas, getVillages } from '@/lib/locations';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district');
  const taluka = searchParams.get('taluka');

  if (district && taluka) {
    const data = await getVillages(district, taluka);
    return NextResponse.json({ ok: true, level: 'villages', count: data.length, data });
  }
  if (district) {
    const data = await getTalukas(district);
    return NextResponse.json({ ok: true, level: 'talukas', count: data.length, data });
  }
  const data = await getDistricts();
  return NextResponse.json({ ok: true, level: 'districts', count: data.length, data });
}
