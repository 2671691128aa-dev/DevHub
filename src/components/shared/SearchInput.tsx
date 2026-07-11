import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = '搜索工具...' }: SearchInputProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      prefix={<Search className="h-4 w-4" />}
      suffix={
        value ? (
          <button onClick={() => onChange('')} className="hover:text-text-secondary">
            <X className="h-3.5 w-3.5" />
          </button>
        ) : undefined
      }
    />
  );
}
