// scripts/seed.ts
// Seeds MongoDB Atlas with the current demo data.
//
// Usage:
//   1. Put MONGODB_URI in .env.local
//   2. npm run seed
//
// Each collection is cleared and re-inserted (idempotent). The demo objects'
// string `id` field is stripped so MongoDB generates real ObjectIds.

import dotenv from 'dotenv';
// Load .env.local first (Next.js loads this automatically, but plain scripts do not).
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { FDRate } from '@/models/FDRate';
import { LoanProduct } from '@/models/LoanProduct';
import { SIPFund } from '@/models/SIPFund';
import { Insurance } from '@/models/Insurance';
import { fdRates, loanProducts, sipFunds, insurancePlans } from '@/lib/data';

// Drop the demo-only `id` so Mongo assigns its own _id.
const strip = <T extends { id?: string }>(rows: T[]) =>
  rows.map(({ id, ...rest }) => rest);

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set. Add it to .env.local and retry.');
    process.exit(1);
  }

  console.log('⏳ Connecting to MongoDB…');
  await connectDB();

  const jobs: [string, mongoose.Model<any>, unknown[]][] = [
    ['FD rates', FDRate, strip(fdRates)],
    ['Loan products', LoanProduct, strip(loanProducts)],
    ['SIP funds', SIPFund, strip(sipFunds)],
    ['Insurance plans', Insurance, strip(insurancePlans)],
  ];

  for (const [label, model, rows] of jobs) {
    await model.deleteMany({});
    await model.insertMany(rows);
    console.log(`✅ Seeded ${rows.length} ${label}`);
  }

  await mongoose.disconnect();
  console.log('🎉 Done. Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
