/**
 * ToolCallCard — displays a single tool invocation in the chat.
 *
 * Shows: tool name, input params (collapsible), execution status, result.
 */
import { useState } from 'react';
import { ChevronDown, ChevronRight, Wrench, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ToolCallDisplay } from '@/types/chat';

interface ToolCallCardProps {
  toolCall: ToolCallDisplay;
}

const TOOL_ICONS: Record<string, string> = {
  'json-formatter': '{ }',
  'regex-tester': '.*',
  'code-review': '🔍',
};

export function ToolCallCard({ toolCall }: ToolCallCardProps) {
  const [expanded, setExpanded] = useState(false);
  const duration = toolCall.endTime
    ? ((toolCall.endTime - toolCall.startTime) / 1000).toFixed(1)
    : null;

  const statusIcon = {
    pending: <Loader2 className="h-3.5 w-3.5 animate-spin text-text-muted" />,
    running: <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />,
    done: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />,
    error: <XCircle className="h-3.5 w-3.5 text-red-500" />,
  }[toolCall.status];

  return (
    <div
      className={cn(
        'rounded-lg border text-sm',
        toolCall.status === 'error'
          ? 'border-red-500/20 bg-red-500/5'
          : 'border-border bg-bg-tertiary/50',
      )}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-bg-tertiary"
      >
        {statusIcon}
        <Wrench className="h-3.5 w-3.5 text-accent" />
        <span className="font-medium text-text-primary">
          {TOOL_ICONS[toolCall.toolId] ? (
            <span className="mr-1.5 rounded bg-accent/10 px-1.5 py-0.5 font-mono text-xs text-accent">
              {TOOL_ICONS[toolCall.toolId]}
            </span>
          ) : null}
          {toolCall.toolName}
        </span>
        {duration && (
          <span className="ml-auto text-xs text-text-muted">{duration}s</span>
        )}
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border px-3 py-2 space-y-2">
          {/* Input params */}
          <div>
            <div className="text-xs font-medium text-text-muted mb-1">输入参数</div>
            <pre className="rounded bg-bg-primary p-2 text-xs text-text-secondary overflow-x-auto font-mono">
              {JSON.stringify(toolCall.params, null, 2)}
            </pre>
          </div>

          {/* Result */}
          {toolCall.result !== undefined && (
            <div>
              <div className="text-xs font-medium text-text-muted mb-1">
                {toolCall.status === 'error' ? '错误' : '执行结果'}
              </div>
              <pre
                className={cn(
                  'rounded p-2 text-xs overflow-x-auto font-mono whitespace-pre-wrap',
                  toolCall.status === 'error'
                    ? 'bg-red-500/5 text-red-400'
                    : 'bg-bg-primary text-text-secondary',
                )}
              >
                {toolCall.result}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
