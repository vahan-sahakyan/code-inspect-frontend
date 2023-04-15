import './Dashboard.scss';

import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { AssignmentRecord } from '../../components';
import { ApiService } from '../../services';
import { AssignmentStatusValues } from '../../services/apiService';
import { User } from '../Login/Login';
import { styles } from './Dashboard.styles';

export type Assignment = {
  id: number;
  number?: number;
  status: AssignmentStatusValues;
  githubUrl?: string;
  branch?: string;
  codeReviewVideoUrl?: string;
  codeReviewer: User;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>();
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
    localStorage.clear();
  }

  function handleGoBack() {
    navigate('/');
  }

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

        <Button
          variant='link'
          style={{ cursor: 'pointer' }}
          onClick={handleLogout}
          className='text-black text-decoration-underline'
        >
          Logout
        </Button>
      </header>
      <h2 className='w-75 m-auto m-5 my-0'>Student Dashboard</h2>
      <div className='assignment-wrapper needs-update  mt-5 px-2 w-75 m-auto rounded-0'>
        <div className='h5 text-black px-3 bg-white' style={styles.wrapperTitle}>
          My Board
        </div>
        <div className='d-grid gap-4 m-4  justify-content-center align-content-center' style={styles.assignmentsGrid}>
          {assignments && assignments.map(item => <AssignmentRecord key={item.id} assignment={item} />)}
        </div>
      </div>
      <div style={{ height: '10rem' }} />
    </div>
  );
};

export default Dashboard;
