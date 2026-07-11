# DevHub — AI Developer Toolbox · 产品设计文档 v1.0

> 创建日期：2026-07-11
> 项目类型：简历 & 前端实习展示项目
> 项目状态：设计阶段

---

## 一、产品背景

### 1.1 开发动机

开发者在日常工作中频繁需要在多个零散工具之间切换——JSON 格式化用一个网站、正则测试用另一个、Markdown 预览又换一个。这些工具分散、体验不一致、且大多界面陈旧。

与此同时，AI 正在深刻改变开发工作流，但大多数开发者工具箱尚未将 AI 能力整合进来。

### 1.2 项目目的

DevHub 是一个**面向开发者的一站式效率平台**，将常用的开发工具、AI 工具、文档工具整合到一个统一、美观的界面中。

作为**简历和前端实习展示项目**，它需要：
- 展示扎实的前端工程能力（组件设计、状态管理、性能优化）
- 展示 AI 集成能力（LLM API 调用、流式响应、上下文管理）
- 展示设计品味（对标 Apple/Linear/Vercel 级别的 UI）
- 在面试官 3 分钟内留下深刻印象

### 1.3 核心价值主张

**"开发者的 AI 工具箱，一个 DevHub 就够了。"**

---

## 二、产品定位

| 维度 | 描述 |
|------|------|
| 产品名 | DevHub — AI Developer Toolbox |
| 一句话定位 | 面向开发者的一站式 AI 效率工具平台 |
| 产品类型 | Web 应用（纯前端 SPA） |
| 核心差异化 | 统一体验 + AI 原生 + 极致设计 |
| 部署方式 | 静态部署（Vercel / Netlify） |
| 数据模式 | 纯本地（localStorage / IndexedDB），无后端 |

---

## 三、用户画像

### 3.1 主要用户

| 画像 | 描述 | 核心需求 |
|------|------|----------|
| **前端开发者（求职目标）** | 1-3 年经验，关注开发效率和工具品质 | 高质量工具 + 美观界面 + AI 辅助 |
| **后端开发者** | 需要快速格式化/转换数据，不想装 IDE 插件 | JSON、正则等基础工具 + 快速访问 |
| **计算机专业大学生** | 学习编程、做课程项目、准备实习 | 学习工具使用 + 了解 AI 编程辅助 |
| **全栈开发者** | 需要一个轻量级在线工具箱 | 多工具集合 + 随时可用 |

### 3.2 用户场景

1. **面试展示**：面试官打开网站，3 秒内被首页设计吸引，点击 AI 助手体验流式对话，印象深刻
2. **日常开发**：开发者复制一段 JSON，打开 DevHub 格式化后复制回去，全程 < 5 秒
3. **学习探索**：大学生用正则测试工具学习正则表达式，通过可视化匹配结果理解语法
4. **文档编写**：用 Markdown 编辑器写技术笔记，实时预览效果

---

## 四、功能架构

### 4.1 功能全景图

```
DevHub
├── 🏠 首页（Landing Page）
│   ├── Hero 区域（产品 Slogan + CTA）
│   ├── 工具分类导航
│   ├── 特色工具推荐
│   └── 底部信息
│
├── 🧰 工具中心（Toolbox）
│   ├── 分类筛选（全部 / 开发工具 / AI 工具 / 文档工具 / 网络工具）
│   ├── 搜索
│   └── 工具卡片网格
│
├── 🔧 工具页面
│   ├── 📋 JSON 格式化工具
│   │   ├── 输入/输出双面板
│   │   ├── 格式化 / 压缩 / 校验
│   │   ├── 树形视图
│   │   └── 差异对比
│   │
│   ├── 🔍 正则测试工具
│   │   ├── 正则输入 +  flags 选择
│   │   ├── 测试文本输入
│   │   ├── 实时匹配高亮
│   │   ├── 匹配结果列表
│   │   └── 常用正则模板
│   │
│   ├── 🤖 AI 聊天助手
│   │   ├── 对话界面（消息列表）
│   │   ├── 流式响应
│   │   ├── 上下文管理
│   │   ├── 提示词模板
│   │   └── 对话历史（本地存储）
│   │
│   └── 📝 Markdown 编辑器
│       ├── 编辑区（支持快捷键）
│       ├── 实时预览
│       ├── 分栏 / 预览切换
│       └── 导出（HTML / PDF）
│
├── 📖 关于页面（About）
│   ├── 项目介绍
│   ├── 技术栈展示
│   ├── 开发者信息
│   └── GitHub 链接
│
└── ⚙️ 全局组件
    ├── 导航栏（Navbar）
    ├── 侧边栏（Sidebar）
    ├── 面包屑
    ├── 命令面板（Cmd+K）
    └── 主题切换（预留）
```

