import type { AIError, AIErrorCode } from '@/types/error';

/** 创建结构化 AIError 实例 */
function createAIError(
  code: AIErrorCode,
  message: string,
  options: { statusCode?: number; retryable?: boolean; retryAfter?: number } = {},
): AIError {
  const retryable = options.retryable ?? false;
  const error = new Error(message) as AIError;
  error.name = 'AIError';
  Object.defineProperties(error, {
    code: { value: code, enumerable: true },
    retryable: { value: retryable, enumerable: true },
    statusCode: { value: options.statusCode, enumerable: true },
    retryAfter: { value: options.retryAfter, enumerable: true },
  });
  return error;
}

/** 将 HTTP 状态码转换为结构化 AIError */
export function classifyHTTPError(status: number, retryAfter?: string | null): AIError {
  switch (status) {
    case 401:
      return createAIError('AUTH_FAILED', `认证失败 (${status})`, { statusCode: status });
    case 403:
      return createAIError('FORBIDDEN', `权限不足 (${status})`, { statusCode: status });
    case 429: {
      const seconds = retryAfter ? parseInt(retryAfter, 10) : undefined;
      return createAIError('RATE_LIMITED', `请求过于频繁 (${status})`, {
        statusCode: status,
        retryable: true,
        retryAfter: seconds && !Number.isNaN(seconds) ? seconds : undefined,
      });
    }
    default:
      if (status >= 500) {
        return createAIError('SERVER_ERROR', `服务器错误 (${status})`, {
          statusCode: status,
          retryable: true,
        });
      }
      return createAIError('UNKNOWN', `未知 HTTP 错误 (${status})`, {
        statusCode: status,
        retryable: false,
      });
  }
}

/** 将 fetch 网络层错误转换为结构化 AIError */
export function classifyNetworkError(error: unknown): AIError {
  if (error instanceof DOMException) {
    if (error.name === 'AbortError') {
      return createAIError('ABORTED', '请求已被取消', { retryable: false });
    }
    // AbortSignal.timeout() 在某些浏览器中也会产生 AbortError
    // 但 TimeoutError 是较新的规范
    if (error.name === 'TimeoutError') {
      return createAIError('TIMEOUT', '请求超时', { retryable: true });
    }
  }

  if (error instanceof TypeError) {
    // fetch 网络失败抛出 TypeError，message 通常是 "Failed to fetch" 等
    return createAIError('NETWORK_ERROR', `网络连接失败: ${error.message}`, {
      retryable: true,
    });
  }

  if (error instanceof Error && error.name === 'AbortError') {
    return createAIError('ABORTED', '请求已被取消', { retryable: false });
  }

  return createAIError('UNKNOWN', error instanceof Error ? error.message : '未知错误');
}

/** 将 SSE 流读取阶段的错误转换为结构化 AIError */
export function classifyStreamError(error: unknown): AIError {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return createAIError('ABORTED', '请求已被取消', { retryable: false });
  }
  return createAIError('STREAM_ERROR', '数据流意外中断', { retryable: true });
}

/** 通用错误分类入口 */
export function classifyAIError(error: unknown): AIError {
  if (error instanceof Error && error.name === 'AIError') {
    return error as AIError;
  }
  return classifyNetworkError(error);
}
