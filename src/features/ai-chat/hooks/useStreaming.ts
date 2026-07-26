import { useRef, useCallback, useEffect } from 'react';
import { sendMessage } from '../services/aiService';
import { useChatStore } from '@/store/useChatStore';
import { classifyAIError } from '@/lib/errorClassifier';
import { retryWithBackoff } from '@/lib/retryWithBackoff';
import { toast } from '@/lib/toast';
import { RETRY_CONFIG } from '@/constants/error-messages';
import type { Message, ChatSettings } from '@/types/chat';
import type { AIError } from '@/types/error';

export function useStreaming() {
  const abortRef = useRef<AbortController | null>(null);

  // Select individual actions (Zustand guarantees stable references for actions)
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessageStatus = useChatStore((s) => s.updateMessageStatus);
  const updateLastAssistantMessage = useChatStore((s) => s.updateLastAssistantMessage);
  const removeLastAssistantMessage = useChatStore((s) => s.removeLastAssistantMessage);
  const updateMessageError = useChatStore((s) => s.updateMessageError);
  const setStreaming = useChatStore((s) => s.setStreaming);
  const createConversation = useChatStore((s) => s.createConversation);

  const send = useCallback(
    async (content: string) => {
      // Use getState() to read latest values inside callback without subscribing
      const state = useChatStore.getState();
      const settings: ChatSettings = state.settings;
      const conversationId =
        state.activeConversationId ?? state.conversations[0]?.id ?? createConversation();

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

        await retryWithBackoff(
          () => {
            // 每次重试前清空上一条不完整的 AI 回复
            removeLastAssistantMessage(conversationId);
            addMessage(conversationId, {
              ...assistantMessage,
              id: crypto.randomUUID(),
              content: '',
            });

            return sendMessage(
              history,
              settings,
              (chunk) => {
                updateLastAssistantMessage(conversationId, chunk);
              },
              controller.signal,
            );
          },
          {
            maxRetries: RETRY_CONFIG.MAX_RETRIES,
            baseDelayMs: RETRY_CONFIG.BASE_DELAY_MS,
            maxDelayMs: RETRY_CONFIG.MAX_DELAY_MS,
            shouldRetry: (err: AIError) => err.retryable,
            onRetry: (err: AIError, attempt: number) => {
              updateMessageError(conversationId, userMessage.id, err.code, attempt);
            },
            signal: controller.signal,
          },
        );

        // 3. 成功：标记用户消息为 sent
        updateMessageStatus(conversationId, userMessage.id, 'sent');
      } catch (e) {
        const aiError = classifyAIError(e);

        if (aiError.code === 'ABORTED') {
          // 用户主动取消：清理占位消息，不显示错误
          removeLastAssistantMessage(conversationId);
          return;
        }

        // 4. 最终失败：写入错误信息 + Toast 通知
        updateMessageError(conversationId, userMessage.id, aiError.code);
        removeLastAssistantMessage(conversationId);

        // 只有非用户取消的错误才弹 toast
        toast.aiError(aiError);
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [
      addMessage,
      updateMessageStatus,
      updateLastAssistantMessage,
      removeLastAssistantMessage,
      updateMessageError,
      setStreaming,
      createConversation,
    ],
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