### 4.2 功能优先级（MoSCoW）

| 优先级 | 功能 | 说明 |
|--------|------|------|
| **Must Have** | 首页、工具中心、4 个核心工具、关于页 | MVP 核心 |
| **Must Have** | 响应式布局、暗黑主题、键盘导航 | 基础体验 |
| **Should Have** | 命令面板（Cmd+K）、工具搜索、分类筛选 | 体验增强 |
| **Should Have** | JSON 树形视图、正则可视化、Markdown 导出 | 工具深度 |
| **Could Have** | 工具收藏、快捷键提示、历史记录 | 锦上添花 |
| **Won't Have (MVP)** | 用户系统、云端同步、国际化、PWA | 后续版本 |

---

## 五、页面结构 & 信息架构

### 5.1 网站信息架构

```
/                          → 首页（Landing Page）
/tools                     → 工具中心（Toolbox）
/tools/json                → JSON 格式化工具
/tools/regex               → 正则测试工具
/tools/ai-chat             → AI 聊天助手
/tools/markdown            → Markdown 编辑器
/about                     → 关于页面
```

### 5.2 页面层级关系

```
Level 0:  首页 (/)
Level 1:  工具中心 (/tools)  |  关于 (/about)
Level 2:    ├── JSON 工具 (/tools/json)
            ├── 正则工具 (/tools/regex)
            ├── AI 助手 (/tools/ai-chat)
            └── Markdown 编辑器 (/tools/markdown)
```

### 5.3 导航结构

**顶部导航栏：**
- Logo（左）
- 导航链接：首页 | 工具 | 关于（中）
- 操作区：搜索（Cmd+K）| GitHub | 主题切换（右）

**工具中心侧边栏：**
- 分类列表：
  - 全部工具
  - 开发工具（JSON、正则）
  - AI 工具（聊天助手）
  - 文档工具（Markdown）
  - 网络工具（预留）

---

## 六、页面说明 & 组件清单

### 6.1 首页（Landing Page）

**页面目标：** 3 秒内传递产品价值，引导用户进入工具。

#### 页面区域

| 区域 | 内容 | 组件 |
|------|------|------|
| **Hero** | 产品名 + Slogan + 副标题 + CTA 按钮 + 背景动效 | `HeroSection`, `AnimatedBackground`, `CTAButton` |
| **工具分类** | 4 个分类卡片（开发/AI/文档/网络），点击跳转工具中心 | `CategoryCard`, `CategoryGrid` |
| **特色工具** | 3-4 个核心工具卡片，展示工具名+描述+图标 | `ToolCard`, `ToolShowcase` |
| **数据亮点** | 工具数量、支持分类、本地运行等关键数据 | `StatCard`, `StatsRow` |
| **Footer** | 版权、GitHub 链接、技术栈标签 | `Footer`, `TechStackBadges` |

#### 数据结构

```typescript
// 首页无需独立数据结构，使用全局配置

interface HeroConfig {
  title: string;         // "DevHub"
  subtitle: string;      // "AI Developer Toolbox"
  description: string;   // 一句话描述
  ctaText: string;       // "开始使用"
  ctaLink: string;       // "/tools"
}

interface Category {
  id: string;
  name: string;          // "开发工具"
  icon: string;          // icon name
  description: string;
  toolCount: number;
  color: string;         // 主题色
}
```

---

### 6.2 工具中心（Toolbox）

**页面目标：** 快速找到并进入目标工具。

#### 页面区域

