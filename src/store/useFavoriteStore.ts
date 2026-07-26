import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';

interface FavoriteState {
  favoriteIds: string[];
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (toolId) => {
        set((state) => {
          const exists = state.favoriteIds.includes(toolId);
          return {
            favoriteIds: exists
              ? state.favoriteIds.filter((id) => id !== toolId)
              : [...state.favoriteIds, toolId],
          };
        });
      },

      isFavorite: (toolId) => {
        return get().favoriteIds.includes(toolId);
      },

      clearFavorites: () => set({ favoriteIds: [] }),
    }),
    {
      name: STORAGE_KEYS.FAVORITES,
    },
  ),
);
