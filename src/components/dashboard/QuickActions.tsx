import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, Code2, Compass } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { ROUTES } from '@/constants';

interface QuickAction {
  label: string;
  description: string;
  icon: typeof Search;
  color: string;
  to?: string;
  action?: () => void;
}

export function QuickActions() {
  const openCommandPalette = useAppStore((s) => s.openCommandPalette);

  const actions: QuickAction[] = [
    {
      label: '搜索工具',
      description: '⌘K 快速搜索',
      icon: Search,
      color: '#6366F1',
      action: openCommandPalette,
    },
    {
      label: '收藏管理',
      description: '查看收藏的工具',
      icon: Star,
      color: '#F59E0B',
      to: `${ROUTES.TOOLS}?filter=favorites`,
    },
    {
      label: '代码审查',
      description: 'AI 代码质量分析',
      icon: Code2,
      color: '#8B5CF6',
      to: ROUTES.TOOLS_CODE_REVIEW,
    },
    {
      label: '浏览全部',
      description: '查看所有工具',
      icon: Compass,
      color: '#10B981',
      to: ROUTES.TOOLS,
    },
  ];

  return (
    <Card className="!p-4">
      <h3 className="mb-3 text-sm font-semibold text-text-primary">快捷操作</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, i) => {
          const Icon = action.icon;
          const content = (
            <div className="flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-colors hover:bg-bg-tertiary">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${action.color}15`, color: action.color }}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="text-xs font-medium text-text-primary">{action.label}</div>
                <div className="text-[10px] text-text-muted">{action.description}</div>
              </div>
            </div>
          );

          if (action.to) {
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <Link to={action.to}>{content}</Link>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
            >
              <button onClick={action.action} className="w-full">
                {content}
              </button>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
