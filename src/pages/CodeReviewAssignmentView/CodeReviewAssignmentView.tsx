import './CodeReviewAssignmentView.scss';

import { ChangeEvent } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import { ReactComponent as CopySVG } from '../../../public/copy.svg';
import { StatusBadge } from '../../components';
import { CommentContainer } from '../../containers';
import { useAssignment } from '../../hooks';
import { styled } from '../CodeReviewerDashboard/CodeReviewerDashboard.styles';

const CodeReviewAssignmentView = () => {
  const { assignment, selectedAssignment, save, updateAssignment, navigate } = useAssignment();

  return (
    <Container className='my-5 code-review-assignment-view'>
      <header className='d-flex flex-row justify-content-start gap-4 align-items-center flex-wrap '>
        {selectedAssignment || (assignment?.number && <h2>Assignment #{selectedAssignment || assignment?.number}</h2>)}
        <StatusBadge className='rounded-0' text={assignment?.status?.toUpperCase()} style={{ fontSize: '1rem' }} />
      </header>

      <div>
        <Form.Group as={Row} className='my-3 d-flex align-items-center' controlId='formPlaintextGitHubUrl'>
          <Form.Label column sm='3' md='2'>
            GitHub&nbsp;URL:
          </Form.Label>
          <Col sm='9' md='8' lg='6'>
            <a target={'_blank'} href={assignment?.githubUrl} rel='noreferrer'>
              {assignment?.githubUrl}
            </a>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='my-3 d-flex align-items-center' controlId='formPlaintextBranch'>
          <Form.Label column sm='3' md='2'>
            Branch:
          </Form.Label>
          <Col sm='9' md='8' lg='6'>
            {assignment?.branch}
            <CopySVG
              className={styled.copy}
              onClick={() => navigator.clipboard.writeText(assignment?.branch as string)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='my-3 d-flex align-items-center' controlId='formPlaintextBran'>
          <Form.Label column sm='3' md='2'>
            Review Video URL:
          </Form.Label>
          <Col sm='9' md='8' lg='6'>
            <Form.Control
              type='text'
              value={assignment?.codeReviewVideoUrl ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateAssignment('codeReviewVideoUrl', e.target.value)}
              placeholder='https://www.youtube.com/your-review'
              className='rounded-0'
            />
          </Col>
        </Form.Group>
        <Col sm='12' md='10' lg='8' className='pe-lg-2 pe-md-1 pe-sm-0'>
          <Container className='m-0 p-0 d-flex justify-content-end'>
            <Button variant='outline-dark' className='px-3 me-3 rounded-0' onClick={() => navigate('/dashboard')}>
              Go Back
            </Button>
            {assignment?.status === 'Needs Update' ? (
              <Button variant='dark' className='px-4 me-3 rounded-0' onClick={() => save('In Review')}>
                Re-Claim
              </Button>
            ) : (
              <Button variant='danger' className='px-4 me-3 rounded-0' onClick={() => save('Needs Update')}>
                Reject Assignment
              </Button>
            )}

            {assignment?.status === 'Completed' ? (
              <Button variant='dark' className='px-4 rounded-0' onClick={() => save('In Review')}>
                Re-Claim
              </Button>
            ) : (
              <Button variant='success' className='px-4 rounded-0' onClick={() => save('Completed')}>
                Complete Review
              </Button>
            )}
          </Container>
        </Col>
      </div>
      <CommentContainer />
    </Container>
  );
};

export default CodeReviewAssignmentView;
