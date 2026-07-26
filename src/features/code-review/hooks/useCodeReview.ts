import { useState, useCallback, useMemo } from 'react';
import { analyzeCode } from '../engine/analyzer';
import type { ReviewResult, CodeLanguage } from '../types';

export function useCodeReview() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<CodeLanguage>('javascript');
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = useCallback(() => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    // Simulate a brief analysis delay for UX
    setTimeout(() => {
      const reviewResult = analyzeCode(code, language);
      setResult(reviewResult);
      setIsAnalyzing(false);
    }, 300);
  }, [code, language]);

  const reset = useCallback(() => {
    setCode('');
    setResult(null);
  }, []);

  const stats = useMemo(() => {
    if (!code) return { lines: 0, chars: 0 };
    return {
      lines: code.split('\n').length,
      chars: code.length,
    };
  }, [code]);

  return {
    code,
    setCode,
    language,
    setLanguage,
    result,
    isAnalyzing,
    analyze,
    reset,
    stats,
  };
}
