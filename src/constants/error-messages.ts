import type { AIErrorCode, ErrorMessage } from '@/types/error';

/** 每种错误码对应的用户可见消息（中文） */
export const AI_ERROR_MESSAGES: Record<AIErrorCode, ErrorMessage> = {
  AUTH_FAILED: {
    code: 'AUTH_FAILED',
    title: '认证失败',
    description: 'API Key 无效或已过期，请在设置中检查',
    retryable: false,
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    title: '权限不足',
    description: '当前 API Key 无权访问该模型',
    retryable: false,
  },
  RATE_LIMITED: {
    code: 'RATE_LIMITED',
    title: '请求过于频繁',
    description: '已超出速率限制，稍后将自动重试',
    retryable: true,
  },
  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    title: '服务暂时不可用',
    description: 'AI 服务出现问题，稍后将自动重试',
    retryable: true,
  },
  TIMEOUT: {
    code: 'TIMEOUT',
    title: '请求超时',
    description: '响应时间过长，请稍后重试',
    retryable: true,
  },
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    title: '网络连接失败',
    description: '请检查网络连接后重试',
    retryable: true,
  },
  ABORTED: {
    code: 'ABORTED',
    title: '已取消',
    description: '请求已被取消',
    retryable: false,
  },
  STREAM_ERROR: {
    code: 'STREAM_ERROR',
    title: '响应流中断',
    description: '数据流意外中断，请重试',
    retryable: true,
  },
  UNKNOWN: {
    code: 'UNKNOWN',
    title: '未知错误',
    description: '发生了未知错误，请重试',
    retryable: true,
  },
};

/** 自动重试配置 */
export const RETRY_CONFIG = {
  /** 最大重试次数 */
  MAX_RETRIES: 3,
  /** 基础退避延迟（毫秒） */
  BASE_DELAY_MS: 1000,
  /** 最大退避延迟（毫秒） */
  MAX_DELAY_MS: 30000,
  /** 单次请求超时（毫秒） */
  REQUEST_TIMEOUT_MS: 120_000,
} as const;
