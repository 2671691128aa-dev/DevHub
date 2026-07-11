# DevHub MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建 DevHub —— 一个面向开发者的一站式 AI 效率工具平台（纯前端 SPA），包含首页、工具中心、JSON 格式化、正则测试、AI 聊天助手、Markdown 编辑器和关于页面。

**Architecture:** React 18 + TypeScript 纯前端 SPA，Vite 构建，React Router v6 管理路由，Zustand 全局状态管理，Tailwind CSS + CSS Variables 实现深色主题系统。工具功能按 feature-based 结构组织（features/json、features/regex、features/ai-chat、features/markdown），每个工具拥有独立的 components/hooks/utils/services 子目录。

**Tech Stack:** React 18, TypeScript, Vite, React Router v6, Tailwind CSS, Zustand, Framer Motion, CodeMirror 6, react-markdown, Lucide React, Anthropic SDK (直连), Vercel (部署), ESLint + Prettier, Vitest + Testing Library

## Global Constraints

- 纯前端 SPA，无后端服务（AI API 直连除外）
- 所有用户数据存 localStorage / IndexedDB，不依赖任何数据库
- 暗黑主题为默认，暂不实现明亮主题切换（预留 CSS Variables 接口）
- 配色体系见设计文档第十四章：bg-primary `#09090B`、accent `#3B82F6`
- 字体：正文 Inter、代码 JetBrains Mono
- AI 工具使用 Anthropic SDK 直连，API Key 存 localStorage
- 中文界面，代码标识符用英文
- Node.js >= 18，包管理器用 npm

## File Structure

```
devhub/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                          # 入口
│   ├── App.tsx                           # 根组件 + 路由
│   ├── vite-env.d.ts
│   │
│   ├── types/
│   │   ├── tool.ts                       # Tool, ToolCategory, ToolCategoryConfig
│   │   ├── chat.ts                       # ChatState, Conversation, Message, ChatSettings, PromptTemplate
│   │   └── common.ts                     # 共享类型
│   │
│   ├── data/
│   │   ├── tools.ts                      # 工具注册表（静态数据）
│   │   └── categories.ts                 # 分类配置
│   │
│   ├── utils/
│   │   ├── cn.ts                         # className 合并（clsx + tailwind-merge）
│   │   └── storage.ts                    # localStorage 类型安全封装
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.ts            # 响应式 localStorage hook
│   │   └── useKeyboardShortcuts.ts       # 全局快捷键
│   │
│   ├── store/
│   │   ├── useAppStore.ts                # 全局 App 状态（主题、命令面板）
│   │   ├── useToolStore.ts               # 工具搜索/筛选状态
│   │   └── useChatStore.ts               # AI 聊天状态
│   │
│   ├── styles/
│   │   └── globals.css                   # Tailwind 入口 + CSS Variables 主题
│   │
│   ├── components/
│   │   ├── ui/                           # 基础 UI 原子
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── index.ts                  # barrel export
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── PageLayout.tsx
│   │   │   └── Breadcrumb.tsx
│   │   │
│   │   └── shared/
│   │       ├── ToolCard.tsx
│   │       ├── CommandPalette.tsx
│   │       └── SearchInput.tsx
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ToolboxPage.tsx
│   │   ├── AboutPage.tsx
│   │   └── tools/
│   │       ├── JsonFormatterPage.tsx
│   │       ├── RegexTesterPage.tsx
│   │       ├── AiChatPage.tsx
│   │       └── MarkdownEditorPage.tsx
│   │
│   └── features/
│       ├── json/
│       │   ├── components/
│       │   │   ├── JsonEditor.tsx
│       │   │   ├── JsonTreeView.tsx
│       │   │   └── ValidationStatus.tsx
│       │   ├── hooks/
│       │   │   └── useJsonFormatter.ts
│       │   └── utils/
│       │       ├── formatter.ts
│       │       └── validator.ts
│       │
│       ├── regex/
│       │   ├── components/
│       │   │   ├── RegexInput.tsx
│       │   │   ├── MatchHighlight.tsx
│       │   │   ├── MatchList.tsx
│       │   │   └── RegexTemplates.tsx
│       │   ├── hooks/
│       │   │   └── useRegexTester.ts
│       │   └── data/
│       │       └── templates.ts
│       │
│       ├── ai-chat/
│       │   ├── components/
│       │   │   ├── ChatContainer.tsx
│       │   │   ├── MessageBubble.tsx
│       │   │   ├── ChatInput.tsx
│       │   │   ├── PromptPanel.tsx
│       │   │   ├── ConversationList.tsx
│       │   │   └── SettingsPanel.tsx
│       │   ├── hooks/
│       │   │   ├── useChat.ts
│       │   │   └── useStreaming.ts
│       │   ├── services/
│       │   │   └── aiService.ts
│       │   └── data/
│       │       └── promptTemplates.ts
│       │
│       └── markdown/
│           ├── components/
│           │   ├── MarkdownEditor.tsx
│           │   ├── MarkdownPreview.tsx
│           │   └── FormattingToolbar.tsx
│           ├── hooks/
│           │   └── useMarkdownEditor.ts
│           └── utils/
│               └── parser.ts
│
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
├── vitest.config.ts
├── .gitignore
└── README.md
```

---

## Task 1: 项目脚手架 — Vite + React + TypeScript

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/vite-env.d.ts`
- Create: `.gitignore`
- Create: `public/favicon.svg`

**Interfaces:**
- Consumes: 无（项目起点）
- Produces: 可运行的 Vite + React + TS 空应用，`npm run dev` 启动开发服务器

- [ ] **Step 1: 初始化 package.json**

```json
{
  "name": "devhub",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "zustand": "^5.0.0",
    "framer-motion": "^11.11.0",
    "lucide-react": "^0.460.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.0",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 5: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DevHub — AI Developer Toolbox</title>
    <meta name="description" content="面向开发者的一站式 AI 效率工具平台" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: 创建 src/vite-env.d.ts**

```typescript
/// <reference types="vite/client" />
```

- [ ] **Step 7: 创建 src/main.tsx**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 8: 创建 src/App.tsx（最小占位）**

```tsx
function App() {
  return <div>DevHub</div>;
}

export default App;
```

- [ ] **Step 9: 创建 src/styles/globals.css（Tailwind 基础）**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* 背景层 */
  --bg-primary: #09090B;
  --bg-secondary: #18181B;
  --bg-tertiary: #27272A;

  /* 文字层 */
  --text-primary: #FAFAFA;
  --text-secondary: #A1A1AA;
  --text-muted: #71717A;

  /* 品牌色 */
  --accent: #3B82F6;
  --accent-hover: #60A5FA;
  --accent-glow: rgba(59, 130, 246, 0.15);

  /* 语义色 */
  --success: #22C55E;
  --warning: #EAB308;
  --error: #EF4444;

  /* 边框 */
  --border: #27272A;
  --border-hover: #3F3F46;
}

body {
  margin: 0;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code, pre, .font-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}
```

- [ ] **Step 10: 创建 tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          glow: 'var(--accent-glow)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 11: 创建 postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 12: 创建 .gitignore**

```
node_modules
dist
.DS_Store
*.local
.env
.env.local
```

- [ ] **Step 13: 创建 public/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#3B82F6"/>
  <path d="M8 10h6l4 6-4 6H8l4-6-4-6z" fill="white"/>
  <path d="M16 10h6l-4 6 4 6h-6l-4-6 4-6z" fill="white" opacity="0.7"/>
</svg>
```

- [ ] **Step 14: 安装依赖并验证**

Run: `cd f:/vibecoding/DevHub && npm install`
Expected: 安装成功，生成 node_modules 和 package-lock.json

Run: `npm run dev`
Expected: 输出 `Local: http://localhost:5173/`，浏览器打开显示 "DevHub"

- [ ] **Step 15: Commit**

```bash
git add .
git commit -m "feat: scaffold Vite + React + TypeScript project with Tailwind"
```

---

## Task 2: 类型定义 + 静态数据 + 工具函数

**Files:**
- Create: `src/types/tool.ts`
- Create: `src/types/chat.ts`
- Create: `src/types/common.ts`
- Create: `src/data/tools.ts`
- Create: `src/data/categories.ts`
- Create: `src/utils/cn.ts`
- Create: `src/utils/storage.ts`
- Create: `src/hooks/useLocalStorage.ts`
- Create: `src/hooks/useKeyboardShortcuts.ts`

**Interfaces:**
- Consumes: 无（基础层）
- Produces:
  - `Tool`, `ToolCategory`, `ToolCategoryConfig` 类型 — 全局使用
  - `ChatState`, `Conversation`, `Message`, `ChatSettings`, `PromptTemplate` 类型 — AI 聊天模块使用
  - `tools` 数组 — 工具注册表，ToolboxPage 和 HomePage 消费
  - `categories` 数组 — 分类配置
  - `cn()` 函数 — 所有组件消费
  - `storage` 对象 — localStorage 类型安全读写
  - `useLocalStorage<T>()` hook — 响应式本地状态
  - `useKeyboardShortcuts()` hook — 全局快捷键注册

- [ ] **Step 1: 创建 src/types/tool.ts**

```typescript
export type ToolCategory = 'developer' | 'ai' | 'document' | 'network';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  route: string;
  tags: string[];
  isHot?: boolean;
  isNew?: boolean;
  status: 'stable' | 'beta' | 'coming-soon';
}

export interface ToolCategoryConfig {
  id: ToolCategory;
  name: string;
  icon: string;
  color: string;
  description: string;
}
```

- [ ] **Step 2: 创建 src/types/chat.ts**

```typescript
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: string;
}

export interface ChatSettings {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  settings: ChatSettings;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: 'coding' | 'writing' | 'analysis';
}
```

- [ ] **Step 3: 创建 src/types/common.ts**

```typescript
export interface JsonError {
  message: string;
  line: number;
  column: number;
}

export interface TreeNode {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';
  value: unknown;
  children?: TreeNode[];
  path: string;
  isCollapsed: boolean;
}

export interface RegexMatch {
  index: number;
  fullMatch: string;
  groups: CaptureGroup[];
}

export interface CaptureGroup {
  name: string | null;
  value: string;
  start: number;
  end: number;
}

export interface RegexTemplate {
  id: string;
  name: string;
  pattern: string;
  description: string;
  example: string;
}
```

- [ ] **Step 4: 创建 src/data/categories.ts**

