/**
 * Agent Loop — orchestrates the AI ↔ tool calling cycle.
 *
 * Flow:
 * 1. User sends a message
 * 2. Send to AI with tool definitions (non-streaming)
 * 3. If AI returns tool_use → execute tool → send result back → repeat
 * 4. When AI returns final text → switch to streaming for the response
 *
 * This runs entirely on the frontend — the server just proxies API calls.
 */

import type { Message, ChatSettings } from '@/types/chat';
import type { AIErrorCode } from '@/types/error';
import {
  getAnthropicToolDefinitions,
  getOpenAIToolDefinitions,
  getTool,
} from './toolRegistry';

export interface ToolCallStep {
  id: string;
  toolId: string;
  toolName: string;
  params: Record<string, unknown>;
  result?: string;
  status: 'pending' | 'running' | 'done' | 'error';
  startTime: number;
  endTime?: number;
}

export interface AgentLoopCallbacks {
  onToolCallStart: (step: ToolCallStep) => void;
  onToolCallResult: (stepId: string, result: string, status: 'done' | 'error') => void;
  onTextChunk: (text: string) => void;
  onComplete: (fullText: string) => void;
  onError: (code: AIErrorCode, message: string) => void;
}

/** Send a non-streaming request to /api/chat and parse the full response */
async function nonStreamingChat(
  messages: Array<{ role: string; content: string | unknown[] }>,
  settings: ChatSettings,
  tools: unknown[],
  signal: AbortSignal,
): Promise<Record<string, unknown>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = (window as unknown as { __clerkToken?: string }).__clerkToken;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers,
    signal,
    body: JSON.stringify({
      messages,
      provider: settings.provider,
      providerName: settings.providerName,
      model: settings.model,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      systemPrompt: settings.systemPrompt || undefined,
      tools,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<Record<string, unknown>>;
}

/** Send a streaming request to /api/chat — exported for direct use if needed */
export async function streamingChat(
  messages: Array<{ role: string; content: string }>,
  settings: ChatSettings,
  onChunk: (text: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = (window as unknown as { __clerkToken?: string }).__clerkToken;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers,
    signal,
    body: JSON.stringify({
      messages,
      provider: settings.provider,
      providerName: settings.providerName,
      model: settings.model,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      systemPrompt: settings.systemPrompt || undefined,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data) as Record<string, unknown>;

        // Anthropic
        if (parsed.type === 'content_block_delta' && parsed.delta) {
          const text = (parsed.delta as Record<string, string>).text;
          if (text) onChunk(text);
        }

        // OpenAI
        const choices = parsed.choices as
          | Array<{ delta?: { content?: string } }>
          | undefined;
        const content = choices?.[0]?.delta?.content;
        if (typeof content === 'string') onChunk(content);
      } catch {
        // skip
      }
    }
  }
}

/** Parse tool calls from Anthropic response */
function parseAnthropicToolCalls(response: Record<string, unknown>): Array<{
  id: string;
  toolId: string;
  params: Record<string, unknown>;
}> {
  const content = response.content as unknown[] | undefined;
  if (!content) return [];

  const toolCalls: Array<{ id: string; toolId: string; params: Record<string, unknown> }> = [];

  for (const block of content) {
    const b = block as Record<string, unknown>;
    if (b.type === 'tool_use') {
      toolCalls.push({
        id: b.id as string,
        toolId: b.name as string,
        params: (b.input as Record<string, unknown>) ?? {},
      });
    }
  }

  return toolCalls;
}

/** Parse tool calls from OpenAI-compatible response */
function parseOpenAIToolCalls(response: Record<string, unknown>): Array<{
  id: string;
  toolId: string;
  params: Record<string, unknown>;
}> {
  const choices = response.choices as Array<{
    message?: { tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }> };
  }>;
  if (!choices?.[0]?.message?.tool_calls) return [];

  return choices[0].message.tool_calls.map((tc) => ({
    id: tc.id,
    toolId: tc.function.name,
    params: JSON.parse(tc.function.arguments || '{}'),
  }));
}

/** Get the text content from a response */
function getResponseText(response: Record<string, unknown>, isAnthropic: boolean): string {
  if (isAnthropic) {
    const content = response.content as unknown[] | undefined;
    if (!content) return '';
    return content
      .filter((b) => (b as Record<string, unknown>).type === 'text')
      .map((b) => (b as Record<string, string>).text)
      .join('');
  }

  // OpenAI
  const choices = response.choices as Array<{ message?: { content?: string } }>;
  return choices?.[0]?.message?.content ?? '';
}

