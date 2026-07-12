import { CheckCircle, XCircle } from 'lucide-react';
import type { JsonError, JsonStats } from '@/types/common';

export interface ValidationStatusProps {
  isValid: boolean;
  error: JsonError | null;
  stats: JsonStats;
}

export function ValidationStatus({ isValid, error, stats }: ValidationStatusProps) {
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-2 text-sm">
      <div className="flex items-center gap-2">
        {isValid ? (
          <>
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-success">JSON 有效</span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-error" />
            <span className="text-error">{error?.message}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-4 text-text-muted">
        <span>{stats.lines} 行</span>
        <span>{stats.size}</span>
        <span>{stats.keys} 键</span>
        <span>深度 {stats.depth}</span>
      </div>
    </div>
  );
}
