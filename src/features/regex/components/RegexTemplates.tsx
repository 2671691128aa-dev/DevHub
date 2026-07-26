import { cn } from '@/utils/cn';
import { REGEX_TEMPLATES } from '@/constants/regex-templates';

export interface RegexTemplatesProps {
  onSelect: (pattern: string) => void;
  selectedId?: string;
}

export function RegexTemplates({ onSelect, selectedId }: RegexTemplatesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {REGEX_TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.pattern)}
          className={cn(
            'rounded-lg border px-3 py-2 text-left transition-all hover:-translate-y-0.5',
            selectedId === template.id
              ? 'bg-accent/10 border-accent'
              : 'border-border bg-bg-secondary hover:border-border-hover',
          )}
          title={template.description}
        >
          <div className="text-sm font-medium text-text-primary">{template.name}</div>
          <code className="mt-0.5 block max-w-[180px] truncate text-xs text-text-muted">
            {template.pattern}
          </code>
        </button>
      ))}
    </div>
  );
}
