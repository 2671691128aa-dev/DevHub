import { Copy, Trash2, Binary, ArrowLeftRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { ToolPageHeader } from '@/components/shared/ToolPageHeader';
import DecryptedText from '@/components/DecryptedText';
import { useBase64 } from '@/features/base64/hooks/useBase64';

const modeTabs = [
  { id: 'encode', label: '编码' },
  { id: 'decode', label: '解码' },
];

export function Base64Page() {
  const {
    input,
    setInput,
    mode,
    setMode,
    output,
    error,
    stats,
    handleSwap,
    handleCopy,
    handleClear,
  } = useBase64();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <ToolPageHeader
        icon={Binary}
        title="Base64 编解码"
        titleNode={
          <DecryptedText
            text="Base64 编解码"
            animateOn="view"
            speed={50}
            maxIterations={10}
            sequential
            className="text-xl font-semibold text-text-primary"
            encryptedClassName="text-accent"
          />
        }
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={handleSwap} disabled={!input && !output}>
              <ArrowLeftRight className="h-3.5 w-3.5" /> 交换
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
              <Copy className="h-3.5 w-3.5" /> 复制
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Trash2 className="h-3.5 w-3.5" /> 清空
            </Button>
          </>
        }
      />

      {/* 模式切换 */}
      <div className="mt-4">
        <Tabs
          tabs={modeTabs}
          activeId={mode}
          onChange={(id) => setMode(id as 'encode' | 'decode')}
        />
      </div>

      {/* 输入/输出区域 */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2" style={{ minHeight: 400 }}>
        <div className="flex flex-col">
          <label className="mb-1.5 text-xs font-medium text-text-muted">
            {mode === 'encode' ? '输入文本' : '输入 Base64'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'encode' ? '输入要编码的文本...' : '输入要解码的 Base64 字符串...'
            }
            className="placeholder:text-text-muted/50 focus:border-accent/50 focus:ring-accent/30 flex-1 resize-none rounded-lg border border-border bg-bg-secondary p-4 text-sm text-text-primary outline-none transition-colors focus:ring-1"
            style={{ minHeight: 380 }}
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1.5 text-xs font-medium text-text-muted">
            {mode === 'encode' ? 'Base64 结果' : '解码文本'}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder={mode === 'encode' ? '编码结果将显示在这里...' : '解码结果将显示在这里...'}
            className="placeholder:text-text-muted/50 flex-1 resize-none rounded-lg border border-border bg-bg-secondary p-4 text-sm text-text-primary outline-none transition-colors"
            style={{ minHeight: 380 }}
            spellCheck={false}
          />
        </div>
      </div>

      {/* 状态栏 */}
      <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-bg-secondary px-4 py-2">
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span>输入: {stats.inputLength} 字符</span>
          <span>输出: {stats.outputLength} 字符</span>
        </div>
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