/** Main agent loop */
export async function runAgentLoop(
  messages: Message[],
  settings: ChatSettings,
  signal: AbortSignal,
  callbacks: AgentLoopCallbacks,
): Promise<void> {
  const isAnthropic = settings.providerName === 'Anthropic';
  const toolDefs = isAnthropic
    ? getAnthropicToolDefinitions()
    : getOpenAIToolDefinitions();

  // Build message history for the API
  let apiMessages: Array<{ role: string; content: string | unknown[] }> = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role, content: m.content }));

  const maxIterations = 5; // Prevent infinite loops
  let iteration = 0;

  while (iteration < maxIterations) {
    iteration++;

    // Call AI with tools (non-streaming)
    let response: Record<string, unknown>;
    try {
      response = await nonStreamingChat(apiMessages, settings, toolDefs, signal);
    } catch (e) {
      callbacks.onError('NETWORK_ERROR', e instanceof Error ? e.message : String(e));
      return;
    }

    // Parse tool calls
    const toolCalls = isAnthropic
      ? parseAnthropicToolCalls(response)
      : parseOpenAIToolCalls(response);

    // If no tool calls, we're done — get the text and stream it
    if (toolCalls.length === 0) {
      const text = getResponseText(response, isAnthropic);
      if (text) {
        // Stream the final text for nice UX
        // (In practice, since it's already a complete response, we can just send it as chunks)
        const words = text.split(/(\s+)/);
        for (const word of words) {
          if (signal.aborted) return;
          callbacks.onTextChunk(word);
          await new Promise((r) => setTimeout(r, 10)); // Small delay for effect
        }
        callbacks.onComplete(text);
      }
      return;
    }

    // Execute tool calls
    const toolResults: Array<{ toolCallId: string; result: string; isError: boolean }> = [];

    for (const tc of toolCalls) {
      const tool = getTool(tc.toolId);
      const step: ToolCallStep = {
        id: crypto.randomUUID(),
        toolId: tc.toolId,
        toolName: tool?.name ?? tc.toolId,
        params: tc.params,
        status: 'pending',
        startTime: Date.now(),
      };

      callbacks.onToolCallStart(step);

      if (!tool) {
        callbacks.onToolCallResult(step.id, `工具 "${tc.toolId}" 不存在`, 'error');
        toolResults.push({ toolCallId: tc.id, result: `工具 "${tc.toolId}" 不存在`, isError: true });
        continue;
      }

      // Update status to running
      step.status = 'running';

      try {
        const result = await tool.execute(tc.params);
        step.result = result.output;
        step.status = 'done';
        step.endTime = Date.now();

        if (result.success) {
          callbacks.onToolCallResult(step.id, result.output, 'done');
          toolResults.push({ toolCallId: tc.id, result: result.output, isError: false });
        } else {
          callbacks.onToolCallResult(step.id, result.error ?? '工具执行失败', 'error');
          toolResults.push({
            toolCallId: tc.id,
            result: result.error ?? '工具执行失败',
            isError: true,
          });
        }
      } catch (e) {
        const errMsg = e instanceof Error ? e.message : String(e);
        callbacks.onToolCallResult(step.id, errMsg, 'error');
        toolResults.push({ toolCallId: tc.id, result: errMsg, isError: true });
      }
    }

    // Build next round of messages including tool results
    if (isAnthropic) {
      // Anthropic: assistant message with tool_use blocks + tool_result messages
      const assistantContent = (response.content as unknown[]).filter(
        (b) => (b as Record<string, unknown>).type === 'text' || (b as Record<string, unknown>).type === 'tool_use',
      );
      apiMessages = [
        ...apiMessages,
        { role: 'assistant', content: assistantContent },
        {
          role: 'user',
          content: toolResults.map((tr) => ({
            type: 'tool_result',
            tool_use_id: tr.toolCallId,
            content: tr.result,
            is_error: tr.isError,
          })),
        },
      ];
    } else {
      // OpenAI: assistant message + tool messages
      apiMessages = [
        ...apiMessages,
        {
          role: 'assistant',
          content: getResponseText(response, false) || '',
        },
        ...toolResults.map((tr) => ({
          role: 'tool',
          content: tr.result,
        })),
      ];
    }
  }

  // Max iterations reached
  callbacks.onTextChunk('（已达到最大工具调用轮次，停止执行）');
  callbacks.onComplete('（已达到最大工具调用轮次）');
}
