/**
 * Chat sync hook — keeps Zustand store in sync with Supabase when logged in.
 *
 * Behavior:
 * - Not logged in: IndexedDB only (existing behavior, unchanged)
 * - Logged in: fetch conversations from Supabase on mount, sync writes via API
 * - Network failure: falls back to IndexedDB seamlessly
 */
import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useChatStore } from '@/store/useChatStore';
import {
  fetchConversations,
  fetchConversation,
  createConversationRecord,
  deleteConversationRecord,
  saveMessageRecord,
} from '@/lib/api-client';
import type { Conversation, Message } from '@/types/chat';

export function useChatSync() {
  const { isLoaded, isSignedIn } = useAuth();
  const hasSynced = useRef(false);

  // Fetch conversations from Supabase on login
  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasSynced.current) return;

    hasSynced.current = true;

    async function sync() {
      try {
        const records = await fetchConversations();
        if (records.length === 0) return;

        // Fetch messages for each conversation
        const conversations: Conversation[] = [];
        for (const record of records) {
          try {
            const full = await fetchConversation(record.id);
            conversations.push({
              id: full.id,
              title: full.title,
              model: full.model,
              createdAt: new Date(full.created_at).getTime(),
              updatedAt: new Date(full.updated_at).getTime(),
              messages: full.messages.map((m) => ({
                id: m.id,
                role: m.role as Message['role'],
                content: m.content,
                timestamp: new Date(m.created_at).getTime(),
                status: m.status as Message['status'],
                errorCode: m.error_code as Message['errorCode'],
              })),
            });
          } catch {
            // Skip conversations that fail to load
            conversations.push({
              id: record.id,
              title: record.title,
              model: record.model,
              createdAt: new Date(record.created_at).getTime(),
              updatedAt: new Date(record.updated_at).getTime(),
              messages: [],
            });
          }
        }

        // Merge with local: prefer server data but keep local-only conversations
        const state = useChatStore.getState();
        const localIds = new Set(state.conversations.map((c) => c.id));
        const newConvs = conversations.filter((c) => !localIds.has(c.id));

        if (newConvs.length > 0) {
          useChatStore.setState({
            conversations: [...state.conversations, ...newConvs],
          });
        }
      } catch {
        // Network error — keep using IndexedDB, no-op
        hasSynced.current = false; // Allow retry
      }
    }

    sync();
  }, [isLoaded, isSignedIn]);

  // Reset sync flag on logout
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      hasSynced.current = false;
    }
  }, [isLoaded, isSignedIn]);
}

/**
 * Sync a message to Supabase (fire-and-forget, doesn't block UI).
 * Call after a message is added locally.
 */
export function syncMessageToServer(
  conversationId: string,
  message: Message,
): void {
  if (!useChatStore.getState().isHydrated) return;

  // Only sync non-pending, non-streaming messages
  if (message.role === 'assistant' && !message.content) return;

  saveMessageRecord(conversationId, {
    role: message.role,
    content: message.content,
    status: message.status ?? 'sent',
    error_code: message.errorCode ?? null,
    token_count: null,
  }).catch(() => {
    // Silently fail — message is already in IndexedDB
  });
}

/**
 * Sync conversation creation to Supabase (fire-and-forget).
 */
export function syncConversationCreate(conversationId: string): void {
  const state = useChatStore.getState();
  const conv = state.conversations.find((c) => c.id === conversationId);
  if (!conv) return;

  createConversationRecord(conv.title, conv.model).catch(() => {
    // Silently fail
  });
}

/**
 * Sync conversation deletion to Supabase (fire-and-forget).
 */
export function syncConversationDelete(conversationId: string): void {
  deleteConversationRecord(conversationId).catch(() => {
    // Silently fail
  });
}
