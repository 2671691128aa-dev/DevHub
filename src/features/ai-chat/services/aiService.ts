import type { Message, ChatSettings } from '@/types/chat';
import {
  classifyHTTPError,
  classifyNetworkError,
  classifyStreamError,
} from '@/lib/errorClassifier';

/**
 * Unified server-side chat proxy.
 *
 * Sends the request to /api/chat which handles API key injection
 * and streams back the SSE response. API keys are never exposed to the browser.
 */
export async function sendMessage(
  messages: Message[],
  settings: ChatSettings,
  onChunk: (text: string) => void,
  signal: AbortSignal,
): Promise<void> {
  let response: Response;

  try {
    // Build auth headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = (window as unknown as { __clerkToken?: string }).__clerkToken;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    response = await fetch('/api/chat', {
      method: 'POST',
      headers,
      signal,
      body: JSON.stringify({
        messages: messages
          .filter((m) => m.role !== 'system')
          .map((m) => ({ role: m.role, content: m.content })),
        provider: settings.provider,
        providerName: settings.providerName,
        model: settings.model,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        systemPrompt: settings.systemPrompt || undefined,
      }),
    });
  } catch (e) {
    if (isTimeoutError(e)) {
      throw classifyNetworkError(
        Object.assign(new Error('请求超时'), { name: 'TimeoutError' }),
      );
    }
    throw classifyNetworkError(e);
  }

  if (!response.ok) {
    throw classifyHTTPError(response.status, response.headers.get('Retry-After'));
  }

  await readStream(response, onChunk);
}

function isTimeoutError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'TimeoutError') return true;
  if (error instanceof Error && error.name === 'TimeoutError') return true;
  if (error instanceof DOMException && error.name === 'AbortError') return true;
  return false;
}

/**
 * Generic SSE stream reader.
 * Handles both Anthropic and OpenAI event formats since the server
 * already normalizes the streaming — we just look for text content.
 */
async function readStream(
  response: Response,
  onChunk: (text: string) => void,
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) throw classifyStreamError(new Error('No response body'));

  const decoder = new TextDecoder();
  let buffer = '';

  try {
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
          const parsed = JSON.parse(data) as Record<string, unknown>;

          // Anthropic format: { type: 'content_block_delta', delta: { text: '...' } }
          if (
            parsed.type === 'content_block_delta' &&
            parsed.delta &&
            typeof (parsed.delta as Record<string, unknown>).text === 'string'
          ) {
            onChunk((parsed.delta as Record<string, string>).text);
            continue;
          }

          // OpenAI format: { choices: [{ delta: { content: '...' } }] }
          const choices = parsed.choices as
            | Array<{ delta?: { content?: string } }>
            | undefined;
          const content = choices?.[0]?.delta?.content;
          if (typeof content === 'string') {
            onChunk(content);
          }
        } catch {
          // skip malformed chunks
        }
      }
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw e;
    }
    throw classifyStreamError(e);
  }
}
