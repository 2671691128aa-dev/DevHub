/**
 * Storage layer — uses IndexedDB (via idb-keyval) for large data,
 * localStorage for small config data.
 *
 * Why not just localStorage?
 * - localStorage has a ~5MB limit
 * - Chat conversations with long AI responses can easily exceed 5MB
 * - IndexedDB has no practical limit (typically 50MB+)
 */
import { get, set, del } from 'idb-keyval';
import type { StateStorage } from 'zustand/middleware';

// --- IndexedDB (for large data: conversations, markdown content) ---

export const idbStorage = {
  async get<T>(key: string, fallback: T): Promise<T> {
    try {
      const value = await get(key);
      return value ?? fallback;
    } catch {
      return fallback;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await set(key, value);
    } catch (e) {
      console.warn(`IndexedDB write failed for key "${key}":`, e);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await del(key);
    } catch {
      // ignore
    }
  },
};

// --- localStorage (for small config: theme, settings) ---

export const localStore = {
  get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`localStorage write failed for key "${key}"`);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },
};

// --- Zustand persist adapter (IndexedDB-backed) ---
// Shared across all Zustand stores that use persist middleware with IndexedDB.

export const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};
