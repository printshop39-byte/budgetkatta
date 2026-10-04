import { describe, it, expect } from 'vitest';
import { EMPTY_FILTERS, filterProjects, PROJECTS, type Project } from './projects';

const base: Project = {
  id: 'a',
  name: 'Test Heights',
  builder: 'Test Builder',
  city: 'Pune',
  area: 'Hinjewadi',
  homeTypes: ['1 BHK', '2 BHK'],
  sizes: '420-560',
  priceMin: 4_500_000,
  priceMax: 7_000_000,
  reraNumber: 'P00000000000',
  status: 'ready',
  loanBanks: ['SBI'],
  sourceUrl: 'https://example.invalid',
  verifiedOn: '2026-01-01',
};
const other: Project = { ...base, id: 'b', name: 'Other', city: 'Nashik', status: 'under-construction', loanBanks: [], priceMin: 9_000_000 };

describe('filterProjects', () => {
  const list = [base, other];
  it('returns everything with empty filters', () => expect(filterProjects(list, EMPTY_FILTERS)).toHaveLength(2));
  it('filters by city, status, type, price and loan', () => {
    expect(filterProjects(list, { ...EMPTY_FILTERS, city: 'Pune' })).toEqual([base]);
    expect(filterProjects(list, { ...EMPTY_FILTERS, status: 'under-construction' })).toEqual([other]);
    expect(filterProjects(list, { ...EMPTY_FILTERS, homeType: '2 BHK' })).toHaveLength(2);
    expect(filterProjects(list, { ...EMPTY_FILTERS, maxPrice: 5_000_000 })).toEqual([base]);
    expect(filterProjects(list, { ...EMPTY_FILTERS, loanOnly: true })).toEqual([base]);
  });
  it('matches the text query across name/builder/area', () => {
    expect(filterProjects(list, { ...EMPTY_FILTERS, query: 'hinjewadi' })).toHaveLength(2);
    expect(filterProjects(list, { ...EMPTY_FILTERS, query: 'zzz' })).toHaveLength(0);
  });
});

describe('PROJECTS data integrity', () => {
  it('every shipped entry has RERA number, source and verification date', () => {
    for (const p of PROJECTS) {
      expect(p.reraNumber.trim()).not.toBe('');
      expect(p.sourceUrl).toMatch(/^https:\/\//);
      expect(p.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
