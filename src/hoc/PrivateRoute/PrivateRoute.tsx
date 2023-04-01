import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import instance from '../../services/axios';
import useLocalState from '../../utils/useLocalStorage';

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const [jwt, setJwt] = useLocalState<string>('', 'jwt');
  const isValid = useRef(false);
  const navigate = useNavigate();

  if (!jwt) navigate('/login');

  async function validate() {
    try {
      const { data } = await instance.get(`/api/auth/validate?token=${jwt}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      isValid.current = data;
      if (!data) setJwt('');
    } catch (error) {
      setJwt('');
    } finally {
      if (!jwt) navigate('/login');
    }
  }

  useEffect(() => {
    validate();
  }, []);

  return isValid ? children : <Navigate to='/login' />;
};
