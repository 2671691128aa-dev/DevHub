import { useState, useCallback } from 'react';
import { localStore } from '@/lib/storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => localStore.get(key, initialValue));

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        localStore.set(key, next);
        return next;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
