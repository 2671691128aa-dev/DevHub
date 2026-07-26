/**
 * Default values — chat settings, markdown content, and application defaults.
 */

import type { ChatSettings } from '@/types/chat';
import type { MarkdownViewMode } from '@/types/chat';

/** Default AI chat settings (used when no settings are saved) */
export const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  provider: 'anthropic',
  providerName: 'Anthropic',
  apiKey: '',
  baseUrl: '',
  model: 'claude-sonnet-4-20250514',
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: '你是一个专业的开发者助手，擅长编程、调试和技术问题解答。',
};

/** Default conversation title */
export const DEFAULT_CONVERSATION_TITLE = '新对话';

/** Default theme */
export const DEFAULT_THEME: 'light' | 'dark' = 'dark';

/** Default markdown editor content */
export const DEFAULT_MARKDOWN_CONTENT = `# 欢迎使用 Markdown 编辑器

开始编写你的文档...

## 功能

- 实时预览
- 工具栏快捷操作
- 导出 HTML
- 自动保存到 IndexedDB（无容量限制）
`;

/** Default markdown view mode */
export const DEFAULT_MARKDOWN_VIEW_MODE: MarkdownViewMode = 'split';

/** Markdown export default filename */
export const MARKDOWN_EXPORT_FILENAME = 'document.html';

/** Markdown export default HTML title */
export const MARKDOWN_EXPORT_TITLE = 'Document';

/** Markdown export HTML lang attribute */
export const MARKDOWN_EXPORT_LANG = 'zh-CN';

/** Words per minute for reading time calculation */
export const READING_WPM = 300;
