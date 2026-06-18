// app/api/rates/route.ts — combined rates endpoint (?module=fd|loans|sip|insurance)
// Kept for backwards compatibility; delegates to the same repository as the
// dedicated /api/{fd,loans,sip,insurance} routes (MongoDB with demo fallback).
//
//   GET  /api/rates?module=fd        → read rates (DB, demo fallback)
//   POST /api/rates  { data:[ BankRate ] }
//                                    → upsert FD bank rates by bankName (admin-guarded)
import { NextResponse } from 'next/server';
import {
  getFDRates,
  getLoanProducts,
  getSIPFunds,
  getInsurancePlans,
} from '@/lib/repository';
import { connectDB, isMongoConfigured } from '@/lib/mongodb';
import { BankRate } from '@/models/BankRate';

export const dynamic = 'force-dynamic';

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

// ── Write path: upsert FD bank rates ─────────────────────────────────────────
// Authorization: if ADMIN_API_TOKEN is set, require `Authorization: Bearer
// <token>`. Otherwise the endpoint is only enabled when NEXT_PUBLIC_ENABLE_ADMIN
// === 'true' (admin mode), matching the leads route. Never writes without one.
function isAuthorized(request: Request): boolean {
  const token = process.env.ADMIN_API_TOKEN;
  if (token) {
    return request.headers.get('authorization') === `Bearer ${token}`;
  }
  return process.env.NEXT_PUBLIC_ENABLE_ADMIN === 'true';
}

interface RateRow {
  tenureLabel?: string;
  tenureMonths?: number;
  regularRate?: number;
  seniorRate?: number;
}
interface BankRateInput {
  bankName?: string;
  bankType?: 'govt' | 'private' | 'cooperative';
  logo?: string;
  rates?: RateRow[];
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  if (!isMongoConfigured()) {
    return NextResponse.json({ ok: false, error: 'database_not_configured' }, { status: 503 });
  }

  let body: { data?: BankRateInput[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const rows = Array.isArray(body?.data) ? body.data : [];
  const valid = rows.filter((r) => r && typeof r.bankName === 'string' && r.bankName.trim());
  if (valid.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'Provide { data: [{ bankName, bankType?, rates: [...] }] }' },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const ops = valid.map((r) => ({
      updateOne: {
        filter: { bankName: r.bankName },
        update: {
          $set: {
            bankName: r.bankName,
            ...(r.bankType ? { bankType: r.bankType } : {}),
            ...(r.logo ? { logo: r.logo } : {}),
            rates: Array.isArray(r.rates) ? r.rates : [],
          },
        },
        upsert: true,
      },
    }));
    const result = await BankRate.bulkWrite(ops);
    const upserted = result.upsertedCount ?? 0;
    const modified = result.modifiedCount ?? 0;
    return NextResponse.json({ ok: true, upserted, modified, received: valid.length });
  } catch (err) {
    console.error('[BudgetKatta] /api/rates POST failed:', err);
    return NextResponse.json({ ok: false, error: 'write_failed' }, { status: 500 });
  }
}
