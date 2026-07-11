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
