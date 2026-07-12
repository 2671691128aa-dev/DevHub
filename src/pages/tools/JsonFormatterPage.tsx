import { Copy, Trash2, Braces, Loader2 } from 'lucide-react';
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
    isProcessing,
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
          {isProcessing && (
            <span className="flex items-center gap-1.5 text-xs text-text-muted">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              处理中...
            </span>
          )}
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
          <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
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
