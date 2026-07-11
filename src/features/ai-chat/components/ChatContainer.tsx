import { Bot } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { useChat } from '../hooks/useChat';

export function ChatContainer() {
  const { conversation, isStreaming, handleSend, stop, messagesEndRef, settings } = useChat();

  const needsApiKey = !settings.apiKey;

  return (
    <div className="flex flex-col rounded-xl border border-border bg-bg-secondary" style={{ height: 'calc(100vh - 240px)' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!conversation || conversation.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Bot className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-text-primary">AI 聊天助手</h3>
            <p className="mt-1 text-sm text-text-muted max-w-sm">
              {needsApiKey ? '请先点击右上角设置 API Key 以开始对话' : '输入消息开始对话，支持 Markdown 格式'}
            </p>
          </div>
        ) : (
          <>
            {conversation.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <ChatInput
          onSend={handleSend}
          onStop={stop}
          isStreaming={isStreaming}
          disabled={needsApiKey}
        />
      </div>
    </div>
  );
}
