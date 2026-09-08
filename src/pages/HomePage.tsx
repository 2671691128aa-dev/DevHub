import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Bot, FileText, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ToolCard } from '@/components/shared/ToolCard';
import { tools, categories, iconMap } from '@/data';
import { ROUTES, EXTERNAL_LINKS } from '@/constants';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentTools } from '@/components/dashboard/RecentTools';
import { QuickActions } from '@/components/dashboard/QuickActions';
import GradientText from '@/components/GradientText';
import SpotlightCard from '@/components/SpotlightCard';
import AnimatedContent from '@/components/AnimatedContent';
import type { LucideIcon } from 'lucide-react';

const categoryIcons: Record<string, LucideIcon> = {
  developer: Code2,
  ai: Bot,
  document: FileText,
  network: Globe,
};

export function HomePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      {/* Hero + 核心工具 — 第一屏就是工具 */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Compact Welcome + Stats — 横向排列，不抢工具的主体位置 */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <WelcomeCard />
          <div className="flex-1">
            <StatsGrid />
          </div>
        </div>

        {/* 核心工具 — 视觉主体 */}
        <div className="flex items-center justify-between">
          <div>
            <GradientText
              colors={['var(--text-primary)', 'var(--accent)', 'var(--text-primary)']}
              animationSpeed={8}
              className="text-lg font-semibold"
            >
              核心工具
            </GradientText>
            <p className="mt-0.5 text-sm text-text-muted">最受欢迎的开发工具</p>
          </div>
          <Link to={ROUTES.TOOLS}>
            <Button variant="ghost" size="sm">
              查看全部
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.slice(0, 6).map((tool, i) => {
            const Icon = iconMap[tool.icon] ?? Code2;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
              >
                <SpotlightCard>
                  <ToolCard tool={tool} icon={Icon} />
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* 中间行：Recent Tools + Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentTools />
        <QuickActions />
      </div>

      {/* Categories */}
      <AnimatedContent distance={60} duration={0.6}>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <GradientText
              colors={['var(--text-primary)', 'var(--accent)', 'var(--text-primary)']}
              animationSpeed={8}
              className="text-lg font-semibold"
            >
              工具分类
            </GradientText>
            <p className="mt-0.5 text-sm text-text-muted">按类别浏览开发工具</p>
          </div>
          <Link to={ROUTES.TOOLS}>
            <Button variant="ghost" size="sm">
              浏览全部
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => {
            const Icon = categoryIcons[cat.id] ?? Code2;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
              >
                <Link to={`${ROUTES.TOOLS}?category=${cat.id}`}>
                  <Card hoverable className="gap-3 !p-4">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary">{cat.name}</h3>
                    <p className="line-clamp-2 text-xs text-text-muted">{cat.description}</p>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
      </AnimatedContent>
      <footer className="border-t border-border pb-2 pt-6">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>© 2026 DevHub. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <a
              href={EXTERNAL_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-text-secondary"
            >
              GitHub
            </a>
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> React + Vite + Tailwind
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
