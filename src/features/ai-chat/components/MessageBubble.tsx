import { memo, useMemo, useState, useCallback } from 'react';
import { User, Bot, AlertCircle, RotateCcw, Loader2, Settings, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';

SyntaxHighlighter.registerLanguage('javascript', jsx);
SyntaxHighlighter.registerLanguage('js', jsx);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('tsx', jsx);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('md', markdown);
import { cn } from '@/utils/cn';
import { AI_ERROR_MESSAGES } from '@/constants/error-messages';
import { AgentTimeline } from './AgentTimeline';
import type { Message } from '@/types/chat';

export interface MessageBubbleProps {
  message: Message;
  onRetry?: (content: string) => void;
  onOpenSettings?: () => void;
}

/** Fix incomplete markdown during streaming */
function fixStreamingMarkdown(text: string): string {
  let fixed = text;

  // Count backtick fences — if odd, add closing fence
  const fenceCount = (fixed.match(/^```/gm) || []).length;
  if (fenceCount % 2 !== 0) {
    fixed += '\n```';
  }

  // Remove incomplete trailing table rows
  const lines = fixed.split('\n');
  const lastLine = lines[lines.length - 1];
  if (lastLine.startsWith('|') && !lastLine.endsWith('|')) {
    lines.pop();
    fixed = lines.join('\n');
  }

  return fixed;
}

/** Copy button for code blocks */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded bg-bg-secondary/80 text-text-muted opacity-0 transition-all hover:text-text-primary group-hover/code:opacity-100"
      title="复制代码"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

/** Streaming Markdown renderer for AI responses */
const StreamingMarkdown = memo(function StreamingMarkdown({
  content,
  isStreaming,
}: {
  content: string;
  isStreaming: boolean;
}) {
  const processedContent = useMemo(
    () => (isStreaming ? fixStreamingMarkdown(content) : content),
    [content, isStreaming],
  );

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Code blocks with syntax highlighting + copy button
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match && !className;
          const codeString = String(children).replace(/\n$/, '');

          if (isInline) {
            return (
              <code
                className="rounded bg-bg-primary px-1.5 py-0.5 font-mono text-xs text-accent"
                {...props}
              >
                {children}
              </code>
            );
          }

          return (
            <div className="group/code relative">
              <CopyButton text={codeString} />
              <SyntaxHighlighter
                style={oneDark}
                language={match?.[1] || 'text'}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                  background: 'var(--bg-primary)',
                }}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          );
        },
        // Tables
        table({ children }) {
          return (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border-collapse border border-border text-sm">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="border border-border bg-bg-tertiary px-3 py-1.5 text-left font-medium">
              {children}
            </th>
          );
        },
        td({ children }) {
          return <td className="border border-border px-3 py-1.5">{children}</td>;
        },
        // Links
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {children}
            </a>
          );
        },
        // Paragraphs
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
        // Lists
        ul({ children }) {
          return <ul className="mb-2 list-disc pl-5 space-y-1">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="mb-2 list-decimal pl-5 space-y-1">{children}</ol>;
        },
        // Headings
        h1({ children }) {
          return <h1 className="mb-2 mt-4 text-lg font-bold">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="mb-2 mt-3 text-base font-semibold">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="mb-1 mt-2 text-sm font-semibold">{children}</h3>;
        },
        // Blockquote
        blockquote({ children }) {
          return (
            <blockquote className="border-l-2 border-accent pl-3 text-text-secondary italic my-2">
              {children}
            </blockquote>
          );
        },
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
});

export const MessageBubble = memo(function MessageBubble({
  message,
  onRetry,
  onOpenSettings,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isFailed = message.status === 'failed';
  const isPending = message.status === 'pending';
  const hasToolCalls = message.toolCalls && message.toolCalls.length > 0;
  const isStreaming = isPending || (message.role === 'assistant' && !message.status);

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
      <div className="flex max-w-[80%] flex-col gap-1">
        {/* Agent timeline — tool calls */}
        {!isUser && hasToolCalls && <AgentTimeline toolCalls={message.toolCalls!} />}

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
          {/* Content rendering */}
          {!isUser && message.content ? (
            <StreamingMarkdown content={message.content} isStreaming={isStreaming} />
          ) : (
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          )}

          {/* Loading dots */}
          {!message.content && !hasToolCalls && (
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
