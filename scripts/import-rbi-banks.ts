// scripts/import-rbi-banks.ts
// Stream-import the official banking export CSV(s) into MongoDB Atlas.
//
// The real exports are PIPE-delimited ("|") and have NO dedicated Branch/City/
// Pincode columns — the pincode is embedded at the end of the quoted Address
// field. This script maps them onto the Institution schema and bulk-inserts in
// batches (streaming keeps memory flat across the ~185k-row files).
//
// Usage:
//   1. Put MONGODB_URI in .env.local
//   2. Pass the file(s), or drop CSVs in data/ and run with no --file:
//        npm run import-banks -- --file="csv file list/Banking Export Data Excel_1781716077178.csv"
//        npm run import-banks -- --clear --file=data/a.csv --file=data/b.csv
//        npm run import-banks -- --dry-run --limit=20 --file="csv file list/all Banking Export Data Excel_1781716332642.csv"
//
// Flags:
//   --clear        wipe the Institution collection before importing
//   --dry-run      parse + map only, print a sample + counts (no DB connection)
//   --limit=N      stop after N data rows (handy with --dry-run)
//   --file=path    CSV to import (repeatable). Defaults to every *.csv in data/.

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { connectDB } from '@/lib/mongodb';
import { Institution } from '@/models/Institution';

const SEPARATOR = '|'; // these exports are pipe-delimited
const BATCH_SIZE = 5000;

// ── Flexible header → field mapping ───────────────────────────────────────────
// Headers vary across exports (BANK / Bank Name / BANK NAME, BRANCH / Banking
// Channel Name, etc.). Normalise each header and pick the first row value whose
// normalised key is in the candidate list.
const normKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// Return the value for the first candidate (in PRIORITY order) that exists and
// is non-empty in the row — not merely the first matching column.
function pick(row: Record<string, string>, candidates: string[]): string {
  for (const cand of candidates) {
    for (const [k, v] of Object.entries(row)) {
      if (normKey(k) === cand && v != null && String(v).trim() !== '') {
        return String(v).trim();
      }
    }
  }
  return '';
}

// Pull a 6-digit pincode out of a column or, failing that, the address tail.
function extractPincode(row: Record<string, string>, address: string): string {
  const explicit = pick(row, ['pincode', 'pin', 'pincode6', 'zip', 'zipcode']);
  if (/^\d{6}$/.test(explicit)) return explicit;
  // Address looks like "<text>,-1,<DISTRICT>,<STATE>,<PINCODE>" → take last 6-digit run.
  const matches = address.match(/\b\d{6}\b/g);
  return matches ? matches[matches.length - 1] : '';
}

function mapRow(row: Record<string, string>) {
  const name = pick(row, ['bankname', 'bank', 'name', 'institutionname']);
  if (!name) return null; // required — skip incomplete rows

  const address = pick(row, ['address', 'fulladdress', 'addr']);
  // Branch: prefer an explicit branch name, else the channel name — but some
  // exports put a numeric code there, so fall back to the readable centre.
  let branch = pick(row, ['branch', 'branchname', 'bankingchannelname']);
  if (!branch || /^\d+$/.test(branch)) branch = pick(row, ['center', 'centre', 'subdistrict']);
  return {
    name,
    branch,
    address,
    // Centre is the town/locality; Sub District ("NO BLOCK" etc.) is a last resort.
    city: pick(row, ['city', 'center', 'centre', 'town', 'subdistrict']),
    district: pick(row, ['district', 'dist']),
    state: pick(row, ['state']),
    pincode: extractPincode(row, address),
    isRbiAuthorized: true, // verified export data
    bankGroup: pick(row, ['bankgroup', 'category', 'banktype', 'type']),
    ifsc: pick(row, ['ifsccode', 'ifsc']),
  };
}

// ── File resolution ────────────────────────────────────────────────────────────
function resolveFiles(args: string[]): string[] {
  const explicit = args
    .filter((a) => a.startsWith('--file='))
    .map((a) => path.resolve(process.cwd(), a.slice('--file='.length)));
  if (explicit.length) return explicit;

  const dataDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) return [];
  return fs
    .readdirSync(dataDir)
    .filter((f) => f.toLowerCase().endsWith('.csv'))
    .map((f) => path.join(dataDir, f));
}

