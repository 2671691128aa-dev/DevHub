/**
 * Application route paths — single source of truth.
 * All route references in App.tsx, Navbar, breadcrumbs, tool data, and links
 * must use these constants instead of hard-coded strings.
 */

export const ROUTES = {
  HOME: '/',
  TOOLS: '/tools',
  ABOUT: '/about',
  // Tool pages
  TOOLS_JSON: '/tools/json',
  TOOLS_REGEX: '/tools/regex',
  TOOLS_AI_CHAT: '/tools/ai-chat',
  TOOLS_MARKDOWN: '/tools/markdown',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
