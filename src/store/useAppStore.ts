import { create } from 'zustand';

interface AppState {
  isCommandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isCommandPaletteOpen: false,
  openCommandPalette: () => set({ isCommandPaletteOpen: true }),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
  toggleCommandPalette: () =>
    set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
}));
