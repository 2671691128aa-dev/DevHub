/**
 * AgentTimeline — displays the full agent thinking process as a timeline.
 *
 * Shows each step: user intent → AI thinking → tool call → result → final answer.
 */
import { ToolCallCard } from './ToolCallCard';
import type { ToolCallDisplay } from '@/types/chat';

interface AgentTimelineProps {
  toolCalls: ToolCallDisplay[];
}

export function AgentTimeline({ toolCalls }: AgentTimelineProps) {
  if (toolCalls.length === 0) return null;

  return (
    <div className="space-y-2 mb-3">
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="font-medium">Agent 思考过程</span>
        <span className="text-text-muted/60">
          ({toolCalls.length} 个工具调用)
        </span>
      </div>
      <div className="space-y-1.5 pl-3 border-l-2 border-border">
        {toolCalls.map((tc) => (
          <ToolCallCard key={tc.id} toolCall={tc} />
        ))}
      </div>
    </div>
  );
}
