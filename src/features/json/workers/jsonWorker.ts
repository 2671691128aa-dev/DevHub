// JSON formatting worker — runs JSON.parse/stringify off the main thread
// to prevent UI blocking on large files (10MB+)

import type { JsonWorkerRequest, JsonWorkerResponse, TreeNode } from '@/types/common';
import {
  formatJson,
  minifyJson,
  buildTree,
  countKeys,
  getDepth,
  formatSize,
} from '../utils/formatter';
import { validateJson } from '../utils/validator';

self.onmessage = (e: MessageEvent<JsonWorkerRequest>) => {
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
          stats: {
            lines: input.split('\n').length,
            size: formatSize(new Blob([input]).size),
            depth: 0,
            keys: 0,
          },
        },
      } satisfies JsonWorkerResponse);
      return;
    }

    let output = '';
    let tree: TreeNode | null = null;

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
      } satisfies JsonWorkerResponse);
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
          stats: {
            lines: output.split('\n').length,
            size: formatSize(new Blob([input]).size),
            depth: 0,
            keys: 0,
          },
        },
      } satisfies JsonWorkerResponse);
    }
  } catch (err) {
    self.postMessage({
      id,
      type,
      success: false,
      error: (err as Error).message,
    } satisfies JsonWorkerResponse);
  }
};
