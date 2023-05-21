import { useRef } from 'react';

export default function useRefState<T>(initial: T) {
  const ref = useRef(initial);

  const getRefValue = () => ref.current;

  const setRefValue = (arg: T | ((prev: T) => T)) => {
    if (arg instanceof Function) ref.current = arg(ref.current);
    else ref.current = arg;
  };
  return [getRefValue, setRefValue] as const;
}
