// One-off importer: adds the missing Maharashtra bank groups (Private, RRB,
// Small Finance + MSCS multi-state co-operative banks) to the Institution
// collection. Insert-only, deduped by IFSC against the existing data.
const fs = require('fs');
const p = require('path');

const DIR = 'co op private bank list maharshtra';
const env = fs.readFileSync('.env.local', 'utf8');
const uri = env.match(/MONGODB_URI=(.+)/)[1].trim().replace(/^"|"$/g, '');
const pin = (a) => {
  const m = String(a || '').match(/\b(\d{6})\b/);
  return m ? m[1] : '';
};
const now = new Date();

const rbiFiles = [
  'Banking Outlet & ATM Locator Banking Export Data Excel_1782402926776.csv',
  'Banking Outlet & ATM Locator  Banking Export Data Excel_1782402786213.csv',
  'small bank name Banking Export Data Excel_1782403056930.csv',
];

const recs = [];
for (const f of rbiFiles) {
  const lines = fs.readFileSync(p.join(DIR, f), 'utf8').split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    const c = lines[i].split('|');
    if (c.length < 20) continue;
    if ((c[2] || '').trim().toUpperCase() !== 'MAHARASHTRA') continue;
    const bg = (c[6] || '').trim();
    if (bg.toUpperCase() === 'PUBLIC SECTOR BANKS') continue;
    if (!(c[7] || '').trim()) continue;
    recs.push({
      name: (c[7] || '').trim(),
      branch: (c[8] || '').trim(),
      address: (c[15] || '').trim(),
      city: (c[5] || '').trim(),
      district: (c[3] || '').trim(),
      state: 'MAHARASHTRA',
      pincode: pin(c[15]),
      isRbiAuthorized: true,
      bankGroup: bg,
      ifsc: (c[19] || '').trim().toUpperCase(),
      createdAt: now,
      updatedAt: now,
    });
  }
}

// MSCS multi-state co-operative banks (Society Name + District).
const cell = (x) => x.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
const mscs = fs.readdirSync(DIR).filter((f) => /MSCS|Central Registrar/i.test(f));
for (const f of mscs) {
  const lines = fs.readFileSync(p.join(DIR, f), 'utf8').split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    const m = lines[i].match(/"((?:[^"]|"")*)"/g);
    if (!m || m.length < 5) continue;
    const society = cell(m[1]);
    const addr = cell(m[2]);
    const dist = cell(m[4]);
    if (!society || !dist) continue;
    recs.push({
      name: society,
      branch: '',
      address: addr,
      city: dist.toUpperCase(),
      district: dist.toUpperCase(),
      state: 'MAHARASHTRA',
      pincode: pin(addr),
      isRbiAuthorized: true,
      bankGroup: 'MULTI STATE CO-OPERATIVE BANK',
      ifsc: '',
      createdAt: now,
      updatedAt: now,
    });
  }
}

const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 });
  const I = mongoose.connection.collection('institutions');
  const existIfsc = new Set(
    (await I.distinct('ifsc', { ifsc: { $nin: ['', null] } })).map((x) => String(x).toUpperCase())
  );
  const seen = new Set();
  const toInsert = [];
  for (const r of recs) {
    const key = r.ifsc ? 'I:' + r.ifsc : 'C:' + [r.name, r.branch, r.city, r.district, r.address].join('|').toUpperCase();
    if (r.ifsc && existIfsc.has(r.ifsc)) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    toInsert.push(r);
  }
  console.log('inserting', toInsert.length, 'records...');
  let done = 0;
  for (let i = 0; i < toInsert.length; i += 2000) {
    const b = toInsert.slice(i, i + 2000);
    await I.insertMany(b, { ordered: false });
    done += b.length;
  }
  console.log('inserted:', done);
  const byG = await I.aggregate([{ $group: { _id: '$bankGroup', n: { $sum: 1 } } }, { $sort: { n: -1 } }]).toArray();
  console.log('\n=== DB bank groups now ===');
  byG.forEach((g) => console.log(String(g.n).padStart(7), g._id));
  await mongoose.disconnect();
})();
