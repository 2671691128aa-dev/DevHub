import type { Message, ChatSettings } from '@/types/chat';
import { sendAnthropic } from './anthropicService';
import { sendOpenAICompatible } from './openaiService';

/**
 * AI service dispatcher — routes to the appropriate provider implementation.
 */
export async function sendMessage(
  messages: Message[],
  settings: ChatSettings,
  onChunk: (text: string) => void,
  signal: AbortSignal,
): Promise<void> {
  if (settings.provider === 'openai-compatible') {
    return sendOpenAICompatible(messages, settings, onChunk, signal);
  }
  return sendAnthropic(messages, settings, onChunk, signal);
}
