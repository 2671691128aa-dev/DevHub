import { useEffect } from 'react';
import { Bot, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ChatContainer } from '@/features/ai-chat/components/ChatContainer';
import { PromptPanel } from '@/features/ai-chat/components/PromptPanel';
import { ConversationList } from '@/features/ai-chat/components/ConversationList';
import { SettingsPanel } from '@/features/ai-chat/components/SettingsPanel';
import { useChatStore } from '@/store/useChatStore';

export function AiChatPage() {
  const setSettingsOpen = useChatStore((s) => s.setSettingsOpen);

  useEffect(() => {
    const handler = (e: Event) => {
      const prompt = (e as CustomEvent).detail as string;
      const textarea = document.querySelector('textarea[placeholder*="输入消息"]') as HTMLTextAreaElement | null;
      if (textarea) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        nativeInputValueSetter?.call(textarea, prompt);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.focus();
      }
    };
    window.addEventListener('devhub:insert-prompt', handler);
    return () => window.removeEventListener('devhub:insert-prompt', handler);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <Breadcrumb items={[
        { label: '工具', path: '/tools' },
        { label: 'AI 聊天助手' },
      ]} />

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Bot className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold">AI 聊天助手</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setSettingsOpen(true)}>
          <Settings className="h-3.5 w-3.5" />
          设置
        </Button>
      </div>

      <div className="mt-4 flex gap-4">
        <div className="hidden lg:block">
          <ConversationList />
        </div>
        <div className="flex-1 min-w-0">
          <ChatContainer />
        </div>
        <div className="hidden xl:block">
          <PromptPanel />
        </div>
      </div>

      <SettingsPanel />
    </div>
  );
}
