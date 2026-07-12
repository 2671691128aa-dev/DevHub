import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Braces, Bot } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { tools } from '@/data';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Braces, Bot, FileText,
};

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  route: string;
}

const allCommands: CommandItem[] = tools.map((t) => ({
  id: t.id,
  label: t.name,
  description: t.description,
  icon: iconMap[t.icon] ?? FileText,
  route: t.route,
}));

export function CommandPalette() {
  const isOpen = useAppStore((s) => s.isCommandPaletteOpen);
  const close = useAppStore((s) => s.closeCommandPalette);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter(
      (cmd) => cmd.label.toLowerCase().includes(q) || cmd.description.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

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

  const handleSelect = (route: string) => {
    navigate(route);
    close();
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
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    close();
                  }
                }}
                placeholder="搜索工具或命令..."
                className="h-12 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
              <kbd className="rounded border border-border bg-bg-tertiary px-1.5 py-0.5 text-[10px] text-text-muted">
                ESC
              </kbd>
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.length > 0 ? (
                filtered.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd.route)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-bg-tertiary"
                  >
                    <cmd.icon className="h-4 w-4 text-text-muted" />
                    <div>
                      <div className="text-sm font-medium text-text-primary">{cmd.label}</div>
                      <div className="text-xs text-text-muted">{cmd.description}</div>
                    </div>
                  </button>
                ))
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
