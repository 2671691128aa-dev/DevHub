# DevHub — AI 开发者工具箱

<div align="center">

**面向开发者的一站式 AI 效率工具平台 · 内置 Tool-Calling Agent**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF)](https://clerk.com)
[![Supabase](https://img.shields.io/badge/DB-Supabase-3ECF8E)](https://supabase.com)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)](https://vercel.com)

</div>

---

## ✨ 功能亮点

| 功能 | 说明 |
|------|------|
| 🤖 **AI 聊天助手** | 支持 Anthropic / DeepSeek / 通义千问 / 智谱 GLM / 月之暗面 / 任意 OpenAI 兼容接口，SSE 流式响应，多轮上下文，提示词模板 |
| 🛠️ **Agent 工具调用** | 手写 ReAct 式 Agent Loop，AI 自主编排 JSON 格式化、正则测试、代码审查三个工具完成任务 |
| 📋 **JSON 格式化** | 格式化、压缩、校验、树形视图，大文件处理走 Web Worker |
| 🔍 **正则测试器** | 实时匹配高亮、分组捕获、常用正则模板 |
| ✍️ **Markdown 编辑器** | 实时预览、工具栏快捷操作、导出 HTML |
| 🔐 **Base64 编解码** | 文本与 Base64 互转，支持文件编码 |
| 🔎 **代码审查** | 基于规则引擎的代码质量分析（命名 / 复杂度 / 安全 / 风格 / Bug 模式），输出评分与改进建议 |
| 👤 **用户系统** | Clerk 登录注册，云端同步对话历史与用户偏好 |
| ⌨️ **命令面板** | `Ctrl+K` 快速搜索跳转，键盘全流程操作 |
| 🌙 **暗色/亮色主题** | 跟随系统或手动切换 |
| ⭐ **收藏 & 历史** | 工具收藏、使用记录追踪、连续使用天数统计 |

---

## 🤖 核心亮点：AI Agent 工具调用

这是项目里技术含量最高的部分。AI 不只是「聊天窗口」，而是能**真正调用工具箱里的能力**——例如用户说「帮我格式化这段 JSON 并检查代码质量」，Agent 会自主决定调用哪几个工具、按什么顺序调用，最后把结果组织成回答。

### 执行流程

```
用户消息
   │
   ▼
① 携带工具定义请求模型（非流式，需完整解析 tool_use 块）
   │
   ├── 模型返回 tool_use ──► ② 执行工具（JSON 格式化 / 正则 / 代码审查）
   │                              │
   │                              ▼
   │                         ③ 工具结果按协议回填消息历史 ──┐
   │                                                          │
   └──────────────── ④ 回到 ① 继续下一轮 ◄──────────────────┘
   │                                              （最多 5 轮，防死循环）
   ▼
⑤ 模型不再调用工具 → 切换为流式输出最终回答
```

### 关键设计

- **工具逻辑复用，而非重写** — 工具注册表（`src/features/agent/toolRegistry.ts`）直接复用页面里的纯函数（`formatJson`、`validateJson`、`analyzeCode`）。同一份能力有两个入口：用户手点，或让 AI 调，不存在第二套实现。
- **双协议适配** — Anthropic 用 `tool_use` / `tool_result` 块，OpenAI 用 `tool_calls` + 独立 `tool` role 消息，两者消息格式完全不同。`agentLoop.ts` 内做双分支适配，对外暴露统一回调（`onToolCallStart` / `onToolCallResult` / `onTextChunk`），UI 层无需感知底层厂商。
- **混合流式策略** — 调工具阶段用非流式（增量解析工具参数 JSON 容易拿到半截内容而报错），产出最终答案时切回流式，兼顾正确性与体验。
- **前端编排，服务端只做代理** — Agent 循环跑在浏览器，服务端只负责鉴权、注入密钥、转发请求，减少一次往返。

### 内置工具

| 工具 ID | 说明 | 参数 |
|---------|------|------|
| `json-formatter` | 格式化 / 压缩 JSON | `content`, `action` |
| `regex-tester` | 测试正则匹配并返回结果列表 | `pattern`, `text`, `flags` |
| `code-review` | 审查代码质量，返回评分与问题列表 | `code`, `language` |

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    浏览器（React SPA）                    │
│  页面 / 组件 · Zustand Store · Agent Loop · 工具注册表     │
│                     │                    │                │
│            Clerk 登录态（JWT）      IndexedDB 本地缓存      │
└─────────────────────┼───────────────────────────────────┘
                      │ 带 Bearer Token 的请求
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  Vercel Serverless Functions              │
│  /api/chat          鉴权 → 注入服务端密钥 → 转发 AI Provider │
│  /api/conversations 对话与消息 CRUD（按 user_id 隔离）       │
│  /api/user          用户信息与使用统计                      │
└──────┬───────────────────────────────────┬──────────────┘
       │                                   │
       ▼                                   ▼
┌──────────────┐                  ┌──────────────────────┐
│ Clerk        │                  │ Supabase (Postgres)  │
│ 用户认证      │                  │ conversations        │
│ Token 验签    │                  │ messages             │
└──────────────┘                  │ user_preferences     │
                                  └──────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│  AI Providers：Anthropic · DeepSeek · 通义千问             │
│               智谱 GLM · 月之暗面 · OpenAI 兼容             │
└─────────────────────────────────────────────────────────┘
```

### 目录结构

```
├── api/                     # Vercel Serverless Functions
│   ├── chat.ts              #   AI 请求代理（鉴权 + 密钥注入 + SSE 透传）
│   ├── conversations.ts     #   对话与消息 CRUD
│   └── user.ts              #   用户信息与统计
│
├── src/
│   ├── components/          # 组件库
│   │   ├── ui/              #   基础 UI 组件（Button, Card, Badge, Tabs...）
│   │   ├── layout/          #   布局组件（Navbar, PageLayout, Breadcrumb）
│   │   ├── shared/          #   共享业务组件（CommandPalette, ToolCard...）
│   │   ├── dashboard/       #   首页仪表盘组件
│   │   └── profile/         #   用户中心组件
│   ├── features/            # 功能模块（组件 + Hook + 服务共存）
│   │   ├── agent/           #   Agent Loop + 工具注册表
│   │   ├── ai-chat/         #   AI 聊天（流式 SSE、多模型适配、虚拟滚动）
│   │   ├── json/            #   JSON 工具（含 Web Worker）
│   │   ├── regex/           #   正则测试
│   │   ├── markdown/        #   Markdown 编辑器
│   │   ├── base64/          #   Base64 编解码
│   │   └── code-review/     #   代码审查规则引擎
│   ├── store/               # Zustand 状态管理（5 个 Store，IndexedDB 持久化）
│   ├── hooks/               # 自定义 Hooks（useAuth, useChatSync...）
│   ├── lib/                 # 工具库（错误分类、指数退避重试、API Client...）
│   ├── constants/           # 常量集中管理（路由、AI Provider、主题 Token...）
│   ├── types/               # TypeScript 类型定义
│   └── data/                # 工具注册数据配置
│
└── docs/                    # 设计文档与数据库初始化脚本
```

**设计决策**：

- **Feature-based 目录结构** — 每个功能模块内聚，组件 / Hook / 服务放在一起，删除或迁移一个工具只动一个目录
- **前后端职责边界** — 密钥、鉴权、数据隔离收在 Serverless 层；工具执行等纯计算能力留在前端
- **离线优先** — 未登录也能完整使用工具，聊天记录落 IndexedDB；登录后无缝接入云端同步
- **结构化错误处理** — 自定义错误分类 + 指数退避重试 + ErrorBoundary 双层兜底
- **CSS 变量主题系统** — 语义化颜色 token，主题切换零闪烁

---

## 🔐 安全设计

| 措施 | 实现方式 |
|------|----------|
| **密钥不下发浏览器** | AI Provider 密钥只存在 Vercel 环境变量，由 `api/chat.ts` 服务端注入 |
| **强制身份验证** | 所有 `/api/*` 端点先用 `verifyToken` 校验 Clerk JWT，失败返回 401 |
| **数据按用户隔离** | 服务端使用 service_role 访问 Supabase，但每条查询强制带 `user_id` 过滤 |
| **Token 自动续期** | 前端每 50 秒刷新一次 Clerk Token（有效期 60 秒），避免请求中途过期 |
| **类型安全** | TypeScript Strict 模式，前端零 `any` |

---

## ⚡ 性能优化

| 手段 | 效果 |
|------|------|
| **路由级代码分割** | 每个页面 `React.lazy()` 按需加载，首屏只加载首页所需 chunk |
| **Vite 手动分包** | `manualChunks` 将 react / markdown / motion / syntax-highlighter / zustand 拆为独立 vendor chunk，利用浏览器缓存 |
| **Web Worker** | 大 JSON 的解析、格式化、建树移出主线程，处理期间界面不卡顿 |
| **虚拟滚动** | AI 消息列表使用 `@tanstack/react-virtual`，长会话只渲染可视区域 |
| **渲染优化** | 流式输出的 Markdown 组件与 JSON 树节点单独 `memo`，避免整树重渲染 |

---

## 🧪 质量保障

```bash
npm run test        # Vitest 单元测试
npm run type-check  # TypeScript 类型检查
npm run lint        # ESLint 检查
npm run format      # Prettier 格式化
```

- **单元测试** — Vitest + Testing Library，覆盖核心纯函数（JSON 格式化 / 校验、错误分类、重试逻辑）与关键组件（Button、Card、ToolCard、Chat Store）
- **错误可观测** — `reportError` 统一上报入口，配合 ErrorBoundary 捕获渲染异常
- **规范约束** — ESLint + Prettier + TypeScript Strict，构建前必过 `tsc -b`

---

## 🚀 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript (Strict) |
| 构建工具 | Vite 5 |
| 路由 | React Router DOM v6 |
| 样式 | Tailwind CSS 3 + CSS Variables |
| 状态管理 | Zustand 5 |
| 动画 | Framer Motion 11 + GSAP |
| 图标 | Lucide React |
| 用户认证 | Clerk |
| 数据库 | Supabase (Postgres) |
| 服务端 | Vercel Serverless Functions |
| AI 集成 | Anthropic API / OpenAI 兼容 API |
| 本地持久化 | IndexedDB (idb-keyval) + localStorage |
| 测试 | Vitest + Testing Library |
| 代码规范 | ESLint + Prettier |

---

## 🛠️ 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量（见下节）
cp .env.example .env.local

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 环境变量

**前端变量**（写入 `.env.local`）：

| 变量 | 说明 |
|------|------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk 公钥，从 [dashboard.clerk.com](https://dashboard.clerk.com) 获取 |
| `VITE_SUPABASE_URL` | Supabase 项目地址 |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名公钥 |

**服务端变量**（本地开发写入 `.env`，线上在 Vercel Dashboard → Settings → Environment Variables 配置）：

| 变量 | 说明 |
|------|------|
| `CLERK_SECRET_KEY` | Clerk 私钥，用于服务端 Token 验签 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role 密钥 |
| `ANTHROPIC_API_KEY` | Anthropic 密钥 |
| `DEEPSEEK_API_KEY` / `QWEN_API_KEY` / `GLM_API_KEY` / `MOONSHOT_API_KEY` | 其他 Provider 密钥（用哪个配哪个） |

> ⚠️ 服务端变量**不要**写进 `.env.local`，也不要加 `VITE_` 前缀——加了前缀会被打包进前端产物。

### 数据库初始化

在 Supabase Dashboard → SQL Editor 中执行 [`docs/supabase-init.sql`](docs/supabase-init.sql)，创建 `conversations`、`messages`、`user_preferences` 三张表及索引。

### 部署

前端与 Serverless Functions 一并部署在 Vercel：推送到仓库后自动构建，`api/` 目录下的文件会被识别为 Serverless Functions。`vercel.json` 已配置 SPA 路由回退。

---

## 📌 项目特色

- 🛠️ **AI 原生** — 不止于聊天，工具可被 AI 自主调用编排
- 🔒 **安全优先** — 密钥服务端托管，全链路鉴权，数据按用户隔离
- ⚡ **性能优化** — 代码分割、手动分包、Web Worker、虚拟滚动
- 🧩 **架构清晰** — Feature-based 组织，前后端职责边界明确
- 🎨 **响应式设计** — 桌面端 / 移动端自适应
- ♿ **可访问性** — 键盘导航、语义化标签、aria 属性
- 🧪 **类型安全** — TypeScript Strict 模式，零 `any`
