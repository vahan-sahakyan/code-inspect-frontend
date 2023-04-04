import './Dashboard.scss';

import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { ApiService } from '../../services';
import { AssignmentStatusValues } from '../../services/apiService';

export type Assignment = {
  id: number;
  number?: number;
  status: AssignmentStatusValues;
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
      <header className='mx-5 d-flex align-items-center justify-content-between'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <div
            style={{
              //
              fontSize: 16,
              display: 'block',
              cursor: 'pointer',
            }}
          >
            <Link to={'/'}>
              <h2>🔙</h2>
            </Link>
          </div>
          <Button
            size='lg'
            variant='secondary'
            style={{
              //
              fontSize: 16,
              margin: '2rem 0',
              display: 'block',
            }}
            onClick={() => createAssignment()}
          >
            Submit New Assignment
          </Button>
        </div>
        <Button
          variant='link'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            navigate('/login');
            localStorage.clear();
          }}
          className='text-muted'
        >
          Logout
        </Button>
      </header>
      <div
        //
        className='dashboard d-grid gap-4 m-5 mt-0 justify-content-start align-content-center'
        style={{ gridTemplateColumns: 'repeat(auto-fill, 18rem)' }}
      >
        {assignments &&
          assignments.map(item => (
            <div key={item.id}>
              <Card style={{ width: '18rem', minHeight: '15rem' }}>
                <Card.Body className='d-flex flex-column justify-content-around'>
                  <Card.Title>Assignment #{item.number}</Card.Title>
                  <Badge pill bg='info' className='mb-2 align-self-start'>
                    {item.status}
                  </Badge>
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
