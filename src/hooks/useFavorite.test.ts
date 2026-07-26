import { renderHook, act } from '@testing-library/react';
import { useFavorite } from './useFavorite';
import { useFavoriteStore } from '@/store/useFavoriteStore';

describe('useFavorite', () => {
  beforeEach(() => {
    // Reset the store between tests
    useFavoriteStore.setState({ favoriteIds: [] });
  });

  it('returns isFavorite=false for a new tool', () => {
    const { result } = renderHook(() => useFavorite('tool-1'));
    expect(result.current.isFavorite).toBe(false);
  });

  it('toggle adds and removes a favorite', () => {
    const { result } = renderHook(() => useFavorite('tool-1'));

    act(() => result.current.toggle());
    expect(result.current.isFavorite).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isFavorite).toBe(false);
  });

  it('add only adds if not already favorited', () => {
    const { result } = renderHook(() => useFavorite('tool-1'));

    act(() => result.current.add());
    expect(result.current.isFavorite).toBe(true);

    // Calling add again should be a no-op (still favorited)
    act(() => result.current.add());
    expect(result.current.isFavorite).toBe(true);
  });

  it('remove only removes if currently favorited', () => {
    const { result } = renderHook(() => useFavorite('tool-1'));

    // Remove when not favorited — no-op
    act(() => result.current.remove());
    expect(result.current.isFavorite).toBe(false);

    act(() => result.current.add());
    act(() => result.current.remove());
    expect(result.current.isFavorite).toBe(false);
  });

  it('tracks different tool IDs independently', () => {
    const { result: r1 } = renderHook(() => useFavorite('tool-1'));
    const { result: r2 } = renderHook(() => useFavorite('tool-2'));

    act(() => r1.current.toggle());
    expect(r1.current.isFavorite).toBe(true);
    expect(r2.current.isFavorite).toBe(false);
  });
});
