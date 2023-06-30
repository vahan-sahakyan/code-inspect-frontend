import './App.scss';

import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { AssignmentView, CodeReviewAssignmentView, CodeReviewerDashboard, Dashboard, Homepage, Login } from './pages';
import { selectIsCodeReviewer } from './redux/selectors';
import { PrivateRoute } from './wrappers';

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
