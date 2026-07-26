import { describe, it, expect } from 'vitest';
import {
  classifyHTTPError,
  classifyNetworkError,
  classifyStreamError,
  classifyAIError,
} from './errorClassifier';

describe('classifyHTTPError', () => {
  it('401 应分类为 AUTH_FAILED', () => {
    const err = classifyHTTPError(401);
    expect(err.code).toBe('AUTH_FAILED');
    expect(err.retryable).toBe(false);
    expect(err.statusCode).toBe(401);
  });

  it('403 应分类为 FORBIDDEN', () => {
    const err = classifyHTTPError(403);
    expect(err.code).toBe('FORBIDDEN');
    expect(err.retryable).toBe(false);
  });

  it('429 应分类为 RATE_LIMITED 且可重试', () => {
    const err = classifyHTTPError(429);
    expect(err.code).toBe('RATE_LIMITED');
    expect(err.retryable).toBe(true);
  });

  it('429 带 Retry-After 应设置 retryAfter', () => {
    const err = classifyHTTPError(429, '30');
    expect(err.retryAfter).toBe(30);
  });

  it('429 带无效 Retry-After 应忽略', () => {
    const err = classifyHTTPError(429, 'invalid');
    expect(err.retryAfter).toBeUndefined();
  });

  it('500+ 应分类为 SERVER_ERROR 且可重试', () => {
    expect(classifyHTTPError(500).code).toBe('SERVER_ERROR');
    expect(classifyHTTPError(500).retryable).toBe(true);
    expect(classifyHTTPError(503).code).toBe('SERVER_ERROR');
  });

  it('其他 4xx 应分类为 UNKNOWN 且不可重试', () => {
    const err = classifyHTTPError(400);
    expect(err.code).toBe('UNKNOWN');
    expect(err.retryable).toBe(false);
  });
});

describe('classifyNetworkError', () => {
  it('AbortError (DOMException) 应分类为 ABORTED', () => {
    const err = classifyNetworkError(new DOMException('cancelled', 'AbortError'));
    expect(err.code).toBe('ABORTED');
    expect(err.retryable).toBe(false);
  });

  it('TimeoutError (DOMException) 应分类为 TIMEOUT', () => {
    const err = classifyNetworkError(new DOMException('timeout', 'TimeoutError'));
    expect(err.code).toBe('TIMEOUT');
    expect(err.retryable).toBe(true);
  });

  it('TypeError 应分类为 NETWORK_ERROR', () => {
    const err = classifyNetworkError(new TypeError('Failed to fetch'));
    expect(err.code).toBe('NETWORK_ERROR');
    expect(err.retryable).toBe(true);
  });

  it('未知 Error 应分类为 UNKNOWN', () => {
    const err = classifyNetworkError(new Error('something'));
    expect(err.code).toBe('UNKNOWN');
  });

  it('非 Error 值应分类为 UNKNOWN', () => {
    const err = classifyNetworkError('string error');
    expect(err.code).toBe('UNKNOWN');
  });
});

describe('classifyStreamError', () => {
  it('AbortError 应分类为 ABORTED', () => {
    const err = classifyStreamError(new DOMException('cancelled', 'AbortError'));
    expect(err.code).toBe('ABORTED');
    expect(err.retryable).toBe(false);
  });

  it('其他错误应分类为 STREAM_ERROR 且可重试', () => {
    const err = classifyStreamError(new Error('connection lost'));
    expect(err.code).toBe('STREAM_ERROR');
    expect(err.retryable).toBe(true);
  });
});

describe('classifyAIError', () => {
  it('已有 AIError 应直接返回', () => {
    const original = classifyHTTPError(401);
    const result = classifyAIError(original);
    expect(result).toBe(original);
  });

  it('非 AIError 应通过网络错误分类', () => {
    const result = classifyAIError(new TypeError('Failed to fetch'));
    expect(result.code).toBe('NETWORK_ERROR');
  });
});
