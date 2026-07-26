import { motion } from 'framer-motion';
import { ScoreGauge } from './ScoreGauge';
import { IssueList } from './IssueList';
import { SuggestionCard } from './SuggestionCard';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { ReviewResult } from '../types';

interface ReviewResultProps {
  result: ReviewResult;
}

export function ReviewResult({ result }: ReviewResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Score + Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Score Card */}
        <Card className="flex items-center gap-6 !p-5">
          <ScoreGauge score={result.score} grade={result.grade} />
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-semibold text-text-primary">代码质量评分</h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">代码行数</span>
                <span className="font-medium text-text-primary">{result.stats.codeLines}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">注释行数</span>
                <span className="font-medium text-text-primary">{result.stats.commentLines}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">复杂度</span>
                <Badge
                  color={
                    result.stats.complexity === 'low'
                      ? 'green'
                      : result.stats.complexity === 'medium'
                        ? 'blue'
                        : result.stats.complexity === 'high'
                          ? 'yellow'
                          : 'gray'
                  }
                >
                  {result.stats.complexity === 'low'
                    ? '低'
                    : result.stats.complexity === 'medium'
                      ? '中'
                      : result.stats.complexity === 'high'
                        ? '高'
                        : '很高'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">问题密度</span>
                <span className="font-medium text-text-primary">
                  {result.stats.issueDensity}/100行
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Highlights + Summary */}
        <Card className="!p-5">
          <h3 className="text-sm font-semibold text-text-primary">代码亮点</h3>
          {result.highlights.length > 0 ? (
            <div className="mt-3 space-y-2">
              {result.highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="flex items-center gap-2 text-xs text-text-secondary"
                >
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  {h}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-xs text-text-muted">继续改善代码以获得更多亮点</p>
          )}

          <div className="mt-4 border-t border-border pt-3">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-error">
                  {result.issues.filter((i) => i.severity === 'error').length}
                </div>
                <div className="text-[10px] text-text-muted">错误</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-warning">
                  {result.issues.filter((i) => i.severity === 'warning').length}
                </div>
                <div className="text-[10px] text-text-muted">警告</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-accent">
                  {result.issues.filter((i) => i.severity === 'info').length}
                </div>
                <div className="text-[10px] text-text-muted">提示</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-success">{result.suggestions.length}</div>
                <div className="text-[10px] text-text-muted">建议</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Issues */}
      {result.issues.length > 0 && (
        <Card className="!p-4">
          <IssueList issues={result.issues} />
        </Card>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <Card className="!p-4">
          <SuggestionCard suggestions={result.suggestions} />
        </Card>
      )}
    </motion.div>
  );
}