```typescript
import type { ToolCategoryConfig } from '@/types/tool';

export const categories: ToolCategoryConfig[] = [
  {
    id: 'developer',
    name: '开发工具',
    icon: 'Code2',
    color: '#3B82F6',
    description: 'JSON 格式化、正则测试、编解码等常用开发工具',
  },
  {
    id: 'ai',
    name: 'AI 工具',
    icon: 'Bot',
    color: '#8B5CF6',
    description: 'AI 聊天助手、代码生成、智能分析',
  },
  {
    id: 'document',
    name: '文档工具',
    icon: 'FileText',
    color: '#22C55E',
    description: 'Markdown 编辑、文档转换、格式处理',
  },
  {
    id: 'network',
    name: '网络工具',
    icon: 'Globe',
    color: '#EAB308',
    description: 'HTTP 测试、URL 编解码、Header 分析',
  },
];
```

- [ ] **Step 5: 创建 src/data/tools.ts**

```typescript
import type { Tool } from '@/types/tool';

export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '格式化、校验、转换 JSON 数据，支持树形视图',
    category: 'developer',
    icon: 'Braces',
    route: '/tools/json',
    tags: ['json', 'format', 'validate', 'tree'],
    isHot: true,
    status: 'stable',
  },
  {
    id: 'regex-tester',
    name: '正则测试',
    description: '实时可视化正则匹配，支持分组捕获和常用模板',
    category: 'developer',
    icon: 'Regex',
    route: '/tools/regex',
    tags: ['regex', 'pattern', 'match', 'test'],
    isHot: true,
    status: 'stable',
  },
  {
    id: 'ai-chat',
    name: 'AI 聊天助手',
    description: '智能对话助手，支持流式响应和提示词模板',
    category: 'ai',
    icon: 'Bot',
    route: '/tools/ai-chat',
    tags: ['ai', 'chat', 'claude', 'assistant'],
    isHot: true,
    isNew: true,
    status: 'stable',
  },
  {
    id: 'markdown-editor',
    name: 'Markdown 编辑器',
    description: '实时预览的 Markdown 编辑器，支持导出',
    category: 'document',
    icon: 'FileText',
    route: '/tools/markdown',
    tags: ['markdown', 'editor', 'preview', 'export'],
    status: 'stable',
  },
];
```

- [ ] **Step 6: 创建 src/utils/cn.ts**

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 7: 创建 src/utils/storage.ts**

```typescript
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`Failed to write localStorage key "${key}"`);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },
};
```

- [ ] **Step 8: 创建 src/hooks/useLocalStorage.ts**

```typescript
import { useState, useCallback } from 'react';
import { storage } from '@/utils/storage';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => storage.get(key, initialValue));

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        storage.set(key, next);
        return next;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
```

- [ ] **Step 9: 创建 src/hooks/useKeyboardShortcuts.ts**

```typescript
import { useEffect } from 'react';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  handler: () => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const matchKey = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchCtrl = shortcut.ctrl ? e.ctrlKey || e.metaKey : true;
        const matchMeta = shortcut.meta ? e.metaKey : true;
        const matchShift = shortcut.shift ? e.shiftKey : true;

        if (matchKey && matchCtrl && matchMeta && matchShift) {
          e.preventDefault();
          shortcut.handler();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
```

- [ ] **Step 10: 验证 — 运行 dev 确认无 TS 错误**

Run: `npm run build`
Expected: 编译成功（忽略 App.tsx 中未使用的 import 警告）

- [ ] **Step 11: Commit**

```bash
git add src/types src/data src/utils src/hooks
git commit -m "feat: add type definitions, static data, and utility hooks"
```

---

## Task 3: 基础 UI 组件

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Tabs.tsx`
- Create: `src/components/ui/index.ts`

**Interfaces:**
- Consumes: `cn` 工具函数
- Produces:
  - `Button` — 主要/次要/幽灵三种变体，sm/md/lg 三种尺寸
  - `Input` — 文本输入，支持 prefix/suffix 插槽
  - `Card` — 容器卡片，hover 可选
  - `Badge` — 标签，多色
  - `Tabs` — 标签切换，受控组件

- [ ] **Step 1: 创建 src/components/ui/Button.tsx**

```tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-hover active:scale-[0.98] shadow-sm',
  secondary:
    'bg-bg-tertiary text-text-primary border border-border hover:border-border-hover hover:bg-bg-secondary',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
  md: 'h-9 px-4 text-sm rounded-lg gap-2',
  lg: 'h-11 px-6 text-base rounded-lg gap-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, type ButtonProps };
```

- [ ] **Step 2: 创建 src/components/ui/Input.tsx**

```tsx
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, prefix, suffix, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 flex items-center text-text-muted">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'h-9 w-full rounded-lg bg-bg-tertiary border border-border px-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent',
            prefix && 'pl-9',
            suffix && 'pr-9',
            className,
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 flex items-center text-text-muted">
            {suffix}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input, type InputProps };
```

- [ ] **Step 3: 创建 src/components/ui/Card.tsx**

```tsx
import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

function Card({ className, hoverable = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-bg-secondary p-6 transition-all duration-200',
        hoverable && 'hover:border-border-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 cursor-pointer',
        className,
      )}
      {...props}
    />
  );
}

export { Card, type CardProps };
```

- [ ] **Step 4: 创建 src/components/ui/Badge.tsx**

```tsx
import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type BadgeColor = 'blue' | 'purple' | 'green' | 'yellow' | 'gray';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

const colorStyles: Record<BadgeColor, string> = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  gray: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

function Badge({ className, color = 'gray', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
        colorStyles[color],
        className,
      )}
      {...props}
    />
  );
}

export { Badge, type BadgeProps };
```

- [ ] **Step 5: 创建 src/components/ui/Tabs.tsx**

```tsx
import { cn } from '@/utils/cn';

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

function Tabs({ tabs, activeId, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex items-center gap-1 border-b border-border', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative px-4 py-2.5 text-sm font-medium transition-colors outline-none',
            activeId === tab.id
              ? 'text-text-primary'
              : 'text-text-muted hover:text-text-secondary',
          )}
        >
          {tab.label}
          {activeId === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}

export { Tabs };
```

- [ ] **Step 6: 创建 src/components/ui/index.ts**

```typescript
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
export { Badge } from './Badge';
export { Tabs } from './Tabs';
```

- [ ] **Step 7: 验证 — 确保无 TS 错误**

Run: `npx tsc --noEmit`
Expected: 无错误输出

- [ ] **Step 8: Commit**

```bash
git add src/components/ui
git commit -m "feat: add base UI components (Button, Input, Card, Badge, Tabs)"
```

---

## Task 4: 布局组件 — Navbar + PageLayout + Breadcrumb

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/PageLayout.tsx`
- Create: `src/components/layout/Breadcrumb.tsx`
- Create: `src/store/useAppStore.ts`

**Interfaces:**
- Consumes: `cn`, `Button`, lucide-react icons
- Produces:
  - `Navbar` — 固定顶部导航，Logo + 链接 + 操作区
  - `PageLayout` — 页面容器，包含 Navbar + main 内容区
  - `Breadcrumb` — 面包屑，接收 items 数组
  - `useAppStore` — 全局状态（命令面板开关）

- [ ] **Step 1: 创建 src/store/useAppStore.ts**

```typescript
import { create } from 'zustand';

interface AppState {
  isCommandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isCommandPaletteOpen: false,
  openCommandPalette: () => set({ isCommandPaletteOpen: true }),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
  toggleCommandPalette: () =>
    set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
}));
```

- [ ] **Step 2: 创建 src/components/layout/Navbar.tsx**

