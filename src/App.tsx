import './App.scss';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { PrivateRoute } from './hoc';
import { AssignmentView, Dashboard, Homepage, Login } from './pages';

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path='/dashboard'
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
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
