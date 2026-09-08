/**
 * Agent Tool Registry — defines tools available to the AI agent.
 *
 * Each tool has:
 * - id: unique identifier
 * - name: display name
 * - description: for AI to understand when to use it
 * - parameters: JSON Schema for the tool's input
 * - execute: function that runs the tool
 */

import { formatJson, minifyJson } from '@/features/json/utils/formatter';
import { validateJson } from '@/features/json/utils/validator';
import { analyzeCode } from '@/features/code-review/engine/analyzer';
import type { CodeLanguage } from '@/features/code-review/types';

export interface ToolParameter {
  type: string;
  description: string;
  required?: boolean;
  enum?: string[];
}

export interface ToolResult {
  success: boolean;
  output: string;
  error?: string;
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
  execute: (params: Record<string, unknown>) => Promise<ToolResult>;
}

// --- JSON Formatter Tool ---

const jsonFormatterTool: AgentTool = {
  id: 'json-formatter',
  name: 'JSON 格式化',
  description:
    '格式化或压缩 JSON 字符串。当用户提供 JSON 并要求格式化、美化、压缩、验证时使用此工具。',
  parameters: {
    content: {
      type: 'string',
      description: '要处理的 JSON 字符串',
      required: true,
    },
    action: {
      type: 'string',
      description: '操作类型：format（格式化/美化）或 minify（压缩）',
      required: true,
      enum: ['format', 'minify'],
    },
  },
  async execute(params) {
    const content = params.content as string;
    const action = (params.action as string) || 'format';

    // Validate first
    const validation = validateJson(content);
    if (!validation.valid) {
      return {
        success: false,
        output: '',
        error: `JSON 验证失败：${validation.error}`,
      };
    }

    try {
      if (action === 'minify') {
        const result = minifyJson(content);
        return { success: true, output: result };
      }
      const result = formatJson(content, 2);
      return { success: true, output: result };
    } catch (e) {
      return {
        success: false,
        output: '',
        error: `JSON 处理失败：${e instanceof Error ? e.message : String(e)}`,
      };
    }
  },
};

// --- Regex Tester Tool ---

const regexTesterTool: AgentTool = {
  id: 'regex-tester',
  name: '正则测试',
  description:
    '测试正则表达式匹配。当用户要求测试正则、匹配文本、查找模式时使用此工具。返回匹配结果列表。',
  parameters: {
    pattern: {
      type: 'string',
      description: '正则表达式模式（不含分隔符）',
      required: true,
    },
    text: {
      type: 'string',
      description: '要测试的文本',
      required: true,
    },
    flags: {
      type: 'string',
      description: '正则标志（默认 "g"）',
      required: false,
    },
  },
  async execute(params) {
    const pattern = params.pattern as string;
    const text = params.text as string;
    const flags = (params.flags as string) || 'g';

    try {
      const regex = new RegExp(pattern, flags);
      const matches: Array<{
        match: string;
        index: number;
        groups: string[];
      }> = [];

      let m: RegExpExecArray | null;
      let count = 0;
      while ((m = regex.exec(text)) !== null && count < 50) {
        matches.push({
          match: m[0],
          index: m.index,
          groups: m.slice(1),
        });
        if (!flags.includes('g')) break;
        count++;
      }

      const summary = matches.length === 0
        ? '没有匹配结果'
        : `找到 ${matches.length} 个匹配`;

      const details = matches
        .map((match, i) => {
          let line = `${i + 1}. "${match.match}" (位置 ${match.index})`;
          if (match.groups.length > 0) {
            line += ` 捕获组: ${match.groups.map((g, j) => `$${j + 1}="${g}"`).join(', ')}`;
          }
          return line;
        })
        .join('\n');

      return {
        success: true,
        output: `${summary}\n\n${details}`,
      };
    } catch (e) {
      return {
        success: false,
        output: '',
        error: `正则表达式错误：${e instanceof Error ? e.message : String(e)}`,
      };
    }
  },
};

// --- Code Review Tool ---

const codeReviewTool: AgentTool = {
  id: 'code-review',
  name: '代码审查',
  description:
    '审查代码质量。当用户提供代码并要求审查、检查、分析代码质量、发现潜在问题时使用此工具。返回评分、问题列表和改进建议。',
  parameters: {
    code: {
      type: 'string',
      description: '要审查的代码',
      required: true,
    },
    language: {
      type: 'string',
      description: '编程语言',
      required: true,
      enum: [
        'javascript',
        'typescript',
        'python',
        'java',
        'go',
        'rust',
        'css',
        'html',
        'sql',
      ],
    },
  },
  async execute(params) {
    const code = params.code as string;
    const language = params.language as CodeLanguage;

    try {
      const result = analyzeCode(code, language);

      const issuesSummary = result.issues.length === 0
        ? '没有发现问题'
        : result.issues
            .slice(0, 10)
            .map(
              (issue) =>
                `- [${issue.severity}] 行 ${issue.line}: ${issue.message} (${issue.category})`,
            )
            .join('\n');

      const output = [
        `评分: ${result.score}/100 (${result.grade})`,
        `复杂度: ${result.stats.complexity}`,
        `代码行数: ${result.stats.codeLines}，注释行数: ${result.stats.commentLines}`,
        `问题数: ${result.stats.issueCount}`,
        '',
        '问题列表:',
        issuesSummary,
      ].join('\n');

      return { success: true, output };
    } catch (e) {
      return {
        success: false,
        output: '',
        error: `代码审查失败：${e instanceof Error ? e.message : String(e)}`,
      };
    }
  },
};

// --- Tool Registry ---

export const agentTools: AgentTool[] = [
  jsonFormatterTool,
  regexTesterTool,
  codeReviewTool,
];

/** Get a tool by ID */
export function getTool(id: string): AgentTool | undefined {
  return agentTools.find((t) => t.id === id);
}

/** Get tool definitions in Anthropic's tool_use format */
export function getAnthropicToolDefinitions() {
  return agentTools.map((tool) => ({
    name: tool.id,
    description: tool.description,
    input_schema: {
      type: 'object' as const,
      properties: Object.fromEntries(
        Object.entries(tool.parameters).map(([key, param]) => [
          key,
          {
            type: param.type,
            description: param.description,
            ...(param.enum ? { enum: param.enum } : {}),
          },
        ]),
      ),
      required: Object.entries(tool.parameters)
        .filter(([, param]) => param.required)
        .map(([key]) => key),
    },
  }));
}

/** Get tool definitions in OpenAI's function calling format */
export function getOpenAIToolDefinitions() {
  return agentTools.map((tool) => ({
    type: 'function' as const,
    function: {
      name: tool.id,
      description: tool.description,
      parameters: {
        type: 'object',
        properties: Object.fromEntries(
          Object.entries(tool.parameters).map(([key, param]) => [
            key,
            {
              type: param.type,
              description: param.description,
              ...(param.enum ? { enum: param.enum } : {}),
            },
          ]),
        ),
        required: Object.entries(tool.parameters)
          .filter(([, param]) => param.required)
          .map(([key]) => key),
      },
    },
  }));
}
