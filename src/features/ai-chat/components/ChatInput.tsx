import { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ChatInputProps {
  onSend: (content: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (isStreaming) return;
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-xl border border-border bg-bg-tertiary p-3 focus-within:border-accent">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? '请先设置 API Key...' : '输入消息，Enter 发送，Shift+Enter 换行...'}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted min-h-[24px] max-h-[200px]"
      />
      {isStreaming ? (
        <Button variant="ghost" size="sm" onClick={onStop}>
          <Square className="h-4 w-4" />
        </Button>
      ) : (
        <Button size="sm" onClick={handleSubmit} disabled={!input.trim() || disabled}>
          <Send className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
