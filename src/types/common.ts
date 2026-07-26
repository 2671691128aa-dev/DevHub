export interface JsonError {
  message: string;
  line: number;
  column: number;
}

export interface TreeNode {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';
  value: unknown;
  children?: TreeNode[];
  path: string;
  isCollapsed?: boolean;
}

export interface JsonStats {
  lines: number;
  size: string;
  depth: number;
  keys: number;
}

export interface JsonValidationResult {
  valid: boolean;
  error: JsonError | null;
}

export interface RegexMatch {
  index: number;
  fullMatch: string;
  groups: CaptureGroup[];
}

export interface CaptureGroup {
  name: string | null;
  value: string;
  start: number;
  end: number;
}

export interface RegexTemplate {
  id: string;
  name: string;
  pattern: string;
  description: string;
  example: string;
}

// --- Worker types ---

export interface JsonWorkerRequest {
  id: number;
  type: 'format' | 'minify' | 'validate';
  input: string;
  indent?: number;
}

export interface JsonWorkerResponse {
  id: number;
  type: 'format' | 'minify' | 'validate';
  success: boolean;
  data?: {
    output: string;
    tree: TreeNode | null;
    isValid: boolean;
    error: JsonError | null;
    stats: JsonStats;
  };
  error?: string;
}

// --- JSON Formatter view ---

export type JsonViewMode = 'code' | 'tree' | 'split';

// --- JSON Formatter worker result ---

export interface JsonWorkerResult {
  output: string;
  tree: TreeNode | null;
  validation: { valid: true } | { valid: false; error: JsonError };
  stats: JsonStats;
}
