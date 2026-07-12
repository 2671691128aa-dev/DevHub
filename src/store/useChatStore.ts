import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import type { Conversation, ChatSettings, Message } from '@/types/chat';
import { STORAGE_KEYS, DEFAULT_CHAT_SETTINGS, DEFAULT_CONVERSATION_TITLE } from '@/constants';

// IndexedDB-backed storage for Zustand persist
// Why IndexedDB? localStorage has ~5MB limit, chat history with AI responses
// can easily exceed that. IndexedDB has no practical limit.
const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  settings: ChatSettings;
  isSettingsOpen: boolean;
  isHydrated: boolean;

  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessageStatus: (conversationId: string, messageId: string, status: 'pending' | 'sent' | 'failed') => void;
  updateLastAssistantMessage: (conversationId: string, chunk: string) => void;
  removeLastAssistantMessage: (conversationId: string) => void;
  setStreaming: (streaming: boolean) => void;
  updateSettings: (settings: Partial<ChatSettings>) => void;
  setSettingsOpen: (open: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  getActiveConversation: () => Conversation | null;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isStreaming: false,
      settings: DEFAULT_CHAT_SETTINGS,
      isSettingsOpen: false,
      isHydrated: false,

      createConversation: () => {
        const id = crypto.randomUUID();
        const conversation: Conversation = {
          id,
          title: DEFAULT_CONVERSATION_TITLE,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          model: DEFAULT_CHAT_SETTINGS.model,
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

      updateMessageStatus: (conversationId, messageId, status) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, status } : m
              ),
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      removeLastAssistantMessage: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const messages = c.messages.filter(
              (m, i) => !(m.role === 'assistant' && i === c.messages.length - 1)
            );
            return { ...c, messages, updatedAt: Date.now() };
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
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      getActiveConversation: () => {
        const state = get();
        return state.conversations.find((c) => c.id === state.activeConversationId) ?? null;
      },
    }),
    {
      name: STORAGE_KEYS.CHAT,
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        settings: state.settings,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHydrated(true);
        };
      },
    },
  ),
);
