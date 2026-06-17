// store/leadFormStore.ts — controls the global "I am interested" lead modal.
import { create } from 'zustand';
import type { LeadModule } from '@/types';

interface LeadFormState {
  isOpen: boolean;
  module: LeadModule;
  product?: string;
  sourcePage: string;
  open: (ctx: { module: LeadModule; product?: string; sourcePage: string }) => void;
  close: () => void;
}

export const useLeadFormStore = create<LeadFormState>((set) => ({
  isOpen: false,
  module: 'GENERAL',
  product: undefined,
  sourcePage: '',
  open: ({ module, product, sourcePage }) =>
    set({ isOpen: true, module, product, sourcePage }),
  close: () => set({ isOpen: false }),
}));
