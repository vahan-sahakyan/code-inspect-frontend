import { AxiosError, AxiosResponse } from 'axios';
import React, { CSSProperties, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../../services/apiService';
import instance from '../../services/axios';
import useLocalState from '../../utils/useLocalStorage';
import './Dashboard.scss';

export type Assignment = {
  branch?: string;
  codeReviewVideoUrl?: string;
  githubUrl?: string;
  id: number;
  status: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [jwt, setJwt] = useLocalState<string>('', 'jwt');
  const [assignments, setAssignments] = useState<Assignment[]>();
  useEffect(() => {
    fetchAssignments();
  }, []);
  async function fetchAssignments() {
    const res = await ApiService.getAssignments();

    setAssignments(res.reverse());
  }

  async function createAssignment() {
    try {
      const assignment = await ApiService.createAssignment();
      console.log(assignment);
      navigate(`/assignments/${assignment.id}`);
    } catch (error) {
      console.error('🔴', (error as AxiosError).message);
    }
  }

  return (
    <div className='dashboard d-grid'>
      <Button variant='secondary' style={{ margin: '1rem' }} onClick={() => createAssignment()}>
        Submit New Assignment
      </Button>

      {assignments &&
        assignments.map(item => (
          <div className='assignment-row' key={item.id}>
            <Link to={`/assignments/${item.id}`}>
              <p>Assignment ID: {item.id}</p>
              <span>
                <pre>Status: {item.status}</pre>
              </span>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Dashboard;
