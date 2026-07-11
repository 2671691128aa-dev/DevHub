import { cn } from '@/utils/cn';
import { regexTemplates } from '../data/templates';

interface RegexTemplatesProps {
  onSelect: (pattern: string) => void;
  selectedId?: string;
}

export function RegexTemplates({ onSelect, selectedId }: RegexTemplatesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {regexTemplates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.pattern)}
          className={cn(
            'rounded-lg border px-3 py-2 text-left transition-all hover:-translate-y-0.5',
            selectedId === template.id
              ? 'border-accent bg-accent/10'
              : 'border-border bg-bg-secondary hover:border-border-hover',
          )}
          title={template.description}
        >
          <div className="text-sm font-medium text-text-primary">{template.name}</div>
          <code className="mt-0.5 block text-xs text-text-muted truncate max-w-[180px]">
            {template.pattern}
          </code>
        </button>
      ))}
    </div>
  );
}
