export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  status?: 'pending' | 'sent' | 'failed';
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: string;
}

export type AIProvider = 'anthropic' | 'openai-compatible';

export interface ChatSettings {
  provider: AIProvider;
  providerName: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  settings: ChatSettings;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: 'coding' | 'writing' | 'analysis';
}

// --- API streaming event types ---

/** Anthropic SSE event: content_block_delta */
interface AnthropicContentBlockDelta {
  type: 'content_block_delta';
  delta: { text: string };
}

/** Anthropic SSE event: generic fallback */
interface AnthropicStreamEventGeneric {
  type: string;
  delta?: { text?: string };
}

export type AnthropicStreamEvent = AnthropicContentBlockDelta | AnthropicStreamEventGeneric;

/** OpenAI-compatible SSE event: choices[0].delta */
interface OpenAIDelta {
  content?: string;
  role?: string;
}

interface OpenAIStreamChoice {
  delta: OpenAIDelta;
  finish_reason?: string | null;
}

export interface OpenAIStreamEvent {
  choices?: OpenAIStreamChoice[];
}

// --- Markdown ---

export type MarkdownViewMode = 'split' | 'editor' | 'preview';
