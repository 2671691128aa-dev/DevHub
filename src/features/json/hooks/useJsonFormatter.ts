import { useState, useMemo, useCallback } from 'react';
import { validateJson } from '../utils/validator';
import { formatJson, minifyJson, buildTree, countKeys, getDepth, formatSize } from '../utils/formatter';

type ViewMode = 'code' | 'tree' | 'split';

interface JsonStats {
  lines: number;
  size: string;
  depth: number;
  keys: number;
}

export function useJsonFormatter() {
  const [input, setInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [indent, setIndent] = useState(2);

  const validation = useMemo(() => validateJson(input), [input]);

  const output = useMemo(() => {
    if (!input.trim() || !validation.valid) return '';
    return formatJson(input, indent);
  }, [input, indent, validation.valid]);

  const tree = useMemo(() => {
    if (!input.trim() || !validation.valid) return null;
    try {
      return buildTree(JSON.parse(input));
    } catch {
      return null;
    }
  }, [input, validation.valid]);

  const stats: JsonStats = useMemo(() => {
    if (!input.trim()) return { lines: 0, size: '0 B', depth: 0, keys: 0 };
    try {
      const parsed = JSON.parse(input);
      const formatted = formatJson(input, indent);
      return {
        lines: formatted.split('\n').length,
        size: formatSize(new Blob([input]).size),
        depth: getDepth(parsed),
        keys: countKeys(parsed),
      };
    } catch {
      return { lines: input.split('\n').length, size: formatSize(new Blob([input]).size), depth: 0, keys: 0 };
    }
  }, [input, indent]);

  const handleFormat = useCallback(() => {
    if (validation.valid && input.trim()) {
      setInput(formatJson(input, indent));
    }
  }, [input, indent, validation.valid]);

  const handleMinify = useCallback(() => {
    if (validation.valid && input.trim()) {
      setInput(minifyJson(input));
    }
  }, [input, validation.valid]);

  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  const handleCopy = useCallback(async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  }, [output]);

  return {
    input,
    setInput,
    output,
    validation,
    tree,
    stats,
    viewMode,
    setViewMode,
    indent,
    setIndent,
    handleFormat,
    handleMinify,
    handleClear,
    handleCopy,
  };
}
