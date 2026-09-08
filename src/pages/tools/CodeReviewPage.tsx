import { motion } from 'framer-motion';
import { ScanSearch, Play, RotateCcw, Loader2 } from 'lucide-react';
import { ToolPageHeader } from '@/components/shared/ToolPageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CodeInput } from '@/features/code-review/components/CodeInput';
import { LanguageSelector } from '@/features/code-review/components/LanguageSelector';
import { ReviewResult } from '@/features/code-review/components/ReviewResult';
import { useCodeReview } from '@/features/code-review/hooks/useCodeReview';
import ClickSpark from '@/components/ClickSpark';

export function CodeReviewPage() {
  const { code, setCode, language, setLanguage, result, isAnalyzing, analyze, reset, stats } =
    useCodeReview();

  return (
    <ClickSpark sparkColor="var(--accent)" sparkCount={5} sparkRadius={15} sparkSize={6}>
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Breadcrumb + Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 mt-4"
      >
        <ToolPageHeader
          icon={ScanSearch}
          title="AI 代码审查"
          description="基于规则引擎的代码质量分析，支持多语言检测"
        />
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card className="!p-4">
          {/* Controls Row */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted">语言：</span>
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>{stats.lines} 行</span>
              <span>·</span>
              <span>{stats.chars} 字符</span>
            </div>
            <Button size="sm" onClick={analyze} disabled={!code.trim() || isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Play className="mr-1.5 h-3.5 w-3.5" />
                  开始分析
                </>
              )}
            </Button>
            {result && (
              <Button variant="secondary" size="sm" onClick={reset}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                重置
              </Button>
            )}
          </div>

          {/* Code Input */}
          <CodeInput
            value={code}
            onChange={setCode}
            placeholder={`在此粘贴你的 ${language} 代码...\n\n支持的检测项：\n• 命名规范检查\n• 代码复杂度分析\n• 安全漏洞检测\n• 代码风格问题\n• 常见 Bug 模式`}
          />
        </Card>
      </motion.div>

      {/* Results Section */}
      {result && (
        <div className="mt-6">
          <ReviewResult result={result} />
        </div>
      )}

      {/* Empty state */}
      {!result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="bg-accent/5 text-accent/50 flex h-16 w-16 items-center justify-center rounded-2xl">
            <ScanSearch className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-text-primary">等待代码输入</h3>
          <p className="mt-2 max-w-md text-sm text-text-muted">
            粘贴代码并选择语言，点击「开始分析」即可获得代码质量评分、问题分析和优化建议。 支持
            JavaScript、TypeScript、Python、Java 等多种语言。
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {['命名规范', '复杂度', '安全性', '代码风格', 'Bug 模式'].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border bg-bg-secondary px-3 py-2 text-xs text-text-secondary"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
    </ClickSpark>
  );
}
