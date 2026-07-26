import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { tools, iconMap } from '@/data';
import { useHistoryStore } from '@/store/useHistoryStore';
import type { LucideIcon } from 'lucide-react';
import type { Tool } from '@/types/tool';

interface RecentTool extends Tool {
  lastUsed: number;
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  return `${days} 天前`;
}

export function RecentTools() {
  const entries = useHistoryStore((s) => s.entries);

  const recentTools = useMemo(() => {
    // Deduplicate: keep only the most recent entry per toolId
    const seen = new Map<string, number>();
    for (const entry of entries) {
      if (!seen.has(entry.toolId)) {
        seen.set(entry.toolId, entry.timestamp);
      }
    }
    const result: RecentTool[] = [];
    for (const [toolId, lastUsed] of seen) {
      const tool = tools.find((t) => t.id === toolId);
      if (tool) result.push({ ...tool, lastUsed });
    }
    return result.sort((a, b) => b.lastUsed - a.lastUsed).slice(0, 6);
  }, [entries]);

  if (recentTools.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-tertiary text-text-muted">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-text-primary">暂无使用记录</h3>
          <p className="mt-1 text-xs text-text-muted">开始使用工具，记录将出现在这里</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="!p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">最近使用</h3>
      </div>
      <div className="space-y-1">
        {recentTools.map((tool, i) => {
          const Icon = (iconMap[tool.icon] ?? Clock) as LucideIcon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
            >
              <Link
                to={tool.route}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-bg-tertiary"
              >
                <div className="bg-accent/10 flex h-8 w-8 items-center justify-center rounded-lg text-accent">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-text-primary">{tool.name}</div>
                </div>
                <span className="shrink-0 text-xs text-text-muted">
                  {formatTimeAgo(tool.lastUsed)}
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-text-muted" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
