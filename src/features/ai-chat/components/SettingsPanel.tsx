import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useChatStore } from '@/store/useChatStore';
import { useAppStore } from '@/store/useAppStore';
import { AI_PROVIDERS } from '@/constants/ai-providers';
import { cn } from '@/utils/cn';

export function SettingsPanel() {
  const settings = useChatStore((s) => s.settings);
  const updateSettings = useChatStore((s) => s.updateSettings);
  const isSettingsOpen = useAppStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);

  const currentProvider =
    AI_PROVIDERS.find((p) => p.name === settings.providerName) ?? AI_PROVIDERS[0];
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
    <Modal open={isSettingsOpen} onClose={() => setSettingsOpen(false)} title="AI 设置">
      <div className="space-y-4">
        {/* Provider */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            模型服务商
          </label>
          <div className="grid grid-cols-3 gap-2">
            {AI_PROVIDERS.map((p) => (
              <button
                key={p.name}
                onClick={() => handleProviderChange(p.name)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  settings.providerName === p.name
                    ? 'bg-accent/10 border-accent text-accent'
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
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              API Base URL
            </label>
            <Input
              value={settings.baseUrl}
              onChange={(e) => updateSettings({ baseUrl: e.target.value })}
              placeholder={currentProvider.defaultBase || 'https://your-api.com'}
            />
          </div>
        )}

        {/* API Key */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">API Key</label>
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
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">模型</label>
          {models.length > 0 ? (
            <select
              value={settings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
              className="h-9 w-full rounded-lg border border-border bg-bg-tertiary px-3 text-sm text-text-primary outline-none focus:border-accent"
            >
              {models.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
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
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
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
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            System Prompt
          </label>
          <textarea
            value={settings.systemPrompt}
            onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-bg-tertiary p-3 text-sm text-text-primary outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => setSettingsOpen(false)}>保存并关闭</Button>
      </div>
    </Modal>
  );
}
