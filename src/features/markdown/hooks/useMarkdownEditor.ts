import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { getWordCount, getReadingTime, getLineCount, exportAsHtml } from '../utils/parser';

type ViewMode = 'split' | 'editor' | 'preview';

const DEFAULT_CONTENT = '# 欢迎使用 Markdown 编辑器\n\n开始编写你的文档...\n\n## 功能\n\n- 实时预览\n- 工具栏快捷操作\n- 导出 HTML\n- 自动保存到 IndexedDB（无容量限制）\n';

const STORAGE_KEY = 'devhub-markdown-content';

export function useMarkdownEditor() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved content from IndexedDB on mount
  useEffect(() => {
    get<string>(STORAGE_KEY).then((saved) => {
      if (saved) setContent(saved);
    });
  }, []);

  // Debounced save to IndexedDB
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const handleContentChange = useCallback((value: string) => {
    setContent(value);
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      set(STORAGE_KEY, value);
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
