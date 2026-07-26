import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/lib/storage';
import type { ToolHistoryEntry } from '@/types/user';
import { STORAGE_KEYS } from '@/constants';

const MAX_HISTORY_ENTRIES = 200;

interface HistoryState {
  entries: ToolHistoryEntry[];
  isHydrated: boolean;
  recordUsage: (toolId: string) => void;
  clearHistory: () => void;
  getRecentTools: (limit: number) => ToolHistoryEntry[];
  setHydrated: (hydrated: boolean) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      isHydrated: false,

      recordUsage: (toolId) => {
        set((state) => {
          const entry: ToolHistoryEntry = {
            toolId,
            timestamp: Date.now(),
          };
          const entries = [entry, ...state.entries].slice(0, MAX_HISTORY_ENTRIES);
          return { entries };
        });
      },

      clearHistory: () => set({ entries: [] }),

      getRecentTools: (limit) => {
        return get().entries.slice(0, limit);
      },

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: STORAGE_KEYS.HISTORY,
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: (state) => ({ entries: state.entries }),
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHydrated(true);
        };
      },
    },
  ),
);
