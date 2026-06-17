// store/compareStore.ts — Zustand compare-items store
import { create } from 'zustand';
import type { CompareItem } from '@/types';

interface CompareStore {
  module: string;
  items: CompareItem[];
  addItem: (module: string, item: CompareItem) => void;
  removeItem: (id: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  module: '',
  items: [],
  addItem: (module, item) =>
    set((state) => {
      // Switching module resets the comparison set
      const base = state.module === module ? state.items : [];
      if (base.find((i) => i.id === item.id)) return { module, items: base };
      return { module, items: [...base.slice(-2), item] }; // max 3 items
    }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearCompare: () => set({ items: [], module: '' }),
}));
