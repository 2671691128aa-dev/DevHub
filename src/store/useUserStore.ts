import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/lib/storage';
import type { UserProfile } from '@/types/user';
import { STORAGE_KEYS } from '@/constants';

const DEFAULT_PROFILE: UserProfile = {
  nickname: '开发者',
  avatar: '👨‍💻',
  avatarType: 'emoji',
  bio: '',
  createdAt: Date.now(),
  lastActiveAt: Date.now(),
};

interface UserState {
  profile: UserProfile;
  isHydrated: boolean;
  updateProfile: (partial: Partial<UserProfile>) => void;
  setHydrated: (hydrated: boolean) => void;
  resetProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      isHydrated: false,

      updateProfile: (partial) => {
        set((state) => ({
          profile: {
            ...state.profile,
            ...partial,
            lastActiveAt: Date.now(),
          },
        }));
      },

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      resetProfile: () => set({ profile: DEFAULT_PROFILE }),
    }),
    {
      name: STORAGE_KEYS.USER,
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: (state) => ({ profile: state.profile }),
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHydrated(true);
        };
      },
    },
  ),
);
