import { useEffect, useRef } from 'react';

export default function useInterval(cb: () => void, delay?: number) {
  const savedCallback = useRef(cb);
  useEffect(() => {
    if (delay !== undefined) {
      const id: NodeJS.Timeout = setInterval(savedCallback.current, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
