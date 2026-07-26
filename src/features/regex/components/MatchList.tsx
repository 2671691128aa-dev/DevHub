import type { RegexMatch } from '@/types/common';

export interface MatchListProps {
  matches: RegexMatch[];
}

export function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-bg-tertiary p-6 text-center text-sm text-text-muted">
        没有匹配结果
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg-tertiary">
      <div className="border-b border-border px-4 py-2 text-xs font-medium text-text-muted">
        {matches.length} 个匹配
      </div>
      <div className="max-h-64 overflow-auto">
        {matches.map((match, i) => (
          <div key={i} className="border-border/50 border-b px-4 py-2 last:border-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">
                #{i + 1} (位置 {match.index})
              </span>
              <code className="rounded bg-bg-secondary px-2 py-0.5 text-xs text-accent">
                {match.fullMatch}
              </code>
            </div>
            {match.groups.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-2">
                {match.groups.map((group, j) => (
                  <div key={j} className="rounded bg-bg-secondary px-2 py-0.5 text-xs">
                    <span className="text-text-muted">{group.name ?? `G${j + 1}`}: </span>
                    <span className="text-text-primary">{group.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
