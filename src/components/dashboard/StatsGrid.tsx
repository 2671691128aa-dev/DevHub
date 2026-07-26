import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Star, Clock, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { CountUp } from '@/components/shared/CountUp';
import { tools } from '@/data';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import type { LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export function StatsGrid() {
  const favoriteCount = useFavoriteStore((s) => s.favoriteIds.length);
  const historyEntries = useHistoryStore((s) => s.entries);

  const weeklyUses = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    return historyEntries.filter((e) => e.timestamp >= weekAgo).length;
  }, [historyEntries]);

  // Calculate streak: consecutive days with usage
  const streak = useMemo(() => {
    if (historyEntries.length === 0) return 0;
    const days = new Set<string>();
    historyEntries.forEach((e) => {
      days.add(new Date(e.timestamp).toDateString());
    });
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (days.has(d.toDateString())) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [historyEntries]);

  const stats: StatItem[] = [
    { label: '可用工具', value: tools.length, icon: Wrench, color: '#6366F1' },
    { label: '我的收藏', value: favoriteCount, icon: Star, color: '#F59E0B' },
    { label: '本周使用', value: weeklyUses, icon: Clock, color: '#10B981' },
    { label: '连续天数', value: streak, icon: TrendingUp, color: '#8B5CF6' },
  ];

  return (
    <div className="grid h-full grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="flex"
          >
            <Card className="flex w-full items-center gap-3 !p-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-base font-bold text-text-primary">
                  {typeof stat.value === 'number' ? <CountUp end={stat.value} /> : stat.value}
                </div>
                <div className="truncate text-[11px] text-text-muted">{stat.label}</div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
