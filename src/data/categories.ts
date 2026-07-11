import type { ToolCategoryConfig } from '@/types/tool';

export const categories: ToolCategoryConfig[] = [
  {
    id: 'developer',
    name: '开发工具',
    icon: 'Code2',
    color: '#3B82F6',
    description: 'JSON 格式化、正则测试、编解码等常用开发工具',
  },
  {
    id: 'ai',
    name: 'AI 工具',
    icon: 'Bot',
    color: '#8B5CF6',
    description: 'AI 聊天助手、代码生成、智能分析',
  },
  {
    id: 'document',
    name: '文档工具',
    icon: 'FileText',
    color: '#22C55E',
    description: 'Markdown 编辑、文档转换、格式处理',
  },
  {
    id: 'network',
    name: '网络工具',
    icon: 'Globe',
    color: '#EAB308',
    description: 'HTTP 测试、URL 编解码、Header 分析',
  },
];
