import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useAppStore } from '@/store/useAppStore';
import { useStreaming } from './useStreaming';

export function useChat() {
  const conversation = useChatStore(
    (s) => s.conversations.find((c) => c.id === s.activeConversationId) ?? null,
  );
  const isStreaming = useChatStore((s) => s.isStreaming);
  const isSettingsOpen = useAppStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);
  const createConversation = useChatStore((s) => s.createConversation);
  const settings = useChatStore((s) => s.settings);
  const { send, stop } = useStreaming();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // Debounced scroll: avoid layout thrashing on every streaming chunk
  useEffect(() => {
    if (!conversation?.messages.length) return;
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;

    const timer = requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      isScrollingRef.current = false;
    });

    return () => cancelAnimationFrame(timer);
  }, [conversation?.messages]);

  const handleSend = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      if (!useChatStore.getState().settings.apiKey) {
        setSettingsOpen(true);
        return;
      }
      send(content);
    },
    [send, setSettingsOpen],
  );

  return {
    conversation,
    isStreaming,
    isSettingsOpen,
    setSettingsOpen,
    createConversation,
    settings,
    handleSend,
    stop,
    messagesEndRef,
  };
}
