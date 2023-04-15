import './CodeReviewerDashboard.scss';

import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { DecodedJwt } from '../../App';
import { AssignmentRecord } from '../../components';
import { useLocalState } from '../../hooks';
import { ApiService } from '../../services';
import { Assignment } from '../Dashboard/Dashboard';
import { styles } from './CodeReviewerDashboard.styles';

const CodeReviewerDashboard = () => {
  const navigate = useNavigate();
  const [jwt] = useLocalState<string>('', 'jwt');
  const [assignments, setAssignments] = useState<Assignment[]>();

  async function claimAssignment(assignment: Assignment) {
    const decodedJwt: DecodedJwt = jwtDecode(jwt);
    assignment = {
      ...assignment,
      codeReviewer: {
        username: decodedJwt.sub,
      },
      status: 'In Review',
    };

    const response = await ApiService.claimAssignment(assignment);

    setAssignments(prev => prev?.map(item => (item.id === response.id ? response : item)));
  }

  async function fetchAssignments() {
    const res = await ApiService.getAssignments();
    res.reverse();
    setAssignments(res);
  }

  function handleLogout() {
    navigate('/login');
    localStorage.clear();
  }
  function handleGoBack() {
    navigate('/');
  }

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className='code-reviewer-dashboard '>
      <header className='mx-5 d-flex align-items-center justify-content-between'>
        <div style={styles.goBack}>
          <Button
            variant='link'
            style={{ cursor: 'pointer' }}
            onClick={handleGoBack}
            className='text-black text-decoration-underline'
          >
            ◂ Go Back
          </Button>
        </div>
        <Button
          variant='link'
          style={{ cursor: 'pointer' }}
          onClick={handleLogout}
          className='text-black text-decoration-underline'
        >
          Logout
        </Button>
      </header>
      <h2 className='w-75 m-auto m-5 my-0'>Code Reviewer Dashboard</h2>
      <div className='assignment-wrapper in-review mt-5 px-2 w-75 m-auto rounded-0'>
        <div className='h5 text-black px-3 bg-white' style={styles.wrapperTitle}>
          In Review
        </div>
        <div className='d-grid gap-4 p-4 justify-content-center align-content-center' style={styles.assignmentsGrid}>
          {assignments?.filter(a => a.status === 'In Review').length ? (
            assignments
              .filter(a => a.status === 'In Review')
              .map(item => <AssignmentRecord key={item.id} assignment={item} claimAssignment={claimAssignment} />)
          ) : (
            <div>No Assignments Found</div>
          )}
        </div>
      </div>
      <div className='assignment-wrapper submitted mt-5 px-2 w-75 m-auto rounded-0'>
        <div className='h5 text-black px-3 bg-white' style={styles.wrapperTitle}>
          Awaiting Review
        </div>
        <div className='d-grid gap-4 p-4 justify-content-center align-content-center' style={styles.assignmentsGrid}>
          {assignments?.filter(a => ['Submitted', 'Resubmitted'].includes(a.status)).length ? (
            assignments
              .filter(a => ['Submitted', 'Resubmitted'].includes(a.status))
              .sort((a, b) => (a.status === 'Resubmitted' ? -1 : 1))
              .map(item => <AssignmentRecord key={item.id} assignment={item} claimAssignment={claimAssignment} />)
          ) : (
            <div>No Assignments Found</div>
          )}
        </div>
      </div>
      <div className='assignment-wrapper needs-update  mt-5 px-2 w-75 m-auto rounded-0'>
        <div className='h5 text-black px-3 bg-white' style={styles.wrapperTitle}>
          Needs Update
        </div>
        <div className='d-grid gap-4 p-4 justify-content-center align-content-center' style={styles.assignmentsGrid}>
          {assignments?.filter(a => a.status === 'Needs Update').length ? (
            assignments
              .filter(a => a.status === 'Needs Update')
              .map(item => <AssignmentRecord key={item.id} assignment={item} claimAssignment={claimAssignment} />)
          ) : (
            <div>No Assignments Found</div>
          )}
        </div>
      </div>
      <div style={{ height: '10rem' }} />
    </div>
  );
};

export default CodeReviewerDashboard;
