import { describe, it, expect } from 'vitest';
import { validateJson } from './validator';

describe('validateJson', () => {
  it('空字符串应返回 valid', () => {
    expect(validateJson('')).toEqual({ valid: true });
  });

  it('纯空白字符串应返回 valid', () => {
    expect(validateJson('   \n  ')).toEqual({ valid: true });
  });

  it('有效 JSON 对象应返回 valid', () => {
    expect(validateJson('{"a": 1}')).toEqual({ valid: true });
  });

  it('有效 JSON 数组应返回 valid', () => {
    expect(validateJson('[1, 2, 3]')).toEqual({ valid: true });
  });

  it('有效 JSON 字符串应返回 valid', () => {
    expect(validateJson('"hello"')).toEqual({ valid: true });
  });

  it('有效 JSON 数字应返回 valid', () => {
    expect(validateJson('42')).toEqual({ valid: true });
  });

  it('无效 JSON 应返回 error 信息', () => {
    const result = validateJson('{invalid}');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error.message).toBeTruthy();
      expect(typeof result.error.line).toBe('number');
      expect(typeof result.error.column).toBe('number');
    }
  });

  it('应提供正确的错误位置（行和列）', () => {
    const input = '{\n  "a": 1,\n  "b": \n}';
    const result = validateJson(input);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      // 错误位置应为有效数字
      expect(result.error.line).toBeGreaterThanOrEqual(1);
      expect(result.error.column).toBeGreaterThanOrEqual(1);
    }
  });

  it('截断的 JSON 应返回 error', () => {
    const result = validateJson('{"a": 1, "b":');
    expect(result.valid).toBe(false);
  });
});
