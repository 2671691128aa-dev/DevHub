import type { AIProvider } from '@/types/chat';

export interface ProviderConfig {
  id: AIProvider;
  name: string;
  defaultBase: string;
  keyPlaceholder: string;
  models: { label: string; value: string }[];
}

export const AI_PROVIDERS: ProviderConfig[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    defaultBase: '',
    keyPlaceholder: 'sk-ant-...',
    models: [
      { label: 'Claude Fable 5', value: 'claude-fable-5' },
      { label: 'Claude Opus 4.8', value: 'claude-opus-4-8' },
      { label: 'Claude Sonnet 4', value: 'claude-sonnet-4-20250514' },
      { label: 'Claude Haiku 3.5', value: 'claude-haiku-4-20250414' },
      { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20241022' },
    ],
  },
  {
    id: 'openai-compatible',
    name: 'DeepSeek',
    defaultBase: 'https://api.deepseek.com',
    keyPlaceholder: 'sk-...',
    models: [
      { label: 'DeepSeek-V3', value: 'deepseek-chat' },
      { label: 'DeepSeek-R1', value: 'deepseek-reasoner' },
    ],
  },
  {
    id: 'openai-compatible',
    name: '通义千问',
    defaultBase: 'https://dashscope.aliyuncs.com/compatible-mode',
    keyPlaceholder: 'sk-...',
    models: [
      { label: 'Qwen-Max', value: 'qwen-max' },
      { label: 'Qwen-Plus', value: 'qwen-plus' },
      { label: 'Qwen-Turbo', value: 'qwen-turbo' },
    ],
  },
  {
    id: 'openai-compatible',
    name: '智谱 GLM',
    defaultBase: 'https://open.bigmodel.cn/api/paas',
    keyPlaceholder: '...',
    models: [
      { label: 'GLM-4-Plus', value: 'glm-4-plus' },
      { label: 'GLM-4', value: 'glm-4' },
      { label: 'GLM-4-Flash', value: 'glm-4-flash' },
    ],
  },
  {
    id: 'openai-compatible',
    name: '月之暗面',
    defaultBase: 'https://api.moonshot.cn',
    keyPlaceholder: 'sk-...',
    models: [
      { label: 'Moonshot-v1-128k', value: 'moonshot-v1-128k' },
      { label: 'Moonshot-v1-32k', value: 'moonshot-v1-32k' },
      { label: 'Moonshot-v1-8k', value: 'moonshot-v1-8k' },
    ],
  },
  {
    id: 'openai-compatible',
    name: '自定义',
    defaultBase: '',
    keyPlaceholder: 'API Key',
    models: [],
  },
];
