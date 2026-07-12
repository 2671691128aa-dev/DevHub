import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import type { MarkdownViewMode } from '@/types/chat';
import { getWordCount, getReadingTime, getLineCount, exportAsHtml } from '../utils/parser';
import { STORAGE_KEYS, DEFAULT_MARKDOWN_CONTENT, DEFAULT_MARKDOWN_VIEW_MODE, MARKDOWN_EXPORT_FILENAME } from '@/constants';

export function useMarkdownEditor() {
  const [content, setContent] = useState(DEFAULT_MARKDOWN_CONTENT);
  const [viewMode, setViewMode] = useState<MarkdownViewMode>(DEFAULT_MARKDOWN_VIEW_MODE);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved content from IndexedDB on mount
  useEffect(() => {
    get<string>(STORAGE_KEYS.MARKDOWN_CONTENT).then((saved) => {
      if (saved) setContent(saved);
    });
  }, []);

  // Debounced save to IndexedDB
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const handleContentChange = useCallback((value: string) => {
    setContent(value);
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      set(STORAGE_KEYS.MARKDOWN_CONTENT, value);
    }, 500);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(saveTimerRef.current);
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