```tsx
import { Link, useLocation } from 'react-router-dom';
import { Search, Github, Terminal } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/store/useAppStore';

const navLinks = [
  { label: '首页', path: '/' },
  { label: '工具', path: '/tools' },
  { label: '关于', path: '/about' },
];

export function Navbar() {
  const location = useLocation();
  const openCommandPalette = useAppStore((s) => s.openCommandPalette);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-text-primary">
          <Terminal className="h-5 w-5 text-accent" />
          <span>DevHub</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                location.pathname === link.path
                  ? 'text-text-primary bg-bg-tertiary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={openCommandPalette}
            className="flex h-8 items-center gap-2 rounded-md border border-border bg-bg-secondary px-3 text-sm text-text-muted transition-colors hover:border-border-hover hover:text-text-secondary"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">搜索</span>
            <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-bg-tertiary px-1.5 text-[10px] font-medium text-text-muted">
              ⌘K
            </kbd>
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 3: 创建 src/components/layout/PageLayout.tsx**

```tsx
import { type ReactNode } from 'react';
import { Navbar } from './Navbar';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
```

- [ ] **Step 4: 创建 src/components/layout/Breadcrumb.tsx**

```tsx
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-text-muted">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          {item.path && index < items.length - 1 ? (
            <Link to={item.path} className="transition-colors hover:text-text-secondary">
              {item.label}
            </Link>
          ) : (
            <span className="text-text-secondary">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 5: 更新 src/App.tsx 使用 PageLayout + 路由**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';

function Home() {
  return <div className="p-6">首页占位</div>;
}

function Toolbox() {
  return <div className="p-6">工具中心占位</div>;
}

function About() {
  return <div className="p-6">关于占位</div>;
}

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Toolbox />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 6: 验证**

Run: `npm run dev`
Expected: 打开 localhost:5173 看到 Navbar（Logo + 首页/工具/关于 + 搜索按钮 + GitHub），点击链接可切换路由

- [ ] **Step 7: Commit**

```bash
git add src/components/layout src/store src/App.tsx
git commit -m "feat: add Navbar, PageLayout, Breadcrumb and routing shell"
```

---

## Task 5: 首页（HomePage）

**Files:**
- Create: `src/pages/HomePage.tsx`
- Create: `src/components/shared/ToolCard.tsx`

**Interfaces:**
- Consumes: `tools`, `categories` 静态数据, `Card`, `Badge`, `Button` UI 组件, `motion` (framer-motion)
- Produces: `HomePage` 组件，作为 `/` 路由渲染

- [ ] **Step 1: 创建 src/components/shared/ToolCard.tsx**

```tsx
import { Link } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Tool } from '@/types/tool';

interface ToolCardProps {
  tool: Tool;
  icon: LucideIcon;
}

export function ToolCard({ tool, icon: Icon }: ToolCardProps) {
  return (
    <Link to={tool.route} className="group block">
      <Card hoverable className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex gap-1.5">
            {tool.isHot && <Badge color="yellow">热门</Badge>}
            {tool.isNew && <Badge color="green">NEW</Badge>}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
            {tool.name}
          </h3>
          <p className="mt-1 text-sm text-text-secondary line-clamp-2">
            {tool.description}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 2: 创建 src/pages/HomePage.tsx**

```tsx
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

const iconMap: Record<string, typeof Code2> = {
  Code2,
  Bot,
  FileText,
  Globe,
  Braces,
  Regex,
};

const categoryIcons: Record<string, typeof Code2> = {
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
```

- [ ] **Step 3: 创建 src/data/index.ts（barrel export）**

```typescript
export { tools } from './tools';
export { categories } from './categories';
```

- [ ] **Step 4: 更新 src/App.tsx — 将 Home 占位替换为 HomePage**

将 `function Home() { ... }` 替换为：

```tsx
import { HomePage } from '@/pages/HomePage';
```

并在 Route 中使用 `<Route path="/" element={<HomePage />} />`

- [ ] **Step 5: 验证**

Run: `npm run dev`
Expected: 首页显示 Hero + 分类卡片 + 工具卡片 + 统计 + Footer，动画正常

- [ ] **Step 6: Commit**

```bash
git add src/pages/HomePage.tsx src/components/shared/ToolCard.tsx src/data/index.ts src/App.tsx
git commit -m "feat: add HomePage with hero, categories, featured tools, and stats"
```

---

## Task 6: 工具中心（ToolboxPage）

**Files:**
- Create: `src/pages/ToolboxPage.tsx`
- Create: `src/store/useToolStore.ts`
- Create: `src/components/shared/SearchInput.tsx`

**Interfaces:**
- Consumes: `tools`, `categories`, `ToolCard`, `Tabs`, `Input`
- Produces: `ToolboxPage` 组件 — `/tools` 路由

- [ ] **Step 1: 创建 src/store/useToolStore.ts**

```typescript
import { create } from 'zustand';
import type { ToolCategory } from '@/types/tool';

interface ToolState {
  searchQuery: string;
  activeCategory: ToolCategory | 'all';
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: ToolCategory | 'all') => void;
}

export const useToolStore = create<ToolState>((set) => ({
  searchQuery: '',
  activeCategory: 'all',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
```

- [ ] **Step 2: 创建 src/components/shared/SearchInput.tsx**

```tsx
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = '搜索工具...' }: SearchInputProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      prefix={<Search className="h-4 w-4" />}
      suffix={
        value ? (
          <button onClick={() => onChange('')} className="hover:text-text-secondary">
            <X className="h-3.5 w-3.5" />
          </button>
        ) : undefined
      }
    />
  );
}
```

- [ ] **Step 3: 创建 src/pages/ToolboxPage.tsx**

```tsx
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

const categoryIcons: Record<string, LucideIcon> = {
  developer: Code2, ai: Bot, document: FileText, network: Globe,
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
```

- [ ] **Step 4: 更新 src/App.tsx — 将 Toolbox 占位替换为 ToolboxPage**

```tsx
import { ToolboxPage } from '@/pages/ToolboxPage';
// ...
<Route path="/tools" element={<ToolboxPage />} />
```

- [ ] **Step 5: 验证**

Run: `npm run dev`
Expected: 访问 `/tools` 看到搜索框 + 分类标签 + 工具网格，搜索和筛选功能正常

- [ ] **Step 6: Commit**

```bash
git add src/pages/ToolboxPage.tsx src/store/useToolStore.ts src/components/shared/SearchInput.tsx src/App.tsx
git commit -m "feat: add ToolboxPage with search and category filtering"
```

---

## Task 7: JSON 格式化工具

**Files:**
- Create: `src/features/json/utils/formatter.ts`
- Create: `src/features/json/utils/validator.ts`
- Create: `src/features/json/hooks/useJsonFormatter.ts`
- Create: `src/features/json/components/JsonEditor.tsx`
- Create: `src/features/json/components/JsonTreeView.tsx`
- Create: `src/features/json/components/ValidationStatus.tsx`
- Create: `src/pages/tools/JsonFormatterPage.tsx`

**Interfaces:**
- Consumes: `Card`, `Button`, `Badge`, `Tabs`, `Breadcrumb`, `PageLayout`
- Produces: `JsonFormatterPage` 组件 — `/tools/json` 路由

- [ ] **Step 1: 创建 src/features/json/utils/validator.ts**

```typescript
import type { JsonError } from '@/types/common';

export function validateJson(input: string): { valid: true } | { valid: false; error: JsonError } {
  if (!input.trim()) {
    return { valid: true };
  }
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    const message = (e as SyntaxError).message;
    const positionMatch = message.match(/position (\d+)/);
    const position = positionMatch ? parseInt(positionMatch[1], 10) : 0;

    const lines = input.slice(0, position).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    return { valid: false, error: { message, line, column } };
  }
}
```

- [ ] **Step 2: 创建 src/features/json/utils/formatter.ts**

```typescript
import type { TreeNode } from '@/types/common';

export function formatJson(input: string, indent: number = 2): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indent);
}

export function minifyJson(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

export function buildTree(data: unknown, key = '$', path = '$'): TreeNode {
  if (data === null) {
    return { key, type: 'null', value: null, path };
  }
  if (Array.isArray(data)) {
    return {
      key,
      type: 'array',
      value: data,
      path,
      isCollapsed: false,
      children: data.map((item, i) => buildTree(item, `[${i}]`, `${path}[${i}]`)),
    };
  }
  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    return {
      key,
      type: 'object',
      value: data,
      path,
      isCollapsed: false,
      children: entries.map(([k, v]) => buildTree(v, k, `${path}.${k}`)),
    };
  }
  return {
    key,
    type: typeof data as 'string' | 'number' | 'boolean',
    value: data,
    path,
  };
}

export function countKeys(data: unknown): number {
  if (data === null || typeof data !== 'object') return 0;
  if (Array.isArray(data)) return data.reduce((sum, item) => sum + countKeys(item), 0);
  return Object.keys(data).length + Object.values(data).reduce((sum, v) => sum + countKeys(v), 0);
}

