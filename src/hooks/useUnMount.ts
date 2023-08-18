import { useEffect } from 'react';

// eslint-disable-next-line react-hooks/exhaustive-deps
const useUnMount = (effect: () => void) => useEffect(() => effect, []);

export default useUnMount;
