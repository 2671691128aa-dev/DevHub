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
  return {
    id: `complexity-${++issueCounter}`,
    rule,
    severity,
    category,
    line,
    message,
    suggestion,
  };
}

export const complexityRule: ReviewRule = {
  id: 'complexity',
  name: '复杂度分析',
  description: '检测代码复杂度过高的区域',
  languages: ['javascript', 'typescript', 'python', 'java', 'go', 'rust'],
  analyze: (code: string): CodeIssue[] => {
    const issues: CodeIssue[] = [];
    const lines = code.split('\n');

    // 1. Deep nesting detection
    let maxIndent = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '') continue;

      // Count leading spaces/tabs
      const indent = line.search(/\S/);
      const level = Math.floor(indent / 2); // Assume 2-space indent

      if (level > maxIndent) maxIndent = level;

      if (level >= 5) {
        issues.push(
          makeIssue(
            'complexity',
            'warning',
            'complexity',
            i + 1,
            `代码嵌套层级过深（${level} 层），建议提取为独立函数`,
            '考虑使用 early return 或提取子函数来降低嵌套',
          ),
        );
      }
    }

    // 2. Long function detection
    let funcStart = -1;
    let braceCount = 0;
    let funcName = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;

      // Detect function start
      const funcMatch = trimmed.match(
        /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:\([^)]*\)|[\w]+)\s*=>)/,
      );
      if (funcMatch && braceCount === 0) {
        funcStart = i;
        funcName = funcMatch[1] || funcMatch[2] || '匿名函数';
      }

      // Count braces
      for (const ch of line) {
        if (ch === '{') braceCount++;
        if (ch === '}') braceCount--;
      }

      // Function end
      if (funcStart >= 0 && braceCount === 0) {
        const funcLength = i - funcStart + 1;
        if (funcLength > 50) {
          issues.push(
            makeIssue(
              'complexity',
              'warning',
              'complexity',
              funcStart + 1,
              `函数 "${funcName}" 过长（${funcLength} 行），建议拆分为更小的函数`,
              '单个函数建议控制在 30 行以内',
            ),
          );
        }
        funcStart = -1;
      }
    }

    // 3. Too many parameters
    const paramPattern = /function\s+\w+\s*\(([^)]+)\)/g;
    for (let i = 0; i < lines.length; i++) {
      paramPattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = paramPattern.exec(lines[i])) !== null) {
        const params = match[1].split(',').filter((p) => p.trim().length > 0);
        if (params.length > 5) {
          issues.push(
            makeIssue(
              'complexity',
              'info',
              'complexity',
              i + 1,
              `函数参数过多（${params.length} 个），建议使用对象参数`,
              '考虑将参数封装为一个配置对象',
            ),
          );
        }
      }
    }

    // 4. Detect deeply nested ternaries
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const ternaryCount = (line.match(/\?[^?]*:/g) || []).length;
      if (ternaryCount >= 3) {
        issues.push(
          makeIssue(
            'complexity',
            'info',
            'complexity',
            i + 1,
            '行内包含多个三元运算符，可读性较差',
            '建议拆分为 if-else 或使用 switch 语句',
          ),
        );
      }
    }

    // 5. Detect switch statements without default
    const switchPattern = /^\s*switch\s*\(/;
    const defaultPattern = /^\s*default\s*:/;
    for (let i = 0; i < lines.length; i++) {
      if (switchPattern.test(lines[i])) {
        let hasDefault = false;
        let braceDepth = 0;
        for (let j = i; j < lines.length; j++) {
          for (const ch of lines[j]) {
            if (ch === '{') braceDepth++;
            if (ch === '}') braceDepth--;
          }
          if (defaultPattern.test(lines[j])) hasDefault = true;
          if (braceDepth === 0 && j > i) break;
        }
        if (!hasDefault) {
          issues.push(
            makeIssue(
              'complexity',
              'info',
              'complexity',
              i + 1,
              'switch 语句缺少 default 分支',
              '添加 default 分支处理未预期的情况',
            ),
          );
        }
      }
    }

    return issues;
  },
};
