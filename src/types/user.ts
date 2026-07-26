import type { ToolCategory } from './tool';

/** User profile stored locally (no auth) */
export interface UserProfile {
  nickname: string;
  avatar: string; // emoji or data URL
  avatarType: 'emoji' | 'url' | 'initials';
  bio: string;
  createdAt: number;
  lastActiveAt: number;
}

/** Single record of a tool usage event */
export interface ToolHistoryEntry {
  toolId: string;
  timestamp: number;
  duration?: number; // session duration in ms
}

/** Aggregated usage statistics */
export interface UsageStats {
  totalUses: number;
  favoriteToolId: string | null;
  dailyUsage: Record<string, number>; // date-keyed counts (last 30 days)
  categoryUsage: Record<ToolCategory, number>;
  streak: number; // consecutive days of usage
}
