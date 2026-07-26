import { MessageSquare, Plus, SearchX, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useChatStore } from '@/store/useChatStore';

export function ConversationList() {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeConversationId);
  const setActive = useChatStore((s) => s.setActiveConversation);
  const create = useChatStore((s) => s.createConversation);
  const remove = useChatStore((s) => s.deleteConversation);

  return (
    <div className="w-56 shrink-0 overflow-y-auto rounded-xl border border-border bg-bg-secondary p-3">
      <button
        onClick={() => create()}
        className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
      >
        <Plus className="h-4 w-4" />
        新建对话
      </button>

      <div className="mt-3 space-y-0.5">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <SearchX className="text-text-tertiary h-8 w-8" />
            <p className="mt-2 text-sm font-medium text-text-secondary">暂无对话记录</p>
            <p className="text-text-tertiary mt-0.5 text-xs">点击上方按钮创建新对话</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                'group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                conv.id === activeId
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
              )}
              onClick={() => setActive(conv.id)}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1 truncate">{conv.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(conv.id);
                }}
                className="hidden text-text-muted hover:text-error group-hover:block"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
