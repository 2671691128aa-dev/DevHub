/**
 * API configuration — endpoints, version headers, and default URLs.
 */

/** Anthropic Messages API endpoint */
export const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

/** Anthropic API version header value */
export const ANTHROPIC_API_VERSION = '2023-06-01';

/** OpenAI-compatible chat completions path (appended to base URL) */
export const OPENAI_CHAT_PATH = '/v1/chat/completions';

/** Default fallback base URL for OpenAI-compatible providers */
export const DEFAULT_OPENAI_BASE_URL = 'https://api.deepseek.com';

/** External links */
export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com',
  DEV_EMAIL: 'mailto:dev@example.com',
} as const;
