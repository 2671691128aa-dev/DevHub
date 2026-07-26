import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/lib/storage';
import type { Conversation, ChatSettings, Message } from '@/types/chat';
import type { AIErrorCode } from '@/types/error';
import {
  STORAGE_KEYS,
  DEFAULT_CHAT_SETTINGS,
  DEFAULT_CONVERSATION_TITLE,
  AI_ERROR_MESSAGES,
} from '@/constants';

/**
 * Helper: apply a transform to a specific conversation within the array.
 * Avoids repeating the `map → find-by-id → return others unchanged` pattern.
 */
function updateConversation(
  conversations: Conversation[],
  conversationId: string,
  transform: (c: Conversation) => Conversation,
): Conversation[] {
  return conversations.map((c) => (c.id === conversationId ? transform(c) : c));
}

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  settings: ChatSettings;
  isHydrated: boolean;

  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessageStatus: (
    conversationId: string,
    messageId: string,
    status: 'pending' | 'sent' | 'failed',
  ) => void;
  updateLastAssistantMessage: (conversationId: string, chunk: string) => void;
  removeLastAssistantMessage: (conversationId: string) => void;
  setStreaming: (streaming: boolean) => void;
  updateSettings: (settings: Partial<ChatSettings>) => void;
  setHydrated: (hydrated: boolean) => void;
  updateMessageError: (
    conversationId: string,
    messageId: string,
    errorCode: AIErrorCode,
    attempt?: number,
  ) => void;
  getActiveConversation: () => Conversation | null;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isStreaming: false,
      settings: DEFAULT_CHAT_SETTINGS,
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
          conversations: updateConversation(state.conversations, conversationId, (c) => {
            const messages = [...c.messages, message];
            const title =
              c.messages.length === 0 && message.role === 'user'
                ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
                : c.title;
            return { ...c, messages, title, updatedAt: Date.now() };
          }),
        }));
      },

      updateMessageStatus: (conversationId, messageId, status) => {
        set((state) => ({
          conversations: updateConversation(state.conversations, conversationId, (c) => ({
            ...c,
            messages: c.messages.map((m) => (m.id === messageId ? { ...m, status } : m)),
            updatedAt: Date.now(),
          })),
        }));
      },

      removeLastAssistantMessage: (conversationId) => {
        set((state) => ({
          conversations: updateConversation(state.conversations, conversationId, (c) => ({
            ...c,
            messages: c.messages.filter(
              (m, i) => !(m.role === 'assistant' && i === c.messages.length - 1),
            ),
            updatedAt: Date.now(),
          })),
        }));
      },

      updateLastAssistantMessage: (conversationId, chunk) => {
        set((state) => ({
          conversations: updateConversation(state.conversations, conversationId, (c) => {
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
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      updateMessageError: (conversationId, messageId, errorCode, attempt) => {
        const errorInfo = AI_ERROR_MESSAGES[errorCode];
        const errorMessage = attempt
          ? `${errorInfo.title}（重试 ${attempt}/${3}）`
          : errorInfo.title;

        set((state) => ({
          conversations: updateConversation(state.conversations, conversationId, (c) => ({
            ...c,
            messages: c.messages.map((m) =>
              m.id === messageId
                ? { ...m, status: 'failed' as const, errorMessage, errorCode }
                : m,
            ),
            updatedAt: Date.now(),
          })),
        }));
      },

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
