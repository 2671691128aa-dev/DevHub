import type { AIError } from '@/types/error';
import { classifyAIError } from './errorClassifier';

export interface RetryOptions {
  /** 最大重试次数 */
  maxRetries: number;
  /** 基础退避延迟（毫秒） */
  baseDelayMs: number;
  /** 最大退避延迟（毫秒） */
  maxDelayMs: number;
  /** 判断是否应该重试 */
  shouldRetry: (error: AIError) => boolean;
  /** 每次重试前的回调 */
  onRetry?: (error: AIError, attempt: number) => void;
  /** 取消信号 */
  signal?: AbortSignal;
}

/**
 * 带指数退避的重试包装器。
 * 失败时通过 classifyAIError 分类，根据 shouldRetry 决定是否重试。
 */
export async function retryWithBackoff<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  const { maxRetries, baseDelayMs, maxDelayMs, shouldRetry, onRetry, signal } = options;

  let lastError: AIError | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // 检查是否已被取消
    if (signal?.aborted) {
      throw classifyAIError(new DOMException('请求已被取消', 'AbortError'));
    }

    try {
      return await fn();
    } catch (e) {
      lastError = classifyAIError(e);

      // 用户主动取消，不重试
      if (lastError.code === 'ABORTED') {
        throw lastError;
      }

      // 不可重试或已达最大次数
      if (!shouldRetry(lastError) || attempt >= maxRetries) {
        throw lastError;
      }

      // 通知 UI 即将重试
      onRetry?.(lastError, attempt + 1);

      // 计算退避延迟
      const delay = calculateDelay(attempt, baseDelayMs, maxDelayMs, lastError);
      await sleep(delay, signal);
    }
  }

  // 理论上不会走到这里，但 TypeScript 需要
  throw lastError ?? classifyAIError(new Error('重试耗尽'));
}

/** 计算退避延迟：指数退避 + 随机抖动，429 时优先使用 Retry-After */
function calculateDelay(
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number,
  error: AIError,
): number {
  // 429 带 Retry-After 头时，优先使用
  if (error.retryAfter && error.retryAfter > 0) {
    return Math.min(error.retryAfter * 1000, maxDelayMs);
  }

  // 指数退避 + 随机抖动
  const exponential = baseDelayMs * Math.pow(2, attempt);
  const jitter = exponential * 0.1 * Math.random(); // 10% 随机抖动
  return Math.min(exponential + jitter, maxDelayMs);
}

/** 可中断的 sleep */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('请求已被取消', 'AbortError'));
      return;
    }

    const timer = setTimeout(resolve, ms);

    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('请求已被取消', 'AbortError'));
      },
      { once: true },
    );
  });
}