| 区域 | 内容 | 组件 |
|------|------|------|
| **页头** | 页面标题 + 工具总数 + 搜索框 | `PageHeader`, `SearchInput` |
| **分类筛选** | 横向分类标签栏（全部 / 开发 / AI / 文档 / 网络） | `FilterTabs`, `FilterTab` |
| **工具网格** | 工具卡片网格布局（响应式 1-3 列） | `ToolGrid`, `ToolCard` |
| **空状态** | 搜索无结果时的友好提示 | `EmptyState` |

#### 数据结构

```typescript
interface Tool {
  id: string;                    // "json-formatter"
  name: string;                  // "JSON 格式化"
  description: string;           // 一句话描述
  category: ToolCategory;        // "developer" | "ai" | "document" | "network"
  icon: string;                  // icon 组件名
  route: string;                 // "/tools/json"
  tags: string[];                // ["json", "format", "validate"]
  isHot?: boolean;               // 热门推荐标记
  isNew?: boolean;               // 新工具标记
  status: "stable" | "beta" | "coming-soon";
}

type ToolCategory = "developer" | "ai" | "document" | "network";

interface ToolCategoryConfig {
  id: ToolCategory;
  name: string;
  icon: string;
  color: string;
}
```

---

### 6.3 JSON 格式化工具

**页面目标：** 快速格式化、校验、转换 JSON 数据。

#### 页面区域

| 区域 | 内容 | 组件 |
|------|------|------|
| **工具栏** | 操作按钮组（格式化/压缩/校验/清空/复制） | `Toolbar`, `ToolButton`, `ButtonGroup` |
| **输入区** | JSON 输入文本框，带行号和语法高亮 | `CodeEditor`, `LineNumbers` |
| **输出区** | 格式化结果展示，支持语法高亮 | `CodeOutput`, `SyntaxHighlight` |
| **树形视图** | JSON 树形结构展示（可折叠/展开） | `JsonTreeView`, `TreeNode` |
| **状态栏** | 校验状态 + 错误提示 + 统计信息 | `StatusBar`, `ValidationStatus` |
| **差异对比** | 对比原始和格式化后的差异（可选） | `DiffViewer` |

#### 数据结构

```typescript
interface JsonFormatterState {
  input: string;
  output: string;
  indent: number;              // 缩进空格数 (2/4)
  isValid: boolean;
  error: JsonError | null;
  viewMode: "code" | "tree" | "split";
  stats: {
    lines: number;
    size: string;              // "1.2 KB"
    depth: number;             // 嵌套深度
    keys: number;              // 键数量
  };
}

interface JsonError {
  message: string;
  line: number;
  column: number;
}

interface TreeNode {
  key: string;
  type: "string" | "number" | "boolean" | "null" | "object" | "array";
  value: unknown;
  children?: TreeNode[];
  path: string;                // JSON Path，如 "$.users[0].name"
  isCollapsed: boolean;
}
```

---

### 6.4 正则测试工具

**页面目标：** 实时可视化正则匹配结果，帮助开发者理解和调试正则。

#### 页面区域

| 区域 | 内容 | 组件 |
|------|------|------|
| **正则输入** | 正则表达式输入框 + flags 复选框（g/i/m/s/u） | `RegexInput`, `FlagCheckbox`, `FlagGroup` |
| **测试文本** | 多行文本输入区 | `TestTextInput` |
| **匹配结果** | 高亮显示匹配内容（不同分组不同颜色） | `MatchHighlight`, `HighlightedText` |
| **匹配详情** | 匹配列表（索引、匹配内容、分组捕获） | `MatchList`, `MatchItem`, `CaptureGroup` |
| **正则模板** | 常用正则快速选择（邮箱/URL/手机号等） | `RegexTemplatePanel`, `TemplateCard` |
| **性能分析** | 执行耗时 + 步骤数 + 性能警告 | `PerformanceMeter` |

#### 数据结构

```typescript
interface RegexTesterState {
  pattern: string;
  flags: string;               // "gi"
  testString: string;
  matches: RegexMatch[];
  isValid: boolean;
  error: string | null;
  executionTime: number;       // ms
  selectedTemplate: string | null;
}

interface RegexMatch {
  index: number;
  fullMatch: string;
  groups: CaptureGroup[];
}

interface CaptureGroup {
  name: string | null;         // 命名捕获组
  value: string;
  start: number;
  end: number;
}

interface RegexTemplate {
  id: string;
  name: string;                // "邮箱地址"
  pattern: string;
  description: string;
  example: string;
}
```

