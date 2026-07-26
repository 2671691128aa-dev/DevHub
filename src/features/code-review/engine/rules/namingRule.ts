import type { ReviewRule, CodeIssue, CodeLanguage } from '../../types';

let issueCounter = 0;
function makeIssue(
  rule: string,
  severity: CodeIssue['severity'],
  category: CodeIssue['category'],
  line: number | undefined,
  message: string,
  suggestion?: string,
): CodeIssue {
  return { id: `naming-${++issueCounter}`, rule, severity, category, line, message, suggestion };
}

/** Check camelCase for variables/functions */
function isCamelCase(s: string): boolean {
  return /^[a-z][a-zA-Z0-9]*$/.test(s);
}

/** Check PascalCase for classes/types */
function isPascalCase(s: string): boolean {
  return /^[A-Z][a-zA-Z0-9]*$/.test(s);
}

/** Check UPPER_SNAKE_CASE for constants */
function isUpperSnake(s: string): boolean {
  return /^[A-Z][A-Z0-9_]*$/.test(s);
}

/** Check snake_case */
function isSnakeCase(s: string): boolean {
  return /^[a-z][a-z0-9_]*$/.test(s);
}

export const namingRule: ReviewRule = {
  id: 'naming-convention',
  name: '命名规范',
  description: '检查变量、函数、类的命名是否符合语言约定',
  languages: ['javascript', 'typescript', 'java', 'go', 'rust'],
  analyze: (code: string, language: CodeLanguage): CodeIssue[] => {
    const issues: CodeIssue[] = [];
    const lines = code.split('\n');

    // Variable declarations: const/let/var name =
    const varPattern = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    // Function declarations
    const funcPattern = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    // Class declarations
    const classPattern = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    // Arrow function assignments
    // (used for detecting arrow function variable names — kept for reference)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip comments
      if (
        line.trim().startsWith('//') ||
        line.trim().startsWith('*') ||
        line.trim().startsWith('/*')
      )
        continue;

      let match: RegExpExecArray | null;

      // Check variable names
      varPattern.lastIndex = 0;
      while ((match = varPattern.exec(line)) !== null) {
        const name = match[1];
        if (name.length <= 1 && name !== '_') continue; // Skip single char (loop vars)
        if (language === 'python') {
          if (!isSnakeCase(name) && !isUpperSnake(name)) {
            issues.push(
              makeIssue(
                'naming-convention',
                'warning',
                'style',
                i + 1,
                `变量 "${name}" 建议使用 snake_case 命名`,
                `建议改为: ${toSnakeCase(name)}`,
              ),
            );
          }
        } else {
          // JS/TS/Java/Go: camelCase for variables
          if (!isCamelCase(name) && !isUpperSnake(name) && !isPascalCase(name)) {
            issues.push(
              makeIssue(
                'naming-convention',
                'warning',
                'style',
                i + 1,
                `变量 "${name}" 命名不规范`,
                '变量建议使用 camelCase，常量使用 UPPER_SNAKE_CASE',
              ),
            );
          }
        }
      }

      // Check function names
      funcPattern.lastIndex = 0;
      while ((match = funcPattern.exec(line)) !== null) {
        const name = match[1];
        if (language === 'python') {
          if (!isSnakeCase(name) && !name.startsWith('_')) {
            issues.push(
              makeIssue(
                'naming-convention',
                'warning',
                'style',
                i + 1,
                `函数 "${name}" 建议使用 snake_case 命名`,
                `建议改为: ${toSnakeCase(name)}`,
              ),
            );
          }
        } else {
          if (!isCamelCase(name) && !isPascalCase(name)) {
            issues.push(
              makeIssue(
                'naming-convention',
                'warning',
                'style',
                i + 1,
                `函数 "${name}" 建议使用 camelCase 命名`,
              ),
            );
          }
        }
      }

      // Check class names
      classPattern.lastIndex = 0;
      while ((match = classPattern.exec(line)) !== null) {
        const name = match[1];
        if (!isPascalCase(name)) {
          issues.push(
            makeIssue(
              'naming-convention',
              'warning',
              'style',
              i + 1,
              `类名 "${name}" 建议使用 PascalCase 命名`,
              `建议改为: ${toPascalCase(name)}`,
            ),
          );
        }
      }
    }

    // Check for overly short names (excluding loop variables and common patterns)
    const shortNamePattern = /(?:const|let|var)\s+([a-z])\s*=/g;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('//')) continue;
      shortNamePattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = shortNamePattern.exec(line)) !== null) {
        const name = match[1];
        if (!['i', 'j', 'k', 'x', 'y', 'z', '_'].includes(name)) {
          issues.push(
            makeIssue(
              'naming-convention',
              'info',
              'style',
              i + 1,
              `变量名 "${name}" 过短，建议使用更具描述性的名称`,
            ),
          );
        }
      }
    }

    return issues;
  },
};

function toSnakeCase(s: string): string {
  return s.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`).replace(/^_/, '');
}

function toPascalCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
