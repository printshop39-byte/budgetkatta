// Behaviour tests for the readiness wizard's answer/step store. The wizard
// renders `STEPS[step]` keyed by the step id, so the store's `step` is the single
// source of truth for which step is on screen. These tests pin the progression
// primitives the wizard relies on — advance, go back, reset and preserve answers
// — proving they work synchronously, independent of any animation,
// requestAnimationFrame or render timing.
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import type { useHealthCheckStore as StoreHook } from './healthCheckStore';

// Node has no DOM, and the store's persist middleware captures
// window.sessionStorage once, at store-creation time. Define an in-memory
// Storage BEFORE importing the store (below, dynamically) so it binds to a real
// backing store instead of crashing on `undefined`.
const mem = new Map<string, string>();
(globalThis as { window?: unknown }).window = {
  sessionStorage: {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => {
      mem.set(k, v);
    },
    removeItem: (k: string) => {
      mem.delete(k);
    },
  },
};

let useHealthCheckStore: typeof StoreHook;
beforeAll(async () => {
  ({ useHealthCheckStore } = await import('./healthCheckStore'));
});

const s = () => useHealthCheckStore.getState();

describe('healthCheckStore (wizard progression source of truth)', () => {
  beforeEach(() => {
    s().reset();
  });

  it('starts at step 0 with no answers', () => {
    expect(s().step).toBe(0);
    expect(s().answers).toEqual({});
  });

  it('goTo advances the step immediately (no animation gate)', () => {
    s().goTo(1);
    expect(s().step).toBe(1);
    s().goTo(2);
    expect(s().step).toBe(2);
  });

  it('goTo returns to an earlier step (Back)', () => {
    s().goTo(3);
    s().goTo(2);
    expect(s().step).toBe(2);
  });

  it('reset returns to the first step and clears answers', () => {
    s().set({ monthlyIncome: 40000 });
    s().goTo(4);
    s().reset();
    expect(s().step).toBe(0);
    expect(s().answers).toEqual({});
  });

  it('set merges answers, preserving earlier ones', () => {
    s().set({ monthlyIncome: 40000 });
    s().set({ monthlyEssential: 15000 });
    expect(s().answers.monthlyIncome).toBe(40000);
    expect(s().answers.monthlyEssential).toBe(15000);
  });

  it('step value reflects exactly what was last set (rendered content follows state)', () => {
    s().goTo(5);
    expect(useHealthCheckStore.getState().step).toBe(5);
  });
});
