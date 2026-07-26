/**
 * Base64 编解码工具函数
 * 使用 TextEncoder/TextDecoder 实现完整的 UTF-8 Unicode 支持
 */

/** 将 UTF-8 字符串编码为 Base64 */
export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  // 将 Uint8Array 转为二进制字符串，再用 btoa 编码
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** 将 Base64 解码为 UTF-8 字符串；输入非法时抛出 Error */
export function decodeBase64(input: string): string {
  // 先校验格式（仅允许 Base64 字符 + 合法 padding）
  if (!isValidBase64(input)) {
    throw new Error('无效的 Base64 输入');
  }
  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/** 判断字符串是否为合法的 Base64 编码 */
export function isValidBase64(input: string): boolean {
  if (input.length === 0) return true;
  // Base64 正则：仅 A-Z a-z 0-9 + /，末尾允许最多两个 = 填充
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return base64Regex.test(input);
}
