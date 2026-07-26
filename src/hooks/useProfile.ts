import { useUserStore } from '@/store/useUserStore';
import type { UserProfile } from '@/types/user';

/**
 * Convenience hook for user profile operations.
 */
export function useProfile() {
  const profile = useUserStore((s) => s.profile);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const resetProfile = useUserStore((s) => s.resetProfile);
  const isHydrated = useUserStore((s) => s.isHydrated);

  return {
    profile,
    isHydrated,
    updateProfile: (partial: Partial<UserProfile>) => updateProfile(partial),
    resetProfile,
    updateNickname: (nickname: string) => updateProfile({ nickname }),
    updateBio: (bio: string) => updateProfile({ bio }),
    updateAvatar: (avatar: string, avatarType: UserProfile['avatarType']) =>
      updateProfile({ avatar, avatarType }),
  };
}
