import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, X, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { tools, iconMap } from '@/data';
import type { LucideIcon } from 'lucide-react';

export function FavoriteManager() {
  const favoriteIds = useFavoriteStore((s) => s.favoriteIds);
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite);

  const favoriteTools = tools.filter((t) => favoriteIds.includes(t.id));

  if (favoriteTools.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-tertiary text-text-muted">
            <Heart className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-text-primary">暂无收藏</h3>
          <p className="mt-1 text-xs text-text-muted">浏览工具时点击星标即可收藏</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="!p-4">
      <h3 className="mb-3 text-sm font-semibold text-text-primary">
        收藏管理 ({favoriteTools.length})
      </h3>
      <div className="space-y-1">
        {favoriteTools.map((tool, i) => {
          const Icon = (iconMap[tool.icon] ?? Heart) as LucideIcon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-bg-tertiary"
            >
              <div className="bg-accent/10 flex h-8 w-8 items-center justify-center rounded-lg text-accent">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-text-primary">{tool.name}</div>
              </div>
              <Link to={tool.route} className="shrink-0">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <button
                onClick={() => toggleFavorite(tool.id)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                title="取消收藏"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
