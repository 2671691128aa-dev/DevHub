import { describe, it, expect, vi } from 'vitest';
import { retryWithBackoff } from './retryWithBackoff';
import type { AIError } from '@/types/error';
import { classifyHTTPError } from './errorClassifier';

describe('retryWithBackoff', () => {
  const retryableError = (): AIError => classifyHTTPError(500);
  const nonRetryableError = (): AIError => classifyHTTPError(401);

  it('成功时应直接返回结果', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const result = await retryWithBackoff(fn, {
      maxRetries: 3,
      baseDelayMs: 10,
      maxDelayMs: 100,
      shouldRetry: () => true,
    });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('不可重试错误应立即抛出', async () => {
    const fn = vi.fn().mockRejectedValue(nonRetryableError());
    await expect(
      retryWithBackoff(fn, {
        maxRetries: 3,
        baseDelayMs: 10,
        maxDelayMs: 100,
        shouldRetry: () => false,
      }),
    ).rejects.toMatchObject({ code: 'AUTH_FAILED' });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('可重试错误应在重试后成功', async () => {
    const fn = vi.fn().mockRejectedValueOnce(retryableError()).mockResolvedValue('recovered');

    const result = await retryWithBackoff(fn, {
      maxRetries: 3,
      baseDelayMs: 10,
      maxDelayMs: 50,
      shouldRetry: () => true,
    });
    expect(result).toBe('recovered');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('达到最大重试次数后应抛出', async () => {
    const fn = vi.fn().mockRejectedValue(retryableError());
    await expect(
      retryWithBackoff(fn, {
        maxRetries: 2,
        baseDelayMs: 10,
        maxDelayMs: 50,
        shouldRetry: () => true,
      }),
    ).rejects.toMatchObject({ code: 'SERVER_ERROR' });
    // 1 次初始 + 2 次重试 = 3 次
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('每次重试前应调用 onRetry 回调', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(retryableError())
      .mockRejectedValueOnce(retryableError())
      .mockResolvedValue('ok');

    const onRetry = vi.fn();
    await retryWithBackoff(fn, {
      maxRetries: 3,
      baseDelayMs: 10,
      maxDelayMs: 50,
      shouldRetry: () => true,
      onRetry,
    });
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ code: 'SERVER_ERROR' }),
      1,
    );
    expect(onRetry).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ code: 'SERVER_ERROR' }),
      2,
    );
  });

  it('已取消的 AbortSignal 应立即抛出 ABORTED', async () => {
    const controller = new AbortController();
    controller.abort();

    const fn = vi.fn().mockResolvedValue('ok');
    await expect(
      retryWithBackoff(fn, {
        maxRetries: 3,
        baseDelayMs: 10,
        maxDelayMs: 100,
        shouldRetry: () => true,
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({ code: 'ABORTED' });
    expect(fn).not.toHaveBeenCalled();
  });
});
