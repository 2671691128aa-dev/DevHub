import type { CodeLanguage } from '../types';
import { Select } from '@/components/ui/Select';

interface LanguageSelectorProps {
  value: CodeLanguage;
  onChange: (lang: CodeLanguage) => void;
}

const languages: { value: CodeLanguage; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
  { value: 'sql', label: 'SQL' },
];

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <Select
      value={value}
      onChange={(v) => onChange(v as CodeLanguage)}
      options={languages.map((l) => ({ value: l.value, label: l.label }))}
    />
  );
}
