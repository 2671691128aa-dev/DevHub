import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('应渲染子元素', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByRole('button', { name: '点击我' })).toBeInTheDocument();
  });

  it('点击时应触发 onClick', async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(
      <Button
        onClick={() => {
          clicked = true;
        }}
      >
        点击
      </Button>,
    );

    await user.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });

  it('loading 状态时应显示 spinner 且不可点击', () => {
    render(<Button loading>加载中</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    // SVG spinner should be present
    expect(button.querySelector('svg')).toBeTruthy();
  });

  it('disabled 时不应触发 onClick', async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(
      <Button
        disabled
        onClick={() => {
          clicked = true;
        }}
      >
        禁用
      </Button>,
    );

    await user.click(screen.getByRole('button'));
    expect(clicked).toBe(false);
  });

  it('不同 variant 应渲染不同样式', () => {
    const { rerender } = render(<Button variant="primary">主按钮</Button>);
    const primaryBtn = screen.getByRole('button');
    expect(primaryBtn.className).toContain('bg-accent');

    rerender(<Button variant="ghost">幽灵按钮</Button>);
    const ghostBtn = screen.getByRole('button');
    expect(ghostBtn.className).toContain('text-text-secondary');
  });

  it('不同 size 应有不同高度', () => {
    const { rerender } = render(<Button size="sm">小</Button>);
    const smBtn = screen.getByRole('button');
    expect(smBtn.className).toContain('h-8');

    rerender(<Button size="lg">大</Button>);
    const lgBtn = screen.getByRole('button');
    expect(lgBtn.className).toContain('h-11');
  });
});
