import { create } from 'zustand';
import type { ToolCategory } from '@/types/tool';

interface ToolState {
  searchQuery: string;
  activeCategory: ToolCategory | 'all';
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: ToolCategory | 'all') => void;
}

export const useToolStore = create<ToolState>((set) => ({
  searchQuery: '',
  activeCategory: 'all',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
