// store/botStore.ts — lets any component (e.g. GuidanceCTA) open the chat bot.
import { create } from 'zustand';

interface BotStore {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}

export const useBotStore = create<BotStore>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));
