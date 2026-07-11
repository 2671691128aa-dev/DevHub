import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useChatStore } from '@/store/useChatStore';
import type { AIProvider } from '@/types/chat';
import { cn } from '@/utils/cn';

const providers: { id: AIProvider; name: string; defaultBase: string; keyPlaceholder: string }[] = [
  { id: 'anthropic', name: 'Anthropic', defaultBase: '', keyPlaceholder: 'sk-ant-...' },
  { id: 'openai-compatible', name: 'DeepSeek', defaultBase: 'https://api.deepseek.com', keyPlaceholder: 'sk-...' },
  { id: 'openai-compatible', name: '通义千问', defaultBase: 'https://dashscope.aliyuncs.com/compatible-mode', keyPlaceholder: 'sk-...' },
  { id: 'openai-compatible', name: '智谱 GLM', defaultBase: 'https://open.bigmodel.cn/api/paas', keyPlaceholder: '...' },
  { id: 'openai-compatible', name: '月之暗面', defaultBase: 'https://api.moonshot.cn', keyPlaceholder: 'sk-...' },
  { id: 'openai-compatible', name: '自定义', defaultBase: '', keyPlaceholder: 'API Key' },
];

const modelOptions: Record<string, { label: string; value: string }[]> = {
  anthropic: [
    { label: 'Claude Fable 5', value: 'claude-fable-5' },
    { label: 'Claude Opus 4.8', value: 'claude-opus-4-8' },
    { label: 'Claude Sonnet 4', value: 'claude-sonnet-4-20250514' },
    { label: 'Claude Haiku 3.5', value: 'claude-haiku-4-20250414' },
    { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20241022' },
  ],
  deepseek: [
    { label: 'DeepSeek-V3', value: 'deepseek-chat' },
    { label: 'DeepSeek-R1', value: 'deepseek-reasoner' },
  ],
  qwen: [
    { label: 'Qwen-Max', value: 'qwen-max' },
    { label: 'Qwen-Plus', value: 'qwen-plus' },
    { label: 'Qwen-Turbo', value: 'qwen-turbo' },
  ],
  glm: [
    { label: 'GLM-4-Plus', value: 'glm-4-plus' },
    { label: 'GLM-4', value: 'glm-4' },
    { label: 'GLM-4-Flash', value: 'glm-4-flash' },
  ],
  moonshot: [
    { label: 'Moonshot-v1-128k', value: 'moonshot-v1-128k' },
    { label: 'Moonshot-v1-32k', value: 'moonshot-v1-32k' },
    { label: 'Moonshot-v1-8k', value: 'moonshot-v1-8k' },
  ],
  custom: [],
};

function getModelList(name: string) {
  switch (name) {
    case 'Anthropic': return modelOptions.anthropic;
    case 'DeepSeek': return modelOptions.deepseek;
    case '通义千问': return modelOptions.qwen;
    case '智谱 GLM': return modelOptions.glm;
    case '月之暗面': return modelOptions.moonshot;
    default: return [];
  }
}

export function SettingsPanel() {
  const settings = useChatStore((s) => s.settings);
  const updateSettings = useChatStore((s) => s.updateSettings);
  const isSettingsOpen = useChatStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useChatStore((s) => s.setSettingsOpen);

  if (!isSettingsOpen) return null;

  const currentProvider = providers.find((p) => p.name === settings.providerName) ?? providers[0];
  const models = getModelList(settings.providerName ?? 'Anthropic');

  const handleProviderChange = (name: string) => {
    const provider = providers.find((p) => p.name === name)!;
    const models = getModelList(name);
    updateSettings({
      providerName: name,
      provider: provider.id,
      baseUrl: provider.defaultBase,
      model: models[0]?.value ?? '',
      apiKey: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSettingsOpen(false)}>
      <div className="w-full max-w-md rounded-xl border border-border bg-bg-secondary p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI 设置</h2>
          <button onClick={() => setSettingsOpen(false)} className="text-text-muted hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {/* Provider */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">模型服务商</label>
            <div className="grid grid-cols-3 gap-2">
              {providers.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handleProviderChange(p.name)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                    settings.providerName === p.name
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-text-secondary hover:border-border-hover hover:text-text-primary',
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Base URL (only for openai-compatible) */}
          {settings.provider === 'openai-compatible' && settings.providerName !== '自定义' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">API Base URL</label>
              <Input
                value={settings.baseUrl}
                onChange={(e) => updateSettings({ baseUrl: e.target.value })}
                placeholder={currentProvider.defaultBase}
              />
            </div>
          )}

          {settings.providerName === '自定义' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">API Base URL</label>
              <Input
                value={settings.baseUrl}
                onChange={(e) => updateSettings({ baseUrl: e.target.value })}
                placeholder="https://your-api.com"
              />
            </div>
          )}

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">API Key</label>
            <Input
              type="password"
              value={settings.apiKey}
              onChange={(e) => updateSettings({ apiKey: e.target.value })}
              placeholder={currentProvider.keyPlaceholder}
            />
            <p className="mt-1 text-xs text-text-muted">密钥仅存储在本地浏览器中</p>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">模型</label>
            {models.length > 0 ? (
              <select
                value={settings.model}
                onChange={(e) => updateSettings({ model: e.target.value })}
                className="h-9 w-full rounded-lg bg-bg-tertiary border border-border px-3 text-sm text-text-primary outline-none focus:border-accent"
              >
                {models.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            ) : (
              <Input
                value={settings.model}
                onChange={(e) => updateSettings({ model: e.target.value })}
                placeholder="输入模型名称"
              />
            )}
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Temperature: {settings.temperature}
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={settings.temperature}
              onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
              className="w-full accent-accent"
            />
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">System Prompt</label>
            <textarea
              value={settings.systemPrompt}
              onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
              rows={3}
              className="w-full rounded-lg bg-bg-tertiary border border-border p-3 text-sm text-text-primary outline-none focus:border-accent resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={() => setSettingsOpen(false)}>保存并关闭</Button>
        </div>
      </div>
    </div>
  );
}
