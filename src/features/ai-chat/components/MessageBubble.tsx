import { memo } from 'react';
import { User, Bot, AlertCircle, RotateCcw, Loader2, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';
import { AI_ERROR_MESSAGES } from '@/constants/error-messages';
import type { Message } from '@/types/chat';

export interface MessageBubbleProps {
  message: Message;
  onRetry?: (content: string) => void;
  onOpenSettings?: () => void;
}

export const MessageBubble = memo(function MessageBubble({
  message,
  onRetry,
  onOpenSettings,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isFailed = message.status === 'failed';
  const isPending = message.status === 'pending';

  // 不可重试的错误类型（需要用户操作而非重试）
  const isNonRetryable = message.errorCode && !AI_ERROR_MESSAGES[message.errorCode].retryable;

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          isUser ? 'bg-accent/10 text-accent' : 'bg-bg-tertiary text-text-secondary',
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex max-w-[75%] flex-col gap-1">
        <div
          className={cn(
            'rounded-xl px-4 py-3 text-sm leading-relaxed',
            isUser
              ? isFailed
                ? 'bg-error/10 border-error/30 border text-text-primary'
                : 'bg-accent text-white'
              : 'border border-border bg-bg-tertiary text-text-primary',
          )}
        >
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
          {!message.content && (
            <div className="flex items-center gap-1">
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          )}
        </div>
        {/* Status indicators */}
        {isUser && isPending && (
          <div className="flex items-center gap-1 px-1 text-xs text-text-muted">
            <Loader2 className="h-3 w-3 animate-spin" />
            发送中...
          </div>
        )}
        {isUser && isFailed && (
          <div className="flex items-center gap-2 px-1">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-error" />
            <span className="text-xs text-error">{message.errorMessage ?? '发送失败'}</span>
            {isNonRetryable ? (
              <button
                onClick={onOpenSettings}
                className="ml-auto flex items-center gap-1 text-xs text-accent transition-colors hover:text-accent-hover"
              >
                <Settings className="h-3 w-3" />
                检查设置
              </button>
            ) : onRetry ? (
              <button
                onClick={() => onRetry(message.content)}
                className="ml-auto flex items-center gap-1 text-xs text-accent transition-colors hover:text-accent-hover"
              >
                <RotateCcw className="h-3 w-3" />
                重试
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
});
