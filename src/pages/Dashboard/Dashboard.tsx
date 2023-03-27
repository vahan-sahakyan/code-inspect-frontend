import { AxiosError, AxiosResponse } from 'axios';
import React, { CSSProperties, useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import ApiService from '../../services/apiService';
import instance from '../../services/axios';
import useLocalState from '../../utils/useLocalStorage';
import './Dashboard.scss';

export type Assignment = {
  branch?: string;
  codeReviewVideoUrl?: string;
  githubUrl?: string;
  name?: string;
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
    <>
      <div className='text-center'>
        <Button
          size='lg'
          variant='secondary'
          className='text-6'
          style={{ margin: '1rem' }}
          onClick={() => createAssignment()}
        >
          Submit New Assignment
        </Button>
      </div>
      <div
        //
        className='dashboard d-grid gap-4 m-5 justify-content-around align-content-center'
        style={{ gridTemplateColumns: 'repeat(auto-fill, 18rem)' }}
      >
        {assignments &&
          assignments.map(item => (
            <div key={item.id}>
              <Card style={{ width: '18rem', minHeight: '15rem' }}>
                <Card.Body className='d-flex flex-column justify-content-around'>
                  <Card.Title>Assignment #{item.id}</Card.Title>
                  <Card.Subtitle className='mb-2 text-muted'>{item.status}</Card.Subtitle>
                  <Card.Text>
                    <p>
                      <strong>GitHub URL:</strong>
                      {item.githubUrl}
                    </p>
                    <p>
                      <strong>Branch:</strong>
                      {item.branch}
                    </p>
                  </Card.Text>
                  <Button variant='secondary' onClick={() => navigate(`/assignments/${item.id}`)}>
                    Edit
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
      </div>
    </>
  );
};

export default Dashboard;
