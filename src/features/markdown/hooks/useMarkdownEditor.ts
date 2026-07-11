import { useState, useMemo, useCallback, useRef } from 'react';
import { getWordCount, getReadingTime, getLineCount, exportAsHtml } from '../utils/parser';

type ViewMode = 'split' | 'editor' | 'preview';

export function useMarkdownEditor() {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('devhub-markdown-content');
    return saved || '# 欢迎使用 Markdown 编辑器\n\n开始编写你的文档...\n\n## 功能\n\n- 实时预览\n- 工具栏快捷操作\n- 导出 HTML\n- 自动保存\n';
  });
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
    localStorage.setItem('devhub-markdown-content', value);
  }, []);

  const stats = useMemo(() => {
    const words = getWordCount(content);
    return {
      words,
      characters: content.length,
      lines: getLineCount(content),
      readingTime: getReadingTime(words),
    };
  }, [content]);

  const insertFormatting = useCallback((prefix: string, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const before = content.slice(0, start);
    const after = content.slice(end);

    const newContent = `${before}${prefix}${selected}${suffix}${after}`;
    handleContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + prefix.length + selected.length + suffix.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  }, [content, handleContentChange]);

  const handleExportHtml = useCallback(() => {
    const html = exportAsHtml(content);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  const handleCopyHtml = useCallback(async () => {
    const html = exportAsHtml(content);
    await navigator.clipboard.writeText(html);
  }, [content]);

  return {
    content,
    handleContentChange,
    viewMode,
    setViewMode,
    textareaRef,
    stats,
    insertFormatting,
    handleExportHtml,
    handleCopyHtml,
  };
}
