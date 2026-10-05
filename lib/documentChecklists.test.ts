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

describe('generic HOME_LOAN checklist by applicant', () => {
  it('co-applicant gets co-applicant KYC + income proof, not the primary KYC', () => {
    const names = getDocuments('HOME_LOAN', 'CO_APPLICANT').map((d) => d.name.en);
    expect(names.some((n) => n.startsWith('Co-applicant KYC'))).toBe(true);
    expect(names.some((n) => n.startsWith('Co-applicant income proof'))).toBe(true);
    expect(names).not.toContain('Aadhaar Card');
    expect(names).toContain('Property Documents');
  });
  it('salaried and business keep the standard KYC and their own income proof', () => {
    const sal = getDocuments('HOME_LOAN', 'SALARIED').map((d) => d.name.en);
    const biz = getDocuments('HOME_LOAN', 'BUSINESS').map((d) => d.name.en);
    expect(sal).toContain('Aadhaar Card');
    expect(sal.some((n) => n.startsWith('Salary Slip'))).toBe(true);
    expect(biz.some((n) => n.startsWith('ITR'))).toBe(true);
  });
});
