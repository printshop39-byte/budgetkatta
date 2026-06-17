// app/api/rates/route.ts — combined rates endpoint (?module=fd|loans|sip|insurance)
// Kept for backwards compatibility; delegates to the same repository as the
// dedicated /api/{fd,loans,sip,insurance} routes (MongoDB with demo fallback).
import { NextResponse } from 'next/server';
import {
  getFDRates,
  getLoanProducts,
  getSIPFunds,
  getInsurancePlans,
} from '@/lib/repository';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const module = searchParams.get('module');

  const map = {
    fd: getFDRates,
    loans: getLoanProducts,
    sip: getSIPFunds,
    insurance: getInsurancePlans,
  } as const;

  const getter = map[module as keyof typeof map];
  if (!getter) {
    return NextResponse.json(
      { ok: false, error: 'Provide ?module=fd|loans|sip|insurance' },
      { status: 400 }
    );
  }

  const { data, source } = await getter();
  return NextResponse.json({ ok: true, source, count: data.length, data });
}
