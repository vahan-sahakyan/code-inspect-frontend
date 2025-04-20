import './AssignmentRecord.scss';

import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useRoles } from '../../hooks';
import { TAssignment } from '../../pages/Dashboard/Dashboard';
import { TAssignmentStatusValues } from '../../services/apiService';
import StatusBadge from '../StatusBadge/StatusBadge';

type TAssignmentRecordProps<T> = {
  assignment: T;
  // eslint-disable-next-line no-unused-vars
  claimAssignment?: (assignment: T) => Promise<void>;
};
export default function AssignmentRecord({ assignment, claimAssignment }: TAssignmentRecordProps<TAssignment>) {
  const navigate = useNavigate();
  const { isCodeReviewer } = useRoles();
  return (
    <div key={assignment.id} className='assignment-record'>
      <Card className='rounded-0' style={{ width: '18rem', minHeight: '15rem', border: '2px solid black' }}>
        <Card.Body className='d-flex flex-column justify-content-around '>
          <Card.Title>Assignment #{assignment.number}</Card.Title>
          <StatusBadge text={assignment.status} className='rounded-0 align-self-start' />
          <Card.Text>
            <span style={{ display: 'block' }}>
              <strong>GitHubURL:&nbsp;</strong>
              {assignment.githubUrl || <AssignmentRecord.EmptyBadge />}
            </span>
            <span style={{ display: 'block' }}>
              <strong>Branch:&nbsp;</strong>
              {assignment.branch || <AssignmentRecord.EmptyBadge />}
            </span>
          </Card.Text>
          {isCodeReviewer ? (
            <Button
              variant='dark'
              className='rounded-0'
              onClick={() => {
                if (assignment.status === 'In Review') {
                  navigate(`/assignments/${assignment.id}`);
                } else {
                  claimAssignment?.(assignment);
                }
              }}
            >
              {(['In Review'] as TAssignmentStatusValues[]).includes(assignment.status) ? 'Edit' : 'Claim'}
            </Button>
          ) : (
            <Button
              variant='dark'
              className='rounded-0'
              onClick={() => {
                navigate(`/assignments/${assignment.id}`);
              }}
            >
              {(['Completed'] as TAssignmentStatusValues[]).includes(assignment.status) ? 'View Code Review' : 'Edit'}
            </Button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

AssignmentRecord.EmptyBadge = function EmptyBadge() {
  return <em className='empty-badge'>Empty</em>;
};
