import { motion } from 'framer-motion';
import { Lightbulb, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import type { ReviewSuggestion } from '../types';

interface SuggestionCardProps {
  suggestions: ReviewSuggestion[];
}

const priorityConfig = {
  high: { icon: ArrowUp, color: '#EF4444', label: '高优先' },
  medium: { icon: ArrowRight, color: '#EAB308', label: '中优先' },
  low: { icon: ArrowDown, color: '#22C55E', label: '低优先' },
};

export function SuggestionCard({ suggestions }: SuggestionCardProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-yellow-500" />
        <h3 className="text-sm font-semibold text-text-primary">优化建议 ({suggestions.length})</h3>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => {
          const config = priorityConfig[s.priority];
          const Icon = config.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="rounded-lg border border-border bg-bg-secondary p-3"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5" style={{ color: config.color }} />
                <span className="text-xs font-medium" style={{ color: config.color }}>
                  {config.label}
                </span>
              </div>
              <h4 className="mt-1.5 text-sm font-medium text-text-primary">{s.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">{s.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
