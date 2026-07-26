import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToolCard } from './ToolCard';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { Braces } from 'lucide-react';
import type { Tool } from '@/types/tool';
import { BrowserRouter } from 'react-router-dom';

const mockTool: Tool = {
  id: 'test-tool',
  name: '测试工具',
  description: '这是一个测试工具',
  category: 'developer',
  icon: 'Braces',
  route: '/tools/json',
  tags: ['test', 'json'],
  status: 'stable',
};

function renderCard(tool: Tool = mockTool) {
  return render(
    <BrowserRouter>
      <ToolCard tool={tool} icon={Braces} />
    </BrowserRouter>,
  );
}

describe('ToolCard', () => {
  beforeEach(() => {
    // Reset favorite store before each test
    useFavoriteStore.setState({ favoriteIds: [] });
  });

  it('应渲染工具名称和描述', () => {
    renderCard();
    expect(screen.getByText('测试工具')).toBeInTheDocument();
    expect(screen.getByText('这是一个测试工具')).toBeInTheDocument();
  });

  it('应渲染工具标签', () => {
    renderCard();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('json')).toBeInTheDocument();
  });

  it('isHot 为 true 时应显示"热门"徽章', () => {
    renderCard({ ...mockTool, isHot: true });
    expect(screen.getByText('热门')).toBeInTheDocument();
  });

  it('isNew 为 true 时应显示"NEW"徽章', () => {
    renderCard({ ...mockTool, isNew: true });
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('点击收藏按钮应切换收藏状态', async () => {
    const user = userEvent.setup();
    renderCard();

    // Initially not favorited
    expect(useFavoriteStore.getState().favoriteIds).not.toContain('test-tool');

    // Click favorite button
    const favButton = screen.getByTitle('收藏');
    await user.click(favButton);

    // Should be favorited now
    expect(useFavoriteStore.getState().favoriteIds).toContain('test-tool');

    // Click again to unfavorite
    const unfavButton = screen.getByTitle('取消收藏');
    await user.click(unfavButton);

    expect(useFavoriteStore.getState().favoriteIds).not.toContain('test-tool');
  });

  it('已收藏的工具应显示填充的星标', () => {
    useFavoriteStore.setState({ favoriteIds: ['test-tool'] });
    renderCard();

    const svg = screen.getByTitle('取消收藏').querySelector('svg');
    expect(svg).toHaveClass('fill-yellow-400');
  });

  it('应渲染为指向工具路由的链接', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/tools/json');
  });
});
