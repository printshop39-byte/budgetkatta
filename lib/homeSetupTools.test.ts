import { describe, it, expect } from 'vitest';
import { CONTRACTOR_CHECK, MATERIALS, PAYMENT_STAGES, SNAGGING } from './homeSetupTools';

describe('home setup tools data', () => {
  it('checklist ids are unique and every item is bilingual', () => {
    for (const list of [SNAGGING, CONTRACTOR_CHECK]) {
      expect(new Set(list.map((i) => i.id)).size).toBe(list.length);
      for (const i of list) expect(i.text.mr && i.text.en).toBeTruthy();
    }
  });
  it('payment stages add up to 100%', () => {
    expect(PAYMENT_STAGES.reduce((t, s) => t + s.pct, 0)).toBe(100);
  });
  it('material rows are complete and carry no prices', () => {
    for (const m of MATERIALS) {
      expect(m.area.mr && m.ask.mr && m.why.mr && m.caution.mr).toBeTruthy();
      expect(JSON.stringify(m)).not.toMatch(/₹/);
    }
  });
});
