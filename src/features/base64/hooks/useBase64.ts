import { useState, useMemo, useCallback } from 'react';
import { encodeBase64, decodeBase64 } from '../utils/converter';
import { toast } from '@/lib/toast';

export type Base64Mode = 'encode' | 'decode';

export interface Base64Stats {
  inputLength: number;
  outputLength: number;
}

export function useBase64() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Base64Mode>('encode');
  const [error, setError] = useState<string | null>(null);

  // 实时转换：根据 mode 计算 output
  const output = useMemo(() => {
    if (!input) {
      setError(null);
      return '';
    }
    try {
      if (mode === 'encode') {
        setError(null);
        return encodeBase64(input);
      } else {
        const result = decodeBase64(input);
        setError(null);
        return result;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '解码失败');
      return '';
    }
  }, [input, mode]);

  const stats: Base64Stats = useMemo(
    () => ({
      inputLength: input.length,
      outputLength: output.length,
    }),
    [input, output],
  );

  /** 切换编解码方向，并将当前 output 作为新的 input */
  const handleSwap = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'encode' ? 'decode' : 'encode';
      // 交换输入输出
      setInput(output);
      return next;
    });
  }, [output]);

  /** 复制输出到剪贴板 */
  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success('已复制到剪贴板');
    } catch {
      toast.error('复制失败');
    }
  }, [output]);

  /** 清空所有状态 */
  const handleClear = useCallback(() => {
    setInput('');
    setError(null);
  }, []);

  return {
    input,
    setInput,
    mode,
    setMode,
    output,
    error,
    stats,
    handleSwap,
    handleCopy,
    handleClear,
  };
}
