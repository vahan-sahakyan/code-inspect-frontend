import './App.scss';

import jwtDecode from 'jwt-decode';
import React, { useCallback, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { useLocalState } from './hooks';
import { AssignmentView, Dashboard, Homepage, Login } from './pages';
import CodeReviewerDashboard from './pages/CodeReviewerDashboard';
import { PrivateRoute } from './wrappers';

const roles = ['ROLE_STUDENT', 'ROLE_CODE_REVIEWER'] as const;
type Role = (typeof roles)[number];
type DecodedJwt = { exp: number; iat: number; sub: string; authorities: Array<Role> };

const App: React.FC = () => {
  // const [jwt] = useLocalState('', 'jwt');

  // const getRoleFromJwt = useCallback(
  //   function () {
  //     if (!jwt) return [];
  //     const decodedJwt: DecodedJwt = jwtDecode(jwt);
  //     return decodedJwt.authorities;
  //   },
  //   [jwt]
  // );

  // const [roles, setRoles] = useState<Role[]>(getRoleFromJwt());

  // useEffect(() => {
  //   setRoles(getRoleFromJwt());
  //   console.log(roles);
  // }, [getRoleFromJwt, jwt]);
  const [jwt] = useLocalState('', 'jwt');

  const [roles, setRoles] = useState<Role[]>();

  useEffect(() => {
    if (!jwt) return setRoles([]);
    setRoles((jwtDecode(jwt) as DecodedJwt).authorities);
    console.log(roles);
  }, [jwt]);

  return (
    <Routes>
      <Route
        path='/dashboard'
        element={
          roles?.includes('ROLE_CODE_REVIEWER') ? (
            <PrivateRoute>
              <CodeReviewerDashboard />
            </PrivateRoute>
          ) : (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          )
        }
      />
      <Route
        path='/assignments/:assignmentId'
        element={
          <PrivateRoute>
            <AssignmentView />
          </PrivateRoute>
        }
      />

      <Route path='/login' element={<Login />} />
      <Route path='/' element={<Homepage />} />
    </Routes>
  );
};

export default App;
