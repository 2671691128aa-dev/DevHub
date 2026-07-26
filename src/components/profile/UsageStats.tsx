import { useMemo } from 'react';
import { BarChart3, Clock, Wrench, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { tools, categories } from '@/data';
import type { ToolCategory } from '@/types/tool';

export function UsageStats() {
  const entries = useHistoryStore((s) => s.entries);
  const favoriteIds = useFavoriteStore((s) => s.favoriteIds);

  const stats = useMemo(() => {
    const totalUses = entries.length;

    // Most used tool
    const toolCounts = new Map<string, number>();
    entries.forEach((e) => {
      toolCounts.set(e.toolId, (toolCounts.get(e.toolId) ?? 0) + 1);
    });
    let favoriteToolId: string | null = null;
    let maxCount = 0;
    for (const [id, count] of toolCounts) {
      if (count > maxCount) {
        favoriteToolId = id;
        maxCount = count;
      }
    }
    const favoriteTool = favoriteToolId ? tools.find((t) => t.id === favoriteToolId) : null;

    // Category breakdown
    const categoryCounts = new Map<ToolCategory, number>();
    entries.forEach((e) => {
      const tool = tools.find((t) => t.id === e.toolId);
      if (tool) {
        categoryCounts.set(tool.category, (categoryCounts.get(tool.category) ?? 0) + 1);
      }
    });

    // Daily usage (last 7 days) — bucket entries into a date→count Map in one pass
    const dateCounts = new Map<string, number>();
    entries.forEach((e) => {
      const key = new Date(e.timestamp).toISOString().slice(0, 10);
      dateCounts.set(key, (dateCounts.get(key) ?? 0) + 1);
    });
    const dailyUsage: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
      dailyUsage.push({ date: label, count: dateCounts.get(key) ?? 0 });
    }

    return { totalUses, favoriteTool, categoryCounts, dailyUsage };
  }, [entries]);

  const maxDaily = Math.max(...stats.dailyUsage.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="!p-3 text-center">
          <Clock className="mx-auto h-5 w-5 text-accent" />
          <div className="mt-1 text-lg font-bold text-text-primary">{stats.totalUses}</div>
          <div className="text-[10px] text-text-muted">总使用次数</div>
        </Card>
        <Card className="!p-3 text-center">
          <Star className="mx-auto h-5 w-5 text-yellow-500" />
          <div className="mt-1 text-lg font-bold text-text-primary">{favoriteIds.length}</div>
          <div className="text-[10px] text-text-muted">收藏工具</div>
        </Card>
        <Card className="!p-3 text-center">
          <Wrench className="mx-auto h-5 w-5 text-green-500" />
          <div className="mt-1 text-lg font-bold text-text-primary">
            {stats.favoriteTool ? stats.favoriteTool.name.slice(0, 4) : '-'}
          </div>
          <div className="text-[10px] text-text-muted">最常用</div>
        </Card>
      </div>

      {/* 7-day Bar Chart */}
      <Card className="!p-4">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-text-muted" />
          <h3 className="text-sm font-semibold text-text-primary">近 7 天使用趋势</h3>
        </div>
        <div className="flex h-24 items-end gap-2">
          {stats.dailyUsage.map((day) => (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full items-end justify-center" style={{ height: '64px' }}>
                <div
                  className="bg-accent/30 w-full max-w-[32px] rounded-t-md transition-all"
                  style={{
                    height: `${Math.max((day.count / maxDaily) * 100, 4)}%`,
                    backgroundColor: day.count > 0 ? undefined : undefined,
                  }}
                >
                  {day.count > 0 && <div className="bg-accent/60 h-full w-full rounded-t-md" />}
                </div>
              </div>
              <span className="text-[10px] text-text-muted">{day.date}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card className="!p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">分类使用分布</h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const count = stats.categoryCounts.get(cat.id as ToolCategory) ?? 0;
            const pct = stats.totalUses > 0 ? Math.round((count / stats.totalUses) * 100) : 0;
            return (
              <div key={cat.id} className="flex items-center gap-3">
                <Badge
                  color={
                    cat.id === 'developer'
                      ? 'blue'
                      : cat.id === 'ai'
                        ? 'purple'
                        : cat.id === 'document'
                          ? 'green'
                          : 'yellow'
                  }
                >
                  {cat.name}
                </Badge>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-tertiary">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs text-text-muted">{pct}%</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
