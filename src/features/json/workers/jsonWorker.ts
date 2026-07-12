// JSON formatting worker — runs JSON.parse/stringify off the main thread
// to prevent UI blocking on large files (10MB+)

import { formatJson, minifyJson, buildTree, countKeys, getDepth, formatSize } from '../utils/formatter';
import { validateJson } from '../utils/validator';

export interface WorkerRequest {
  id: number;
  type: 'format' | 'minify' | 'validate';
  input: string;
  indent?: number;
}

export interface WorkerResponse {
  id: number;
  type: 'format' | 'minify' | 'validate';
  success: boolean;
  data?: {
    output: string;
    tree: ReturnType<typeof buildTree> | null;
    isValid: boolean;
    error: { message: string; line: number; column: number } | null;
    stats: {
      lines: number;
      size: string;
      depth: number;
      keys: number;
    };
  };
  error?: string;
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { id, type, input, indent = 2 } = e.data;

  try {
    const validation = validateJson(input);

    if (!validation.valid) {
      self.postMessage({
        id,
        type,
        success: true,
        data: {
          output: '',
          tree: null,
          isValid: false,
          error: validation.error,
          stats: { lines: input.split('\n').length, size: formatSize(new Blob([input]).size), depth: 0, keys: 0 },
        },
      } satisfies WorkerResponse);
      return;
    }

    let output = '';
    let tree = null;

    if (type === 'format') {
      output = formatJson(input, indent);
    } else if (type === 'minify') {
      output = minifyJson(input);
    } else {
      output = formatJson(input, indent);
    }

    try {
      const parsed = JSON.parse(input);
      tree = buildTree(parsed);

      self.postMessage({
        id,
        type,
        success: true,
        data: {
          output,
          tree,
          isValid: true,
          error: null,
          stats: {
            lines: output.split('\n').length,
            size: formatSize(new Blob([input]).size),
            depth: getDepth(parsed),
            keys: countKeys(parsed),
          },
        },
      } satisfies WorkerResponse);
    } catch {
      self.postMessage({
        id,
        type,
        success: true,
        data: {
          output,
          tree: null,
          isValid: true,
          error: null,
          stats: { lines: output.split('\n').length, size: formatSize(new Blob([input]).size), depth: 0, keys: 0 },
        },
      } satisfies WorkerResponse);
    }
  } catch (err) {
    self.postMessage({
      id,
      type,
      success: false,
      error: (err as Error).message,
    } satisfies WorkerResponse);
  }
};
