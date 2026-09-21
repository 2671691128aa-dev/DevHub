/**
 * API configuration — endpoints, version headers, and default URLs.
 *
 * Provider endpoint URLs and version headers live server-side in `api/chat.ts`;
 * frontend only talks to the `/api/chat` proxy.
 */

/** OpenAI-compatible chat completions path (appended to base URL) */
export const OPENAI_CHAT_PATH = '/v1/chat/completions';

/** Default fallback base URL for OpenAI-compatible providers */
export const DEFAULT_OPENAI_BASE_URL = 'https://api.deepseek.com';

/** External links */
export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com',
  DEV_EMAIL: 'mailto:dev@example.com',
} as const;
