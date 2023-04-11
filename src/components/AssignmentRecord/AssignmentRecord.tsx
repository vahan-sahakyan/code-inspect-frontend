import { Badge, Button, Card } from 'react-bootstrap';

import { Assignment } from '../../pages/Dashboard/Dashboard';

type AssignmentRecordProps<T> = {
  assignment: T;
  claimAssignment: (assignment: T) => Promise<void>;
};
export default function AssignmentRecord({ assignment, claimAssignment }: AssignmentRecordProps<Assignment>) {
  return (
    <div key={assignment.id}>
      <Card className='rounded-0' style={{ width: '18rem', minHeight: '15rem' }}>
        <Card.Body className='d-flex flex-column justify-content-around '>
          <Card.Title>Assignment #{assignment.number}</Card.Title>
          <Badge bg='info' className='rounded-0 mb-2 align-self-start'>
            {assignment.status}
          </Badge>
          <Card.Text>
            <span style={{ display: 'block' }}>
              <strong>GitHubURL:&nbsp;</strong>
              {assignment.githubUrl || ' --'}
            </span>
            <span style={{ display: 'block' }}>
              <strong>Branch:&nbsp;</strong>
              {assignment.branch || ' --'}
            </span>
          </Card.Text>
          <Button variant='secondary' className='rounded-0' onClick={() => claimAssignment(assignment)}>
            Claim
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
