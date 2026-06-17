// app/api/insurance/route.ts — Insurance plans (MongoDB with demo fallback)
import { NextResponse } from 'next/server';
import { getInsurancePlans } from '@/lib/repository';

// Read live per request so seeded MongoDB data is reflected (not build-time cached).
export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, source } = await getInsurancePlans();
  return NextResponse.json({ ok: true, source, count: data.length, data });
}
