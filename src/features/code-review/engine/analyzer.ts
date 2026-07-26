import type { ReviewResult, CodeIssue, ReviewSuggestion, CodeLanguage } from '../types';
import { namingRule } from './rules/namingRule';
import { complexityRule } from './rules/complexityRule';
import { securityRule } from './rules/securityRule';
import { styleRule } from './rules/styleRule';
import { bugPatternRule } from './rules/bugPatternRule';
import type { ReviewRule } from '../types';

const allRules: ReviewRule[] = [
  namingRule,
  complexityRule,
  securityRule,
  styleRule,
  bugPatternRule,
];

function computeCodeStats(code: string): {
  lines: number;
  codeLines: number;
  commentLines: number;
} {
  const lines = code.split('\n');
  let codeLines = 0;
  let commentLines = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') continue;
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('/*')
    ) {
      commentLines++;
    } else {
      codeLines++;
    }
  }

  return { lines: lines.length, codeLines, commentLines };
}

function computeComplexity(code: string): 'low' | 'medium' | 'high' | 'very-high' {
  const lines = code.split('\n');
  let branchCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('#')) continue;
    if (/\b(if|else|for|while|switch|case|catch|&&|\|\|)\b/.test(trimmed)) {
      branchCount++;
    }
  }

  const codeLines = lines.filter((l) => l.trim() !== '').length;
  const ratio = codeLines > 0 ? branchCount / codeLines : 0;

  if (ratio < 0.1) return 'low';
  if (ratio < 0.2) return 'medium';
  if (ratio < 0.35) return 'high';
  return 'very-high';
}

function calculateScore(issues: CodeIssue[], _codeLines: number): number {
  let score = 100;

  for (const issue of issues) {
    switch (issue.severity) {
      case 'error':
        score -= 15;
        break;
      case 'warning':
        score -= 6;
        break;
      case 'info':
        score -= 2;
        break;
      case 'suggestion':
        score -= 1;
        break;
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function generateSuggestions(
  issues: CodeIssue[],
  code: string,
  _language: CodeLanguage,
): ReviewSuggestion[] {
  const suggestions: ReviewSuggestion[] = [];
  const categories = new Set(issues.map((i) => i.category));

  if (categories.has('security')) {
    const securityIssues = issues.filter((i) => i.category === 'security');
    const hasError = securityIssues.some((i) => i.severity === 'error');
    suggestions.push({
      title: hasError ? '修复安全漏洞（优先）' : '改善安全性',
      description: `发现 ${securityIssues.length} 个安全问题。${hasError ? '其中包含高风险安全漏洞，建议优先修复。' : '建议逐步改善以增强代码安全性。'}`,
      priority: hasError ? 'high' : 'medium',
    });
  }

  if (categories.has('bug')) {
    suggestions.push({
      title: '修复潜在 Bug',
      description: `发现 ${issues.filter((i) => i.category === 'bug').length} 个可能导致运行时错误的问题，建议优先修复。`,
      priority: 'high',
    });
  }

  if (categories.has('complexity')) {
    suggestions.push({
      title: '降低代码复杂度',
      description: '部分代码区域复杂度过高，建议通过提取函数、简化条件判断等方式降低复杂度。',
      priority: 'medium',
    });
  }

  if (categories.has('style')) {
    suggestions.push({
      title: '改善代码风格',
      description: '存在命名不规范、魔法数字等风格问题，建议统一代码风格。',
      priority: 'low',
    });
  }

  if (categories.has('maintainability')) {
    suggestions.push({
      title: '提升可维护性',
      description: '处理代码中的 TODO/FIXME 标记，保持代码库整洁。',
      priority: 'medium',
    });
  }

  // General suggestions based on code analysis
  const codeLines = code.split('\n').filter((l) => l.trim() !== '').length;
  const commentLines = code.split('\n').filter((l) => {
    const t = l.trim();
    return t.startsWith('//') || t.startsWith('#') || t.startsWith('*') || t.startsWith('/*');
  }).length;
  const commentRatio = codeLines > 0 ? commentLines / codeLines : 0;

  if (commentRatio < 0.05 && codeLines > 20) {
    suggestions.push({
      title: '增加代码注释',
      description: `注释比例仅 ${Math.round(commentRatio * 100)}%，建议为关键逻辑添加注释以提高可读性。`,
      priority: 'low',
    });
  }

  return suggestions.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
}

function findHighlights(code: string, language: CodeLanguage): string[] {
  const highlights: string[] = [];
  const lines = code.split('\n');

  // Check for TypeScript usage
  if (
    language === 'typescript' &&
    code.includes(': ') &&
    (code.includes('interface') || code.includes('type '))
  ) {
    highlights.push('使用了 TypeScript 类型系统');
  }

  // Check for error handling
  if (code.includes('try') && code.includes('catch')) {
    highlights.push('包含错误处理逻辑');
  }

  // Check for async/await
  if (code.includes('async') && code.includes('await')) {
    highlights.push('使用了 async/await 异步模式');
  }

  // Check for tests
  if (code.includes('describe') || code.includes('it(') || code.includes('test(')) {
    highlights.push('包含测试代码');
  }

  // Check for documentation
  const hasDocComments = lines.some(
    (l) => l.trim().startsWith('/**') || l.trim().startsWith('* @'),
  );
  if (hasDocComments) {
    highlights.push('使用了 JSDoc 文档注释');
  }

  // Check for const usage
  const constCount = (code.match(/\bconst\b/g) || []).length;
  const letCount = (code.match(/\blet\b/g) || []).length;
  if (constCount > letCount * 2) {
    highlights.push('偏好使用 const 声明（良好的不可变性实践）');
  }

  // Check for optional chaining
  if (code.includes('?.')) {
    highlights.push('使用了可选链操作符');
  }

  // Check for template literals
  if (code.includes('`') && code.includes('${')) {
    highlights.push('使用模板字符串');
  }

  return highlights;
}

export function analyzeCode(code: string, language: CodeLanguage): ReviewResult {
  // Filter rules applicable to the language
  const applicableRules = allRules.filter((rule) => rule.languages.includes(language));

  // Run all rules
  const allIssues: CodeIssue[] = [];
  for (const rule of applicableRules) {
    const ruleIssues = rule.analyze(code, language);
    allIssues.push(...ruleIssues);
  }

  // De-duplicate issues on same line+rule
  const seen = new Set<string>();
  const uniqueIssues = allIssues.filter((issue) => {
    const key = `${issue.line}-${issue.rule}-${issue.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Compute stats
  const stats = computeCodeStats(code);
  const complexity = computeComplexity(code);
  const score = calculateScore(uniqueIssues, stats.codeLines);
  const grade = getGrade(score);

  const suggestions = generateSuggestions(uniqueIssues, code, language);
  const highlights = findHighlights(code, language);

  return {
    score,
    grade,
    issues: uniqueIssues,
    suggestions,
    highlights,
    stats: {
      ...stats,
      complexity,
      issueCount: uniqueIssues.length,
      issueDensity:
        stats.codeLines > 0
          ? Math.round((uniqueIssues.length / stats.codeLines) * 100 * 100) / 100
          : 0,
    },
  };
}
