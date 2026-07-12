import { useState, useMemo, useCallback, useDeferredValue } from 'react';
import type { RegexMatch, CaptureGroup } from '@/types/common';

export function useRegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');

  // Defer heavy regex computation — input stays responsive while regex runs
  const deferredPattern = useDeferredValue(pattern);
  const deferredTestString = useDeferredValue(testString);

  const { matches, isValid, error, executionTime } = useMemo(() => {
    if (!deferredPattern || !deferredTestString) {
      return { matches: [], isValid: true, error: null, executionTime: 0 };
    }

    const start = performance.now();
    try {
      const regex = new RegExp(deferredPattern, flags);
      const results: RegexMatch[] = [];
      let match: RegExpExecArray | null;

      if (flags.includes('g')) {
        let safety = 0;
        while ((match = regex.exec(deferredTestString)) !== null && safety < 10000) {
          results.push(buildMatch(match));
          if (match[0].length === 0) regex.lastIndex++;
          safety++;
        }
      } else {
        match = regex.exec(deferredTestString);
        if (match) results.push(buildMatch(match));
      }

      const elapsed = performance.now() - start;
      return { matches: results, isValid: true, error: null, executionTime: elapsed };
    } catch (e) {
      return { matches: [], isValid: false, error: (e as Error).message, executionTime: 0 };
    }
  }, [deferredPattern, flags, deferredTestString]);

  const handleTemplateSelect = useCallback((templatePattern: string) => {
    setPattern(templatePattern);
    setFlags('g');
  }, []);

  return {
    pattern, setPattern,
    flags, setFlags,
    testString, setTestString,
    matches, isValid, error, executionTime,
    handleTemplateSelect,
  };
}

function buildMatch(match: RegExpExecArray): RegexMatch {
  const groups: CaptureGroup[] = [];
  for (let i = 1; i < match.length; i++) {
    if (match[i] !== undefined) {
      groups.push({
        name: match.groups ? Object.entries(match.groups).find(([, v]) => v === match[i])?.[0] ?? null : null,
        value: match[i],
        start: match.index + (match[0].indexOf(match[i])),
        end: match.index + (match[0].indexOf(match[i])) + match[i].length,
      });
    }
  }
  return {
    index: match.index,
    fullMatch: match[0],
    groups,
  };
}
