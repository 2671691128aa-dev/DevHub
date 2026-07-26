/**
 * 集中错误日志 / 上报。
 * 当前仅 console.error，预留未来接入 Sentry 等服务的接口。
 */
export function reportError(error: unknown, context?: string): void {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  if (context) {
    console.error(`[DevHub Error] ${context}:`, message);
  } else {
    console.error(`[DevHub Error]:`, message);
  }

  if (stack) {
    console.error(stack);
  }

  // 预留：dispatch 给 window 以便调试工具监听
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('devhub:error', {
        detail: { error, context, message, timestamp: Date.now() },
      }),
    );
  }
}
