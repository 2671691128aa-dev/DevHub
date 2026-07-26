import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  READING_WPM,
  MARKDOWN_EXPORT_TITLE,
  MARKDOWN_EXPORT_LANG,
  EXPORT_THEME,
} from '@/constants';

// Hoisted to module scope — avoids creating a new array on every call
const REMARK_PLUGINS = [remarkGfm];

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
  const renderedHtml = renderToStaticMarkup(
    createElement(ReactMarkdown, { remarkPlugins: REMARK_PLUGINS }, content),
  );
  return `<!DOCTYPE html>
<html lang="${MARKDOWN_EXPORT_LANG}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
body { max-width: ${t.maxWidth}; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, system-ui, sans-serif; line-height: 1.7; color: ${t.bodyText}; }
h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
p { margin: 1em 0; }
pre { background: ${t.codeBackground}; padding: 16px; border-radius: 8px; overflow-x: auto; }
code { background: ${t.codeBackground}; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
pre code { background: none; padding: 0; }
blockquote { border-left: 4px solid ${t.blockquoteBorder}; margin: 0; padding-left: 16px; color: ${t.blockquoteText}; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid ${t.blockquoteBorder}; padding: 8px 12px; text-align: left; }
th { background: ${t.codeBackground}; }
a { color: #0969da; }
img { max-width: 100%; }
hr { border: none; border-top: 1px solid ${t.blockquoteBorder}; margin: 2em 0; }
ul, ol { padding-left: 2em; }
li { margin: 0.25em 0; }
</style>
</head>
<body>${renderedHtml}</body>
</html>`;
}
