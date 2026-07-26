import { useState, memo, type ReactNode } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { TreeNode } from '@/types/common';

export interface JsonTreeViewProps {
  tree: TreeNode;
}

export const JsonTreeView = memo(function JsonTreeView({ tree }: JsonTreeViewProps) {
  return (
    <div className="h-full overflow-auto rounded-lg border border-border bg-bg-tertiary p-3 font-mono text-sm">
      <TreeNodeComponent node={tree} depth={0} />
    </div>
  );
});

const TreeNodeComponent = memo(function TreeNodeComponent({
  node,
  depth,
}: {
  node: TreeNode;
  depth: number;
}): ReactNode {
  const [collapsed, setCollapsed] = useState(depth > 2);

  const hasChildren = node.children && node.children.length > 0;
  const indent = depth * 20;

  const typeColors: Record<string, string> = {
    string: 'text-green-400',
    number: 'text-blue-400',
    boolean: 'text-purple-400',
    null: 'text-text-muted',
    array: 'text-yellow-400',
    object: 'text-accent',
  };

  if (!hasChildren) {
    return (
      <div className="flex items-center gap-1 leading-7" style={{ paddingLeft: indent }}>
        <span className="text-text-secondary">{node.key}: </span>
        <span className={typeColors[node.type]}>
          {node.type === 'string' ? `"${node.value}"` : String(node.value)}
        </span>
      </div>
    );
  }

  const bracket = node.type === 'array' ? ['[', ']'] : ['{', '}'];
  const childCount = node.children?.length ?? 0;

  return (
    <div>
      <div
        className="flex cursor-pointer items-center gap-1 rounded leading-7 hover:bg-bg-secondary"
        style={{ paddingLeft: indent }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
        )}
        <span className="text-text-secondary">{node.key}</span>
        <span className="text-text-muted">{bracket[0]}</span>
        {collapsed && (
          <span className="ml-1 text-xs text-text-muted">
            {childCount} items… {bracket[1]}
          </span>
        )}
      </div>
      {!collapsed && (
        <>
          {node.children!.map((child, i) => (
            <TreeNodeComponent key={`${child.key}-${i}`} node={child} depth={depth + 1} />
          ))}
          <div className="leading-7 text-text-muted" style={{ paddingLeft: indent }}>
            {bracket[1]}
          </div>
        </>
      )}
    </div>
  );
});
