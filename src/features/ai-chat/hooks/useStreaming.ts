import { useRef, useCallback, useEffect } from 'react';
import { sendMessage } from '../services/aiService';
import { useChatStore } from '@/store/useChatStore';
import type { Message, ChatSettings } from '@/types/chat';

export function useStreaming() {
  const abortRef = useRef<AbortController | null>(null);

  // Select individual actions (Zustand guarantees stable references for actions)
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessageStatus = useChatStore((s) => s.updateMessageStatus);
  const updateLastAssistantMessage = useChatStore((s) => s.updateLastAssistantMessage);
  const removeLastAssistantMessage = useChatStore((s) => s.removeLastAssistantMessage);
  const setStreaming = useChatStore((s) => s.setStreaming);
  const createConversation = useChatStore((s) => s.createConversation);

  const send = useCallback(
    async (content: string) => {
      // Use getState() to read latest values inside callback without subscribing
      const state = useChatStore.getState();
      const settings: ChatSettings = state.settings;
      const conversationId = state.activeConversationId
        ?? state.conversations[0]?.id
        ?? createConversation();

      // 1. 乐观更新：先把用户消息显示在 UI 上，标记为 pending
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: Date.now(),
        status: 'pending',
      };
      addMessage(conversationId, userMessage);

      // 2. 添加一个空的 AI 回复占位
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

        // 3. 成功：标记用户消息为 sent
        updateMessageStatus(conversationId, userMessage.id, 'sent');
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          // 4. 失败：标记用户消息为 failed，删除空的 AI 回复
          updateMessageStatus(conversationId, userMessage.id, 'failed');
          removeLastAssistantMessage(conversationId);
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [addMessage, updateMessageStatus, updateLastAssistantMessage, removeLastAssistantMessage, setStreaming, createConversation],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
  }, [setStreaming]);

  // Cleanup: abort streaming on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return { send, stop };
}
