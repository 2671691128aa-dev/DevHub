import { cn } from '@/utils/cn';

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

function Tabs({ tabs, activeId, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex items-center gap-1 border-b border-border', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative px-4 py-2.5 text-sm font-medium outline-none transition-colors',
            activeId === tab.id ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary',
          )}
        >
          {tab.label}
          {activeId === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent" />
          )}
        </button>
      ))}
    </div>
  );
}

export { Tabs };
