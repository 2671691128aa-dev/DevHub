import { useFavoriteStore } from '@/store/useFavoriteStore';

/**
 * Convenience hook for favorite operations.
 * Provides reactive state + stable callbacks.
 */
export function useFavorite(toolId: string) {
  const favoriteIds = useFavoriteStore((s) => s.favoriteIds);
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite);
  const isFavorite = favoriteIds.includes(toolId);

  return {
    isFavorite,
    toggle: () => toggleFavorite(toolId),
    add: () => {
      if (!isFavorite) toggleFavorite(toolId);
    },
    remove: () => {
      if (isFavorite) toggleFavorite(toolId);
    },
  };
}
