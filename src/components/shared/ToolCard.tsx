import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import type { Tool } from '@/types/tool';

export interface ToolCardProps {
  tool: Tool;
  icon: LucideIcon;
}

export function ToolCard({ tool, icon: Icon }: ToolCardProps) {
  const isFav = useFavoriteStore((s) => s.favoriteIds.includes(tool.id));
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <Link
      to={tool.route}
      className="group block outline-none focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-full"
      >
        {/* Mouse-follow glow */}
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: isHovered
              ? `radial-gradient(300px circle at ${glowPos.x}% ${glowPos.y}%, var(--accent-glow), transparent 60%)`
              : 'none',
          }}
        />
        <Card
          hoverable
          className="group-hover:shadow-accent/10 relative flex h-full flex-col gap-3 transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl"
        >
          <div className="flex items-start justify-between">
            <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg text-accent">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1.5">
              {/* Favorite toggle */}
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(tool.id);
                }}
                className="flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-bg-tertiary"
                title={isFav ? '取消收藏' : '收藏'}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 transition-colors ${
                    isFav
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-none text-text-muted group-hover:text-text-secondary'
                  }`}
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </motion.button>
              {tool.isHot && <Badge color="yellow">热门</Badge>}
              {tool.isNew && <Badge color="green">NEW</Badge>}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary transition-colors group-hover:text-accent">
              {tool.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{tool.description}</p>
          </div>
          <div className="mt-auto flex flex-wrap gap-1.5">
            {tool.tags.slice(0, 3).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </Card>
      </div>
    </Link>
  );
}
