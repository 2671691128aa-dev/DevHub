import { useRef, useCallback } from 'react';
import { sendMessage } from '../services/aiService';
import { useChatStore } from '@/store/useChatStore';
import type { Message } from '@/types/chat';

export function useStreaming() {
  const abortRef = useRef<AbortController | null>(null);
  const {
    addMessage, updateLastAssistantMessage, setStreaming, settings,
    getActiveConversation, createConversation,
  } = useChatStore();

  const send = useCallback(
    async (content: string) => {
      const conversationId = getActiveConversation()?.id ?? createConversation();

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      addMessage(conversationId, userMessage);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };
      addMessage(conversationId, assistantMessage);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const conv = useChatStore.getState().conversations.find((c) => c.id === conversationId);
        const history = conv?.messages.filter((m) => m.role !== 'assistant' || m.content) ?? [];

        await sendMessage(history, settings, (chunk) => {
          updateLastAssistantMessage(conversationId, chunk);
        }, controller.signal);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          updateLastAssistantMessage(conversationId, `\n\n---\n⚠️ 错误: ${(e as Error).message}`);
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [addMessage, updateLastAssistantMessage, setStreaming, settings, getActiveConversation, createConversation],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
  }, [setStreaming]);

  return { send, stop };
}
