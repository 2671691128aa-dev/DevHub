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
  return { id: `security-${++issueCounter}`, rule, severity, category, line, message, suggestion };
}

interface SecurityPattern {
  pattern: RegExp;
  message: string;
  suggestion: string;
  severity: CodeIssue['severity'];
}

const jsPatterns: SecurityPattern[] = [
  {
    pattern: /\beval\s*\(/,
    message: '使用 eval() 存在安全风险，可能导致代码注入',
    suggestion: '使用 Function 构造函数或 JSON.parse() 替代',
    severity: 'error',
  },
  {
    pattern: /\binnerHTML\s*=/,
    message: '直接设置 innerHTML 可能导致 XSS 攻击',
    suggestion: '使用 textContent 或 DOMPurify 库进行消毒',
    severity: 'warning',
  },
  {
    pattern: /\bdocument\.write\s*\(/,
    message: 'document.write() 可能被利用进行 XSS 攻击',
    suggestion: '使用 DOM API（createElement、appendChild）替代',
    severity: 'warning',
  },
  {
    pattern: /\bdangerouslySetInnerHTML\b/,
    message: 'dangerouslySetInnerHTML 可能导致 XSS 攻击',
    suggestion: '确保输入已经过消毒处理',
    severity: 'warning',
  },
  {
    pattern:
      /\blocalStorage\s*\.\s*(?:setItem|getItem)\s*\(\s*['"`]*(?:token|password|secret|key|auth)/i,
    message: '敏感信息存储在 localStorage 中容易被 XSS 攻击窃取',
    suggestion: '使用 httpOnly cookie 存储敏感信息',
    severity: 'warning',
  },
  {
    pattern: /\/\/\s*@ts-ignore\b/,
    message: '使用 @ts-ignore 跳过了类型安全检查',
    suggestion: '尽量修复类型错误而非忽略',
    severity: 'info',
  },
  {
    pattern: /\/\/\s*eslint-disable\b/,
    message: '禁用了 ESLint 规则检查',
    suggestion: '确保禁用是必要的，并添加注释说明原因',
    severity: 'info',
  },
  {
    pattern: /\bconsole\.(?:log|debug|info|warn|error)\s*\(/,
    message: '生产代码中遗留 console 语句',
    suggestion: '使用日志库替代，或在构建时移除',
    severity: 'info',
  },
  {
    pattern: /\bnew\s+Function\s*\(/,
    message: '动态创建 Function 对象与 eval 类似，存在安全风险',
    suggestion: '使用静态函数定义替代',
    severity: 'error',
  },
  {
    pattern: /\bsetTimeout\s*\(\s*['"`]/,
    message: 'setTimeout 使用字符串参数等同于 eval',
    suggestion: '传递函数引用而非字符串',
    severity: 'error',
  },
  {
    pattern: /\bsetInterval\s*\(\s*['"`]/,
    message: 'setInterval 使用字符串参数等同于 eval',
    suggestion: '传递函数引用而非字符串',
    severity: 'error',
  },
  {
    pattern: /href\s*=\s*['"`]\s*javascript:/i,
    message: 'javascript: 协议可能被利用进行 XSS 攻击',
    suggestion: '使用事件处理器替代',
    severity: 'error',
  },
];

const pythonPatterns: SecurityPattern[] = [
  {
    pattern: /\beval\s*\(/,
    message: '使用 eval() 存在安全风险',
    suggestion: '使用 ast.literal_eval() 替代',
    severity: 'error',
  },
  {
    pattern: /\bexec\s*\(/,
    message: '使用 exec() 存在代码注入风险',
    suggestion: '避免动态执行代码字符串',
    severity: 'error',
  },
  {
    pattern: /\bos\.system\s*\(/,
    message: 'os.system() 可能导致命令注入',
    suggestion: '使用 subprocess.run() 并设置 shell=False',
    severity: 'warning',
  },
  {
    pattern: /\bpickle\.loads?\s*\(/,
    message: 'pickle 反序列化不受信任的数据可能导致远程代码执行',
    suggestion: '使用 json 替代，或验证数据来源',
    severity: 'warning',
  },
  {
    pattern: /#\s*type:\s*ignore\b/,
    message: '使用 type: ignore 跳过了类型检查',
    suggestion: '尽量修复类型错误而非忽略',
    severity: 'info',
  },
  {
    pattern: /\bprint\s*\(/,
    message: '生产代码中遗留 print 语句',
    suggestion: '使用 logging 模块替代',
    severity: 'info',
  },
];

export const securityRule: ReviewRule = {
  id: 'security',
  name: '安全漏洞检测',
  description: '检测常见安全漏洞模式',
  languages: ['javascript', 'typescript', 'python', 'java', 'go', 'rust', 'html', 'css'],
  analyze: (code: string, language: CodeLanguage): CodeIssue[] => {
    const issues: CodeIssue[] = [];
    const lines = code.split('\n');

    const patterns = language === 'python' ? pythonPatterns : jsPatterns;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip pure comments (but check @ts-ignore and eslint-disable)
      if (
        line.trim().startsWith('//') &&
        !line.includes('@ts-ignore') &&
        !line.includes('eslint-disable')
      )
        continue;
      if (line.trim().startsWith('#') && language === 'python' && !line.includes('type: ignore'))
        continue;

      for (const p of patterns) {
        if (p.pattern.test(line)) {
          issues.push(
            makeIssue('security', p.severity, 'security', i + 1, p.message, p.suggestion),
          );
        }
      }
    }

    return issues;
  },
};
