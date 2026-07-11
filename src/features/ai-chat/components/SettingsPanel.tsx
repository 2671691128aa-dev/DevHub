import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useChatStore } from '@/store/useChatStore';

export function SettingsPanel() {
  const settings = useChatStore((s) => s.settings);
  const updateSettings = useChatStore((s) => s.updateSettings);
  const isSettingsOpen = useChatStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useChatStore((s) => s.setSettingsOpen);

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSettingsOpen(false)}>
      <div className="w-full max-w-md rounded-xl border border-border bg-bg-secondary p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI 设置</h2>
          <button onClick={() => setSettingsOpen(false)} className="text-text-muted hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">API Key</label>
            <Input
              type="password"
              value={settings.apiKey}
              onChange={(e) => updateSettings({ apiKey: e.target.value })}
              placeholder="sk-ant-..."
            />
            <p className="mt-1 text-xs text-text-muted">密钥仅存储在本地浏览器中</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">模型</label>
            <select
              value={settings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
              className="h-9 w-full rounded-lg bg-bg-tertiary border border-border px-3 text-sm text-text-primary outline-none focus:border-accent"
            >
              <option value="claude-sonnet-4-20250514">Claude Sonnet</option>
              <option value="claude-haiku-4-20250414">Claude Haiku</option>
            </select>
          </div>

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
