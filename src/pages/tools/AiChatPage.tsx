import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Bot, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ErrorFallback } from '@/components/shared/ErrorFallback';
import { ToolPageHeader } from '@/components/shared/ToolPageHeader';
import { ChatContainer } from '@/features/ai-chat/components/ChatContainer';
import { PromptPanel } from '@/features/ai-chat/components/PromptPanel';
import { ConversationList } from '@/features/ai-chat/components/ConversationList';
import { SettingsPanel } from '@/features/ai-chat/components/SettingsPanel';
import { useAppStore } from '@/store/useAppStore';

export function AiChatPage() {
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);
  const [pendingPromptText, setPendingPromptText] = useState<string | null>(null);

  const handlePromptInsert = (text: string) => {
    setPendingPromptText(text);
  };

  const handlePromptHandled = () => {
    setPendingPromptText(null);
  };

  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback {...props} variant="section" title="AI 聊天组件出错" />
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-6">
        <ToolPageHeader
          icon={Bot}
          title="AI 聊天助手"
          actions={
            <Button variant="secondary" size="sm" onClick={() => setSettingsOpen(true)}>
              <Settings className="h-3.5 w-3.5" />
              设置
            </Button>
          }
        />

        <div className="mt-4 flex gap-4">
          <div className="hidden lg:block">
            <ConversationList />
          </div>
          <div className="min-w-0 flex-1">
            <ChatContainer
              pendingPromptText={pendingPromptText}
              onPromptHandled={handlePromptHandled}
            />
          </div>
          <div className="hidden xl:block">
            <PromptPanel onInsert={handlePromptInsert} />
          </div>
        </div>

        <SettingsPanel />
      </div>
    </ErrorBoundary>
  );
}
