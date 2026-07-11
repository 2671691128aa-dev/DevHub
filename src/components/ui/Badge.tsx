import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type BadgeColor = 'blue' | 'purple' | 'green' | 'yellow' | 'gray';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

const colorStyles: Record<BadgeColor, string> = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  gray: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

function Badge({ className, color = 'gray', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
        colorStyles[color],
        className,
      )}
      {...props}
    />
  );
}

export { Badge, type BadgeProps };
