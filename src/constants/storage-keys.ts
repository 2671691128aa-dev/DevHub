/**
 * Storage keys — single source of truth for localStorage and IndexedDB keys.
 * All persistence operations must use these constants.
 */
export const STORAGE_KEYS = {
  /** localStorage: theme preference */
  THEME: 'devhub-theme',
  /** IndexedDB (via Zustand persist): chat conversations + settings */
  CHAT: 'devhub-chat',
  /** localStorage: favorite tool IDs */
  FAVORITES: 'devhub-favorites',
  /** IndexedDB (via Zustand persist): tool usage history */
  HISTORY: 'devhub-history',
  /** IndexedDB (via Zustand persist): user profile */
  USER: 'devhub-user',
} as const;
