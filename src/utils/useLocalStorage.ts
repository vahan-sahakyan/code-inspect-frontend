import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export default function useLocalState<S>(defaultValue: S, key: string): [S, Dispatch<SetStateAction<S>>] {
  const [value, setValue] = useState<S>(() => {
    const localStorageValue = localStorage.getItem(key);
    return localStorageValue !== null ? (JSON.parse(localStorageValue) as S) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
