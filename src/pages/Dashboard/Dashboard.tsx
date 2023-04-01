import './Dashboard.scss';

import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import ApiService from '../../services/apiService';

export type Assignment = {
  id: number;
  number?: number;
  status: string;
  githubUrl?: string;
  branch?: string;
  codeReviewVideoUrl?: string;
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
          style={{ margin: '2rem' }}
          onClick={() => createAssignment()}
        >
          Submit New Assignment
        </Button>
      </div>
      <div
        //
        className='dashboard d-grid gap-4 m-5 mt-0 justify-content-around align-content-center'
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
                    <span style={{ display: 'block' }}>
                      <strong>GitHubURL:&nbsp;</strong>
                      {item.githubUrl || ' --'}
                    </span>
                    <span style={{ display: 'block' }}>
                      <strong>Branch:&nbsp;</strong>
                      {item.branch || ' --'}
                    </span>
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
