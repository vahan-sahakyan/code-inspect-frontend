import './Dashboard.scss';

import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { socket } from '../../App';
import { AssignmentRecord } from '../../components';
import { useMount, useUser } from '../../hooks';
import useUnMount from '../../hooks/useUnMount';
import { ApiService } from '../../services';
import { TAssignmentStatusValues } from '../../services/apiService';
import { TKafkaTopic } from '../../shared/types';
import { TUser } from '../Login/Login';
import { styles } from './Dashboard.styles';

export type TAssignment = {
  id: number;
  number?: number;
  status: TAssignmentStatusValues;
  githubUrl?: string;
  branch?: string;
  codeReviewVideoUrl?: string;
  codeReviewer: TUser;
};
const STATUS_ORDER: Record<TAssignmentStatusValues, number> = {
  'Pending Submission': 1,
  'Needs Update': 2,
  'In Review': 3,
  Resubmitted: 4,
  Submitted: 5,
  Completed: 6,
};
const Dashboard = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<TAssignment[]>();
  useEffect(() => {
    fetchAssignments();
  }, []);
  async function fetchAssignments() {
    const res = await ApiService.getAssignments();
    res.reverse();
    setAssignments(res);
  }

  async function createAssignment() {
    try {
      const assignment = await ApiService.createAssignment();
      navigate(`/assignments/${assignment.id}`);
    } catch (error) {
      console.error('🔴', (error as AxiosError).message);
    }
  }

  function handleLogout() {
    navigate('/login');
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loginResponse');
  }

  function handleGoBack() {
    navigate('/');
  }
  const { displayName } = useUser();

  const dashboardMessageHandler = (event: { data: string }) => {
    const { value } = JSON.parse(event.data) as TKafkaTopic;
    if (value.includes('CREATE ASSIGNMENT') || value.includes('UPDATE ASSIGNMENT')) fetchAssignments();
  };
  useMount(() => {
    socket.addEventListener('message', dashboardMessageHandler);
  });
  useUnMount(() => {
    socket.removeEventListener('message', dashboardMessageHandler);
  });
  return (
    <div className='dashboard'>
      <header className='mx-5 d-flex align-items-center justify-content-between'>
        <div className='d-flex align-items-center gap-3'>
          <div style={styles.goBack}>
            <Button variant='link' onClick={handleGoBack} className='text-black text-decoration-underline'>
              ◂ Go Back
            </Button>
          </div>
          <Button
            size='lg'
            variant='dark'
            className='rounded-0'
            style={styles.btnCreateAssignment}
            onClick={() => createAssignment()}
          >
            Submit New Assignment
          </Button>
        </div>

        <Container role='cell' className='text-muted w-auto d-flex gap-4 m-0'>
          <p style={{ whiteSpace: 'nowrap' }} className='text-muted'>
            Hi {displayName} 👋
          </p>
          <Container role='button' onClick={handleLogout} className='text-black text-decoration-underline'>
            Logout
          </Container>
        </Container>
      </header>
      <h2 className='w-75 m-auto m-5 my-0 text-center '>Student&apos;s Dashboard</h2>
      <div className='assignment-wrapper needs-update  mt-5 px-2 w-75 m-auto rounded-0'>
        <div className='h5 text-black px-3 bg-white' style={styles.wrapperTitle}>
          My Work
        </div>
        <div className='d-grid gap-4 m-4  justify-content-center align-content-center' style={styles.assignmentsGrid}>
          {assignments &&
            assignments
              .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
              .map(item => <AssignmentRecord key={item.id} assignment={item} />)}
        </div>
      </div>
      <div style={{ height: '10rem' }} />
    </div>
  );
};

export default Dashboard;
