import type { Message, ChatSettings, AnthropicStreamEvent, OpenAIStreamEvent } from '@/types/chat';

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

// --- Anthropic API ---

async function sendAnthropic(
  messages: Message[],
  settings: ChatSettings,
  onChunk: (text: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': settings.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    signal,
    body: JSON.stringify({
      model: settings.model,
      max_tokens: settings.maxTokens,
      temperature: settings.temperature,
      system: settings.systemPrompt || undefined,
      stream: true,
      messages: messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      if (data === '[DONE]') return;

      try {
        const parsed: AnthropicStreamEvent = JSON.parse(data) as AnthropicStreamEvent;
        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          onChunk(parsed.delta.text);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }
}

// --- OpenAI-compatible API (DeepSeek, Qwen, GLM, etc.) ---

async function sendOpenAICompatible(
  messages: Message[],
  settings: ChatSettings,
  onChunk: (text: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const baseUrl = settings.baseUrl || 'https://api.deepseek.com';
  const url = `${baseUrl.replace(/\/+$/, '')}/v1/chat/completions`;

  const allMessages = [
    ...(settings.systemPrompt ? [{ role: 'system' as const, content: settings.systemPrompt }] : []),
    ...messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`,
    },
    signal,
    body: JSON.stringify({
      model: settings.model,
      max_tokens: settings.maxTokens,
      temperature: settings.temperature,
      stream: true,
      messages: allMessages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      if (data === '[DONE]') return;

      try {
        const parsed: OpenAIStreamEvent = JSON.parse(data) as OpenAIStreamEvent;
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          onChunk(content);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }
}