---

### 6.5 AI 聊天助手

**页面目标：** 展示 LLM 集成能力——流式响应、上下文管理、提示词工程。这是简历项目最大亮点。

#### 页面区域

| 区域 | 内容 | 组件 |
|------|------|------|
| **对话区** | 消息列表（用户消息 + AI 回复） | `ChatContainer`, `MessageList` |
| **消息气泡** | 用户消息（右侧）、AI 回复（左侧，支持 Markdown 渲染） | `MessageBubble`, `UserMessage`, `AIMessage` |
| **输入区** | 文本输入框 + 发送按钮 + 快捷键提示 | `ChatInput`, `SendButton` |
| **提示词模板** | 侧边可折叠面板，预设提示词快速使用 | `PromptPanel`, `PromptCard` |
| **状态指示** | AI 思考中/生成中的动画指示 | `TypingIndicator`, `StreamingIndicator` |
| **对话管理** | 新建对话 / 历史对话列表 / 删除 | `ConversationList`, `ConversationItem` |
| **设置面板** | API Key 输入 / 模型选择 / 温度参数 | `SettingsPanel`, `ApiKeyInput`, `ModelSelector` |

#### 数据结构

```typescript
interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  settings: ChatSettings;
}

interface Conversation {
  id: string;
  title: string;               // 自动取首条消息摘要
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: string;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  tokens?: number;
}

interface ChatSettings {
  apiKey: string;              // 存 localStorage
  model: string;               // "claude-sonnet-4-20250514" 等
  temperature: number;         // 0-1
  maxTokens: number;
  systemPrompt: string;
}

interface PromptTemplate {
  id: string;
  name: string;                // "代码审查"
  description: string;
  prompt: string;
  category: string;            // "coding" | "writing" | "analysis"
}
```

---

### 6.6 Markdown 编辑器

**页面目标：** 提供流畅的 Markdown 编写和实时预览体验。

#### 页面区域

| 区域 | 内容 | 组件 |
|------|------|------|
| **编辑区** | Markdown 文本编辑器，支持快捷键 | `MarkdownEditor`, `EditorToolbar` |
| **预览区** | 实时渲染的 Markdown 预览 | `MarkdownPreview` |
| **布局切换** | 分栏 / 纯编辑 / 纯预览 三种模式 | `LayoutToggle` |
| **工具栏** | 加粗/斜体/标题/链接/图片/代码块/列表 | `FormattingToolbar`, `ToolbarButton` |
| **状态栏** | 字数统计 / 行数 / 阅读时间 | `EditorStatusBar` |
| **导出菜单** | 导出 HTML / 复制 HTML / 打印 | `ExportMenu`, `ExportButton` |

#### 数据结构

```typescript
interface MarkdownEditorState {
  content: string;
  viewMode: "split" | "editor" | "preview";
  cursorPosition: { line: number; column: number };
  stats: {
    words: number;
    characters: number;
    lines: number;
    readingTime: number;       // 分钟
  };
  isSaved: boolean;            // 自动保存到 localStorage
  scrollSync: boolean;         // 编辑/预览同步滚动
}
```

---

### 6.7 关于页面（About）

**页面目标：** 展示项目技术栈和开发者信息，为面试加分。

#### 页面区域

| 区域 | 内容 | 组件 |
|------|------|------|
| **项目介绍** | DevHub 的理念和设计决策 | `AboutHero` |
| **技术栈** | 技术栈图标 + 描述网格 | `TechStackGrid`, `TechCard` |
| **开发者** | 个人简介 + 头像 + 社交链接 | `DeveloperCard` |
| **项目数据** | 代码行数、组件数量、工具数量 | `ProjectStats` |
| **时间线** | 项目开发里程碑 | `Timeline`, `TimelineItem` |

#### 数据结构

```typescript
interface TechStackItem {
  name: string;                // "React"
  category: "framework" | "styling" | "state" | "build" | "ai";
  icon: string;
  description: string;
  url: string;
}

interface DeveloperInfo {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  links: {
    github: string;
    email: string;
    portfolio?: string;
  };
}
```

