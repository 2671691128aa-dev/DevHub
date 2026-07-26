import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoriteStore } from './useFavoriteStore';

describe('useFavoriteStore', () => {
  beforeEach(() => {
    useFavoriteStore.setState({ favoriteIds: [] });
  });

  it('初始状态应没有收藏', () => {
    expect(useFavoriteStore.getState().favoriteIds).toEqual([]);
  });

  it('toggleFavorite 应添加收藏', () => {
    useFavoriteStore.getState().toggleFavorite('tool-a');
    expect(useFavoriteStore.getState().favoriteIds).toContain('tool-a');
  });

  it('toggleFavorite 再次调用应移除收藏', () => {
    useFavoriteStore.getState().toggleFavorite('tool-a');
    expect(useFavoriteStore.getState().favoriteIds).toContain('tool-a');

    useFavoriteStore.getState().toggleFavorite('tool-a');
    expect(useFavoriteStore.getState().favoriteIds).not.toContain('tool-a');
  });

  it('isFavorite 应正确返回收藏状态', () => {
    expect(useFavoriteStore.getState().isFavorite('tool-a')).toBe(false);

    useFavoriteStore.getState().toggleFavorite('tool-a');
    expect(useFavoriteStore.getState().isFavorite('tool-a')).toBe(true);
  });

  it('可以收藏多个工具', () => {
    useFavoriteStore.getState().toggleFavorite('tool-a');
    useFavoriteStore.getState().toggleFavorite('tool-b');
    useFavoriteStore.getState().toggleFavorite('tool-c');

    const ids = useFavoriteStore.getState().favoriteIds;
    expect(ids).toEqual(['tool-a', 'tool-b', 'tool-c']);
  });

  it('clearFavorites 应清空所有收藏', () => {
    useFavoriteStore.getState().toggleFavorite('tool-a');
    useFavoriteStore.getState().toggleFavorite('tool-b');
    useFavoriteStore.getState().clearFavorites();

    expect(useFavoriteStore.getState().favoriteIds).toEqual([]);
  });
});
