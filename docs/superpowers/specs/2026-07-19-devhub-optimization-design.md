# DevHub 前端工程优化设计方案

## 背景

大学生前端实习求职作品，目标是体现真实工程质量和个人前端能力。
时间约束：1 个月内完成优化。
交付模式：分方向交付，按优先级推进。

## 当前状态

- React 18 + TypeScript + Vite + Tailwind + Zustand
- 72 个源文件，约 4,449 行代码
- 4 个工具页面：JSON 格式化、正则测试、AI 对话、Markdown 编辑器
- 已有：feature-based 结构、路由懒加载、IndexedDB 持久化、Web Worker、SSE 流式、错误分类

## 优化方案

### 第一优先级：代码质量 + TypeScript + 用户体验 + 工程规范

#### 1. 代码质量优化
- 拆分 `aiService.ts`（187 行）→ `anthropicService.ts` + `openaiService.ts`
- 拆分 `useJsonFormatter.ts`（189 行）→ 提取 `useJsonWorker.ts`
- 提取 3 处重复 `iconMap` → 统一到 `data/tools.ts`
- 修复 AI Chat prompt 插入 → DOM 操作改为回调 ref 模式
- 删除未使用的 `useKeyboardShortcuts` hook
- 清理 `console.log`、统一命名

#### 2. 用户体验
- 添加 404 页面
- 添加页面切换 Loading skeleton
- 修复 Markdown 导出 HTML bug（当前导出原始 Markdown 而非渲染 HTML）
- 关键操作 Toast 反馈完善
- 空状态优化

#### 3. 工程规范
- 添加单元测试（vitest）：`formatter.ts`、`validator.ts`、`useLocalStorage`
- 统一注释风格

### 第二优先级：性能 + UI 细节

#### 4. 性能优化
- JSON 工具 React.memo 优化
- Vite 构建分包（manualChunks）
- 图片优化检查

#### 5. UI 设计
- 统一间距/圆角/阴影规范
- 按钮 loading 状态
- 移动端适配检查

### 第三优先级：锦上添花

#### 6. 亮点补充
- 添加轻量工具（Base64 编解码）展示扩展能力
- 优化 About 页面

## 简历亮点总结（优化完成后提供）

完成后将提供：
1. 修改内容清单
2. 可写入简历的技术亮点
3. 面试可能被问到的问题
