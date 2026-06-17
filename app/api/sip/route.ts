// app/api/sip/route.ts — SIP funds (MongoDB with demo fallback)
import { NextResponse } from 'next/server';
import { getSIPFunds } from '@/lib/repository';

// Read live per request so seeded MongoDB data is reflected (not build-time cached).
export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, source } = await getSIPFunds();
  return NextResponse.json({ ok: true, source, count: data.length, data });
}
