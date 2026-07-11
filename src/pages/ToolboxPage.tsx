import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Bot, FileText, Globe, Wrench } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';
import { ToolCard } from '@/components/shared/ToolCard';
import { SearchInput } from '@/components/shared/SearchInput';
import { useToolStore } from '@/store/useToolStore';
import { tools, categories } from '@/data';
import type { ToolCategory } from '@/types/tool';
import type { LucideIcon } from 'lucide-react';
import { Braces, Regex } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Code2, Bot, FileText, Globe, Braces, Regex,
};

const filterTabs = [
  { id: 'all', label: '全部工具' },
  ...categories.map((c) => ({ id: c.id, label: c.name })),
];

export function ToolboxPage() {
  const searchQuery = useToolStore((s) => s.searchQuery);
  const activeCategory = useToolStore((s) => s.activeCategory);
  const setSearchQuery = useToolStore((s) => s.setSearchQuery);
  const setActiveCategory = useToolStore((s) => s.setActiveCategory);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchCategory = activeCategory === 'all' || tool.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some((t) => t.toLowerCase().includes(query));
      return matchCategory && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">工具中心</h1>
          <p className="mt-1 text-sm text-text-muted">
            共 {tools.length} 个工具
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
          onChange={(id) => setActiveCategory(id as ToolCategory | 'all')}
        />
      </div>

      {/* Tools Grid */}
      <div className="mt-8">
        {filteredTools.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
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
            <Wrench className="h-12 w-12 text-text-muted" />
            <h3 className="mt-4 text-lg font-medium text-text-primary">没有找到工具</h3>
            <p className="mt-1 text-sm text-text-muted">
              试试其他关键词或切换分类
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
