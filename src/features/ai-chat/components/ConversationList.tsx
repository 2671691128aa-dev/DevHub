import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useChatStore } from '@/store/useChatStore';

export function ConversationList() {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeConversationId);
  const setActive = useChatStore((s) => s.setActiveConversation);
  const create = useChatStore((s) => s.createConversation);
  const remove = useChatStore((s) => s.deleteConversation);

  return (
    <div className="w-56 shrink-0 rounded-xl border border-border bg-bg-secondary p-3 overflow-y-auto">
      <button
        onClick={() => create()}
        className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
      >
        <Plus className="h-4 w-4" />
        新建对话
      </button>

      <div className="mt-3 space-y-0.5">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={cn(
              'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors',
              conv.id === activeId
                ? 'bg-accent/10 text-accent'
                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
            )}
            onClick={() => setActive(conv.id)}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 truncate">{conv.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); remove(conv.id); }}
              className="hidden group-hover:block text-text-muted hover:text-error"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
