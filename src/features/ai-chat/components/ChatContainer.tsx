import { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { MessageSquare } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { useChat } from '../hooks/useChat';

export interface ChatContainerProps {
  pendingPromptText: string | null;
  onPromptHandled: () => void;
}

export function ChatContainer({ pendingPromptText, onPromptHandled }: ChatContainerProps) {
  const { conversation, isStreaming, handleSend, stop, messagesEndRef, settings, setSettingsOpen } =
    useChat();

  const parentRef = useRef<HTMLDivElement>(null);
  const needsApiKey = !settings.apiKey;
  const messages = conversation?.messages ?? [];

  // Virtual list for messages
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // estimated height per message
    overscan: 5,
  });

  // Auto-scroll to bottom when new messages arrive or content changes
  useEffect(() => {
    if (messages.length > 0) {
      virtualizer.scrollToIndex(messages.length - 1, { align: 'end' });
    }
  }, [messages.length, messages[messages.length - 1]?.content, virtualizer]);

  return (
    <div
      className="flex flex-col rounded-xl border border-border bg-bg-secondary"
      style={{ height: 'calc(100vh - 240px)' }}
    >
      {/* Messages — virtualized */}
      <div ref={parentRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="bg-accent/10 flex h-14 w-14 items-center justify-center rounded-2xl text-accent">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-text-primary">开始对话</h3>
            <p className="text-text-tertiary mt-1 max-w-sm text-sm">
              {needsApiKey
                ? '请先点击右上角设置 API Key 以开始对话'
                : '输入消息开始与 AI 对话，或选择一个提示模板'}
            </p>
          </div>
        ) : (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const msg = messages[virtualRow.index];
              return (
                <div
                  key={msg.id}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="px-4 py-2">
                    <MessageBubble
                      message={msg}
                      onRetry={handleSend}
                      onOpenSettings={() => setSettingsOpen(true)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <ChatInput
          onSend={handleSend}
          onStop={stop}
          isStreaming={isStreaming}
          disabled={needsApiKey}
          pendingPromptText={pendingPromptText}
          onPromptHandled={onPromptHandled}
        />
      </div>
    </div>
  );
}
