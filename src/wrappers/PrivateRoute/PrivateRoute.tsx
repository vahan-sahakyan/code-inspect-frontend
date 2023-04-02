import { useCallback, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useLocalState } from '../../hooks';
import { instance } from '../../services';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const [jwt, setJwt] = useLocalState<string>('', 'jwt');
  const isValid = useRef(false);
  const navigate = useNavigate();

  if (!jwt) navigate('/login');

  const validate = useCallback(
    async function () {
      try {
        const { data } = await instance.get(`/api/auth/validate?token=${jwt}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        isValid.current = data;
        if (!data) setJwt('');
      } catch (error) {
        setJwt('');
        console.clear();
      } finally {
        if (!jwt) navigate('/login');
      }
    },
    [jwt, navigate, setJwt]
  );

  useEffect(() => {
    validate();
  }, [validate]);

  return isValid ? children : <Navigate to='/login' />;
};
export default PrivateRoute;
