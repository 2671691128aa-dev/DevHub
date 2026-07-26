import { memo } from 'react';
import { cn } from '@/utils/cn';

export interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export const JsonEditor = memo(function JsonEditor({
  value,
  onChange,
  readOnly = false,
  placeholder,
}: JsonEditorProps) {
  const lines = value ? value.split('\n').length : 1;

  return (
    <div className="flex h-full overflow-hidden rounded-lg border border-border bg-bg-tertiary">
      {/* Line numbers */}
      <div className="flex select-none flex-col items-end border-r border-border bg-bg-secondary py-3 pl-3 pr-3 text-right font-mono text-xs text-text-muted">
        {Array.from({ length: Math.max(lines, 10) }, (_, i) => (
          <div key={i} className="leading-6">
            {i + 1}
          </div>
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
          'flex-1 resize-none bg-transparent p-3 font-mono text-sm leading-6 text-text-primary outline-none placeholder:text-text-muted',
          readOnly && 'cursor-default',
        )}
      />
    </div>
  );
});
