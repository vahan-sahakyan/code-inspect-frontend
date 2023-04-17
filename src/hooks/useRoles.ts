import jwtDecode from 'jwt-decode';
import { useEffect, useMemo, useState } from 'react';

import { TDecodedJwt, TRole } from '../App';
import useLocalState from './useLocalStorage';
const useRoles = () => {
  const [jwt] = useLocalState('', 'jwt');
  const [roles, setRoles] = useState<TRole[]>();

  useEffect(() => {
    if (!jwt) return setRoles([]);
    setRoles((jwtDecode(jwt) as TDecodedJwt).authorities);
  }, [jwt]);

  const isCodeReviewer = useMemo(() => roles?.includes('ROLE_CODE_REVIEWER'), [roles]);
  return { isCodeReviewer };
};

export default useRoles;
