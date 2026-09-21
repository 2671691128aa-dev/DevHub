import { RETRY_CONFIG } from '@/constants/error-messages';

/**
 * 为请求信号绑定超时保护。
 *
 * 组合用户的取消信号与超时信号：任一触发都会中止请求。
 * 返回的 cleanup 用于释放超时定时器，避免任务早已结束却仍占着 timer。
 */
export function withTimeout(userSignal: AbortSignal): {
  signal: AbortSignal;
  cleanup: () => void;
} {
  const timeoutSignal = AbortSignal.timeout(RETRY_CONFIG.REQUEST_TIMEOUT_MS);

  // AbortSignal.any 是现代浏览器原生 API
  if (typeof AbortSignal.any === 'function') {
    return {
      signal: AbortSignal.any([userSignal, timeoutSignal]),
      cleanup: () => {},
    };
  }

  // 降级：手动串联两个信号，只支持单次中止
  const controller = new AbortController();
  const abort = () => controller.abort();
  userSignal.addEventListener('abort', abort, { once: true });
  timeoutSignal.addEventListener('abort', abort, { once: true });

  return {
    signal: controller.signal,
    cleanup: () => {
      userSignal.removeEventListener('abort', abort);
      timeoutSignal.removeEventListener('abort', abort);
    },
  };
}
