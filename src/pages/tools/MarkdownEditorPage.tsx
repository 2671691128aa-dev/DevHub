import { FileText, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { ToolPageHeader } from '@/components/shared/ToolPageHeader';
import GradientText from '@/components/GradientText';
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
    content,
    handleContentChange,
    viewMode,
    setViewMode,
    textareaRef,
    stats,
    insertFormatting,
    handleExportHtml,
    handleCopyHtml,
  } = useMarkdownEditor();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <ToolPageHeader
        icon={FileText}
        title="Markdown 编辑器"
        titleNode={
          <GradientText
            colors={['var(--text-primary)', 'var(--accent)', 'var(--text-primary)']}
            animationSpeed={8}
            className="text-xl font-semibold"
          >
            Markdown 编辑器
          </GradientText>
        }
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={handleCopyHtml}>
              <Copy className="h-3.5 w-3.5" /> 复制 HTML
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportHtml}>
              <Download className="h-3.5 w-3.5" /> 导出
            </Button>
          </>
        }
      />

      {/* View mode + Toolbar */}
      <div className="mt-4">
        <Tabs
          tabs={viewTabs}
          activeId={viewMode}
          onChange={(id) => setViewMode(id as 'split' | 'editor' | 'preview')}
        />
      </div>

      <div
        className="mt-4 overflow-hidden rounded-xl border border-border bg-bg-secondary"
        style={{ height: 'calc(100vh - 280px)', minHeight: 400 }}
      >
        <FormattingToolbar onInsert={insertFormatting} />

        <div className="flex h-[calc(100%-41px)] flex-col md:flex-row">
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div
              className={`flex flex-col ${viewMode === 'split' ? 'w-full border-b border-border md:w-1/2 md:border-b-0 md:border-r' : 'w-full'}`}
            >
              <MarkdownEditorPanel
                value={content}
                onChange={handleContentChange}
                textareaRef={textareaRef}
              />
            </div>
          )}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              className={`flex flex-col overflow-auto ${viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'}`}
            >
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
