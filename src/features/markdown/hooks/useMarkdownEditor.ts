import { useState, useMemo, useCallback, useRef } from 'react';
import type { MarkdownViewMode } from '@/types/chat';
import { getWordCount, getReadingTime, getLineCount, exportAsHtml } from '../utils/parser';
import {
  DEFAULT_MARKDOWN_CONTENT,
  DEFAULT_MARKDOWN_VIEW_MODE,
  MARKDOWN_EXPORT_FILENAME,
} from '@/constants';

// Markdown content is ephemeral working data — NOT persisted.
// Only user preferences (view mode, export filename) would be candidates for persistence.

export function useMarkdownEditor() {
  const [content, setContent] = useState(DEFAULT_MARKDOWN_CONTENT);
  const [viewMode, setViewMode] = useState<MarkdownViewMode>(DEFAULT_MARKDOWN_VIEW_MODE);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
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

  const insertFormatting = useCallback(
    (prefix: string, suffix = '') => {
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
    },
    [content, handleContentChange],
  );

  const handleExportHtml = useCallback(() => {
    const html = exportAsHtml(content);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = MARKDOWN_EXPORT_FILENAME;
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
