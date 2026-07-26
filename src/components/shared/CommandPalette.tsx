import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Star, Compass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { tools, iconMap } from '@/data';
import { ROUTES } from '@/constants';
import { cn } from '@/utils/cn';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  route: string;
  section: '工具' | '页面' | '收藏' | '最近';
}

function buildCommands(favoriteIds: string[]): CommandItem[] {
  // Build tool commands
  const toolCommands: CommandItem[] = tools.map((t) => ({
    id: t.id,
    label: t.name,
    description: t.description,
    icon: iconMap[t.icon] ?? FileText,
    route: t.route,
    section: favoriteIds.includes(t.id) ? ('收藏' as const) : ('工具' as const),
  }));

  // Page commands
  const pageCommands: CommandItem[] = [
    {
      id: 'page-home',
      label: '首页',
      description: '返回 Dashboard 首页',
      icon: Compass,
      route: ROUTES.HOME,
      section: '页面',
    },
    {
      id: 'page-tools',
      label: '工具中心',
      description: '浏览所有工具',
      icon: Compass,
      route: ROUTES.TOOLS,
      section: '页面',
    },
    {
      id: 'page-about',
      label: '关于',
      description: '了解 DevHub',
      icon: Compass,
      route: ROUTES.ABOUT,
      section: '页面',
    },
    {
      id: 'page-profile',
      label: '用户中心',
      description: '管理个人信息',
      icon: Compass,
      route: ROUTES.PROFILE,
      section: '页面',
    },
  ];

  // Deduplicate: tools that are favorites should appear in '收藏' only
  const seen = new Set<string>();
  const allCommands: CommandItem[] = [];
  for (const cmd of [...toolCommands, ...pageCommands]) {
    if (!seen.has(cmd.id)) {
      seen.add(cmd.id);
      allCommands.push(cmd);
    }
  }

  return allCommands;
}

export function CommandPalette() {
  const isOpen = useAppStore((s) => s.isCommandPaletteOpen);
  const close = useAppStore((s) => s.closeCommandPalette);
  const navigate = useNavigate();
  const favoriteIds = useFavoriteStore((s) => s.favoriteIds);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Rebuild commands when favorites change (isOpen triggers reset via effect)
  const allCommands = useMemo(() => buildCommands(favoriteIds), [favoriteIds]);

  const filtered = useMemo(() => {
    if (!query) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.section.toLowerCase().includes(q),
    );
  }, [query, allCommands]);

  // Group by section
  const grouped = useMemo(() => {
    const groups: { section: string; items: CommandItem[] }[] = [];
    const sectionOrder = ['收藏', '最近', '工具', '页面'];
    for (const section of sectionOrder) {
      const items = filtered.filter((c) => c.section === section);
      if (items.length > 0) groups.push({ section, items });
    }
    return groups;
  }, [filtered]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useAppStore.getState().toggleCommandPalette();
      }
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, close]);

  const flatItems = grouped.flatMap((g) => g.items);

  const handleSelect = (route: string) => {
    navigate(route);
    close();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % Math.max(flatItems.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + flatItems.length) % Math.max(flatItems.length, 1));
    } else if (e.key === 'Enter' && flatItems[selectedIndex]) {
      handleSelect(flatItems[selectedIndex].route);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            className="relative w-full max-w-lg rounded-xl border border-border bg-bg-secondary shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 text-text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="搜索工具、页面..."
                className="h-12 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
              <kbd className="rounded border border-border bg-bg-tertiary px-1.5 py-0.5 text-[10px] text-text-muted">
                ESC
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {flatItems.length > 0 ? (
                (() => {
                  let globalIdx = 0;
                  return grouped.map((group) => (
                    <div key={group.section} className="mb-2">
                      <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        {group.section === '收藏'
                          ? '⭐ 收藏'
                          : group.section === '工具'
                            ? '🔧 工具'
                            : group.section === '页面'
                              ? '📄 页面'
                              : '🕐 最近'}
                      </div>
                      {group.items.map((cmd) => {
                        const cmdIdx = globalIdx++;
                        const isSelected = cmdIdx === selectedIndex;
                        return (
                          <button
                            key={cmd.id}
                            onClick={() => handleSelect(cmd.route)}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                              isSelected ? 'bg-accent/10 text-accent' : 'hover:bg-bg-tertiary',
                            )}
                          >
                            <cmd.icon className="h-4 w-4 shrink-0 text-text-muted" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium text-text-primary">
                                {cmd.label}
                              </div>
                              <div className="truncate text-xs text-text-muted">
                                {cmd.description}
                              </div>
                            </div>
                            {cmd.section === '收藏' && (
                              <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ));
                })()
              ) : (
                <div className="py-8 text-center text-sm text-text-muted">没有找到结果</div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
