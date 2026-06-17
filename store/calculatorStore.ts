// store/calculatorStore.ts — shared active calculator tab so BentoGrid and
// EducationHub can deep-link into CalculatorsHub while page.tsx stays a server
// component.
import { create } from 'zustand';

export type CalculatorType = 'sip' | 'fd' | 'emi' | 'budget' | 'insurance' | 'goal';

interface CalculatorStore {
  activeTab: CalculatorType;
  setActiveTab: (tab: CalculatorType) => void;
}

export const useCalculatorStore = create<CalculatorStore>((set) => ({
  activeTab: 'sip',
  setActiveTab: (activeTab) => set({ activeTab }),
}));
