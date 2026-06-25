// Import Urban Co-operative Banks (HO-level) for Maharashtra from the RBI lists.
// District/city are derived from the HO pincode using the existing Institution
// data (which carries pincode -> district/city). Non-MH pincodes fall out
// automatically (no match). Run with `--commit` to actually insert.
const fs = require('fs');
const p = require('path');
const DIR = 'co op private bank list maharshtra';
const COMMIT = process.argv.includes('--commit');
const env = fs.readFileSync('.env.local', 'utf8');
const uri = env.match(/MONGODB_URI=(.+)/)[1].trim().replace(/^"|"$/g, '');
const norm = (s) => String(s || '').trim().toUpperCase().replace(/\s+/g, ' ');
const now = new Date();

// Parse a CSV line into fields (handles simple quoted commas).
function parseCsv(line) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (q && line[i + 1] === '"') { cur += '"'; i++; } else q = !q;
    } else if (c === ',' && !q) { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur);
  return out.map((x) => x.trim());
}

// --- collect candidate UCBs: {name, pincode} ---
const cands = [];
// Non-scheduled CSV: Sr.No, Bank Name, RO Name, HO Address, Pincode
const ns = fs.readFileSync(p.join(DIR, 'nonschedulecoop.csv'), 'utf8').split(/\r?\n/);
for (let i = 1; i < ns.length; i++) {
  if (!ns[i].trim()) continue;
  const f = parseCsv(ns[i]);
  const name = (f[1] || '').trim();
  const pin = (f[4] || '').replace(/\D/g, '').slice(0, 6);
  if (name && pin.length === 6) cands.push({ name, pincode: pin });
}
// Scheduled (layout text): rows carry the HO address + a 6-digit pincode column.
if (fs.existsSync(p.join(DIR, 'sched.txt'))) {
  const lines = fs.readFileSync(p.join(DIR, 'sched.txt'), 'utf8').split(/\r?\n/);
  let pendingPin = '';
  for (const ln of lines) {
    const pinOnly = ln.trim().match(/^(\d{6})$/);
    if (pinOnly) { pendingPin = pinOnly[1]; continue; }
    const m = ln.match(/^\s*\d+\s+(.+?)\s{2,}([A-Z][A-Z .]+?)\s{2,}(.+)$/);
    if (m) {
      const name = m[1].replace(/\*+$/, '').trim();
      const pin = (ln.match(/\b(\d{6})\b/) || [])[1] || pendingPin;
      if (name && pin) cands.push({ name, pincode: pin });
      pendingPin = '';
    }
  }
}

const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
  const I = mongoose.connection.collection('institutions');
  // pincode -> {district, city} (most common in existing data)
  const rows = await I.aggregate([
    { $match: { pincode: { $nin: ['', null] }, district: { $nin: ['', null] } } },
    { $group: { _id: { pin: '$pincode', d: '$district', c: '$city' }, n: { $sum: 1 } } },
  ], { allowDiskUse: true }).toArray();
  const pinMap = {};
  for (const r of rows) {
    const pin = r._id.pin;
    if (!pinMap[pin] || r.n > pinMap[pin].n) pinMap[pin] = { district: r._id.d, city: r._id.c, n: r.n };
  }
  // existing coop names (to skip dupes)
  const existCoop = new Set(
    (await I.find({ bankGroup: /co.?op/i }).project({ name: 1 }).toArray()).map((x) => norm(x.name))
  );

  const recs = [];
  const seen = new Set();
  let noPin = 0, dup = 0;
  const byDist = {};
  for (const c of cands) {
    const loc = pinMap[c.pincode];
    if (!loc) { noPin++; continue; }
    const key = norm(c.name) + '|' + loc.district;
    if (existCoop.has(norm(c.name)) || seen.has(key)) { dup++; continue; }
    seen.add(key);
    byDist[loc.district] = (byDist[loc.district] || 0) + 1;
    recs.push({
      name: c.name, branch: '', address: '', city: loc.city, district: loc.district,
      state: 'MAHARASHTRA', pincode: c.pincode, isRbiAuthorized: true,
      bankGroup: 'URBAN CO-OPERATIVE BANK', ifsc: '', createdAt: now, updatedAt: now,
    });
  }
  console.log('candidates:', cands.length, ' -> MH UCBs to add:', recs.length,
    ' (skipped non-MH/no-pin:', noPin, ', dup:', dup, ')');
  console.log('top districts:', Object.entries(byDist).sort((a, b) => b[1] - a[1]).slice(0, 12)
    .map(([d, n]) => `${d}:${n}`).join('  '));
  console.log('Kolhapur sample:', recs.filter((r) => r.district === 'KOLHAPUR').slice(0, 6).map((r) => r.name).join(' | '));

  if (COMMIT) {
    for (let i = 0; i < recs.length; i += 1000) await I.insertMany(recs.slice(i, i + 1000), { ordered: false });
    console.log('INSERTED', recs.length, 'UCB records.');
  } else {
    console.log('\n(dry run — pass --commit to insert)');
  }
  await mongoose.disconnect();
})();
