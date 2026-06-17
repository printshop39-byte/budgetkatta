// scripts/import-rbi-banks.ts
// Bulk-import an official RBI bank/branch CSV export into MongoDB Atlas.
//
// Usage:
//   1. Put MONGODB_URI in .env.local
//   2. Export the RBI master list as CSV → data/rbi_master_banks.csv
//   3. Run:
//        npm run import:rbi            # append to existing data
//        npm run import:rbi -- --clear # wipe the collection first, then import
//        npm run import:rbi -- --file=data/other.csv
//
// Expected CSV header (case / spacing / underscores are tolerated):
//   Bank_Name, Category, State, District, City, Pincode
//
// Design notes:
//   • Native fs parsing — no extra dependency, handles quoted fields & commas.
//   • Rows missing a Bank_Name are skipped (logged); other blanks default safely.
//   • insertMany in batches of 500 with { ordered: false } so one bad row never
//     aborts the whole import, and progress is logged as it goes.

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { connectDB } from '@/lib/mongodb';
import { Institution } from '@/models/Institution';

const BATCH_SIZE = 500;

// ── CSV parsing ───────────────────────────────────────────────────────────────

// Parse a single CSV line respecting quotes and "" escapes.
function parseLine(line: string): string[] {
  const out: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      out.push(field);
      field = '';
    } else {
      field += ch;
    }
  }
  out.push(field);
  return out;
}

// Normalise a header cell to a canonical key: lower-case, strip non-alphanumerics.
const normKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// Map canonical header keys → our field names. Several spellings accepted.
const HEADER_MAP: Record<string, string> = {
  bankname: 'bankName',
  bank: 'bankName',
  name: 'bankName',
  category: 'category',
  type: 'category',
  banktype: 'category',
  state: 'state',
  district: 'district',
  city: 'city',
  branch: 'city',
  pincode: 'pincode',
  pin: 'pincode',
  zip: 'pincode',
};

interface RawRow {
  bankName?: string;
  category?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
}

function parseCsv(content: string): RawRow[] {
  // Strip a UTF-8 BOM if present, normalise line endings.
  const text = content.replace(/^﻿/, '');
  const lines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const headerCells = parseLine(lines[0]).map((h) => HEADER_MAP[normKey(h)] ?? null);

  const rows: RawRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseLine(lines[i]);
    const row: RawRow = {};
    headerCells.forEach((key, idx) => {
      if (key) row[key as keyof RawRow] = (cells[idx] ?? '').trim();
    });
    rows.push(row);
  }
  return rows;
}

// ── Mapping & validation ───────────────────────────────────────────────────────

function toDoc(row: RawRow) {
  const bankName = (row.bankName ?? '').trim();
  if (!bankName) return null; // required — skip incomplete rows

  const pincodeRaw = (row.pincode ?? '').replace(/\D/g, '');
  const pincode = /^\d{6}$/.test(pincodeRaw) ? pincodeRaw : ''; // keep only valid 6-digit pins

  return {
    bankName,
    category: (row.category ?? '').trim() || 'Other',
    state: (row.state ?? '').trim(),
    district: (row.district ?? '').trim(),
    city: (row.city ?? '').trim(),
    pincode,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const clearFirst = args.includes('--clear');
  const dryRun = args.includes('--dry-run');
  const fileArg = args.find((a) => a.startsWith('--file='));
  const filePath = path.resolve(process.cwd(), fileArg ? fileArg.split('=')[1] : 'data/rbi_master_banks.csv');

  // --dry-run parses + validates only, so it needs no database connection.
  if (!dryRun && !process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set. Add it to .env.local and retry.');
    process.exit(1);
  }
  if (!fs.existsSync(filePath)) {
    console.error(`❌ CSV not found at: ${filePath}`);
    console.error('   Place the RBI export there, or pass --file=path/to/file.csv');
    process.exit(1);
  }

  console.log(`📄 Reading ${filePath}…`);
  const content = fs.readFileSync(filePath, 'utf8');
  const rawRows = parseCsv(content);
  console.log(`   Parsed ${rawRows.length} data rows.`);

  const docs: ReturnType<typeof toDoc>[] = [];
  let skipped = 0;
  for (const row of rawRows) {
    const doc = toDoc(row);
    if (doc) docs.push(doc);
    else skipped += 1;
  }
  if (skipped) console.log(`   ⚠️  Skipped ${skipped} row(s) with no Bank_Name.`);
  if (docs.length === 0) {
    console.error('❌ No valid rows to import. Check the CSV header/columns.');
    process.exit(1);
  }

  if (dryRun) {
    const noPin = docs.filter((d) => d && !d.pincode).length;
    console.log(`\n🔍 Dry run — ${docs.length} valid record(s) ready, ${noPin} with no/invalid pincode.`);
    console.log('   Sample (first 3):');
    docs.slice(0, 3).forEach((d) => console.log('   •', JSON.stringify(d)));
    console.log('\n   No database changes made. Drop --dry-run to import.');
    process.exit(0);
  }

  console.log('⏳ Connecting to MongoDB…');
  await connectDB();

  if (clearFirst) {
    const { deletedCount } = await Institution.deleteMany({});
    console.log(`🧹 Cleared existing collection (${deletedCount ?? 0} removed).`);
  }

  let inserted = 0;
  let failed = 0;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);
    try {
      const res = await Institution.insertMany(batch, { ordered: false });
      inserted += res.length;
    } catch (err: any) {
      // With ordered:false, valid docs in the batch still insert; count them.
      const ok = err?.result?.insertedCount ?? err?.insertedDocs?.length ?? 0;
      inserted += ok;
      failed += batch.length - ok;
      console.warn(`   ⚠️  Batch ${i / BATCH_SIZE + 1}: ${batch.length - ok} row(s) failed, ${ok} inserted.`);
    }
    console.log(`   ➕ Inserted ${inserted}/${docs.length} banks…`);
  }

  console.log(`\n✅ Done. Inserted ${inserted} record(s)${failed ? `, ${failed} failed` : ''}.`);
  await (await connectDB()).disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
