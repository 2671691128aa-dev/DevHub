import { cn } from '@/utils/cn';

export interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export function JsonEditor({ value, onChange, readOnly = false, placeholder }: JsonEditorProps) {
  const lines = value ? value.split('\n').length : 1;

  return (
    <div className="flex h-full overflow-hidden rounded-lg border border-border bg-bg-tertiary">
      {/* Line numbers */}
      <div className="flex flex-col items-end py-3 pr-3 pl-3 text-right font-mono text-xs text-text-muted select-none bg-bg-secondary border-r border-border">
        {Array.from({ length: Math.max(lines, 10) }, (_, i) => (
          <div key={i} className="leading-6">{i + 1}</div>
        ))}
      </div>
      {/* Editor */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        spellCheck={false}
        className={cn(
          'flex-1 resize-none bg-transparent p-3 font-mono text-sm text-text-primary outline-none placeholder:text-text-muted leading-6',
          readOnly && 'cursor-default',
        )}
      />
    </div>
  );
}
