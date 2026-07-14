// store/healthCheckStore.ts — multi-step Money Health Check answers.
// Persisted to sessionStorage (the user's own tab, never transmitted) so
// answers survive step navigation and accidental refreshes but are cleared when
// the tab closes — no financial PII left at rest on the device.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { HealthProfileInput } from '@/lib/healthScore';

interface HealthCheckStore {
  answers: HealthProfileInput;
  /** Furthest step the user has reached (for progress + resume). */
  step: number;
  set: (patch: Partial<HealthProfileInput>) => void;
  goTo: (step: number) => void;
  reset: () => void;
}

const EMPTY: HealthProfileInput = {};

export const useHealthCheckStore = create<HealthCheckStore>()(
  persist(
    (set) => ({
      answers: EMPTY,
      step: 0,
      set: (patch) => set((s) => ({ answers: { ...s.answers, ...patch } })),
      goTo: (step) => set({ step }),
      reset: () => set({ answers: EMPTY, step: 0 }),
    }),
    {
      name: 'bk-health-check',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.sessionStorage : (undefined as unknown as Storage)
      ),
    }
  )
);
