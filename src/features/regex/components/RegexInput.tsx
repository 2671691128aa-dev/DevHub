import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/cn';

export interface RegexInputProps {
  pattern: string;
  onPatternChange: (value: string) => void;
  flags: string;
  onFlagsChange: (flags: string) => void;
  isValid: boolean;
}

const flagOptions = [
  { flag: 'g', label: 'Global' },
  { flag: 'i', label: 'Ignore case' },
  { flag: 'm', label: 'Multiline' },
  { flag: 's', label: 'Dotall' },
];

export function RegexInput({
  pattern,
  onPatternChange,
  flags,
  onFlagsChange,
  isValid,
}: RegexInputProps) {
  const toggleFlag = (flag: string) => {
    onFlagsChange(flags.includes(flag) ? flags.replace(flag, '') : flags + flag);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-text-muted">/</span>
        <div className="flex-1">
          <Input
            value={pattern}
            onChange={(e) => onPatternChange(e.target.value)}
            placeholder="输入正则表达式..."
            className={cn('font-mono', !isValid && 'border-error')}
          />
        </div>
        <span className="font-mono text-sm text-text-muted">/{flags}</span>
      </div>
      <div className="flex items-center gap-2">
        {flagOptions.map((opt) => (
          <button
            key={opt.flag}
            onClick={() => toggleFlag(opt.flag)}
            className={cn(
              'flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
              flags.includes(opt.flag)
                ? 'bg-accent/10 border-accent text-accent'
                : 'border-border text-text-muted hover:border-border-hover hover:text-text-secondary',
            )}
            title={opt.label}
          >
            <span className="font-mono">{opt.flag}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
