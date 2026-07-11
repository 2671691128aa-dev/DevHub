import type { JsonError } from '@/types/common';

export function validateJson(input: string): { valid: true } | { valid: false; error: JsonError } {
  if (!input.trim()) {
    return { valid: true };
  }
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    const message = (e as SyntaxError).message;
    const positionMatch = message.match(/position (\d+)/);
    const position = positionMatch ? parseInt(positionMatch[1], 10) : 0;

    const lines = input.slice(0, position).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    return { valid: false, error: { message, line, column } };
  }
}
