import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Bot, FileText, Globe, Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ToolCard } from '@/components/shared/ToolCard';
import { tools, categories } from '@/data';
import {
  Braces,
  Regex,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Bot,
  FileText,
  Globe,
  Braces,
  Regex,
};

const categoryIcons: Record<string, LucideIcon> = {
  developer: Code2,
  ai: Bot,
  document: FileText,
  network: Globe,
};

const stats = [
  { label: '开发工具', value: '4+', icon: Zap },
  { label: 'AI 驱动', value: '100%', icon: Sparkles },
  { label: '本地运行', value: '0', suffix: '延迟', icon: Shield },
];

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-1 text-sm text-text-secondary">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            AI 驱动的开发工具
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="text-text-primary">Dev</span>
            <span className="text-accent">Hub</span>
          </h1>
          <p className="mt-2 text-xl text-text-secondary">AI Developer Toolbox</p>
          <p className="mx-auto mt-4 max-w-lg text-text-muted">
            面向开发者的一站式效率平台，集 AI 工具、开发工具、文档工具于一体。
            快速、免费、本地运行。
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/tools">
              <Button size="lg">
                开始使用
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" size="lg">
                了解更多
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-text-primary">工具分类</h2>
        <p className="mt-1 text-text-muted">按类别浏览开发工具</p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => {
            const Icon = categoryIcons[cat.id] ?? Code2;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <Link to={`/tools?category=${cat.id}`}>
                  <Card hoverable className="gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-text-primary">{cat.name}</h3>
                    <p className="text-sm text-text-muted">{cat.description}</p>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Tools */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-text-primary">核心工具</h2>
        <p className="mt-1 text-text-muted">最受欢迎的开发者工具</p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => {
            const Icon = iconMap[tool.icon] ?? Code2;
            return <ToolCard key={tool.id} tool={tool} icon={Icon} />;
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-primary">
                    {stat.value}{stat.suffix && <span className="text-sm font-normal text-text-muted ml-1">{stat.suffix}</span>}
                  </div>
                  <div className="text-sm text-text-muted">{stat.label}</div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-text-muted">
          <span>© 2026 DevHub. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-text-secondary">
              GitHub
            </a>
            <span>React + Vite + Tailwind</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
