import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS, DEFAULT_THEME } from '@/constants';

type Theme = 'light' | 'dark';

interface AppState {
  isCommandPaletteOpen: boolean;
  theme: Theme;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function applyTheme(theme: Theme) {
  const el = document.documentElement;
  if (theme === 'dark') {
    el.classList.add('dark');
  } else {
    el.classList.remove('dark');
  }
}

// Apply saved theme on module load (before React hydrates)
const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
applyTheme(savedTheme ?? DEFAULT_THEME);

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isCommandPaletteOpen: false,
      theme: savedTheme ?? DEFAULT_THEME,
      openCommandPalette: () => set({ isCommandPaletteOpen: true }),
      closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
      toggleCommandPalette: () =>
        set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'dark' ? 'light' : 'dark';
          applyTheme(next);
          return { theme: next };
        }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
