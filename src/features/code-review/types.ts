export type CodeLanguage =
  'javascript' | 'typescript' | 'python' | 'java' | 'go' | 'rust' | 'css' | 'html' | 'sql';

export type Severity = 'error' | 'warning' | 'info' | 'suggestion';

export type IssueCategory =
  'bug' | 'performance' | 'security' | 'style' | 'complexity' | 'maintainability';

export interface CodeIssue {
  id: string;
  rule: string;
  severity: Severity;
  category: IssueCategory;
  line?: number;
  message: string;
  suggestion?: string;
}

export interface ReviewSuggestion {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ReviewResult {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: CodeIssue[];
  suggestions: ReviewSuggestion[];
  highlights: string[]; // good practices found
  stats: {
    lines: number;
    codeLines: number;
    commentLines: number;
    complexity: 'low' | 'medium' | 'high' | 'very-high';
    issueCount: number;
    issueDensity: number; // issues per 100 lines
  };
}

export interface ReviewRule {
  id: string;
  name: string;
  description: string;
  languages: CodeLanguage[];
  analyze: (code: string, language: CodeLanguage) => CodeIssue[];
}
