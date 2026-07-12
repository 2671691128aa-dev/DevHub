import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useStreaming } from './useStreaming';

export function useChat() {
  const conversation = useChatStore((s) =>
    s.conversations.find((c) => c.id === s.activeConversationId) ?? null
  );
  const isStreaming = useChatStore((s) => s.isStreaming);
  const isSettingsOpen = useChatStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useChatStore((s) => s.setSettingsOpen);
  const createConversation = useChatStore((s) => s.createConversation);
  const settings = useChatStore((s) => s.settings);
  const { send, stop } = useStreaming();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const handleSend = (content: string) => {
    if (!content.trim()) return;
    if (!settings.apiKey) {
      setSettingsOpen(true);
      return;
    }
    send(content);
  };

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
