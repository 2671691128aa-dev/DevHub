import { READING_WPM, MARKDOWN_EXPORT_TITLE, MARKDOWN_EXPORT_LANG, EXPORT_THEME } from '@/constants';

export function getWordCount(text: string): number {
  const chinese = (text.match(/[一-龥]/g) || []).length;
  const english = (text.replace(/[一-龥]/g, '').match(/\b\w+\b/g) || []).length;
  return chinese + english;
}

export function getReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / READING_WPM));
}

export function getLineCount(text: string): number {
  return text.split('\n').length;
}

export function exportAsHtml(content: string, title = MARKDOWN_EXPORT_TITLE): string {
  const t = EXPORT_THEME;
  return `<!DOCTYPE html>
<html lang="${MARKDOWN_EXPORT_LANG}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
body { max-width: ${t.maxWidth}; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, system-ui, sans-serif; line-height: 1.7; color: ${t.bodyText}; }
pre { background: ${t.codeBackground}; padding: 16px; border-radius: 8px; overflow-x: auto; }
code { background: ${t.codeBackground}; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
blockquote { border-left: 4px solid ${t.blockquoteBorder}; margin: 0; padding-left: 16px; color: ${t.blockquoteText}; }
</style>
</head>
<body>${content}</body>
</html>`;
}
