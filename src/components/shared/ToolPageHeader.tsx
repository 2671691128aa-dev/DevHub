import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ROUTES } from '@/constants/routes';

interface ToolPageHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Breadcrumb label — defaults to title */
  breadcrumbLabel?: string;
  /** Right-side action buttons */
  actions?: ReactNode;
  /** Extra content below the title (e.g. processing indicator) */
  subtitle?: ReactNode;
  /** Optional custom title element (overrides the default h1 text) */
  titleNode?: ReactNode;
}

/**
 * Shared header for tool pages — breadcrumb + icon + title + actions.
 * Extracted from the repeated pattern across 6 tool pages.
 */
export function ToolPageHeader({
  icon: Icon,
  title,
  description,
  breadcrumbLabel,
  actions,
  subtitle,
  titleNode,
}: ToolPageHeaderProps) {
  return (
    <>
      <Breadcrumb
        items={[{ label: '工具', path: ROUTES.TOOLS }, { label: breadcrumbLabel ?? title }]}
      />

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 flex h-9 w-9 items-center justify-center rounded-lg text-accent">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            {titleNode ?? <h1 className="text-xl font-semibold">{title}</h1>}
            {description && <p className="text-sm text-text-muted">{description}</p>}
            {subtitle}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </>
  );
}
