import { toast as sonnerToast } from 'sonner';
import type { AIError } from '@/types/error';
import { AI_ERROR_MESSAGES } from '@/constants/error-messages';

/** 统一的 Toast 通知接口 */
export const toast = {
  success: (message: string) => sonnerToast.success(message),

  error: (message: string, description?: string) => sonnerToast.error(message, { description }),

  warning: (message: string, description?: string) => sonnerToast.warning(message, { description }),

  info: (message: string) => sonnerToast.info(message),

  /** 根据 AIError 自动显示对应的错误 toast */
  aiError: (error: AIError) => {
    const msg = AI_ERROR_MESSAGES[error.code];
    sonnerToast.error(msg.title, {
      description: msg.description,
      duration: msg.retryable ? 4000 : 8000,
    });
  },
};
