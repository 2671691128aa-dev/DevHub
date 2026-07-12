import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useChatStore } from '@/store/useChatStore';
import { AI_PROVIDERS } from '@/constants/ai-providers';
import { cn } from '@/utils/cn';

export function SettingsPanel() {
  const settings = useChatStore((s) => s.settings);
  const updateSettings = useChatStore((s) => s.updateSettings);
  const isSettingsOpen = useChatStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useChatStore((s) => s.setSettingsOpen);

  if (!isSettingsOpen) return null;

  const currentProvider = AI_PROVIDERS.find((p) => p.name === settings.providerName) ?? AI_PROVIDERS[0];
  const models = currentProvider.models;

  const handleProviderChange = (name: string) => {
    const provider = AI_PROVIDERS.find((p) => p.name === name)!;
    updateSettings({
      providerName: name,
      provider: provider.id,
      baseUrl: provider.defaultBase,
      model: provider.models[0]?.value ?? '',
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
              {AI_PROVIDERS.map((p) => (
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

          {/* Base URL */}
          {settings.provider === 'openai-compatible' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">API Base URL</label>
              <Input
                value={settings.baseUrl}
                onChange={(e) => updateSettings({ baseUrl: e.target.value })}
                placeholder={currentProvider.defaultBase || 'https://your-api.com'}
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
