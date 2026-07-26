import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear());

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', ''));

    act(() => result.current[1]('hello'));

    expect(result.current[0]).toBe('hello');
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('hello');
  });

  it('reads existing value from localStorage', () => {
    localStorage.setItem('existing', JSON.stringify(42));

    const { result } = renderHook(() => useLocalStorage('existing', 0));
    expect(result.current[0]).toBe(42);
  });

  it('handles functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => result.current[1]((prev) => prev + 1));
    act(() => result.current[1]((prev) => prev + 1));

    expect(result.current[0]).toBe(2);
  });

  it('handles invalid JSON gracefully', () => {
    localStorage.setItem('broken', 'not-json');

    const { result } = renderHook(() => useLocalStorage('broken', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });
});
