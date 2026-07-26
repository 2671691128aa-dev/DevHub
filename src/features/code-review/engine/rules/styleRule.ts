import type { ReviewRule, CodeIssue } from '../../types';

let issueCounter = 0;
function makeIssue(
  rule: string,
  severity: CodeIssue['severity'],
  category: CodeIssue['category'],
  line: number | undefined,
  message: string,
  suggestion?: string,
): CodeIssue {
  return { id: `style-${++issueCounter}`, rule, severity, category, line, message, suggestion };
}

export const styleRule: ReviewRule = {
  id: 'style',
  name: '代码风格',
  description: '检查代码风格问题',
  languages: ['javascript', 'typescript', 'python', 'java', 'go', 'rust'],
  analyze: (code: string): CodeIssue[] => {
    const issues: CodeIssue[] = [];
    const lines = code.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 1. Magic numbers (exclude common ones: 0, 1, -1, 2, 100, and index/line patterns)
      const magicPattern = /(?<!=\s*['"`])(?<![.\w])(\d{2,})(?!\s*[;\s]*\/\/)/g;
      let match: RegExpExecArray | null;
      magicPattern.lastIndex = 0;
      while ((match = magicPattern.exec(line)) !== null) {
        const num = parseInt(match[1]);
        const allowed = [0, 1, 2, 10, 100, 1000, 1024, 60, 24, 7, 30, 365, 200, 201, 404, 500];
        if (allowed.includes(num)) continue;
        // Skip lines that are just numbers (arrays, etc.) or in comments
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;
        // Skip import/require lines
        if (line.includes('import ') || line.includes('require(')) continue;
        // Skip hex colors, array indices, etc.
        if (/\[.*\]/.test(line)) continue;

        issues.push(
          makeIssue(
            'style',
            'info',
            'style',
            i + 1,
            `检测到魔法数字 ${num}，建议提取为命名常量`,
            `const ${getDescriptiveName(num)} = ${num};`,
          ),
        );
        break; // Only report once per line
      }

      // 2. Line too long
      if (line.length > 120 && !line.trim().startsWith('//')) {
        issues.push(
          makeIssue(
            'style',
            'info',
            'style',
            i + 1,
            `行长度 ${line.length} 超过 120 字符`,
            '考虑拆分表达式或使用多行格式',
          ),
        );
      }

      // 3. Trailing whitespace
      if (line.length > 0 && line !== line.trimEnd() && !line.trim().startsWith('//')) {
        issues.push(makeIssue('style', 'info', 'style', i + 1, '行尾存在多余空白字符'));
      }

      // 4. Multiple statements on one line (semicolon separated)
      const semiCount = (line.match(/;/g) || []).length;
      if (semiCount >= 3 && !line.includes('for') && !line.includes('import')) {
        issues.push(
          makeIssue('style', 'info', 'style', i + 1, '单行包含过多语句，建议每行一个语句'),
        );
      }

      // 5. Empty blocks
      if (/\{\s*\}/.test(line) && !line.includes('=>') && !line.includes('function')) {
        issues.push(
          makeIssue(
            'style',
            'info',
            'style',
            i + 1,
            '检测到空代码块',
            '空代码块可能是未完成的功能或多余的逻辑',
          ),
        );
      }

      // 6. TODO/FIXME/HACK comments
      const todoPattern = /\/\/\s*(TODO|FIXME|HACK|XXX)\b(.*)/i;
      const todoMatch = line.match(todoPattern);
      if (todoMatch) {
        issues.push(
          makeIssue(
            'style',
            'info',
            'maintainability',
            i + 1,
            `检测到 ${todoMatch[1]} 注释${todoMatch[2] ? `: ${todoMatch[2].trim()}` : ''}`,
            '建议及时处理待办事项',
          ),
        );
      }
    }

    // 7. Detect var usage (should use const/let)
    for (let i = 0; i < lines.length; i++) {
      if (/\bvar\s+/.test(lines[i]) && !lines[i].trim().startsWith('//')) {
        issues.push(
          makeIssue(
            'style',
            'warning',
            'style',
            i + 1,
            '使用 var 声明变量，建议使用 const 或 let',
            'var 存在变量提升和函数作用域问题',
          ),
        );
      }
    }

    // 8. == instead of ===
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('//')) continue;
      // Match == but not === and !==
      if (/[^!=]==[^=]/.test(line) && !line.includes('===')) {
        issues.push(
          makeIssue(
            'style',
            'warning',
            'style',
            i + 1,
            '使用 == 进行比较，建议使用 === 严格相等',
            '== 会进行类型转换，可能产生意外结果',
          ),
        );
      }
    }

    return issues;
  },
};

function getDescriptiveName(num: number): string {
  if (num <= 10) return `VALUE_${num}`;
  if (num % 60 === 0) return 'MINUTES_IN_HOUR';
  if (num % 24 === 0) return 'HOURS_IN_DAY';
  if (num >= 1000) return 'MAX_COUNT';
  return `CONSTANT_${num}`;
}
