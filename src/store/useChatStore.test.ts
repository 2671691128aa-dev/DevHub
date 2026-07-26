import { act } from '@testing-library/react';
import { vi, beforeEach as vitestBeforeEach } from 'vitest';

// Mock the storage module to avoid IndexedDB in tests
vi.mock('@/lib/storage', () => ({
  indexedDBStorage: {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  },
  localStore: {
    get: <T,>(_key: string, fallback: T) => fallback,
    set: () => {},
    remove: () => {},
  },
  idbStorage: {
    get: async <T,>(_key: string, fallback: T) => fallback,
    set: async () => {},
    remove: async () => {},
  },
}));

// Now import the store (after mock is set up)
const { useChatStore } = await import('./useChatStore');
import type { Message } from '@/types/chat';

const makeMessage = (overrides: Partial<Message> = {}): Message => ({
  id: 'msg-1',
  role: 'user',
  content: 'Hello',
  timestamp: Date.now(),
  status: 'sent',
  ...overrides,
});

describe('useChatStore', () => {
  vitestBeforeEach(() => {
    useChatStore.setState({
      conversations: [],
      activeConversationId: null,
      isStreaming: false,
    });
  });

  it('creates a conversation and sets it active', () => {
    let id: string = '';
    act(() => {
      id = useChatStore.getState().createConversation();
    });

    const state = useChatStore.getState();
    expect(state.conversations).toHaveLength(1);
    expect(state.conversations[0].id).toBe(id);
    expect(state.activeConversationId).toBe(id);
  });

  it('deletes conversation and resets active if it was active', () => {
    let id1: string = '',
      id2: string = '';
    act(() => {
      id1 = useChatStore.getState().createConversation();
      id2 = useChatStore.getState().createConversation();
    });

    act(() => {
      useChatStore.getState().deleteConversation(id2);
    });

    const state = useChatStore.getState();
    expect(state.conversations).toHaveLength(1);
    expect(state.conversations[0].id).toBe(id1);
    expect(state.activeConversationId).toBe(id1);
  });

  it('addMessage auto-titles conversation from first user message', () => {
    let id: string = '';
    act(() => {
      id = useChatStore.getState().createConversation();
    });

    act(() => {
      useChatStore.getState().addMessage(id, makeMessage({ content: 'Hello World' }));
    });

    const conv = useChatStore.getState().conversations[0];
    expect(conv.title).toBe('Hello World');
    expect(conv.messages).toHaveLength(1);
  });

  it('updateLastAssistantMessage appends chunk to last assistant message', () => {
    let id: string = '';
    act(() => {
      id = useChatStore.getState().createConversation();
      useChatStore.getState().addMessage(id, makeMessage({ content: 'Hi' }));
      useChatStore.getState().addMessage(
        id,
        makeMessage({ id: 'ai-1', role: 'assistant', content: 'Hello' }),
      );
    });

    act(() => {
      useChatStore.getState().updateLastAssistantMessage(id, ' world');
    });

    const conv = useChatStore.getState().conversations[0];
    expect(conv.messages[1].content).toBe('Hello world');
  });

  it('removeLastAssistantMessage removes the last assistant message', () => {
    let id: string = '';
    act(() => {
      id = useChatStore.getState().createConversation();
      useChatStore.getState().addMessage(id, makeMessage());
      useChatStore.getState().addMessage(
        id,
        makeMessage({ id: 'ai-1', role: 'assistant', content: 'Hi' }),
      );
    });

    act(() => {
      useChatStore.getState().removeLastAssistantMessage(id);
    });

    const conv = useChatStore.getState().conversations[0];
    expect(conv.messages).toHaveLength(1);
    expect(conv.messages[0].role).toBe('user');
  });
});
