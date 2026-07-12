import { cn } from '@/utils/cn';
import { useChatStore } from '@/store/useChatStore';
import { PROMPT_TEMPLATES } from '@/constants/prompt-templates';
import { PROMPT_INSERT_EVENT } from '@/constants/defaults';
import type { PromptTemplate } from '@/types/chat';

const categoryLabels: Record<string, string> = {
  coding: '编程',
  writing: '写作',
  analysis: '分析',
};

export function PromptPanel() {
  const isStreaming = useChatStore((s) => s.isStreaming);

  const handleSelect = (template: PromptTemplate) => {
    window.dispatchEvent(new CustomEvent(PROMPT_INSERT_EVENT, { detail: template.prompt }));
  };

  return (
    <div className="w-64 shrink-0 rounded-xl border border-border bg-bg-secondary p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-text-primary">提示词模板</h3>
      <p className="mt-0.5 text-xs text-text-muted">点击快速填充</p>

      {(['coding', 'writing', 'analysis'] as const).map((cat) => {
        const templates = PROMPT_TEMPLATES.filter((t) => t.category === cat);
        return (
          <div key={cat} className="mt-4">
            <div className="text-xs font-medium text-text-muted">{categoryLabels[cat]}</div>
            <div className="mt-1.5 space-y-1">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => !isStreaming && handleSelect(t)}
                  disabled={isStreaming}
                  className={cn(
                    'w-full rounded-lg border border-border px-3 py-2 text-left transition-colors',
                    'hover:border-border-hover hover:bg-bg-tertiary',
                    'disabled:opacity-50 disabled:pointer-events-none',
                  )}
                >
                  <div className="text-sm font-medium text-text-primary">{t.name}</div>
                  <div className="text-xs text-text-muted line-clamp-1">{t.description}</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
