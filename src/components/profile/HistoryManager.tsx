import { useMemo } from 'react';
import { Trash2, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useHistoryStore } from '@/store/useHistoryStore';
import { tools, iconMap } from '@/data';
import type { LucideIcon } from 'lucide-react';

export function HistoryManager() {
  const entries = useHistoryStore((s) => s.entries);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  const recentEntries = useMemo(() => {
    return entries.slice(0, 20).map((entry) => {
      const tool = tools.find((t) => t.id === entry.toolId);
      return { ...entry, tool };
    });
  }, [entries]);

  if (entries.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-tertiary text-text-muted">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-text-primary">暂无历史记录</h3>
          <p className="mt-1 text-xs text-text-muted">使用工具后，记录将出现在这里</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="!p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">使用历史 ({entries.length})</h3>
        <Button variant="ghost" size="sm" onClick={clearHistory}>
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          清空
        </Button>
      </div>
      <div className="max-h-80 space-y-1 overflow-y-auto">
        {recentEntries.map((entry, i) => {
          const Icon = entry.tool ? ((iconMap[entry.tool.icon] ?? Clock) as LucideIcon) : Clock;
          return (
            <div
              key={`${entry.toolId}-${entry.timestamp}-${i}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-bg-tertiary"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-bg-tertiary text-text-muted">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-text-primary">
                  {entry.tool?.name ?? entry.toolId}
                </div>
              </div>
              <span className="shrink-0 text-xs text-text-muted">
                {new Date(entry.timestamp).toLocaleString('zh-CN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
