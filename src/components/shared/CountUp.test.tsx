import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountUp } from './CountUp';

describe('CountUp', () => {
  it('应从 0 开始计数到目标值', async () => {
    render(<CountUp end={10} duration={100} />);

    // Eventually should reach the target
    // We use findByText since the component animates over time
    const el = await screen.findByText('10', {}, { timeout: 500 });
    expect(el).toBeInTheDocument();
  });

  it('end 为 0 时应显示 0', () => {
    render(<CountUp end={0} duration={100} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('应应用传入的 className', () => {
    const { container } = render(<CountUp end={5} className="text-red-500" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('text-red-500');
  });

  it('end 变化时应重新计数', async () => {
    const { rerender } = render(<CountUp end={5} duration={50} />);

    // Wait for initial count
    await screen.findByText('5', {}, { timeout: 300 });

    // Change end value
    rerender(<CountUp end={10} duration={50} />);

    // Should eventually show new value
    await screen.findByText('10', {}, { timeout: 500 });
  });
});
