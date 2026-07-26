import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

function Card({ className, hoverable = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-bg-secondary p-6 transition-all duration-200',
        hoverable &&
          'cursor-pointer hover:-translate-y-0.5 hover:border-border-hover hover:shadow-lg hover:shadow-black/20',
        className,
      )}
      {...props}
    />
  );
}

export { Card, type CardProps };
