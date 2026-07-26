import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('应渲染子元素', () => {
    render(<Card>卡片内容</Card>);
    expect(screen.getByText('卡片内容')).toBeInTheDocument();
  });

  it('默认不应有 hoverable 样式', () => {
    const { container } = render(<Card>内容</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain('cursor-pointer');
  });

  it('hoverable 为 true 时应有 hover 样式', () => {
    const { container } = render(<Card hoverable>内容</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('cursor-pointer');
  });

  it('应合并自定义 className', () => {
    const { container } = render(<Card className="custom-class">内容</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
    expect(card.className).toContain('rounded-xl');
  });

  it('应透传 HTML 属性', () => {
    const { container } = render(<Card data-testid="my-card">内容</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute('data-testid', 'my-card');
  });
});
