import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  className?: string;
}

export const MarkdownEditorPanel = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  ({ value, onChange, textareaRef, className }, _ref) => {
    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={cn(
          'flex-1 resize-none bg-transparent p-4 font-mono text-sm text-text-primary outline-none leading-relaxed placeholder:text-text-muted',
          className,
        )}
        placeholder="开始编写 Markdown..."
      />
    );
  },
);
MarkdownEditorPanel.displayName = 'MarkdownEditorPanel';
