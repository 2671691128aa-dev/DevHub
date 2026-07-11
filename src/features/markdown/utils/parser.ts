export function getWordCount(text: string): number {
  const chinese = (text.match(/[一-龥]/g) || []).length;
  const english = (text.replace(/[一-龥]/g, '').match(/\b\w+\b/g) || []).length;
  return chinese + english;
}

export function getReadingTime(wordCount: number): number {
  const wpm = 300;
  return Math.max(1, Math.ceil(wordCount / wpm));
}

export function getLineCount(text: string): number {
  return text.split('\n').length;
}

export function exportAsHtml(content: string, title = 'Document'): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
body { max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, system-ui, sans-serif; line-height: 1.7; color: #1a1a1a; }
pre { background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto; }
code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
</style>
</head>
<body>${content}</body>
</html>`;
}
