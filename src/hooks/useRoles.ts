import jwtDecode from 'jwt-decode';
import { useEffect, useMemo, useState } from 'react';

import { DecodedJwt, Role } from '../App';
import useLocalState from './useLocalStorage';
const useRoles = () => {
  const [jwt] = useLocalState('', 'jwt');
  const [roles, setRoles] = useState<Role[]>();

  useEffect(() => {
    if (!jwt) return setRoles([]);
    setRoles((jwtDecode(jwt) as DecodedJwt).authorities);
  }, [jwt]);

  const isCodeReviewer = useMemo(() => roles?.includes('ROLE_CODE_REVIEWER'), [roles]);
  return { isCodeReviewer };
};

export default useRoles;
