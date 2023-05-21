import { useEffect } from 'react';

export default function useMount(effect: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}