// Stream one file, mapping + collecting valid docs (respecting --limit).
function streamFile(file: string, limit: number, onDoc: (doc: any) => Promise<void>): Promise<{ read: number; skipped: number }> {
  return new Promise((resolve, reject) => {
    let read = 0;
    let skipped = 0;
    let stopped = false;
    const stream = fs.createReadStream(file).pipe(csv({ separator: SEPARATOR }));

    stream.on('data', (row: Record<string, string>) => {
      if (stopped) return;
      read += 1;
      const doc = mapRow(row);
      if (!doc) {
        skipped += 1;
        return;
      }
      // Backpressure: pause while the (async) batch flush runs.
      stream.pause();
      onDoc(doc)
        .then(() => {
          if (limit && read >= limit) {
            stopped = true;
            stream.destroy();
            resolve({ read, skipped });
          } else {
            stream.resume();
          }
        })
        .catch(reject);
    });
    stream.on('end', () => !stopped && resolve({ read, skipped }));
    stream.on('error', reject);
    stream.on('close', () => !stopped && resolve({ read, skipped }));
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const clearFirst = args.includes('--clear');
  const dryRun = args.includes('--dry-run');
  const limitArg = args.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) || 0 : 0;

  const files = resolveFiles(args);
  if (files.length === 0) {
    console.error('❌ No CSV files. Pass --file=path or drop *.csv into data/.');
    process.exit(1);
  }
  for (const f of files) {
    if (!fs.existsSync(f)) {
      console.error(`❌ File not found: ${f}`);
      process.exit(1);
    }
  }

  if (!dryRun && !process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set. Add it to .env.local and retry.');
    process.exit(1);
  }

  if (!dryRun) {
    console.log('⏳ Connecting to MongoDB…');
    await connectDB();
    if (clearFirst) {
      // Wipe the collection before a fresh import.
      const { deletedCount } = await Institution.deleteMany({});
      // await Institution.deleteMany({}); // (manual wipe — uncomment if not using --clear)
      console.log(`🧹 Cleared Institution collection (${deletedCount ?? 0} removed).`);
    }
  }

  let inserted = 0;
  let totalSkipped = 0;
  const sample: any[] = [];
  let batch: any[] = [];

  const flush = async () => {
    if (batch.length === 0) return;
    const toInsert = batch;
    batch = [];
    try {
      const res = await Institution.insertMany(toInsert, { ordered: false });
      inserted += res.length;
    } catch (err: any) {
      const ok = err?.result?.insertedCount ?? err?.insertedDocs?.length ?? 0;
      inserted += ok;
      console.warn(`   ⚠️  Batch partial: ${toInsert.length - ok} failed, ${ok} inserted.`);
    }
    console.log(`   ➕ Inserted ${inserted} banks…`);
  };

  for (const file of files) {
    console.log(`📄 Streaming ${path.basename(file)}…`);
    const { read, skipped } = await streamFile(file, limit, async (doc) => {
      if (dryRun) {
        inserted += 1;
        if (sample.length < 3) sample.push(doc);
        return;
      }
      batch.push(doc);
      if (batch.length >= BATCH_SIZE) await flush();
    });
    totalSkipped += skipped;
    console.log(`   Read ${read} row(s), skipped ${skipped} (no Bank Name).`);
  }

  if (dryRun) {
    console.log(`\n🔍 Dry run — ${inserted} valid record(s) mapped, ${totalSkipped} skipped.`);
    const noPin = sample.filter((d) => !d.pincode).length;
    console.log(`   Sample (first ${sample.length}):`);
    sample.forEach((d) => console.log('   •', JSON.stringify(d)));
    if (noPin) console.log(`   (note: ${noPin}/${sample.length} sampled rows had no extractable pincode)`);
    console.log('\n   No database changes made. Drop --dry-run to import.');
    process.exit(0);
  }

  await flush();
  console.log(`\n✅ Done. Inserted ${inserted} record(s) across ${files.length} file(s); skipped ${totalSkipped}.`);
  await (await connectDB()).disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
