import { describe, it, expect } from 'vitest';
import { ANALYTICS_EVENTS } from './analytics';

describe('analytics events', () => {
  it('includes the privacy-safe interaction events', () => {
    expect(ANALYTICS_EVENTS.language_toggle).toBe('language_toggle');
    expect(ANALYTICS_EVENTS.official_source_click).toBe('official_source_click');
    expect(ANALYTICS_EVENTS.calculator_tab_viewed).toBe('calculator_tab_viewed');
  });
  it('event names are snake_case and keys match values', () => {
    for (const [k, v] of Object.entries(ANALYTICS_EVENTS)) {
      expect(k).toBe(v);
      expect(v).toMatch(/^[a-z]+(_[a-z]+)*$/);
    }
  });
});
