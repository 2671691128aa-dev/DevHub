/** 分类后的 AI API 错误码 */
export type AIErrorCode =
  | 'AUTH_FAILED' // 401 — API Key 无效或过期
  | 'FORBIDDEN' // 403 — 无权访问
  | 'RATE_LIMITED' // 429 — 请求频率超限
  | 'SERVER_ERROR' // 5xx — 服务端错误
  | 'TIMEOUT' // 请求超时
  | 'NETWORK_ERROR' // 网络不可达
  | 'ABORTED' // 用户主动取消
  | 'STREAM_ERROR' // SSE 流中断
  | 'UNKNOWN'; // 其他

/** 结构化的 AI 请求错误 */
export interface AIError extends Error {
  readonly code: AIErrorCode;
  readonly statusCode?: number;
  readonly retryable: boolean;
  readonly retryAfter?: number; // 来自 429 Retry-After 头（秒）
}

/** 错误码 → 用户可见消息的映射 */
export interface ErrorMessage {
  readonly code: AIErrorCode;
  readonly title: string;
  readonly description: string;
  readonly retryable: boolean;
}
