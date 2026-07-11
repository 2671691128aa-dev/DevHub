import type { PromptTemplate } from '@/types/chat';

export const promptTemplates: PromptTemplate[] = [
  {
    id: 'code-review',
    name: '代码审查',
    description: '审查代码质量、性能和潜在问题',
    prompt: '请帮我审查以下代码，关注代码质量、性能、可读性和潜在问题：\n\n```\n// 在这里粘贴代码\n```',
    category: 'coding',
  },
  {
    id: 'explain-code',
    name: '解释代码',
    description: '逐行解释代码逻辑',
    prompt: '请逐行解释以下代码的功能和逻辑：\n\n```\n// 在这里粘贴代码\n```',
    category: 'coding',
  },
  {
    id: 'generate-test',
    name: '生成测试',
    description: '为代码生成单元测试',
    prompt: '请为以下代码生成完整的单元测试：\n\n```\n// 在这里粘贴代码\n```',
    category: 'coding',
  },
  {
    id: 'summarize',
    name: '文本摘要',
    description: '提取文本的核心要点',
    prompt: '请用简洁的语言总结以下内容的核心要点：\n\n',
    category: 'writing',
  },
  {
    id: 'translate',
    name: '中英翻译',
    description: '在中文和英文之间翻译',
    prompt: '请将以下内容翻译成英文（如果是英文则翻译成中文）：\n\n',
    category: 'writing',
  },
  {
    id: 'analyze',
    name: '问题分析',
    description: '深入分析一个技术问题',
    prompt: '请深入分析以下技术问题，给出原因、影响和解决方案：\n\n',
    category: 'analysis',
  },
];
