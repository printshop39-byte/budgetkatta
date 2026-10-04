import { describe, it, expect } from 'vitest';
import { getDocuments, homeProductOptions, homeProfileOptions } from './documentChecklists';

describe('home document scenarios', () => {
  it('every scenario x profile yields a non-empty list with explanations', () => {
    for (const p of homeProductOptions) {
      for (const f of homeProfileOptions) {
        const docs = getDocuments(p.value, f.value);
        expect(docs.length).toBeGreaterThan(3);
        for (const d of docs) expect(d.explanation.mr.length).toBeGreaterThan(0);
      }
    }
  });
  it('transfer needs a foreclosure letter; build needs a sanctioned plan', () => {
    expect(getDocuments('LOAN_TRANSFER', 'SALARIED').some((d) => d.name.en.includes('Foreclosure'))).toBe(true);
    expect(getDocuments('HOME_BUILD', 'BUSINESS').some((d) => d.name.en.includes('Sanctioned building plan'))).toBe(true);
  });
  it('co-applicant gets co-applicant KYC, not the primary KYC set', () => {
    const names = getDocuments('HOME_BUY', 'CO_APPLICANT').map((d) => d.name.en);
    expect(names.some((n) => n.startsWith('Co-applicant KYC'))).toBe(true);
    expect(names).not.toContain('Aadhaar Card');
  });
});
