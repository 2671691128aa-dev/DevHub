import { type FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

type ErrorFallbackVariant = 'page' | 'section' | 'inline';

export interface ErrorFallbackProps extends FallbackProps {
  variant?: ErrorFallbackVariant;
  title?: string;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  variant = 'page',
  title,
}: ErrorFallbackProps) {
  const heading = title ?? '出了点问题';
  const message = error instanceof Error ? error.message : '未知错误';

  if (variant === 'inline') {
    return (
      <div className="border-error/30 bg-error/5 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-error" />
        <span className="text-error">{message}</span>
        <button
          onClick={resetErrorBoundary}
          className="ml-auto shrink-0 text-accent transition-colors hover:text-accent-hover"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        variant === 'page'
          ? 'min-h-[60vh] p-8'
          : 'my-4 rounded-xl border border-border bg-bg-secondary p-8',
      )}
    >
      <div className="bg-error/10 flex h-12 w-12 items-center justify-center rounded-full">
        <AlertTriangle className="h-6 w-6 text-error" />
      </div>

      <div className="text-center">
        <h2
          className={cn(
            'font-semibold text-text-primary',
            variant === 'page' ? 'text-lg' : 'text-base',
          )}
        >
          {heading}
        </h2>
        <p className="mt-1 max-w-md text-sm text-text-secondary">{message}</p>
      </div>

      <Button variant="secondary" size="sm" onClick={resetErrorBoundary}>
        <RefreshCw className="h-3.5 w-3.5" />
        重新加载
      </Button>
    </div>
  );
}
