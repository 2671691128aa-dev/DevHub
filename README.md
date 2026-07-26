# DevHub — AI 开发者工具箱

<div align="center">

**面向开发者的一站式 AI 效率工具平台**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

</div>

---

## ✨ 功能亮点

| 功能 | 说明 |
|------|------|
| 🤖 **AI 聊天助手** | 支持 Anthropic / OpenAI 等多模型，流式响应，上下文管理，提示词模板 |
| 📋 **JSON 格式化** | 格式化、压缩、校验、树形视图，大文件处理使用 Web Worker |
| 🔍 **正则测试器** | 实时匹配高亮、分组捕获、常用正则模板 |
| ✍️ **Markdown 编辑器** | 实时预览、工具栏快捷操作、导出 HTML |
| 🔐 **Base64 编解码** | 文本与 Base64 互转，支持文件编码 |
| 🔎 **代码审查** | 基于规则引擎的代码质量分析（命名/复杂度/安全/风格/Bug 模式） |
| ⌨️ **命令面板** | `Ctrl+K` 快速搜索跳转，键盘全流程操作 |
| 🌙 **暗色/亮色主题** | 跟随系统或手动切换 |
| ⭐ **收藏 & 历史** | 工具收藏、使用记录追踪、连续使用天数统计 |
| 👤 **用户中心** | 自定义头像/昵称、使用数据统计 |

## 📸 截图预览

> 💡 **提示**：运行 `npm run dev` 后在本地查看完整效果

<div align="center">
<em>首页 Dashboard · 暗色主题 · 工具中心 · AI 聊天</em>
</div>

## 🏗️ 架构设计

```
src/
├── components/          # 组件库
│   ├── ui/              # 基础 UI 组件（Button, Card, Badge, Tabs...）
│   ├── layout/          # 布局组件（Navbar, PageLayout, Breadcrumb）
│   ├── shared/          # 共享业务组件（CommandPalette, ToolCard...）
│   ├── dashboard/       # 首页仪表盘组件
│   └── profile/         # 用户中心组件
├── features/            # 功能模块（组件 + Hook + Service 共存）
│   ├── ai-chat/         # AI 聊天（流式 SSE、多模型适配）
│   ├── json/            # JSON 工具（含 Web Worker）
│   ├── regex/           # 正则测试
│   ├── markdown/        # Markdown 编辑器
│   ├── base64/          # Base64 编解码
│   └── code-review/     # 代码审查引擎
├── store/               # Zustand 状态管理（5 个 Store，IndexedDB 持久化）
├── hooks/               # 自定义 Hooks
├── lib/                 # 工具库（错误分类、指数退避重试...）
├── constants/           # 常量集中管理
├── types/               # TypeScript 类型定义
└── data/                # 工具数据配置
```

**设计决策**：
- **Feature-based 目录结构** — 每个功能模块内聚，组件/Hook/服务放在一起
- **Route-level Code Splitting** — 每个页面 `React.lazy()` 按需加载
- **IndexedDB 持久化** — 聊天数据用 `idb-keyval` 存储，突破 localStorage 5MB 限制
- **结构化错误处理** — 自定义错误分类 + 指数退避重试 + ErrorBoundary 双层兜底
- **CSS 变量主题系统** — 语义化颜色 token，主题切换零闪烁

## 🚀 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript (Strict) |
| 构建工具 | Vite 5 |
| 路由 | React Router DOM v6 |
| 样式 | Tailwind CSS 3 + CSS Variables |
| 状态管理 | Zustand 5 |
| 动画 | Framer Motion 11 |
| 图标 | Lucide React |
| 测试 | Vitest |
| AI 集成 | Anthropic API / OpenAI 兼容 API |
| 数据持久化 | IndexedDB (idb-keyval) + localStorage |

## 🛠️ 快速开始

```bash
# 克隆项目
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## ⚙️ AI 工具配置

AI 聊天助手需要 API Key。在应用内点击右上角「设置」输入即可，密钥**仅存储在本地浏览器**，不会上传到任何服务器。

支持以下模型提供商：
- Anthropic (Claude)
- DeepSeek
- 通义千问 (Qwen)
- 智谱 GLM
- Moonshot (Kimi)
- 任意 OpenAI 兼容 API

## 📌 项目特色

- 🔒 **隐私优先** — API Key 本地存储，无后端服务
- ⚡ **性能优化** — 代码分割、懒加载、Web Worker、Vite 手动分包
- 🎨 **响应式设计** — 桌面端 / 移动端自适应
- ♿ **可访问性** — 键盘导航、语义化标签、aria 属性
- 🧪 **类型安全** — TypeScript Strict 模式，零 `any`

## 📄 License

MIT
