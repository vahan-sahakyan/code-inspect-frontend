import './App.scss';

import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { AssignmentView, CodeReviewAssignmentView, CodeReviewerDashboard, Dashboard, Homepage, Login } from './pages';
import { selectIsCodeReviewer } from './redux/selectors';
import { PrivateRoute } from './wrappers';

/////////////////////////////////////////////////////////
const VITE_WS_URL =
  (import.meta.env.VITE_WS_URL && `ws://${import.meta.env.VITE_WS_URL}`) || `ws://${location.hostname}`;
const VITE_WS_PORT = import.meta.env.VITE_WS_PORT || '7078';

const wsUrl = `${VITE_WS_URL}:${VITE_WS_PORT}`;
console.log('wsUrl', wsUrl);
console.log({ VITE_WS_URL, VITE_WS_PORT });

export const socket = new WebSocket(wsUrl);

export default function () {
  const isCodeReviewer = useSelector(selectIsCodeReviewer);

  return (
    <Routes>
      <Route
        path='/dashboard'
        element={<PrivateRoute component={isCodeReviewer ? <CodeReviewerDashboard /> : <Dashboard />} />}
      />
      <Route
        path='/assignments/:assignmentId'
        element={<PrivateRoute component={isCodeReviewer ? <CodeReviewAssignmentView /> : <AssignmentView />} />}
      />
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<Homepage />} />
    </Routes>
  );
}
