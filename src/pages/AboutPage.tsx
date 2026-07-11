import { motion } from 'framer-motion';
import { Github, Mail, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const techStack = [
  { name: 'React 18', category: '框架', color: 'blue' as const, desc: 'UI 框架' },
  { name: 'TypeScript', category: '语言', color: 'blue' as const, desc: '类型安全' },
  { name: 'Vite', category: '构建', color: 'purple' as const, desc: '极速构建' },
  { name: 'Tailwind CSS', category: '样式', color: 'green' as const, desc: '原子化 CSS' },
  { name: 'Framer Motion', category: '动效', color: 'yellow' as const, desc: '声明式动画' },
  { name: 'Zustand', category: '状态', color: 'purple' as const, desc: '轻量状态管理' },
  { name: 'React Router', category: '路由', color: 'green' as const, desc: 'SPA 路由' },
  { name: 'Lucide', category: '图标', color: 'yellow' as const, desc: '图标库' },
  { name: 'Anthropic API', category: 'AI', color: 'blue' as const, desc: 'AI 集成' },
];

const milestones = [
  { date: '2026-07', title: '项目启动', desc: '确定产品方向和技术选型' },
  { date: '2026-07', title: '基础架构', desc: '搭建脚手架、路由、设计系统' },
  { date: '2026-07', title: '核心工具', desc: '完成 JSON、正则、AI 聊天、Markdown 四大工具' },
  { date: '2026-07', title: 'MVP 发布', desc: '完成首页、工具中心、关于页面，部署上线' },
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold">关于 DevHub</h1>
        <p className="mt-3 text-text-secondary max-w-lg mx-auto">
          DevHub 是一个面向开发者的一站式 AI 效率工具平台，
          旨在将常用开发工具整合到一个统一、美观、智能的界面中。
        </p>
      </motion.div>

      {/* Design Principles */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold">设计理念</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { title: '极简至上', desc: '去除一切不必要的元素，每个像素都有意义' },
            { title: '速度优先', desc: '工具响应 < 100ms，页面切换 < 200ms' },
            { title: '键盘友好', desc: '核心操作全部支持快捷键' },
            { title: '一致性', desc: '统一的间距、圆角、动效、配色系统' },
          ].map((p) => (
            <Card key={p.title}>
              <h3 className="font-semibold text-text-primary">{p.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{p.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold">技术栈</h2>
        <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3">
          {techStack.map((tech) => (
            <Card key={tech.name} hoverable className="!p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-text-primary">{tech.name}</span>
                <Badge color={tech.color}>{tech.category}</Badge>
              </div>
              <p className="mt-1 text-xs text-text-muted">{tech.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold">开发时间线</h2>
        <div className="mt-6 space-y-0">
          {milestones.map((m, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-semibold">
                  {i + 1}
                </div>
                {i < milestones.length - 1 && (
                  <div className="w-px flex-1 bg-border my-1" />
                )}
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-accent font-medium">{m.date}</span>
                  <h3 className="font-semibold text-text-primary">{m.title}</h3>
                </div>
                <p className="mt-0.5 text-sm text-text-secondary">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Developer */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold">开发者</h2>
        <Card className="mt-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent text-xl font-bold">
              D
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">DevHub Developer</h3>
              <p className="mt-1 text-sm text-text-secondary">
                前端开发者，热爱构建高质量的用户界面和开发工具。
              </p>
              <div className="mt-3 flex gap-3">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors">
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a href="mailto:dev@example.com" className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors">
                  <Mail className="h-4 w-4" /> Email
                </a>
                <a href="#" className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors">
                  <ExternalLink className="h-4 w-4" /> Portfolio
                </a>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
