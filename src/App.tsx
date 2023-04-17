import './App.scss';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { AssignmentView, Dashboard, Homepage, Login } from './pages';
import CodeReviewAssignmentView from './pages/CodeReviewAssignmentView';
import CodeReviewerDashboard from './pages/CodeReviewerDashboard';
import { selectIsCodeReviewer } from './redux/selectors';
import { PrivateRoute } from './wrappers';

const roles = ['ROLE_STUDENT', 'ROLE_CODE_REVIEWER'] as const;
export type TRole = (typeof roles)[number];

export type TDecodedJwt = {
  exp: number;
  iat: number;
  sub: string;
  authorities: Array<TRole>;
};

const App: React.FC = () => {
  const isCodeReviewer = useSelector(selectIsCodeReviewer);

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
