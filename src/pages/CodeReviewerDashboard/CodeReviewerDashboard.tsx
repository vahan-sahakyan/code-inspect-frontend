import './CodeReviewerDashboard.scss';

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

const CodeReviewerDashboard = () => {
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
    <div className='code-reviewer-dashboard '>
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
              margin: '2rem 0',
            }}
          >
            <Link to={'/'}>
              <h2>🔙</h2>
            </Link>
          </div>
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
      <h2 className='w-75 m-auto m-5 my-0'>Code Reviewer Dashboard</h2>
      {/* <div className='assignment-wrapper in-review'></div> */}
      <div className='assignment-wrapper submitted mt-5 px-2 w-75 m-auto rounded-0'>
        <div className='h5 text-muted px-3 bg-white' style={{ marginTop: '-.8rem', width: 'max-content' }}>
          Awaiting Review
        </div>
        <div
          //
          className='d-grid gap-4 p-4 justify-content-center align-content-center'
          style={{ gridTemplateColumns: 'repeat(auto-fill, 18rem)' }}
        >
          {assignments &&
            assignments.map(item => (
              <div key={item.id}>
                <Card className='rounded-0' style={{ width: '18rem', minHeight: '15rem' }}>
                  <Card.Body className='d-flex flex-column justify-content-around '>
                    <Card.Title>Assignment #{item.number}</Card.Title>
                    <Badge bg='info' className='rounded-0 mb-2 align-self-start'>
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
                    <Button
                      variant='secondary'
                      className='rounded-0'
                      onClick={() => navigate(`/assignments/${item.id}`)}
                    >
                      Edit
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
        </div>
      </div>
      {/* <div className='assignment-wrapper needs-update'></div> */}
    </div>
  );
};

export default CodeReviewerDashboard;
