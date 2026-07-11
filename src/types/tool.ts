export type ToolCategory = 'developer' | 'ai' | 'document' | 'network';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  route: string;
  tags: string[];
  isHot?: boolean;
  isNew?: boolean;
  status: 'stable' | 'beta' | 'coming-soon';
}

export interface ToolCategoryConfig {
  id: ToolCategory;
  name: string;
  icon: string;
  color: string;
  description: string;
}
