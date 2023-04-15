import './App.scss';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import useRoles from './hooks/useRoles';
import { AssignmentView, Dashboard, Homepage, Login } from './pages';
import CodeReviewAssignmentView from './pages/CodeReviewAssignmentView';
import CodeReviewerDashboard from './pages/CodeReviewerDashboard';
import { PrivateRoute } from './wrappers';

const roles = ['ROLE_STUDENT', 'ROLE_CODE_REVIEWER'] as const;
export type Role = (typeof roles)[number];

export type DecodedJwt = {
  exp: number;
  iat: number;
  sub: string;
  authorities: Array<Role>;
};

const App: React.FC = () => {
  const { isCodeReviewer } = useRoles();

  return (
    <Routes>
      <Route
        path='/dashboard'
        element={
          isCodeReviewer ? (
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
          isCodeReviewer ? (
            <PrivateRoute>
              <CodeReviewAssignmentView />
            </PrivateRoute>
          ) : (
            <PrivateRoute>
              <AssignmentView />
            </PrivateRoute>
          )
        }
      />

      <Route path='/login' element={<Login />} />
      <Route path='/' element={<Homepage />} />
    </Routes>
  );
};

export default App;
