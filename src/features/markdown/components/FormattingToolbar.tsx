import {
  Bold, Italic, Heading1, Heading2, Link, Image, Code, List, ListOrdered, Quote, Minus,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export interface FormattingToolbarProps {
  onInsert: (prefix: string, suffix?: string) => void;
}

const tools = [
  { icon: Bold, label: '加粗', prefix: '**', suffix: '**' },
  { icon: Italic, label: '斜体', prefix: '*', suffix: '*' },
  { icon: Heading1, label: '标题 1', prefix: '# ' },
  { icon: Heading2, label: '标题 2', prefix: '## ' },
  { type: 'divider' as const },
  { icon: Link, label: '链接', prefix: '[', suffix: '](url)' },
  { icon: Image, label: '图片', prefix: '![alt](', suffix: ')' },
  { icon: Code, label: '代码', prefix: '`', suffix: '`' },
  { type: 'divider' as const },
  { icon: List, label: '无序列表', prefix: '- ' },
  { icon: ListOrdered, label: '有序列表', prefix: '1. ' },
  { icon: Quote, label: '引用', prefix: '> ' },
  { icon: Minus, label: '分割线', prefix: '\n---\n' },
];

export function FormattingToolbar({ onInsert }: FormattingToolbarProps) {
  return (
    <div className="flex items-center gap-0.5 border-b border-border px-2 py-1.5">
      {tools.map((tool, i) => {
        if ('type' in tool && tool.type === 'divider') {
          return <div key={i} className="mx-1 h-4 w-px bg-border" />;
        }
        const Item = tool as { icon: typeof Bold; label: string; prefix: string; suffix?: string };
        return (
          <button
            key={i}
            onClick={() => onInsert(Item.prefix, Item.suffix)}
            title={Item.label}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded text-text-muted transition-colors',
              'hover:bg-bg-tertiary hover:text-text-primary',
            )}
          >
            <Item.icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
