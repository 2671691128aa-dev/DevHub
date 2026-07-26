import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Wrench, Star } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';
import { ToolCard } from '@/components/shared/ToolCard';
import { SearchInput } from '@/components/shared/SearchInput';
import { tools, categories, iconMap } from '@/data';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import type { ToolCategory } from '@/types/tool';

const filterTabs = [
  { id: 'all', label: '全部工具' },
  { id: 'favorites', label: '收藏' },
  ...categories.map((c) => ({ id: c.id, label: c.name })),
];

export function ToolboxPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all' | 'favorites'>('all');
  const favoriteIds = useFavoriteStore((s) => s.favoriteIds);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Category filter
      let matchCategory: boolean;
      if (activeCategory === 'all') {
        matchCategory = true;
      } else if (activeCategory === 'favorites') {
        matchCategory = favoriteIds.includes(tool.id);
      } else {
        matchCategory = tool.category === activeCategory;
      }

      // Search filter
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some((t) => t.toLowerCase().includes(query));

      return matchCategory && matchSearch;
    });
  }, [searchQuery, activeCategory, favoriteIds]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            {activeCategory === 'favorites' ? (
              <span className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                我的收藏
              </span>
            ) : (
              '工具中心'
            )}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {activeCategory === 'favorites'
              ? `共 ${filteredTools.length} 个收藏工具`
              : `共 ${tools.length} 个工具`}
          </p>
        </div>
        <div className="w-full sm:w-64">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6">
        <Tabs
          tabs={filterTabs}
          activeId={activeCategory}
          onChange={(id) => setActiveCategory(id as ToolCategory | 'all' | 'favorites')}
        />
      </div>

      {/* Tools Grid */}
      <div className="mt-8">
        {filteredTools.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredTools.map((tool) => {
                const Icon = iconMap[tool.icon] ?? Wrench;
                return (
                  <motion.div
                    key={tool.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ToolCard tool={tool} icon={Icon} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-text-tertiary flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-tertiary">
              {activeCategory === 'favorites' ? (
                <Star className="h-7 w-7" />
              ) : (
                <Search className="h-7 w-7" />
              )}
            </div>
            <h3 className="mt-4 text-lg font-medium text-text-primary">
              {activeCategory === 'favorites' ? '暂无收藏工具' : '没有找到匹配的工具'}
            </h3>
            <p className="text-text-tertiary mt-1 text-sm">
              {activeCategory === 'favorites' ? '浏览工具时点击星标即可收藏' : '试试其他关键词'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
