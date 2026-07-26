import type { Message, ChatSettings, OpenAIStreamEvent } from '@/types/chat';
import { OPENAI_CHAT_PATH, DEFAULT_OPENAI_BASE_URL } from '@/constants/api';
import { RETRY_CONFIG } from '@/constants/error-messages';
import {
  classifyHTTPError,
  classifyNetworkError,
  classifyStreamError,
  classifyAIError,
} from '@/lib/errorClassifier';

/** 组合用户取消信号和超时信号 */
function createCombinedSignal(userSignal: AbortSignal): AbortSignal {
  const timeoutSignal = AbortSignal.timeout(RETRY_CONFIG.REQUEST_TIMEOUT_MS);
  // AbortSignal.any 是现代浏览器原生 API
  if (typeof AbortSignal.any === 'function') {
    return AbortSignal.any([userSignal, timeoutSignal]);
  }
  // 降级：只使用用户信号（超时由 errorClassifier 兜底识别）
  return userSignal;
}

/** 区分超时 AbortError 和用户取消 AbortError */
function isTimeoutError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'TimeoutError') return true;
  if (error instanceof Error && error.name === 'TimeoutError') return true;
  // AbortSignal.timeout 在某些浏览器中抛出 AbortError 但带有特殊标记
  if (error instanceof DOMException && error.name === 'AbortError') {
    // 如果用户没有主动取消，那就是超时
    return true;
  }
  return false;
}

/** OpenAI-compatible API streaming implementation (DeepSeek, Qwen, GLM, etc.) */
export async function sendOpenAICompatible(
  messages: Message[],
  settings: ChatSettings,
  onChunk: (text: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const baseUrl = settings.baseUrl || DEFAULT_OPENAI_BASE_URL;
  const url = `${baseUrl.replace(/\/+$/, '')}${OPENAI_CHAT_PATH}`;
  const combinedSignal = createCombinedSignal(signal);

  const allMessages = [
    ...(settings.systemPrompt ? [{ role: 'system' as const, content: settings.systemPrompt }] : []),
    ...messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content })),
  ];

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey}`,
      },
      signal: combinedSignal,
      body: JSON.stringify({
        model: settings.model,
        max_tokens: settings.maxTokens,
        temperature: settings.temperature,
        stream: true,
        messages: allMessages,
      }),
    });
  } catch (e) {
    if (isTimeoutError(e)) {
      throw classifyAIError(Object.assign(new Error('请求超时'), { name: 'TimeoutError' }));
    }
    throw classifyNetworkError(e);
  }

  if (!response.ok) {
    throw classifyHTTPError(response.status, response.headers.get('Retry-After'));
  }

  await readStream<OpenAIStreamEvent>(response, (parsed) => {
    const content = parsed.choices?.[0]?.delta?.content;
    if (content) {
      onChunk(content);
    }
  });
}

/** 通用流式读取 */
async function readStream<T>(response: Response, handler: (parsed: T) => void): Promise<void> {
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
          const parsed = JSON.parse(data) as T;
          handler(parsed);
        } catch {
          // skip malformed chunks
        }
      }
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw e; // 用户主动取消，原样抛出
    }
    throw classifyStreamError(e);
  }
}
