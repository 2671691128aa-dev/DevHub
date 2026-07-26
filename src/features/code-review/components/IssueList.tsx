import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { CodeIssue, Severity } from '../types';

interface IssueListProps {
  issues: CodeIssue[];
}

const severityConfig: Record<Severity, { icon: typeof AlertCircle; color: string; label: string }> =
  {
    error: { icon: AlertCircle, color: 'red', label: '错误' },
    warning: { icon: AlertTriangle, color: 'yellow', label: '警告' },
    info: { icon: Info, color: 'blue', label: '提示' },
    suggestion: { icon: Lightbulb, color: 'green', label: '建议' },
  };

const severityOrder: Severity[] = ['error', 'warning', 'info', 'suggestion'];

export function IssueList({ issues }: IssueListProps) {
  const grouped = severityOrder
    .map((sev) => ({
      severity: sev,
      items: issues.filter((i) => i.severity === sev),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">问题列表 ({issues.length})</h3>
      {grouped.map((group) => {
        const config = severityConfig[group.severity];
        const Icon = config.icon;
        return (
          <div key={group.severity}>
            <div className="mb-2 flex items-center gap-2">
              <Icon
                className="h-4 w-4"
                style={{
                  color: `var(--${config.color === 'red' ? 'error' : config.color === 'yellow' ? 'warning' : config.color === 'blue' ? 'accent' : 'success'})`,
                }}
              />
              <span className="text-xs font-medium text-text-secondary">
                {config.label} ({group.items.length})
              </span>
            </div>
            <div className="space-y-1.5">
              {group.items.map((issue, i) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="rounded-lg border border-border bg-bg-secondary p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge color={config.color as 'blue' | 'yellow' | 'green' | 'gray'}>
                          {issue.rule}
                        </Badge>
                        {issue.line && (
                          <span className="font-mono text-xs text-text-muted">L{issue.line}</span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm text-text-primary">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="mt-1 text-xs text-accent">💡 {issue.suggestion}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
