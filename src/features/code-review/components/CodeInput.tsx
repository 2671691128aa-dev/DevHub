import { useMemo } from 'react';
import { cn } from '@/utils/cn';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CodeInput({ value, onChange, placeholder }: CodeInputProps) {
  const lineCount = useMemo(() => {
    return value.split('\n').length;
  }, [value]);

  return (
    <div className="flex overflow-hidden rounded-xl border border-border bg-bg-tertiary">
      {/* Line numbers */}
      <div className="select-none border-r border-border bg-bg-secondary px-3 py-4 text-right">
        {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
          <div
            key={i}
            className={cn(
              'font-mono text-xs leading-5',
              i < lineCount ? 'text-text-muted' : 'text-transparent',
            )}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Code textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || '在此粘贴代码...'}
        spellCheck={false}
        className="flex-1 resize-none bg-transparent px-4 py-4 font-mono text-sm leading-5 text-text-primary outline-none placeholder:text-text-muted"
        style={{ minHeight: '300px', tabSize: 2 }}
      />
    </div>
  );
}
