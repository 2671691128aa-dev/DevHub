import type { TreeNode } from '@/types/common';

export function formatJson(input: string, indent: number = 2): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indent);
}

export function minifyJson(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

export function buildTree(data: unknown, key = '$', path = '$'): TreeNode {
  if (data === null) {
    return { key, type: 'null', value: null, path };
  }
  if (Array.isArray(data)) {
    return {
      key,
      type: 'array',
      value: data,
      path,
      isCollapsed: false,
      children: data.map((item, i) => buildTree(item, `[${i}]`, `${path}[${i}]`)),
    };
  }
  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    return {
      key,
      type: 'object',
      value: data,
      path,
      isCollapsed: false,
      children: entries.map(([k, v]) => buildTree(v, k, `${path}.${k}`)),
    };
  }
  return {
    key,
    type: typeof data as 'string' | 'number' | 'boolean',
    value: data,
    path,
  };
}

export function countKeys(data: unknown): number {
  if (data === null || typeof data !== 'object') return 0;
  if (Array.isArray(data)) return data.reduce((sum, item) => sum + countKeys(item), 0);
  return Object.keys(data).length + Object.values(data).reduce((sum, v) => sum + countKeys(v), 0);
}

export function getDepth(data: unknown): number {
  if (data === null || typeof data !== 'object') return 0;
  if (Array.isArray(data)) {
    return 1 + Math.max(0, ...data.map(getDepth));
  }
  const values = Object.values(data as Record<string, unknown>);
  return 1 + Math.max(0, ...values.map(getDepth));
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
