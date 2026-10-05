import { describe, it, expect } from 'vitest';
import { PROPERTY_DOCS, PROPERTY_TYPES } from './propertyDocs';

describe('PROPERTY_DOCS', () => {
  it('every property type has documents with bilingual title and reason', () => {
    for (const t of PROPERTY_TYPES) {
      const docs = PROPERTY_DOCS[t.id];
      expect(docs.length).toBeGreaterThan(3);
      for (const d of docs) {
        expect(d.title.mr && d.title.en && d.why.mr && d.why.en).toBeTruthy();
      }
    }
  });
  it('type-specific anchors are present', () => {
    const has = (id: keyof typeof PROPERTY_DOCS, s: string) => PROPERTY_DOCS[id].some((d) => d.title.en.includes(s));
    expect(has('new', 'MahaRERA')).toBe(true);
    expect(has('new', 'CC')).toBe(true);
    expect(has('ready', 'OC')).toBe(true);
    expect(has('resale', 'chain')).toBe(false); // case-sensitive guard: title uses "Chain"
    expect(has('resale', 'Chain')).toBe(true);
    expect(has('plot', 'NA')).toBe(true);
    expect(has('plot', '7/12')).toBe(true);
  });
});
