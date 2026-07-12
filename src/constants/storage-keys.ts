/**
 * Storage keys — single source of truth for localStorage and IndexedDB keys.
 * All persistence operations must use these constants.
 */
export const STORAGE_KEYS = {
  /** localStorage: theme preference */
  THEME: 'devhub-theme',
  /** IndexedDB (via Zustand persist): chat conversations + settings */
  CHAT: 'devhub-chat',
  /** IndexedDB: markdown editor content */
  MARKDOWN_CONTENT: 'devhub-markdown-content',
} as const;