export function getDepth(data: unknown): number {
  if (data === null || typeof data !== 'object') return 0;
  if (Array.isArray(data)) {
    return 1 + Math.max(0, ...data.map(getDepth));
  }
  const values = Object.values(data as Record<string, unknown>);
  return 1 + Math.max(0, ...values.map(getDepth));
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
```

- [ ] **Step 3: 创建 src/features/json/hooks/useJsonFormatter.ts**

```typescript
import { useState, useMemo, useCallback } from 'react';
import { validateJson } from '../utils/validator';
import { formatJson, minifyJson, buildTree, countKeys, getDepth, formatSize } from '../utils/formatter';

type ViewMode = 'code' | 'tree' | 'split';

interface JsonStats {
  lines: number;
  size: string;
  depth: number;
  keys: number;
}

export function useJsonFormatter() {
  const [input, setInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [indent, setIndent] = useState(2);

  const validation = useMemo(() => validateJson(input), [input]);

  const output = useMemo(() => {
    if (!input.trim() || !validation.valid) return '';
    return formatJson(input, indent);
  }, [input, indent, validation.valid]);

  const tree = useMemo(() => {
    if (!input.trim() || !validation.valid) return null;
    try {
      return buildTree(JSON.parse(input));
    } catch {
      return null;
    }
  }, [input, validation.valid]);

  const stats: JsonStats = useMemo(() => {
    if (!input.trim()) return { lines: 0, size: '0 B', depth: 0, keys: 0 };
    try {
      const parsed = JSON.parse(input);
      const formatted = formatJson(input, indent);
      return {
        lines: formatted.split('\n').length,
        size: formatSize(new Blob([input]).size),
        depth: getDepth(parsed),
        keys: countKeys(parsed),
      };
    } catch {
      return { lines: input.split('\n').length, size: formatSize(new Blob([input]).size), depth: 0, keys: 0 };
    }
  }, [input, indent]);

  const handleFormat = useCallback(() => {
    if (validation.valid && input.trim()) {
      setInput(formatJson(input, indent));
    }
  }, [input, indent, validation.valid]);

  const handleMinify = useCallback(() => {
    if (validation.valid && input.trim()) {
      setInput(minifyJson(input));
    }
  }, [input, validation.valid]);

  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  const handleCopy = useCallback(async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  }, [output]);

  return {
    input,
    setInput,
    output,
    validation,
    tree,
    stats,
    viewMode,
    setViewMode,
    indent,
    setIndent,
    handleFormat,
    handleMinify,
    handleClear,
    handleCopy,
  };
}
```

- [ ] **Step 4: 创建 src/features/json/components/ValidationStatus.tsx**

```tsx
import { CheckCircle, XCircle } from 'lucide-react';
import type { JsonError } from '@/types/common';

interface ValidationStatusProps {
  isValid: boolean;
  error: JsonError | null;
  stats: { lines: number; size: string; depth: number; keys: number };
}

export function ValidationStatus({ isValid, error, stats }: ValidationStatusProps) {
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-2 text-sm">
      <div className="flex items-center gap-2">
        {isValid ? (
          <>
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-success">JSON 有效</span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-error" />
            <span className="text-error">{error?.message}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-4 text-text-muted">
        <span>{stats.lines} 行</span>
        <span>{stats.size}</span>
        <span>{stats.keys} 键</span>
        <span>深度 {stats.depth}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 创建 src/features/json/components/JsonEditor.tsx**

```tsx
import { cn } from '@/utils/cn';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export function JsonEditor({ value, onChange, readOnly = false, placeholder }: JsonEditorProps) {
  const lines = value ? value.split('\n').length : 1;

  return (
    <div className="flex h-full overflow-hidden rounded-lg border border-border bg-bg-tertiary">
      {/* Line numbers */}
      <div className="flex flex-col items-end py-3 pr-3 pl-3 text-right font-mono text-xs text-text-muted select-none bg-bg-secondary border-r border-border">
        {Array.from({ length: Math.max(lines, 10) }, (_, i) => (
          <div key={i} className="leading-6">{i + 1}</div>
        ))}
      </div>
      {/* Editor */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        spellCheck={false}
        className={cn(
          'flex-1 resize-none bg-transparent p-3 font-mono text-sm text-text-primary outline-none placeholder:text-text-muted leading-6',
          readOnly && 'cursor-default',
        )}
      />
    </div>
  );
}
```

- [ ] **Step 6: 创建 src/features/json/components/JsonTreeView.tsx**

```tsx
import { useState, type ReactNode } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { TreeNode } from '@/types/common';

interface JsonTreeViewProps {
  tree: TreeNode;
}

export function JsonTreeView({ tree }: JsonTreeViewProps) {
  return (
    <div className="h-full overflow-auto rounded-lg border border-border bg-bg-tertiary p-3 font-mono text-sm">
      <TreeNodeComponent node={tree} depth={0} />
    </div>
  );
}

function TreeNodeComponent({ node, depth }: { node: TreeNode; depth: number }): ReactNode {
  const [collapsed, setCollapsed] = useState(depth > 2);

  const hasChildren = node.children && node.children.length > 0;
  const indent = depth * 20;

  const typeColors: Record<string, string> = {
    string: 'text-green-400',
    number: 'text-blue-400',
    boolean: 'text-purple-400',
    null: 'text-text-muted',
    array: 'text-yellow-400',
    object: 'text-accent',
  };

  if (!hasChildren) {
    return (
      <div className="flex items-center gap-1 leading-7" style={{ paddingLeft: indent }}>
        <span className="text-text-secondary">{node.key}: </span>
        <span className={typeColors[node.type]}>
          {node.type === 'string' ? `"${node.value}"` : String(node.value)}
        </span>
      </div>
    );
  }

  const bracket = node.type === 'array' ? ['[', ']'] : ['{', '}'];
  const childCount = node.children?.length ?? 0;

  return (
    <div>
      <div
        className="flex cursor-pointer items-center gap-1 leading-7 hover:bg-bg-secondary rounded"
        style={{ paddingLeft: indent }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-text-muted shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-text-muted shrink-0" />
        )}
        <span className="text-text-secondary">{node.key}</span>
        <span className="text-text-muted">{bracket[0]}</span>
        {collapsed && (
          <span className="text-text-muted text-xs ml-1">
            {childCount} items… {bracket[1]}
          </span>
        )}
      </div>
      {!collapsed && (
        <>
          {node.children!.map((child, i) => (
            <TreeNodeComponent key={`${child.key}-${i}`} node={child} depth={depth + 1} />
          ))}
          <div className="leading-7 text-text-muted" style={{ paddingLeft: indent }}>
            {bracket[1]}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 7: 创建 src/pages/tools/JsonFormatterPage.tsx**

```tsx
import { Copy, Trash2, Minimize2, Maximize2, Braces } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { JsonEditor } from '@/features/json/components/JsonEditor';
import { JsonTreeView } from '@/features/json/components/JsonTreeView';
import { ValidationStatus } from '@/features/json/components/ValidationStatus';
import { useJsonFormatter } from '@/features/json/hooks/useJsonFormatter';

const viewTabs = [
  { id: 'code', label: '代码' },
  { id: 'tree', label: '树形' },
  { id: 'split', label: '分栏' },
];

export function JsonFormatterPage() {
  const {
    input, setInput, output, validation, tree, stats,
    viewMode, setViewMode, handleFormat, handleMinify, handleClear, handleCopy,
  } = useJsonFormatter();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <Breadcrumb items={[
        { label: '工具', path: '/tools' },
        { label: 'JSON 格式化' },
      ]} />

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Braces className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold">JSON 格式化</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleFormat}>格式化</Button>
          <Button variant="secondary" size="sm" onClick={handleMinify}>压缩</Button>
          <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
            <Copy className="h-3.5 w-3.5" /> 复制
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <Trash2 className="h-3.5 w-3.5" /> 清空
          </Button>
        </div>
      </div>

      {/* View mode tabs */}
      <div className="mt-4">
        <Tabs tabs={viewTabs} activeId={viewMode} onChange={(id) => setViewMode(id as 'code' | 'tree' | 'split')} />
      </div>

      {/* Editor area */}
      <div className="mt-4" style={{ height: 'calc(100vh - 280px)', minHeight: 400 }}>
        {(viewMode === 'split' || viewMode === 'code') && (
          <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div className="flex flex-col" style={{ height: 'calc(100vh - 300px)', minHeight: 380 }}>
              <label className="mb-1.5 text-xs font-medium text-text-muted">输入</label>
              <div className="flex-1">
                <JsonEditor value={input} onChange={setInput} placeholder='粘贴 JSON，例如：{"key": "value"}' />
              </div>
            </div>
            {viewMode === 'split' && tree && (
              <div className="flex flex-col" style={{ height: 'calc(100vh - 300px)', minHeight: 380 }}>
                <label className="mb-1.5 text-xs font-medium text-text-muted">树形视图</label>
                <div className="flex-1">
                  <JsonTreeView tree={tree} />
                </div>
              </div>
            )}
            {viewMode === 'code' && (
              <div className="flex flex-col" style={{ height: 'calc(100vh - 300px)', minHeight: 380 }}>
                <label className="mb-1.5 text-xs font-medium text-text-muted">输出</label>
                <div className="flex-1">
                  <JsonEditor value={output} onChange={() => {}} readOnly />
                </div>
              </div>
            )}
          </div>
        )}
        {viewMode === 'tree' && tree && (
          <div style={{ height: 'calc(100vh - 300px)', minHeight: 380 }}>
            <JsonTreeView tree={tree} />
          </div>
        )}
      </div>

      {/* Status bar */}
      <ValidationStatus
        isValid={validation.valid}
        error={validation.valid ? null : validation.error}
        stats={stats}
      />
    </div>
  );
}
```

- [ ] **Step 8: 更新 src/App.tsx — 添加 JSON 工具路由**

```tsx
import { JsonFormatterPage } from '@/pages/tools/JsonFormatterPage';
// ...
<Route path="/tools/json" element={<JsonFormatterPage />} />
```

- [ ] **Step 9: 验证**

Run: `npm run dev`
Expected: 访问 `/tools/json`，可输入 JSON 并格式化、压缩、查看树形视图，状态栏显示校验结果

- [ ] **Step 10: Commit**

```bash
git add src/features/json src/pages/tools/JsonFormatterPage.tsx src/App.tsx
git commit -m "feat: add JSON formatter tool with format, minify, tree view, and validation"
```

---

## Task 8: 正则测试工具

**Files:**
- Create: `src/features/regex/data/templates.ts`
- Create: `src/features/regex/hooks/useRegexTester.ts`
- Create: `src/features/regex/components/RegexInput.tsx`
- Create: `src/features/regex/components/MatchHighlight.tsx`
- Create: `src/features/regex/components/MatchList.tsx`
- Create: `src/features/regex/components/RegexTemplates.tsx`
- Create: `src/pages/tools/RegexTesterPage.tsx`

**Interfaces:**
- Consumes: `RegexMatch`, `CaptureGroup`, `RegexTemplate` 类型, UI 组件
- Produces: `RegexTesterPage` — `/tools/regex` 路由

- [ ] **Step 1: 创建 src/features/regex/data/templates.ts**

```typescript
import type { RegexTemplate } from '@/types/common';

export const regexTemplates: RegexTemplate[] = [
  {
    id: 'email',
    name: '邮箱地址',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    description: '匹配常见的电子邮箱格式',
    example: 'hello@example.com',
  },
  {
    id: 'url',
    name: 'URL 链接',
    pattern: 'https?:\\/\\/[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]+',
    description: '匹配 HTTP/HTTPS URL',
    example: 'https://www.example.com/path?q=test',
  },
  {
    id: 'phone-cn',
    name: '中国手机号',
    pattern: '1[3-9]\\d{9}',
    description: '匹配中国大陆手机号码',
    example: '13800138000',
  },
  {
    id: 'ipv4',
    name: 'IPv4 地址',
    pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b',
    description: '匹配 IPv4 地址',
    example: '192.168.1.1',
  },
  {
    id: 'date',
    name: '日期 (YYYY-MM-DD)',
    pattern: '\\d{4}[-/](?:0[1-9]|1[0-2])[-/](?:0[1-9]|[12]\\d|3[01])',
    description: '匹配 YYYY-MM-DD 或 YYYY/MM/DD 格式',
    example: '2026-07-11',
  },
  {
    id: 'hex-color',
    name: '十六进制颜色',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    description: '匹配 #fff 或 #ffffff 格式',
    example: '#3B82F6',
  },
];
```

- [ ] **Step 2: 创建 src/features/regex/hooks/useRegexTester.ts**

```typescript
import { useState, useMemo, useCallback } from 'react';
import type { RegexMatch, CaptureGroup } from '@/types/common';

export function useRegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');

  const { matches, isValid, error, executionTime } = useMemo(() => {
    if (!pattern || !testString) {
      return { matches: [], isValid: true, error: null, executionTime: 0 };
    }

    const start = performance.now();
    try {
      const regex = new RegExp(pattern, flags);
      const results: RegexMatch[] = [];
      let match: RegExpExecArray | null;

      if (flags.includes('g')) {
        let safety = 0;
        while ((match = regex.exec(testString)) !== null && safety < 10000) {
          results.push(buildMatch(match));
          if (match[0].length === 0) regex.lastIndex++;
          safety++;
        }
      } else {
        match = regex.exec(testString);
        if (match) results.push(buildMatch(match));
      }

      const elapsed = performance.now() - start;
      return { matches: results, isValid: true, error: null, executionTime: elapsed };
    } catch (e) {
      return { matches: [], isValid: false, error: (e as Error).message, executionTime: 0 };
    }
  }, [pattern, flags, testString]);

  const handleTemplateSelect = useCallback((templatePattern: string) => {
    setPattern(templatePattern);
    setFlags('g');
  }, []);

  return {
    pattern, setPattern,
    flags, setFlags,
    testString, setTestString,
    matches, isValid, error, executionTime,
    handleTemplateSelect,
  };
}

function buildMatch(match: RegExpExecArray): RegexMatch {
  const groups: CaptureGroup[] = [];
  for (let i = 1; i < match.length; i++) {
    if (match[i] !== undefined) {
      groups.push({
        name: match.groups ? Object.entries(match.groups).find(([, v]) => v === match[i])?.[0] ?? null : null,
        value: match[i],
        start: match.index + (match[0].indexOf(match[i])),
        end: match.index + (match[0].indexOf(match[i])) + match[i].length,
      });
    }
  }
  return {
    index: match.index,
    fullMatch: match[0],
    groups,
  };
}
```

- [ ] **Step 3: 创建 src/features/regex/components/RegexInput.tsx**

```tsx
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/cn';

interface RegexInputProps {
  pattern: string;
  onPatternChange: (value: string) => void;
  flags: string;
  onFlagsChange: (flags: string) => void;
  isValid: boolean;
}

const flagOptions = [
  { flag: 'g', label: 'Global' },
  { flag: 'i', label: 'Ignore case' },
  { flag: 'm', label: 'Multiline' },
  { flag: 's', label: 'Dotall' },
];

export function RegexInput({ pattern, onPatternChange, flags, onFlagsChange, isValid }: RegexInputProps) {
  const toggleFlag = (flag: string) => {
    onFlagsChange(flags.includes(flag) ? flags.replace(flag, '') : flags + flag);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-text-muted font-mono text-sm">/</span>
        <div className="flex-1">
          <Input
            value={pattern}
            onChange={(e) => onPatternChange(e.target.value)}
            placeholder="输入正则表达式..."
            className={cn('font-mono', !isValid && 'border-error')}
          />
        </div>
        <span className="text-text-muted font-mono text-sm">/{flags}</span>
      </div>
      <div className="flex items-center gap-2">
        {flagOptions.map((opt) => (
          <button
            key={opt.flag}
            onClick={() => toggleFlag(opt.flag)}
            className={cn(
              'flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
              flags.includes(opt.flag)
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-text-muted hover:text-text-secondary hover:border-border-hover',
            )}
            title={opt.label}
          >
            <span className="font-mono">{opt.flag}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 创建 src/features/regex/components/MatchHighlight.tsx**

```tsx
import { useMemo, type ReactNode } from 'react';
import type { RegexMatch } from '@/types/common';

interface MatchHighlightProps {
  text: string;
  matches: RegexMatch[];
}

const matchColors = ['bg-blue-500/20 border-blue-500/40', 'bg-purple-500/20 border-purple-500/40', 'bg-green-500/20 border-green-500/40', 'bg-yellow-500/20 border-yellow-500/40'];

export function MatchHighlight({ text, matches }: MatchHighlightProps) {
  const segments = useMemo(() => {
    if (!text || matches.length === 0) return [{ text, highlight: false, colorIdx: -1 }];

    const parts: { text: string; highlight: boolean; colorIdx: number }[] = [];
    let lastEnd = 0;

    const sorted = [...matches].sort((a, b) => a.index - b.index);
    sorted.forEach((m, i) => {
      if (m.index > lastEnd) {
        parts.push({ text: text.slice(lastEnd, m.index), highlight: false, colorIdx: -1 });
      }
      if (m.index >= lastEnd) {
        parts.push({ text: m.fullMatch, highlight: true, colorIdx: i % matchColors.length });
        lastEnd = m.index + m.fullMatch.length;
      }
    });

    if (lastEnd < text.length) {
      parts.push({ text: text.slice(lastEnd), highlight: false, colorIdx: -1 });
    }

    return parts;
  }, [text, matches]);

  return (
    <div className="whitespace-pre-wrap break-all font-mono text-sm leading-7 text-text-primary p-3">
      {segments.map((seg, i): ReactNode =>
        seg.highlight ? (
          <mark key={i} className={`rounded border ${matchColors[seg.colorIdx]} px-0.5`}>
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </div>
  );
}
```

- [ ] **Step 5: 创建 src/features/regex/components/MatchList.tsx**

```tsx
import type { RegexMatch } from '@/types/common';

interface MatchListProps {
  matches: RegexMatch[];
}

export function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-bg-tertiary p-6 text-center text-sm text-text-muted">
        没有匹配结果
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-bg-tertiary overflow-hidden">
      <div className="border-b border-border px-4 py-2 text-xs font-medium text-text-muted">
        {matches.length} 个匹配
      </div>
      <div className="max-h-64 overflow-auto">
        {matches.map((match, i) => (
          <div key={i} className="border-b border-border/50 px-4 py-2 last:border-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">#{i + 1} (位置 {match.index})</span>
              <code className="rounded bg-bg-secondary px-2 py-0.5 text-xs text-accent">
                {match.fullMatch}
              </code>
            </div>
            {match.groups.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-2">
                {match.groups.map((group, j) => (
                  <div key={j} className="rounded bg-bg-secondary px-2 py-0.5 text-xs">
                    <span className="text-text-muted">{group.name ?? `G${j + 1}`}: </span>
                    <span className="text-text-primary">{group.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: 创建 src/features/regex/components/RegexTemplates.tsx**

```tsx
import { cn } from '@/utils/cn';
import { regexTemplates } from '../data/templates';

interface RegexTemplatesProps {
  onSelect: (pattern: string) => void;
  selectedId?: string;
}

export function RegexTemplates({ onSelect, selectedId }: RegexTemplatesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {regexTemplates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.pattern)}
          className={cn(
            'rounded-lg border px-3 py-2 text-left transition-all hover:-translate-y-0.5',
            selectedId === template.id
              ? 'border-accent bg-accent/10'
              : 'border-border bg-bg-secondary hover:border-border-hover',
          )}
          title={template.description}
        >
          <div className="text-sm font-medium text-text-primary">{template.name}</div>
          <code className="mt-0.5 block text-xs text-text-muted truncate max-w-[180px]">
            {template.pattern}
          </code>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 7: 创建 src/pages/tools/RegexTesterPage.tsx**

```tsx
import { Regex } from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { RegexInput } from '@/features/regex/components/RegexInput';
import { MatchHighlight } from '@/features/regex/components/MatchHighlight';
import { MatchList } from '@/features/regex/components/MatchList';
import { RegexTemplates } from '@/features/regex/components/RegexTemplates';
import { useRegexTester } from '@/features/regex/hooks/useRegexTester';

export function RegexTesterPage() {
  const {
    pattern, setPattern, flags, setFlags,
    testString, setTestString,
    matches, isValid, error, executionTime,
    handleTemplateSelect,
  } = useRegexTester();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <Breadcrumb items={[
        { label: '工具', path: '/tools' },
        { label: '正则测试' },
      ]} />

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Regex className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold">正则测试</h1>
      </div>

      {/* Regex input */}
      <div className="mt-6">
        <RegexInput
          pattern={pattern}
          onPatternChange={setPattern}
          flags={flags}
          onFlagsChange={setFlags}
          isValid={isValid}
        />
        {!isValid && (
          <p className="mt-2 text-sm text-error">{error}</p>
        )}
      </div>

      {/* Templates */}
      <div className="mt-6">
        <label className="mb-2 block text-xs font-medium text-text-muted">常用模板</label>
        <RegexTemplates onSelect={handleTemplateSelect} />
      </div>

      {/* Test string */}
      <div className="mt-6">
        <label className="mb-2 block text-xs font-medium text-text-muted">测试文本</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="输入要测试的文本..."
          className="w-full rounded-lg border border-border bg-bg-tertiary p-3 font-mono text-sm text-text-primary outline-none transition-colors focus:border-accent min-h-[120px] resize-y placeholder:text-text-muted"
        />
      </div>

      {/* Match highlight */}
      <div className="mt-6">
        <label className="mb-2 block text-xs font-medium text-text-muted">匹配结果</label>
        <div className="rounded-lg border border-border bg-bg-tertiary min-h-[120px]">
          <MatchHighlight text={testString} matches={matches} />
        </div>
      </div>

      {/* Match list + perf */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <MatchList matches={matches} />
        <div className="rounded-lg border border-border bg-bg-tertiary p-4">
          <div className="text-xs font-medium text-text-muted mb-3">性能分析</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">匹配数量</span>
              <span className="text-text-primary font-medium">{matches.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">执行耗时</span>
              <span className="text-text-primary font-medium">{executionTime.toFixed(2)} ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">状态</span>
              <span className={isValid ? 'text-success' : 'text-error'}>
                {isValid ? '有效' : '无效'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: 更新 src/App.tsx — 添加正则工具路由**

```tsx
import { RegexTesterPage } from '@/pages/tools/RegexTesterPage';
// ...
<Route path="/tools/regex" element={<RegexTesterPage />} />
```

- [ ] **Step 9: 验证**

Run: `npm run dev`
Expected: 访问 `/tools/regex`，可输入正则和测试文本，实时看到高亮匹配和匹配详情列表，点击模板可快速填充

- [ ] **Step 10: Commit**

```bash
git add src/features/regex src/pages/tools/RegexTesterPage.tsx src/App.tsx
git commit -m "feat: add regex tester with real-time matching, templates, and performance stats"
```

---

## Task 9: AI 聊天助手

**Files:**
- Create: `src/features/ai-chat/data/promptTemplates.ts`
- Create: `src/features/ai-chat/services/aiService.ts`
- Create: `src/store/useChatStore.ts`
- Create: `src/features/ai-chat/hooks/useStreaming.ts`
- Create: `src/features/ai-chat/hooks/useChat.ts`
- Create: `src/features/ai-chat/components/MessageBubble.tsx`
- Create: `src/features/ai-chat/components/ChatInput.tsx`
- Create: `src/features/ai-chat/components/ChatContainer.tsx`
- Create: `src/features/ai-chat/components/PromptPanel.tsx`
- Create: `src/features/ai-chat/components/ConversationList.tsx`
- Create: `src/features/ai-chat/components/SettingsPanel.tsx`
- Create: `src/pages/tools/AiChatPage.tsx`

**Interfaces:**
- Consumes: `ChatState`, `Conversation`, `Message`, `ChatSettings`, `PromptTemplate` 类型
- Produces: `AiChatPage` — `/tools/ai-chat` 路由

- [ ] **Step 1: 创建 src/features/ai-chat/data/promptTemplates.ts**

```typescript
import type { PromptTemplate } from '@/types/chat';

export const promptTemplates: PromptTemplate[] = [
  {
    id: 'code-review',
    name: '代码审查',
    description: '审查代码质量、性能和潜在问题',
    prompt: '请帮我审查以下代码，关注代码质量、性能、可读性和潜在问题：\n\n```\n// 在这里粘贴代码\n```',
    category: 'coding',
  },
  {
    id: 'explain-code',
    name: '解释代码',
    description: '逐行解释代码逻辑',
    prompt: '请逐行解释以下代码的功能和逻辑：\n\n```\n// 在这里粘贴代码\n```',
    category: 'coding',
  },
  {
    id: 'generate-test',
    name: '生成测试',
    description: '为代码生成单元测试',
    prompt: '请为以下代码生成完整的单元测试：\n\n```\n// 在这里粘贴代码\n```',
    category: 'coding',
  },
  {
    id: 'summarize',
    name: '文本摘要',
    description: '提取文本的核心要点',
    prompt: '请用简洁的语言总结以下内容的核心要点：\n\n',
    category: 'writing',
  },
  {
    id: 'translate',
    name: '中英翻译',
    description: '在中文和英文之间翻译',
    prompt: '请将以下内容翻译成英文（如果是英文则翻译成中文）：\n\n',
    category: 'writing',
  },
  {
    id: 'analyze',
    name: '问题分析',
    description: '深入分析一个技术问题',
    prompt: '请深入分析以下技术问题，给出原因、影响和解决方案：\n\n',
    category: 'analysis',
  },
];
```

- [ ] **Step 2: 创建 src/features/ai-chat/services/aiService.ts**

```typescript
import type { Message, ChatSettings } from '@/types/chat';

export async function sendMessage(
  messages: Message[],
  settings: ChatSettings,
  onChunk: (text: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': settings.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    signal,
    body: JSON.stringify({
      model: settings.model,
      max_tokens: settings.maxTokens,
      temperature: settings.temperature,
      system: settings.systemPrompt || undefined,
      stream: true,
      messages: messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          onChunk(parsed.delta.text);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }
}
```

- [ ] **Step 3: 创建 src/store/useChatStore.ts**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Conversation, ChatSettings, Message } from '@/types/chat';
import { storage } from '@/utils/storage';

const defaultSettings: ChatSettings = {
  apiKey: '',
  model: 'claude-sonnet-4-20250514',
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: '你是一个专业的开发者助手，擅长编程、调试和技术问题解答。',
};

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  settings: ChatSettings;
  isSettingsOpen: boolean;

  // Actions
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateLastAssistantMessage: (conversationId: string, chunk: string) => void;
  setStreaming: (streaming: boolean) => void;
  updateSettings: (settings: Partial<ChatSettings>) => void;
  setSettingsOpen: (open: boolean) => void;
  getActiveConversation: () => Conversation | null;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isStreaming: false,
      settings: defaultSettings,
      isSettingsOpen: false,

      createConversation: () => {
        const id = crypto.randomUUID();
        const conversation: Conversation = {
          id,
          title: '新对话',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          model: get().settings.model,
        };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      deleteConversation: (id) => {
        set((state) => {
          const filtered = state.conversations.filter((c) => c.id !== id);
          const isActive = state.activeConversationId === id;
          return {
            conversations: filtered,
            activeConversationId: isActive ? (filtered[0]?.id ?? null) : state.activeConversationId,
          };
        });
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const messages = [...c.messages, message];
            const title = c.messages.length === 0 && message.role === 'user'
              ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
              : c.title;
            return { ...c, messages, title, updatedAt: Date.now() };
          }),
        }));
      },

      updateLastAssistantMessage: (conversationId, chunk) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const messages = [...c.messages];
            const last = messages[messages.length - 1];
            if (last?.role === 'assistant') {
              messages[messages.length - 1] = { ...last, content: last.content + chunk };
            }
            return { ...c, messages, updatedAt: Date.now() };
          }),
        }));
      },

      setStreaming: (streaming) => set({ isStreaming: streaming }),
      updateSettings: (partial) =>
        set((state) => ({ settings: { ...state.settings, ...partial } })),
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),

      getActiveConversation: () => {
        const state = get();
        return state.conversations.find((c) => c.id === state.activeConversationId) ?? null;
      },
    }),
    {
      name: 'devhub-chat',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        settings: state.settings,
      }),
    },
  ),
);
```

- [ ] **Step 4: 创建 src/features/ai-chat/hooks/useStreaming.ts**

```typescript
import { useRef, useCallback } from 'react';
import { sendMessage } from '../services/aiService';
import { useChatStore } from '@/store/useChatStore';
import type { ChatSettings, Message } from '@/types/chat';

export function useStreaming() {
  const abortRef = useRef<AbortController | null>(null);
  const {
    addMessage, updateLastAssistantMessage, setStreaming, settings,
    getActiveConversation, createConversation,
  } = useChatStore();

  const send = useCallback(
    async (content: string) => {
      const conversationId = getActiveConversation()?.id ?? createConversation();

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      addMessage(conversationId, userMessage);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };
      addMessage(conversationId, assistantMessage);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const conv = useChatStore.getState().conversations.find((c) => c.id === conversationId);
        const history = conv?.messages.filter((m) => m.role !== 'assistant' || m.content) ?? [];

        await sendMessage(history, settings, (chunk) => {
          updateLastAssistantMessage(conversationId, chunk);
        }, controller.signal);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          updateLastAssistantMessage(conversationId, `\n\n---\n⚠️ 错误: ${(e as Error).message}`);
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [addMessage, updateLastAssistantMessage, setStreaming, settings, getActiveConversation, createConversation],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
  }, [setStreaming]);

  return { send, stop };
}
```

- [ ] **Step 5: 创建 src/features/ai-chat/hooks/useChat.ts**

```typescript
import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useStreaming } from './useStreaming';

export function useChat() {
  const conversation = useChatStore((s) => s.getActiveConversation());
  const isStreaming = useChatStore((s) => s.isStreaming);
  const isSettingsOpen = useChatStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useChatStore((s) => s.setSettingsOpen);
  const createConversation = useChatStore((s) => s.createConversation);
  const settings = useChatStore((s) => s.settings);
  const { send, stop } = useStreaming();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const handleSend = (content: string) => {
    if (!content.trim()) return;
    if (!settings.apiKey) {
      setSettingsOpen(true);
      return;
    }
    send(content);
  };

  return {
    conversation,
    isStreaming,
    isSettingsOpen,
    setSettingsOpen,
    createConversation,
    settings,
    handleSend,
    stop,
    messagesEndRef,
  };
}
```

- [ ] **Step 6: 创建 src/features/ai-chat/components/MessageBubble.tsx**

```tsx
import { User, Bot } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
        isUser ? 'bg-accent/10 text-accent' : 'bg-bg-tertiary text-text-secondary',
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn(
        'max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed',
        isUser
          ? 'bg-accent text-white'
          : 'bg-bg-tertiary text-text-primary border border-border',
      )}>
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        {!message.content && (
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: 创建 src/features/ai-chat/components/ChatInput.tsx**

```tsx
import { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
  onSend: (content: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (isStreaming) return;
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-xl border border-border bg-bg-tertiary p-3 focus-within:border-accent">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? '请先设置 API Key...' : '输入消息，Enter 发送，Shift+Enter 换行...'}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted min-h-[24px] max-h-[200px]"
      />
      {isStreaming ? (
        <Button variant="ghost" size="sm" onClick={onStop}>
          <Square className="h-4 w-4" />
        </Button>
      ) : (
        <Button size="sm" onClick={handleSubmit} disabled={!input.trim() || disabled}>
          <Send className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
```

- [ ] **Step 8: 创建 src/features/ai-chat/components/ChatContainer.tsx**

```tsx
import { Bot } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { useChat } from '../hooks/useChat';

export function ChatContainer() {
  const { conversation, isStreaming, handleSend, stop, messagesEndRef, settings } = useChat();

  const needsApiKey = !settings.apiKey;

  return (
    <div className="flex flex-col rounded-xl border border-border bg-bg-secondary" style={{ height: 'calc(100vh - 240px)' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!conversation || conversation.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Bot className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-text-primary">AI 聊天助手</h3>
            <p className="mt-1 text-sm text-text-muted max-w-sm">
              {needsApiKey ? '请先点击右上角设置 API Key 以开始对话' : '输入消息开始对话，支持 Markdown 格式'}
            </p>
          </div>
        ) : (
          <>
            {conversation.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <ChatInput
          onSend={handleSend}
          onStop={stop}
          isStreaming={isStreaming}
          disabled={needsApiKey}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 9: 创建 src/features/ai-chat/components/PromptPanel.tsx**

```tsx
import { cn } from '@/utils/cn';
import { useChatStore } from '@/store/useChatStore';
import { promptTemplates } from '../data/promptTemplates';
import type { PromptTemplate } from '@/types/chat';

const categoryLabels: Record<string, string> = {
  coding: '编程',
  writing: '写作',
  analysis: '分析',
};

export function PromptPanel() {
  const isStreaming = useChatStore((s) => s.isStreaming);

  const handleSelect = (template: PromptTemplate) => {
    // Dispatch event so ChatInput picks it up
    window.dispatchEvent(new CustomEvent('devhub:insert-prompt', { detail: template.prompt }));
  };

  return (
    <div className="w-64 shrink-0 rounded-xl border border-border bg-bg-secondary p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-text-primary">提示词模板</h3>
      <p className="mt-0.5 text-xs text-text-muted">点击快速填充</p>

      {(['coding', 'writing', 'analysis'] as const).map((cat) => {
        const templates = promptTemplates.filter((t) => t.category === cat);
        return (
          <div key={cat} className="mt-4">
            <div className="text-xs font-medium text-text-muted">{categoryLabels[cat]}</div>
            <div className="mt-1.5 space-y-1">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => !isStreaming && handleSelect(t)}
                  disabled={isStreaming}
                  className={cn(
                    'w-full rounded-lg border border-border px-3 py-2 text-left transition-colors',
                    'hover:border-border-hover hover:bg-bg-tertiary',
                    'disabled:opacity-50 disabled:pointer-events-none',
                  )}
                >
                  <div className="text-sm font-medium text-text-primary">{t.name}</div>
                  <div className="text-xs text-text-muted line-clamp-1">{t.description}</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 10: 创建 src/features/ai-chat/components/ConversationList.tsx**

```tsx
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useChatStore } from '@/store/useChatStore';

export function ConversationList() {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeConversationId);
  const setActive = useChatStore((s) => s.setActiveConversation);
  const create = useChatStore((s) => s.createConversation);
  const remove = useChatStore((s) => s.deleteConversation);

  return (
    <div className="w-56 shrink-0 rounded-xl border border-border bg-bg-secondary p-3 overflow-y-auto">
      <button
        onClick={() => create()}
        className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
      >
        <Plus className="h-4 w-4" />
        新建对话
      </button>

      <div className="mt-3 space-y-0.5">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={cn(
              'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors',
              conv.id === activeId
                ? 'bg-accent/10 text-accent'
                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
            )}
            onClick={() => setActive(conv.id)}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 truncate">{conv.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); remove(conv.id); }}
              className="hidden group-hover:block text-text-muted hover:text-error"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 11: 创建 src/features/ai-chat/components/SettingsPanel.tsx**

```tsx
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useChatStore } from '@/store/useChatStore';

export function SettingsPanel() {
  const settings = useChatStore((s) => s.settings);
  const updateSettings = useChatStore((s) => s.updateSettings);
  const isSettingsOpen = useChatStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useChatStore((s) => s.setSettingsOpen);

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSettingsOpen(false)}>
      <div className="w-full max-w-md rounded-xl border border-border bg-bg-secondary p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI 设置</h2>
          <button onClick={() => setSettingsOpen(false)} className="text-text-muted hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">API Key</label>
            <Input
              type="password"
              value={settings.apiKey}
              onChange={(e) => updateSettings({ apiKey: e.target.value })}
              placeholder="sk-ant-..."
            />
            <p className="mt-1 text-xs text-text-muted">密钥仅存储在本地浏览器中</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">模型</label>
            <select
              value={settings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
              className="h-9 w-full rounded-lg bg-bg-tertiary border border-border px-3 text-sm text-text-primary outline-none focus:border-accent"
            >
              <option value="claude-sonnet-4-20250514">Claude Sonnet</option>
              <option value="claude-haiku-4-20250414">Claude Haiku</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Temperature: {settings.temperature}
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={settings.temperature}
              onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
              className="w-full accent-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">System Prompt</label>
            <textarea
              value={settings.systemPrompt}
              onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
              rows={3}
              className="w-full rounded-lg bg-bg-tertiary border border-border p-3 text-sm text-text-primary outline-none focus:border-accent resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={() => setSettingsOpen(false)}>保存并关闭</Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 12: 创建 src/pages/tools/AiChatPage.tsx**

```tsx
import { useEffect } from 'react';
import { Bot, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ChatContainer } from '@/features/ai-chat/components/ChatContainer';
import { PromptPanel } from '@/features/ai-chat/components/PromptPanel';
import { ConversationList } from '@/features/ai-chat/components/ConversationList';
import { SettingsPanel } from '@/features/ai-chat/components/SettingsPanel';
import { useChatStore } from '@/store/useChatStore';

export function AiChatPage() {
  const setSettingsOpen = useChatStore((s) => s.setSettingsOpen);

  // Listen for prompt insertion from PromptPanel
  useEffect(() => {
    const handler = (e: Event) => {
      const prompt = (e as CustomEvent).detail as string;
      const textarea = document.querySelector('textarea[placeholder*="输入消息"]') as HTMLTextAreaElement | null;
      if (textarea) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        nativeInputValueSetter?.call(textarea, prompt);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.focus();
      }
    };
    window.addEventListener('devhub:insert-prompt', handler);
    return () => window.removeEventListener('devhub:insert-prompt', handler);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <Breadcrumb items={[
        { label: '工具', path: '/tools' },
        { label: 'AI 聊天助手' },
      ]} />

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Bot className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold">AI 聊天助手</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setSettingsOpen(true)}>
          <Settings className="h-3.5 w-3.5" />
          设置
        </Button>
      </div>

      <div className="mt-4 flex gap-4">
        <ConversationList />
        <div className="flex-1">
          <ChatContainer />
        </div>
        <PromptPanel />
      </div>

      <SettingsPanel />
    </div>
  );
}
```

- [ ] **Step 13: 更新 src/App.tsx — 添加 AI 聊天路由**

```tsx
import { AiChatPage } from '@/pages/tools/AiChatPage';
// ...
<Route path="/tools/ai-chat" element={<AiChatPage />} />
```

- [ ] **Step 14: 验证**

Run: `npm run dev`
Expected: 访问 `/tools/ai-chat`，看到对话列表 + 聊天界面 + 提示词面板。点击设置可输入 API Key。设置后发送消息，应看到流式响应。

- [ ] **Step 15: Commit**

```bash
git add src/features/ai-chat src/store/useChatStore.ts src/pages/tools/AiChatPage.tsx src/App.tsx
git commit -m "feat: add AI chat assistant with streaming, conversations, and prompt templates"
```

---

## Task 10: Markdown 编辑器

**Files:**
- Create: `src/features/markdown/utils/parser.ts`
- Create: `src/features/markdown/hooks/useMarkdownEditor.ts`
- Create: `src/features/markdown/components/FormattingToolbar.tsx`
- Create: `src/features/markdown/components/MarkdownEditor.tsx`
- Create: `src/features/markdown/components/MarkdownPreview.tsx`
- Create: `src/pages/tools/MarkdownEditorPage.tsx`

**Interfaces:**
- Consumes: UI 组件, react-markdown（需要安装）
- Produces: `MarkdownEditorPage` — `/tools/markdown` 路由

> **注意：** 需先安装依赖：`npm install react-markdown remark-gfm`

- [ ] **Step 1: 安装 Markdown 依赖**

Run: `cd f:/vibecoding/DevHub && npm install react-markdown remark-gfm`

- [ ] **Step 2: 创建 src/features/markdown/utils/parser.ts**

```typescript
export function getWordCount(text: string): number {
  const chinese = (text.match(/[一-龥]/g) || []).length;
  const english = (text.replace(/[一-龥]/g, '').match(/\b\w+\b/g) || []).length;
  return chinese + english;
}

export function getReadingTime(wordCount: number): number {
  const wpm = 300; // words per minute (mixed Chinese/English)
  return Math.max(1, Math.ceil(wordCount / wpm));
}

export function getLineCount(text: string): number {
  return text.split('\n').length;
}

export function exportAsHtml(content: string, title = 'Document'): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
body { max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, system-ui, sans-serif; line-height: 1.7; color: #1a1a1a; }
pre { background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto; }
code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
</style>
</head>
<body>${content}</body>
</html>`;
}
```

- [ ] **Step 3: 创建 src/features/markdown/hooks/useMarkdownEditor.ts**

```typescript
import { useState, useMemo, useCallback, useRef } from 'react';
import { getWordCount, getReadingTime, getLineCount, exportAsHtml } from '../utils/parser';

type ViewMode = 'split' | 'editor' | 'preview';

export function useMarkdownEditor() {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('devhub-markdown-content');
    return saved || '# 欢迎使用 Markdown 编辑器\n\n开始编写你的文档...\n\n## 功能\n\n- 实时预览\n- 工具栏快捷操作\n- 导出 HTML\n- 自动保存\n';
  });
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save
  const handleContentChange = useCallback((value: string) => {
    setContent(value);
    localStorage.setItem('devhub-markdown-content', value);
  }, []);

  const stats = useMemo(() => {
    const words = getWordCount(content);
    return {
      words,
      characters: content.length,
      lines: getLineCount(content),
      readingTime: getReadingTime(words),
    };
  }, [content]);

  const insertFormatting = useCallback((prefix: string, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const before = content.slice(0, start);
    const after = content.slice(end);

    const newContent = `${before}${prefix}${selected}${suffix}${after}`;
    handleContentChange(newContent);

    // Restore cursor
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + prefix.length + selected.length + suffix.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  }, [content, handleContentChange]);

  const handleExportHtml = useCallback(() => {
    // We render a simple HTML version for export
    const html = exportAsHtml(content);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  const handleCopyHtml = useCallback(async () => {
    const html = exportAsHtml(content);
    await navigator.clipboard.writeText(html);
  }, [content]);

  return {
    content,
    handleContentChange,
    viewMode,
    setViewMode,
    textareaRef,
    stats,
    insertFormatting,
    handleExportHtml,
    handleCopyHtml,
  };
}
```

- [ ] **Step 4: 创建 src/features/markdown/components/FormattingToolbar.tsx**

```tsx
import {
  Bold, Italic, Heading1, Heading2, Link, Image, Code, List, ListOrdered, Quote, Minus,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface FormattingToolbarProps {
  onInsert: (prefix: string, suffix?: string) => void;
}

const tools = [
  { icon: Bold, label: '加粗', prefix: '**', suffix: '**' },
  { icon: Italic, label: '斜体', prefix: '*', suffix: '*' },
  { icon: Heading1, label: '标题 1', prefix: '# ' },
  { icon: Heading2, label: '标题 2', prefix: '## ' },
  { type: 'divider' as const },
  { icon: Link, label: '链接', prefix: '[', suffix: '](url)' },
  { icon: Image, label: '图片', prefix: '![alt](', suffix: ')' },
  { icon: Code, label: '代码', prefix: '`', suffix: '`' },
  { type: 'divider' as const },
  { icon: List, label: '无序列表', prefix: '- ' },
  { icon: ListOrdered, label: '有序列表', prefix: '1. ' },
  { icon: Quote, label: '引用', prefix: '> ' },
  { icon: Minus, label: '分割线', prefix: '\n---\n' },
];

export function FormattingToolbar({ onInsert }: FormattingToolbarProps) {
  return (
    <div className="flex items-center gap-0.5 border-b border-border px-2 py-1.5">
      {tools.map((tool, i) => {
        if ('type' in tool && tool.type === 'divider') {
          return <div key={i} className="mx-1 h-4 w-px bg-border" />;
        }
        const Item = tool as { icon: typeof Bold; label: string; prefix: string; suffix?: string };
        return (
          <button
            key={i}
            onClick={() => onInsert(Item.prefix, Item.suffix)}
            title={Item.label}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded text-text-muted transition-colors',
              'hover:bg-bg-tertiary hover:text-text-primary',
            )}
          >
            <Item.icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 5: 创建 src/features/markdown/components/MarkdownEditor.tsx（编辑器面板）**

```tsx
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  className?: string;
}

export const MarkdownEditorPanel = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  ({ value, onChange, textareaRef, className }, _ref) => {
    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={cn(
          'flex-1 resize-none bg-transparent p-4 font-mono text-sm text-text-primary outline-none leading-relaxed placeholder:text-text-muted',
          className,
        )}
        placeholder="开始编写 Markdown..."
      />
    );
  },
);
MarkdownEditorPanel.displayName = 'MarkdownEditorPanel';
```

- [ ] **Step 6: 创建 src/features/markdown/components/MarkdownPreview.tsx**

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/utils/cn';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  return (
    <div className={cn('prose prose-invert max-w-none p-4', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 7: 创建 src/pages/tools/MarkdownEditorPage.tsx**

```tsx
import { FileText, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { FormattingToolbar } from '@/features/markdown/components/FormattingToolbar';
import { MarkdownEditorPanel } from '@/features/markdown/components/MarkdownEditor';
import { MarkdownPreview } from '@/features/markdown/components/MarkdownPreview';
import { useMarkdownEditor } from '@/features/markdown/hooks/useMarkdownEditor';

const viewTabs = [
  { id: 'split', label: '分栏' },
  { id: 'editor', label: '编辑' },
  { id: 'preview', label: '预览' },
];

export function MarkdownEditorPage() {
  const {
    content, handleContentChange, viewMode, setViewMode,
    textareaRef, stats, insertFormatting, handleExportHtml, handleCopyHtml,
  } = useMarkdownEditor();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <Breadcrumb items={[
        { label: '工具', path: '/tools' },
        { label: 'Markdown 编辑器' },
      ]} />

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <FileText className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold">Markdown 编辑器</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopyHtml}>
            <Copy className="h-3.5 w-3.5" /> 复制 HTML
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportHtml}>
            <Download className="h-3.5 w-3.5" /> 导出
          </Button>
        </div>
      </div>

      {/* View mode + Toolbar */}
      <div className="mt-4">
        <Tabs tabs={viewTabs} activeId={viewMode} onChange={(id) => setViewMode(id as 'split' | 'editor' | 'preview')} />
      </div>

      <div className="mt-4 rounded-xl border border-border bg-bg-secondary overflow-hidden" style={{ height: 'calc(100vh - 280px)', minHeight: 400 }}>
        <FormattingToolbar onInsert={insertFormatting} />

        <div className="flex h-[calc(100%-41px)]">
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div className={`flex flex-col ${viewMode === 'split' ? 'w-1/2 border-r border-border' : 'w-full'}`}>
              <MarkdownEditorPanel value={content} onChange={handleContentChange} textareaRef={textareaRef} />
            </div>
          )}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className={`flex flex-col overflow-auto ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
              <MarkdownPreview content={content} />
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-2 flex items-center justify-end gap-4 text-xs text-text-muted">
        <span>{stats.words} 字</span>
        <span>{stats.characters} 字符</span>
        <span>{stats.lines} 行</span>
        <span>阅读约 {stats.readingTime} 分钟</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: 更新 src/App.tsx — 添加 Markdown 路由**

```tsx
import { MarkdownEditorPage } from '@/pages/tools/MarkdownEditorPage';
// ...
<Route path="/tools/markdown" element={<MarkdownEditorPage />} />
```

- [ ] **Step 9: 添加 Markdown 预览的 prose 样式**

在 `src/styles/globals.css` 末尾添加：

```css
/* Markdown prose styles */
.prose h1 { font-size: 2em; font-weight: 700; margin: 1em 0 0.5em; }
.prose h2 { font-size: 1.5em; font-weight: 600; margin: 1em 0 0.5em; }
.prose h3 { font-size: 1.25em; font-weight: 600; margin: 0.8em 0 0.4em; }
.prose p { margin: 0.75em 0; line-height: 1.75; }
.prose ul, .prose ol { padding-left: 1.5em; margin: 0.75em 0; }
.prose li { margin: 0.25em 0; }
.prose a { color: var(--accent); text-decoration: underline; }
.prose code { background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px; font-size: 0.875em; }
.prose pre { background: var(--bg-tertiary); padding: 16px; border-radius: 8px; overflow-x: auto; margin: 1em 0; }
.prose pre code { background: transparent; padding: 0; }
.prose blockquote { border-left: 4px solid var(--border); padding-left: 16px; color: var(--text-secondary); margin: 1em 0; }
.prose hr { border-color: var(--border); margin: 2em 0; }
.prose table { width: 100%; border-collapse: collapse; margin: 1em 0; }
.prose th, .prose td { border: 1px solid var(--border); padding: 8px 12px; text-align: left; }
.prose th { background: var(--bg-tertiary); font-weight: 600; }
.prose img { max-width: 100%; border-radius: 8px; margin: 1em 0; }
```

- [ ] **Step 10: 验证**

Run: `npm run dev`
Expected: 访问 `/tools/markdown`，可编辑 Markdown 并实时预览，工具栏可插入格式，支持导出 HTML

- [ ] **Step 11: Commit**

```bash
git add src/features/markdown src/pages/tools/MarkdownEditorPage.tsx src/styles/globals.css src/App.tsx package.json package-lock.json
git commit -m "feat: add Markdown editor with live preview, toolbar, and HTML export"
```

---

## Task 11: 关于页面（AboutPage）

**Files:**
- Create: `src/pages/AboutPage.tsx`

**Interfaces:**
- Consumes: `Card`, `Badge`, `lucide-react` icons
- Produces: `AboutPage` — `/about` 路由

- [ ] **Step 1: 创建 src/pages/AboutPage.tsx**

```tsx
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
```

- [ ] **Step 2: 更新 src/App.tsx — 将 About 占位替换为 AboutPage**

```tsx
import { AboutPage } from '@/pages/AboutPage';
// ...
<Route path="/about" element={<AboutPage />} />
```

- [ ] **Step 3: 验证**

Run: `npm run dev`
Expected: 访问 `/about` 看到完整关于页面

- [ ] **Step 4: Commit**

```bash
git add src/pages/AboutPage.tsx src/App.tsx
git commit -m "feat: add About page with tech stack, timeline, and developer info"
```

---

## Task 12: 命令面板（Cmd+K）

**Files:**
- Create: `src/components/shared/CommandPalette.tsx`

**Interfaces:**
- Consumes: `useAppStore`, `tools`, `Input`
- Produces: `CommandPalette` 组件（全局挂载在 App.tsx）

- [ ] **Step 1: 创建 src/components/shared/CommandPalette.tsx**

```tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Braces, Bot } from 'lucide-react';
import { cn } from '@/utils/cn';
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
```

- [ ] **Step 2: 更新 src/App.tsx — 挂载 CommandPalette**

```tsx
import { CommandPalette } from '@/components/shared/CommandPalette';
// ... 在 PageLayout 内部、Routes 之后添加：
<CommandPalette />
```

- [ ] **Step 3: 验证**

Run: `npm run dev`
Expected: 按 Cmd+K / Ctrl+K 打开命令面板，输入工具名可搜索并跳转

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/CommandPalette.tsx src/App.tsx
git commit -m "feat: add command palette (Cmd+K) for quick tool navigation"
```

---

## Task 13: 响应式适配 + 最终打磨

**Files:**
- Modify: `src/components/layout/Navbar.tsx` (移动端菜单)
- Modify: `src/pages/HomePage.tsx` (响应式调整)
- Modify: `src/pages/tools/*.tsx` (响应式调整)

**Interfaces:**
- Consumes: 现有组件
- Produces: 所有页面在移动端可用

- [ ] **Step 1: 为 Navbar 添加移动端菜单按钮**

在 Navbar 中添加移动端汉堡菜单，使用 `useState` 控制展开，在小屏 (`sm:hidden`) 显示。

- [ ] **Step 2: 检查所有工具页在小屏下的布局**

确保：
- AI 聊天页的 ConversationList 和 PromptPanel 在移动端隐藏或折叠
- JSON 工具的 split 模式在移动端变为单栏
- Markdown 编辑器在移动端默认 editor 模式

- [ ] **Step 3: 验证**

Run: `npm run dev`，浏览器缩小到移动端宽度
Expected: 所有页面在 375px 宽度下可用，不出现水平滚动

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: responsive layout for mobile devices"
```

---

## Task 14: README + 最终部署准备

**Files:**
- Create: `README.md`
- Create: `.env.example`

- [ ] **Step 1: 创建 README.md**

```markdown
# DevHub — AI Developer Toolbox

面向开发者的一站式 AI 效率工具平台。

## 功能

- **JSON 格式化** — 格式化、校验、树形视图、差异对比
- **正则测试** — 实时匹配高亮、分组捕获、常用模板
- **AI 聊天助手** — 流式响应、上下文管理、提示词模板
- **Markdown 编辑器** — 实时预览、工具栏、导出 HTML

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand
- Framer Motion
- Anthropic API

## 快速开始

```bash
npm install
npm run dev
```

## 部署

```bash
npm run build
```

将 `dist/` 目录部署到 Vercel / Netlify / 任意静态托管。

## AI 工具配置

AI 聊天助手需要 Anthropic API Key。在应用内点击右上角「设置」输入即可，密钥仅存储在本地浏览器。

## License

MIT
```

- [ ] **Step 2: 创建 .env.example**

```
# 无需环境变量，API Key 在应用内设置
```

- [ ] **Step 3: 最终验证**

Run: `npm run build`
Expected: 构建成功，输出 dist 目录

Run: `npm run preview`
Expected: 本地预览构建产物，所有页面正常工作

- [ ] **Step 4: 最终 Commit**

```bash
git add README.md .env.example
git commit -m "docs: add README and environment configuration"
```

- [ ] **Step 5: 部署到 Vercel（可选）**

```bash
npx vercel --prod
```

---

## Task 执行顺序总结

| Task | 内容 | 产出 |
|------|------|------|
| 1 | 项目脚手架 | 可运行的 Vite + React + TS |
| 2 | 类型 + 数据 + 工具函数 | 基础层 |
| 3 | 基础 UI 组件 | Button/Input/Card/Badge/Tabs |
| 4 | 布局组件 | Navbar + PageLayout + 路由 |
| 5 | 首页 | HomePage 完整页面 |
| 6 | 工具中心 | ToolboxPage + 搜索筛选 |
| 7 | JSON 格式化 | 格式化/压缩/树形/校验 |
| 8 | 正则测试 | 实时匹配/模板/性能分析 |
| 9 | AI 聊天 | 流式对话/上下文/提示词 |
| 10 | Markdown 编辑器 | 实时预览/工具栏/导出 |
| 11 | 关于页面 | 技术栈/时间线/开发者 |
| 12 | 命令面板 | Cmd+K 快速导航 |
| 13 | 响应式 | 移动端适配 |
| 14 | README + 部署 | 最终交付 |
