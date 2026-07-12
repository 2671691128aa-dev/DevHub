import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
const savedTheme = localStorage.getItem('devhub-theme') as Theme | null;
applyTheme(savedTheme ?? 'dark');

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isCommandPaletteOpen: false,
      theme: savedTheme ?? 'dark',
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
      name: 'devhub-theme',
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
