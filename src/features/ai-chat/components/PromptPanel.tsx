import { cn } from '@/utils/cn';
import { useChatStore } from '@/store/useChatStore';
import { PROMPT_TEMPLATES } from '@/constants/prompt-templates';
import type { PromptTemplate } from '@/types/chat';

const categoryLabels: Record<string, string> = {
  coding: '编程',
  writing: '写作',
  analysis: '分析',
};

export interface PromptPanelProps {
  onInsert: (text: string) => void;
}

export function PromptPanel({ onInsert }: PromptPanelProps) {
  const isStreaming = useChatStore((s) => s.isStreaming);

  const handleSelect = (template: PromptTemplate) => {
    onInsert(template.prompt);
  };

  return (
    <div className="w-64 shrink-0 overflow-y-auto rounded-xl border border-border bg-bg-secondary p-4">
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
                    'disabled:pointer-events-none disabled:opacity-50',
                  )}
                >
                  <div className="text-sm font-medium text-text-primary">{t.name}</div>
                  <div className="line-clamp-1 text-xs text-text-muted">{t.description}</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
