import { useMemo, type ReactNode } from 'react';
import type { RegexMatch } from '@/types/common';

export interface MatchHighlightProps {
  text: string;
  matches: RegexMatch[];
}

const matchColors = ['bg-blue-500/20 border-blue-500/40', 'bg-purple-500/20 border-purple-500/40', 'bg-green-500/20 border-green-500/40', 'bg-yellow-500/20 border-yellow-500/40'];

export function MatchHighlight({ text, matches }: MatchHighlightProps) {
  const segments = useMemo(() => {
    if (!text || matches.length === 0) return [{ text, highlight: false, colorIdx: -1 }];

    const parts: { text: string; highlight: boolean; colorIdx: number }[] = [];
    let lastEnd = 0;

    const sorted = [...matches].sort((a, b) => a.index - b.index);
    sorted.forEach((m, i) => {
      if (m.index > lastEnd) {
        parts.push({ text: text.slice(lastEnd, m.index), highlight: false, colorIdx: -1 });
      }
      if (m.index >= lastEnd) {
        parts.push({ text: m.fullMatch, highlight: true, colorIdx: i % matchColors.length });
        lastEnd = m.index + m.fullMatch.length;
      }
    });

    if (lastEnd < text.length) {
      parts.push({ text: text.slice(lastEnd), highlight: false, colorIdx: -1 });
    }

    return parts;
  }, [text, matches]);

  return (
    <div className="whitespace-pre-wrap break-all font-mono text-sm leading-7 text-text-primary p-3">
      {segments.map((seg, i): ReactNode =>
        seg.highlight ? (
          <mark key={i} className={`rounded border ${matchColors[seg.colorIdx]} px-0.5`}>
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </div>
  );
}