---

## 七、全局组件 & 共享数据结构

### 7.1 全局组件

| 组件 | 说明 | 出现页面 |
|------|------|----------|
| `Navbar` | 顶部导航栏 | 所有页面 |
| `Sidebar` | 工具分类侧边栏 | 工具详情页 |
| `CommandPalette` | Cmd+K 命令面板 | 所有页面（全局弹出） |
| `Footer` | 页面底部 | 首页、关于页 |
| `Breadcrumb` | 面包屑导航 | 工具详情页 |
| `ThemeToggle` | 主题切换按钮 | Navbar |
| `KeyboardShortcut` | 快捷键提示 Toast | 所有页面 |

### 7.2 全局状态

```typescript
interface AppState {
  // 路由
  currentRoute: string;

  // 主题
  theme: "dark" | "light";

  // 工具注册表
  tools: Tool[];
  categories: ToolCategoryConfig[];

  // 命令面板
  isCommandPaletteOpen: boolean;

  // 全局搜索
  searchQuery: string;
}
```

---

## 八、页面流程

### 8.1 核心用户流程

**流程 1：首次访问**
```
打开网站 → 首页 Hero → 被设计吸引 → 点击 "开始使用" 或工具卡片
→ 进入工具中心 → 选择工具 → 使用工具 → 满意离开 / 继续探索
```

**流程 2：工具使用**
```
工具中心 → 点击目标工具卡片 → 进入工具页 → 输入数据 → 获得结果
→ 复制结果 → 返回工具中心 / 使用其他工具
```

**流程 3：AI 对话**
```
工具中心 → 点击 AI 助手 → 首次使用需输入 API Key → 选择/输入对话
→ 等待流式响应 → 继续对话 / 切换对话 / 使用提示词模板
```

**流程 4：命令面板快捷操作**
```
任意页面 → Cmd+K → 输入工具名/操作 → 回车跳转
```

### 8.2 路由守卫

- 无登录/权限要求
- AI 工具：首次使用弹出 API Key 设置引导
- 所有数据本地存储，无网络请求（AI API 调用除外）

---

## 九、技术栈推荐

| 层面 | 技术选型 | 选择理由 |
|------|----------|----------|
| **框架** | React 18 + TypeScript | 生态成熟、面试认可度高 |
| **构建** | Vite | 极快的开发体验、HMR |
| **路由** | React Router v6 | SPA 路由标准方案 |
| **样式** | Tailwind CSS + CSS Variables | 原子化 CSS + 主题系统 |
| **动效** | Framer Motion | 声明式动画库，页面过渡 |
| **状态管理** | Zustand | 轻量、简单、TypeScript 友好 |
| **代码编辑** | CodeMirror 6 / Monaco Editor | JSON/代码编辑、语法高亮 |
| **Markdown** | react-markdown + remark-gfm | Markdown 渲染 |
| **图标** | Lucide React | 轻量、一致的图标库 |
| **AI** | Anthropic SDK（直连） | 流式响应、高质量输出 |
| **部署** | Vercel | 零配置部署、自动 CI/CD |
| **代码规范** | ESLint + Prettier | 代码质量保障 |

---

## 十、项目目录结构

