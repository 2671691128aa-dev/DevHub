import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, prefix, suffix, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 flex items-center text-text-muted">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'h-9 w-full rounded-lg bg-bg-tertiary border border-border px-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent',
            prefix && 'pl-9',
            suffix && 'pr-9',
            className,
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 flex items-center text-text-muted">
            {suffix}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input, type InputProps };
