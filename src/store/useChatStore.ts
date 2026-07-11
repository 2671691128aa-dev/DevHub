import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Conversation, ChatSettings, Message } from '@/types/chat';

const defaultSettings: ChatSettings = {
  provider: 'anthropic',
  providerName: 'Anthropic',
  apiKey: '',
  baseUrl: '',
  model: 'claude-sonnet-4-20250514',
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: '你是一个专业的开发者助手，擅长编程、调试和技术问题解答。',
};

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  settings: ChatSettings;
  isSettingsOpen: boolean;

  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateLastAssistantMessage: (conversationId: string, chunk: string) => void;
  setStreaming: (streaming: boolean) => void;
  updateSettings: (settings: Partial<ChatSettings>) => void;
  setSettingsOpen: (open: boolean) => void;
  getActiveConversation: () => Conversation | null;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isStreaming: false,
      settings: defaultSettings,
      isSettingsOpen: false,

      createConversation: () => {
        const id = crypto.randomUUID();
        const conversation: Conversation = {
          id,
          title: '新对话',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          model: get().settings.model,
        };
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      deleteConversation: (id) => {
        set((state) => {
          const filtered = state.conversations.filter((c) => c.id !== id);
          const isActive = state.activeConversationId === id;
          return {
            conversations: filtered,
            activeConversationId: isActive ? (filtered[0]?.id ?? null) : state.activeConversationId,
          };
        });
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const messages = [...c.messages, message];
            const title = c.messages.length === 0 && message.role === 'user'
              ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
              : c.title;
            return { ...c, messages, title, updatedAt: Date.now() };
          }),
        }));
      },

      updateLastAssistantMessage: (conversationId, chunk) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const messages = [...c.messages];
            const last = messages[messages.length - 1];
            if (last?.role === 'assistant') {
              messages[messages.length - 1] = { ...last, content: last.content + chunk };
            }
            return { ...c, messages, updatedAt: Date.now() };
          }),
        }));
      },

      setStreaming: (streaming) => set({ isStreaming: streaming }),
      updateSettings: (partial) =>
        set((state) => ({ settings: { ...state.settings, ...partial } })),
      setSettingsOpen: (open) => set({ isSettingsOpen: open }),

      getActiveConversation: () => {
        const state = get();
        return state.conversations.find((c) => c.id === state.activeConversationId) ?? null;
      },
    }),
    {
      name: 'devhub-chat',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        settings: state.settings,
      }),
    },
  ),
);
