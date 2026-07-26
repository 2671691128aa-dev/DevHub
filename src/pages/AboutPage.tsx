import { motion } from 'framer-motion';
import {
  Github,
  Mail,
  ExternalLink,
  Zap,
  Shield,
  Keyboard,
  Palette,
  Code2,
  Cpu,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EXTERNAL_LINKS } from '@/constants/api';

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

const highlights = [
  {
    icon: Zap,
    title: '极速加载',
    desc: 'Route-level 代码分割 + Vite 手动分包，首屏加载 < 1s',
    color: '#F59E0B',
  },
  {
    icon: Shield,
    title: '隐私安全',
    desc: 'API Key 仅存本地浏览器，零后端服务，数据不经第三方',
    color: '#10B981',
  },
  {
    icon: Keyboard,
    title: '键盘优先',
    desc: 'Cmd+K 命令面板全局跳转，所有核心操作支持快捷键',
    color: '#6366F1',
  },
  {
    icon: Palette,
    title: '设计系统',
    desc: 'CSS 变量语义化 token，亮/暗双主题，一致的间距圆角动效',
    color: '#EC4899',
  },
  {
    icon: Code2,
    title: '类型安全',
    desc: 'TypeScript Strict 模式，零 any，所有 Props 集中导出',
    color: '#3B82F6',
  },
  {
    icon: Cpu,
    title: 'Web Worker',
    desc: '计算密集型任务放入 Worker，大 JSON 处理不卡主线程',
    color: '#8B5CF6',
  },
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
        <p className="mx-auto mt-3 max-w-lg text-text-secondary">
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
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {techStack.map((tech) => (
            <Card key={tech.name} hoverable className="!p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">{tech.name}</span>
                <Badge color={tech.color}>{tech.category}</Badge>
              </div>
              <p className="mt-1 text-xs text-text-muted">{tech.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Project Highlights */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold">项目亮点</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Card hoverable className="flex items-start gap-4 !p-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{item.title}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{item.desc}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Developer */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold">开发者</h2>
        <Card className="mt-4">
          <div className="flex items-start gap-4">
            <div className="bg-accent/10 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-accent">
              D
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">DevHub Developer</h3>
              <p className="mt-1 text-sm text-text-secondary">
                前端开发者，热爱构建高质量的用户界面和开发工具。
              </p>
              <div className="mt-3 flex gap-3">
                <a
                  href={EXTERNAL_LINKS.GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a
                  href={EXTERNAL_LINKS.DEV_EMAIL}
                  className="flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  <Mail className="h-4 w-4" /> Email
                </a>
                <a
                  href="#"
                  className="flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
                >
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
