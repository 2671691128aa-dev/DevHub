import { memo } from 'react';
import { User, Bot, AlertCircle, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Message } from '@/types/chat';

export interface MessageBubbleProps {
  message: Message;
  onRetry?: (content: string) => void;
}

export const MessageBubble = memo(function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isFailed = message.status === 'failed';
  const isPending = message.status === 'pending';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
        isUser ? 'bg-accent/10 text-accent' : 'bg-bg-tertiary text-text-secondary',
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex flex-col gap-1 max-w-[75%]">
        <div className={cn(
          'rounded-xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? isFailed ? 'bg-error/10 border border-error/30 text-text-primary' : 'bg-accent text-white'
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
        {/* Status indicators */}
        {isUser && isPending && (
          <div className="flex items-center gap-1 text-xs text-text-muted px-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            发送中...
          </div>
        )}
        {isUser && isFailed && (
          <div className="flex items-center gap-2 px-1">
            <AlertCircle className="h-3.5 w-3.5 text-error" />
            <span className="text-xs text-error">发送失败</span>
            {onRetry && (
              <button
                onClick={() => onRetry(message.content)}
                className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                重试
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
