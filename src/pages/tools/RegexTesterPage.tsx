import { Regex } from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { RegexInput } from '@/features/regex/components/RegexInput';
import { MatchHighlight } from '@/features/regex/components/MatchHighlight';
import { MatchList } from '@/features/regex/components/MatchList';
import { RegexTemplates } from '@/features/regex/components/RegexTemplates';
import { useRegexTester } from '@/features/regex/hooks/useRegexTester';
import { ROUTES } from '@/constants/routes';

export function RegexTesterPage() {
  const {
    pattern, setPattern, flags, setFlags,
    testString, setTestString,
    matches, isValid, error, executionTime,
    handleTemplateSelect,
  } = useRegexTester();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <Breadcrumb items={[
        { label: '工具', path: ROUTES.TOOLS },
        { label: '正则测试' },
      ]} />

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Regex className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold">正则测试</h1>
      </div>

      {/* Regex input */}
      <div className="mt-6">
        <RegexInput
          pattern={pattern}
          onPatternChange={setPattern}
          flags={flags}
          onFlagsChange={setFlags}
          isValid={isValid}
        />
        {!isValid && (
          <p className="mt-2 text-sm text-error">{error}</p>
        )}
      </div>

      {/* Templates */}
      <div className="mt-6">
        <label className="mb-2 block text-xs font-medium text-text-muted">常用模板</label>
        <RegexTemplates onSelect={handleTemplateSelect} />
      </div>

      {/* Test string */}
      <div className="mt-6">
        <label className="mb-2 block text-xs font-medium text-text-muted">测试文本</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="输入要测试的文本..."
          className="w-full rounded-lg border border-border bg-bg-tertiary p-3 font-mono text-sm text-text-primary outline-none transition-colors focus:border-accent min-h-[120px] resize-y placeholder:text-text-muted"
        />
      </div>

      {/* Match highlight */}
      <div className="mt-6">
        <label className="mb-2 block text-xs font-medium text-text-muted">匹配结果</label>
        <div className="rounded-lg border border-border bg-bg-tertiary min-h-[120px]">
          <MatchHighlight text={testString} matches={matches} />
        </div>
      </div>

      {/* Match list + perf */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <MatchList matches={matches} />
        <div className="rounded-lg border border-border bg-bg-tertiary p-4">
          <div className="text-xs font-medium text-text-muted mb-3">性能分析</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">匹配数量</span>
              <span className="text-text-primary font-medium">{matches.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">执行耗时</span>
              <span className="text-text-primary font-medium">{executionTime.toFixed(2)} ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">状态</span>
              <span className={isValid ? 'text-success' : 'text-error'}>
                {isValid ? '有效' : '无效'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
