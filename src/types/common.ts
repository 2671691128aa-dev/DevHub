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
  isCollapsed: boolean;
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
