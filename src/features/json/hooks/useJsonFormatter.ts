import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { validateJson } from '../utils/validator';
import { formatJson, minifyJson, buildTree, countKeys, getDepth, formatSize } from '../utils/formatter';

type ViewMode = 'code' | 'tree' | 'split';

interface JsonStats {
  lines: number;
  size: string;
  depth: number;
  keys: number;
}

// Threshold: use worker for input larger than 100KB
const WORKER_THRESHOLD = 100 * 1024;

export function useJsonFormatter() {
  const [input, setInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [indent, setIndent] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);

  // Worker result state (for large files)
  const [workerResult, setWorkerResult] = useState<{
    output: string;
    tree: ReturnType<typeof buildTree> | null;
    validation: { valid: true } | { valid: false; error: { message: string; line: number; column: number } };
    stats: JsonStats;
  } | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);

  // Initialize worker lazily
  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/jsonWorker.ts', import.meta.url),
        { type: 'module' }
      );
    }
    return workerRef.current;
  }, []);

  // Cleanup worker on unmount
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Process input — use worker for large files, main thread for small
  const processInput = useCallback((value: string) => {
    const size = new Blob([value]).size;

    if (size < WORKER_THRESHOLD) {
      // Small file: process on main thread (fast enough)
      setWorkerResult(null);
      return;
    }

    // Large file: delegate to worker
    const worker = getWorker();
    const id = ++requestIdRef.current;
    setIsProcessing(true);

    const handler = (e: MessageEvent) => {
      if (e.data.id !== id) return;
      worker.removeEventListener('message', handler);
      setIsProcessing(false);

      if (e.data.success) {
        setWorkerResult({
          output: e.data.data.output,
          tree: e.data.data.tree,
          validation: e.data.data.isValid
            ? { valid: true }
            : { valid: false, error: e.data.data.error },
          stats: e.data.data.stats,
        });
      } else {
        setWorkerResult({
          output: '',
          tree: null,
          validation: { valid: false, error: { message: e.data.error, line: 0, column: 0 } },
          stats: { lines: 0, size: '0 B', depth: 0, keys: 0 },
        });
      }
    };

    worker.addEventListener('message', handler);
    worker.postMessage({ id, type: 'format', input: value, indent });
  }, [getWorker, indent]);

  // Trigger processing on input change with debounce
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => processInput(value), 150);
  }, [processInput]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  // For small files: compute on main thread
  const isUsingWorker = workerResult !== null;

  const validation = isUsingWorker
    ? workerResult.validation
    : useMemo(() => validateJson(input), [input]);

  const output = isUsingWorker
    ? workerResult.output
    : useMemo(() => {
        if (!input.trim() || !validation.valid) return '';
        return formatJson(input, indent);
      }, [input, indent, validation.valid]);

  const tree = isUsingWorker
    ? workerResult.tree
    : useMemo(() => {
        if (!input.trim() || !validation.valid) return null;
        try {
          return buildTree(JSON.parse(input));
        } catch {
          return null;
        }
      }, [input, validation.valid]);

  const stats: JsonStats = isUsingWorker
    ? workerResult.stats
    : useMemo(() => {
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
      const formatted = formatJson(input, indent);
      setInput(formatted);
      processInput(formatted);
    }
  }, [input, indent, validation.valid, processInput]);

  const handleMinify = useCallback(() => {
    if (validation.valid && input.trim()) {
      const minified = minifyJson(input);
      setInput(minified);
      processInput(minified);
    }
  }, [input, validation.valid, processInput]);

  const handleClear = useCallback(() => {
    setInput('');
    setWorkerResult(null);
  }, []);

  const handleCopy = useCallback(async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  }, [output]);

  return {
    input,
    setInput: handleInputChange,
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
    isProcessing,
  };
}
