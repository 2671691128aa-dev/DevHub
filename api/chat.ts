/**
 * /api/chat — Serverless AI chat proxy.
 *
 * Receives chat request from frontend, attaches server-side API keys,
 * forwards to the appropriate AI provider, and pipes the SSE stream back.
 *
 * Supports two modes:
 * 1. Streaming mode (default): pipes SSE stream back to client
 * 2. Non-streaming mode (when tools are provided): returns full JSON response
 *    so the frontend can parse tool_use blocks and execute tools
 *
 * API keys are never exposed to the browser.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '@clerk/clerk-sdk-node';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | unknown[];
}

interface ChatRequestBody {
  messages: ChatMessage[];
  provider: string;
  providerName: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  /** Tool definitions for function calling — enables non-streaming mode */
  tools?: unknown[];
  /** When true, stream SSE. When tools are present, always non-streaming. */
  stream?: boolean;
}

/** Map provider name to environment variable holding its API key */
const PROVIDER_KEY_MAP: Record<string, string> = {
  Anthropic: 'ANTHROPIC_API_KEY',
  DeepSeek: 'DEEPSEEK_API_KEY',
  '通义千问': 'QWEN_API_KEY',
  '智谱 GLM': 'GLM_API_KEY',
  '月之暗面': 'MOONSHOT_API_KEY',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- Auth ---
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const token = authHeader.slice(7);
  try {
    const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
    if (CLERK_SECRET_KEY) {
      await verifyToken(token, { secretKey: CLERK_SECRET_KEY });
    }
  } catch {
    return res.status(401).json({ error: 'Invalid auth token' });
  }

  // --- Parse body ---
  const body = req.body as ChatRequestBody;
  const { messages, providerName, model, temperature, maxTokens, systemPrompt, tools } = body;

  if (!messages?.length) {
    return res.status(400).json({ error: 'Messages required' });
  }

  // When tools are present, use non-streaming mode
  const useTools = tools && tools.length > 0;
  const shouldStream = body.stream !== false && !useTools;

  // --- Resolve API key ---
  const isAnthropic = providerName === 'Anthropic';
  const envKey = PROVIDER_KEY_MAP[providerName];
  const apiKey = envKey ? process.env[envKey] : undefined;

  if (!apiKey) {
    return res.status(400).json({
      error: `API key not configured for "${providerName}". Set ${envKey || 'the corresponding'} env var.`,
    });
  }

  // --- Build upstream request ---
  let upstreamUrl: string;
  let upstreamHeaders: Record<string, string>;
  let upstreamBody: Record<string, unknown>;

  if (isAnthropic) {
    upstreamUrl = 'https://api.anthropic.com/v1/messages';
    upstreamHeaders = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    };
    upstreamBody = {
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt || undefined,
      stream: shouldStream,
      messages: messages.map((m) => ({
        role: m.role === 'system' ? 'user' : m.role,
        content: m.content,
      })),
      ...(useTools ? { tools } : {}),
    };
  } else {
    const baseUrl = getBaseUrl(providerName);
    upstreamUrl = `${baseUrl}/v1/chat/completions`;
    upstreamHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };
    const allMessages = systemPrompt
      ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
      : messages;
    upstreamBody = {
      model,
      max_tokens: maxTokens,
      temperature,
      stream: shouldStream,
      messages: allMessages,
      ...(useTools ? { tools, tool_choice: 'auto' } : {}),
    };
  }

  // --- Call upstream AI API ---
  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(upstreamUrl, {
      method: 'POST',
      headers: upstreamHeaders,
      body: JSON.stringify(upstreamBody),
    });
  } catch (err) {
    console.error('Upstream fetch failed:', err);
    return res.status(502).json({ error: 'Failed to reach AI provider' });
  }

  if (!upstreamResponse.ok) {
    const errorText = await upstreamResponse.text().catch(() => 'Unknown error');
    return res.status(upstreamResponse.status).json({
      error: `AI provider returned ${upstreamResponse.status}: ${errorText}`,
    });
  }

  // --- Non-streaming mode: return full JSON ---
  if (!shouldStream) {
    const data = await upstreamResponse.json();
    return res.status(200).json(data);
  }

  // --- Streaming mode: pipe SSE back ---
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const reader = upstreamResponse.body?.getReader();
  if (!reader) {
    return res.status(502).json({ error: 'No response body from AI provider' });
  }

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }
  } catch (err) {
    console.error('Stream pipe error:', err);
  } finally {
    reader.releaseLock();
    res.end();
  }
}

function getBaseUrl(providerName: string): string {
  const map: Record<string, string> = {
    DeepSeek: 'https://api.deepseek.com',
    '通义千问': 'https://dashscope.aliyuncs.com/compatible-mode',
    '智谱 GLM': 'https://open.bigmodel.cn/api/paas',
    '月之暗面': 'https://api.moonshot.cn',
  };
  return map[providerName] || 'https://api.openai.com';
}