```
devhub/
├── public/
│   ├── favicon.svg
│   └── og-image.png              # Open Graph 预览图
│
├── src/
│   ├── main.tsx                  # 入口
│   ├── App.tsx                   # 根组件 + 路由
│   │
│   ├── assets/                   # 静态资源
│   │   ├── fonts/
│   │   └── images/
│   │
│   ├── components/               # 共享组件
│   │   ├── ui/                   # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/               # 布局组件
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── PageLayout.tsx
│   │   │
│   │   └── shared/               # 业务共享组件
│   │       ├── CommandPalette.tsx
│   │       ├── ToolCard.tsx
│   │       ├── SearchInput.tsx
│   │       ├── ThemeToggle.tsx
│   │       └── KeyboardShortcut.tsx
│   │
│   ├── pages/                    # 页面组件
│   │   ├── HomePage.tsx
│   │   ├── ToolboxPage.tsx
│   │   ├── AboutPage.tsx
│   │   └── tools/                # 工具页面
│   │       ├── JsonFormatter.tsx
│   │       ├── RegexTester.tsx
│   │       ├── AiChat.tsx
│   │       └── MarkdownEditor.tsx
│   │
│   ├── features/                 # 工具功能模块
│   │   ├── json/
│   │   │   ├── components/
│   │   │   │   ├── JsonTreeView.tsx
│   │   │   │   ├── JsonEditor.tsx
│   │   │   │   ├── DiffViewer.tsx
│   │   │   │   └── ValidationStatus.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useJsonFormatter.ts
│   │   │   └── utils/
│   │   │       ├── formatter.ts
│   │   │       └── validator.ts
│   │   │
│   │   ├── regex/
│   │   │   ├── components/
│   │   │   │   ├── RegexInput.tsx
│   │   │   │   ├── MatchHighlight.tsx
│   │   │   │   ├── MatchList.tsx
│   │   │   │   └── RegexTemplates.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useRegexTester.ts
│   │   │   └── data/
│   │   │       └── templates.ts
│   │   │
│   │   ├── ai-chat/
│   │   │   ├── components/
│   │   │   │   ├── ChatContainer.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── PromptPanel.tsx
│   │   │   │   ├── SettingsPanel.tsx
│   │   │   │   └── ConversationList.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useChat.ts
│   │   │   │   └── useStreaming.ts
│   │   │   ├── services/
│   │   │   │   └── aiService.ts
│   │   │   └── data/
│   │   │       └── promptTemplates.ts
│   │   │
│   │   └── markdown/
│   │       ├── components/
│   │       │   ├── MarkdownEditor.tsx
│   │       │   ├── MarkdownPreview.tsx
│   │       │   └── FormattingToolbar.tsx
│   │       ├── hooks/
│   │       │   └── useMarkdownEditor.ts
│   │       └── utils/
│   │           └── exporter.ts
│   │
│   ├── store/                    # 全局状态
│   │   ├── useAppStore.ts
│   │   ├── useToolStore.ts
│   │   └── useChatStore.ts
│   │
│   ├── hooks/                    # 全局 Hooks
│   │   ├── useTheme.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── data/                     # 静态数据
│   │   ├── tools.ts              # 工具注册表
│   │   └── categories.ts        # 分类配置
│   │
│   ├── styles/                   # 全局样式
│   │   ├── globals.css
│   │   └── themes/
│   │       └── dark.css
│   │
│   ├── types/                    # TypeScript 类型
│   │   ├── tool.ts
│   │   ├── chat.ts
│   │   └── common.ts
│   │
│   └── utils/                    # 工具函数
│       ├── cn.ts                 # className 合并
│       ├── storage.ts            # localStorage 封装
│       └── constants.ts
│
├── docs/                         # 文档
│   └── superpowers/
│       └── specs/
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
└── README.md
```

---

## 十一、MVP 版本范围

### 11.1 MVP 交付清单

| # | 交付项 | 说明 |
|---|--------|------|
| 1 | 首页 | Hero + 分类导航 + 工具推荐 + Footer |
| 2 | 工具中心 | 分类筛选 + 搜索 + 工具网格 |
| 3 | JSON 格式化工具 | 格式化/压缩/校验/树形视图 |
| 4 | 正则测试工具 | 实时匹配高亮 + 匹配详情 + 模板 |
| 5 | AI 聊天助手 | 流式对话 + 上下文 + 提示词模板 |
| 6 | Markdown 编辑器 | 实时预览 + 工具栏 + 导出 |
| 7 | 关于页面 | 技术栈展示 + 开发者信息 |
| 8 | 全局组件 | Navbar + 命令面板 + 响应式 |
| 9 | 暗黑主题 | 深色科技风完整主题 |

### 11.2 MVP 开发周期（估算）

| 阶段 | 时间 | 内容 |
|------|------|------|
| **Week 1** | 项目搭建 | 脚手架 + 路由 + 全局布局 + 主题 |
| **Week 2** | 首页 + 工具中心 | 两个结构页面 |
| **Week 3** | JSON + 正则工具 | 两个开发工具 |
| **Week 4** | AI 聊天助手 | 核心亮点功能 |
| **Week 5** | Markdown 编辑器 + 关于页 | 剩余页面 |
| **Week 6** | 打磨 + 部署 | 动效 + 响应式 + Vercel 部署 |

