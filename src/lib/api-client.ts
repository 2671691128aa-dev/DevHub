/**
 * API client — authenticated fetch wrapper for Vercel Serverless Functions.
 *
 * Automatically attaches Clerk JWT token to requests.
 * Falls back to local-only mode when not authenticated.
 */

import type { AIProvider } from '@/types/chat';
import type { AIErrorCode } from '@/types/error';

/** Set Clerk token globally (called from AuthProvider) */
export function setClerkToken(token: string | null): void {
  (window as unknown as { __clerkToken?: string }).__clerkToken = token ?? undefined;
}

/** Authenticated fetch wrapper */
async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Attach auth token if available
  const token = (window as unknown as { __clerkToken?: string }).__clerkToken;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new APIError(response.status, errorBody, url);
  }

  return response.json() as Promise<T>;
}

export class APIError extends Error {
  constructor(
    public status: number,
    public body: string,
    public url: string,
  ) {
    super(`API Error ${status} at ${url}: ${body}`);
    this.name = 'APIError';
  }
}

// --- Conversations API ---

export interface ConversationRecord {
  id: string;
  user_id: string;
  title: string;
  model: string;
  created_at: string;
  updated_at: string;
}

export interface MessageRecord {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  status: string;
  error_code: string | null;
  token_count: number | null;
  created_at: string;
}

export interface ConversationWithMessages extends ConversationRecord {
  messages: MessageRecord[];
}

/** Fetch all conversations for the current user */
export async function fetchConversations(): Promise<ConversationRecord[]> {
  return apiFetch<ConversationRecord[]>('/api/conversations');
}

/** Fetch a single conversation with messages */
export async function fetchConversation(
  id: string,
): Promise<ConversationWithMessages> {
  return apiFetch<ConversationWithMessages>(`/api/conversations/${id}`);
}

/** Create a new conversation */
export async function createConversationRecord(
  title: string,
  model: string,
): Promise<ConversationRecord> {
  return apiFetch<ConversationRecord>('/api/conversations', {
    method: 'POST',
    body: JSON.stringify({ title, model }),
  });
}

/** Update a conversation (e.g., title) */
export async function updateConversationRecord(
  id: string,
  data: Partial<Pick<ConversationRecord, 'title'>>,
): Promise<ConversationRecord> {
  return apiFetch<ConversationRecord>(`/api/conversations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/** Delete a conversation */
export async function deleteConversationRecord(id: string): Promise<void> {
  await apiFetch<void>(`/api/conversations/${id}`, { method: 'DELETE' });
}

/** Save a message to a conversation */
export async function saveMessageRecord(
  conversationId: string,
  message: {
    role: 'user' | 'assistant' | 'system';
    content: string;
    status?: string;
    error_code?: AIErrorCode | null;
    token_count?: number | null;
  },
): Promise<MessageRecord> {
  return apiFetch<MessageRecord>(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify(message),
  });
}

// --- Chat API ---

export interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  provider: AIProvider;
  providerName: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}

/** Stream chat via server-side proxy — returns a ReadableStream */
export async function streamChat(
  request: ChatRequest,
  signal: AbortSignal,
): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = (window as unknown as { __clerkToken?: string }).__clerkToken;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    throw new APIError(response.status, await response.text().catch(() => ''), '/api/chat');
  }

  return response;
}

// --- User API ---

export interface UserStats {
  conversationCount: number;
  messageCount: number;
}

export async function fetchUserStats(): Promise<UserStats> {
  return apiFetch<UserStats>('/api/user/stats');
}
