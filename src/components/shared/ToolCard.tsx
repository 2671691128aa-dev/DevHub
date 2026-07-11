import { Link } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Tool } from '@/types/tool';

interface ToolCardProps {
  tool: Tool;
  icon: LucideIcon;
}

export function ToolCard({ tool, icon: Icon }: ToolCardProps) {
  return (
    <Link to={tool.route} className="group block">
      <Card hoverable className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex gap-1.5">
            {tool.isHot && <Badge color="yellow">热门</Badge>}
            {tool.isNew && <Badge color="green">NEW</Badge>}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
            {tool.name}
          </h3>
          <p className="mt-1 text-sm text-text-secondary line-clamp-2">
            {tool.description}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}