---

## 十二、后续版本规划

### V1.1 — 体验增强

| 功能 | 说明 |
|------|------|
| 工具收藏 | 本地收藏常用工具 |
| 使用历史 | 最近使用的工具记录 |
| PWA 支持 | 离线访问 + 安装到桌面 |
| 键盘导航增强 | 全键盘操作支持 |

### V1.2 — 新工具扩展

| 工具 | 分类 |
|------|------|
| Base64 编解码 | 开发工具 |
| JWT 解码器 | 开发工具 |
| 颜色转换器 | 设计工具 |
| CSS 渐变生成器 | 设计工具 |
| 时间戳转换 | 开发工具 |

### V2.0 — 用户系统

| 功能 | 说明 |
|------|------|
| 用户注册/登录 | OAuth（GitHub） |
| 云端同步 | 对话历史、配置同步 |
| 工具分享 | 生成分享链接 |
| 使用统计 | 个人使用数据面板 |

### V3.0 — 平台化

| 功能 | 说明 |
|------|------|
| 插件系统 | 第三方工具接入 |
| API 市场 | 用户自建工具 |
| 团队协作 | 共享配置和工作区 |

---

## 十三、设计原则

| 原则 | 说明 |
|------|------|
| **极简至上** | 去除一切不必要的元素，每个像素都有意义 |
| **速度优先** | 工具响应 < 100ms，页面切换 < 200ms |
| **键盘友好** | 核心操作全部支持快捷键 |
| **一致性** | 统一的间距、圆角、动效、配色系统 |
| **渐进展示** | 基础功能立即可见，高级功能按需展开 |

---

## 十四、设计规范

### 14.1 配色系统

```
背景层：
  --bg-primary:    #09090B     (主背景)
  --bg-secondary:  #18181B     (卡片/面板)
  --bg-tertiary:   #27272A     (输入框/悬浮)

文字层：
  --text-primary:  #FAFAFA     (主文字)
  --text-secondary:#A1A1AA     (次要文字)
  --text-muted:    #71717A     (占位/禁用)

品牌色：
  --accent:        #3B82F6     (主强调色 - 蓝)
  --accent-hover:  #60A5FA
  --accent-glow:   rgba(59, 130, 246, 0.15)

语义色：
  --success:       #22C55E
  --warning:       #EAB308
  --error:         #EF4444

边框：
  --border:        #27272A
  --border-hover:  #3F3F46
```

### 14.2 间距系统

```
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-6:  24px
--space-8:  32px
--space-12: 48px
--space-16: 64px
```

### 14.3 圆角系统

```
--radius-sm:  6px     (小按钮、标签)
--radius-md:  8px     (输入框、卡片)
--radius-lg:  12px    (面板、弹窗)
--radius-xl:  16px    (大卡片)
--radius-full: 9999px (圆形按钮、头像)
```

### 14.4 字体系统

```
字体族：  Inter (正文) + JetBrains Mono (代码)
标题：    text-3xl/2xl/xl，font-semibold
正文：    text-base，font-normal
代码：    text-sm，font-mono
行高：    leading-relaxed (正文)，leading-tight (标题)
```

### 14.5 动效系统

```
过渡时长：  150ms (微交互) / 200ms (状态切换) / 300ms (页面过渡)
缓动函数：  ease-out (进入) / ease-in (离开)
页面过渡：  fadeIn + slideUp (8px)
卡片悬浮：  translateY(-2px) + shadow 增强
按钮点击：  scale(0.98)
```

---

## 附录 A：竞品参考

| 竞品 | 优点 | DevHub 差异化 |
|------|------|--------------|
| tool.lu | 工具全 | 设计更现代，AI 原生 |
| he3.app | 界面好看 | 中文友好，免费无限制 |
| cyberchef | 功能强大 | 更易用，面向前端 |
| IT Tools | 开源全面 | AI 集成 + 设计品味 |

---

*文档结束*
