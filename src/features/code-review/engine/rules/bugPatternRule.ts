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
  return { id: `bug-${++issueCounter}`, rule, severity, category, line, message, suggestion };
}

export const bugPatternRule: ReviewRule = {
  id: 'bug-patterns',
  name: '常见 Bug 模式',
  description: '检测常见的编程错误模式',
  languages: ['javascript', 'typescript', 'python', 'java', 'go', 'rust'],
  analyze: (code: string): CodeIssue[] => {
    const issues: CodeIssue[] = [];
    const lines = code.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (
        line.trim().startsWith('//') ||
        line.trim().startsWith('#') ||
        line.trim().startsWith('*')
      )
        continue;

      // 1. Comparison in if without braces (JS/TS)
      if (/^\s*if\s*\([^)]+\)\s*[^{\s]/.test(line) && !line.includes('{')) {
        issues.push(
          makeIssue(
            'bug-patterns',
            'warning',
            'bug',
            i + 1,
            'if 语句未使用花括号，可能导致逻辑错误',
            '建议始终使用花括号包裹 if 语句体',
          ),
        );
      }

      // 2. Assigning in condition
      if (/if\s*\([^!=<>]=[^=]/.test(line) && !line.includes('=>')) {
        issues.push(
          makeIssue(
            'bug-patterns',
            'error',
            'bug',
            i + 1,
            '条件判断中使用了赋值操作符 =，是否应该使用 === ？',
            '条件中的赋值通常是笔误',
          ),
        );
      }

      // 3. Missing return in function (heuristic: function with value assignments but no return)
      // This is hard to detect reliably; skip

      // 4. Using undeclared variables (check for common typos: lenght, widht, heigth, etc.)
      const typoPatterns: [RegExp, string, string][] = [
        [/\blenght\b/, '拼写错误: "lenght"', '应该是 "length"'],
        [/\bwidht\b/, '拼写错误: "widht"', '应该是 "width"'],
        [/\bheigth\b/, '拼写错误: "heigth"', '应该是 "height"'],
        [/\brecieve\b/, '拼写错误: "recieve"', '应该是 "receive"'],
        [/\bseperate\b/, '拼写错误: "seperate"', '应该是 "separate"'],
        [/\boccur[a-z]*\s*[^r]\b/, '拼写错误', '检查 "occur" 的拼写'],
        [/\bretun\b/, '拼写错误: "retun"', '应该是 "return"'],
        [/\bfuction\b/, '拼写错误: "fuction"', '应该是 "function"'],
        [/\bcont\b(?!\.)/, '拼写错误: "cont"', '应该是 "const" 或 "continue"'],
        [/\b undefinded \b/, '拼写错误: "undefinded"', '应该是 "undefined"'],
      ];

      for (const [pattern, message, suggestion] of typoPatterns) {
        if (pattern.test(line)) {
          issues.push(makeIssue('bug-patterns', 'warning', 'bug', i + 1, message, suggestion));
        }
      }

      // 5. Potential null/undefined access without check
      if (/\w+\.\w+\.\w+/.test(line) && !line.includes('?.')) {
        // Long chain without optional chaining
        const chains = line.match(/\w+\.\w+\.\w+\.\w+/g);
        if (chains) {
          issues.push(
            makeIssue(
              'bug-patterns',
              'info',
              'bug',
              i + 1,
              '检测到长属性链访问，建议使用可选链操作符 ?.',
              '使用 ?. 可以避免空引用错误',
            ),
          );
        }
      }

      // 6. Async function without await
      if (/async\s+/.test(line) && /async\s+function\b/.test(line)) {
        // Look ahead for await in the function body
        let hasAwait = false;
        let braceCount = 0;
        for (let j = i; j < Math.min(i + 30, lines.length); j++) {
          for (const ch of lines[j]) {
            if (ch === '{') braceCount++;
            if (ch === '}') braceCount--;
          }
          if (lines[j].includes('await')) hasAwait = true;
          if (braceCount === 0 && j > i) break;
        }
        if (!hasAwait) {
          issues.push(
            makeIssue(
              'bug-patterns',
              'warning',
              'bug',
              i + 1,
              'async 函数中未使用 await',
              '如果不需要异步操作，移除 async 关键字',
            ),
          );
        }
      }

      // 7. Unhandled promise (missing catch/finally)
      if (/\.then\s*\(/.test(line) && !line.includes('.catch') && !line.includes('await')) {
        // Check if next few lines have .catch
        let hasCatch = false;
        for (let j = i; j < Math.min(i + 5, lines.length); j++) {
          if (lines[j].includes('.catch') || lines[j].includes('.finally')) {
            hasCatch = true;
            break;
          }
        }
        if (!hasCatch) {
          issues.push(
            makeIssue(
              'bug-patterns',
              'warning',
              'bug',
              i + 1,
              'Promise 链缺少错误处理',
              '添加 .catch() 或使用 try-catch 处理 Promise 错误',
            ),
          );
        }
      }

      // 8. Array index out of bounds risk (accessing arr[arr.length])
      if (/\w+\[\w+\.length\]/.test(line)) {
        issues.push(
          makeIssue(
            'bug-patterns',
            'error',
            'bug',
            i + 1,
            '数组索引 arr[arr.length] 将返回 undefined（索引从 0 开始）',
            '使用 arr[arr.length - 1] 获取最后一个元素',
          ),
        );
      }
    }

    return issues;
  },
};
