import './AssignmentView.scss';

import { ChangeEvent } from 'react';
import { Button, ButtonGroup, Col, Container, DropdownButton, Form, Row } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';

import { Comment } from '../../components';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { useAssignment } from '../../hooks';
import { styled } from './AssignmentView.styles';

const AssignmentView = () => {
  const {
    comment,
    setComment,
    comments,
    assignment,
    assignmentEnum,
    selectedAssignment,
    setSelectedAssignment,
    editingComment,
    isAssignmentCompleted,
    updateAssignment,
    handleSubmitComment,
    handleDeleteComment,
    handleEditComment,
    textareaRef,
    navigate,
    save,
  } = useAssignment();

  return (
    <Container className='my-5 assignment-view'>
      <header className='d-flex flex-row justify-content-start gap-4 align-items-center flex-wrap '>
        {selectedAssignment || (assignment?.number && <h2>Assignment #{selectedAssignment || assignment?.number}</h2>)}
        <StatusBadge className='rounded-0' text={assignment?.status?.toUpperCase()} style={{ fontSize: '1rem' }} />
      </header>

      <Form.Group as={Row} className='my-3' controlId='formPlaintextEmail'>
        <Form.Label column sm='3' md='2'>
          Assignment Number:
        </Form.Label>
        <Col sm='9' md='8' lg='6'>
          <DropdownButton
            variant={isAssignmentCompleted ? 'outline-secondary' : 'dark'}
            as={ButtonGroup}
            title={
              selectedAssignment || assignment?.number
                ? `Assignment #${selectedAssignment || assignment?.number}`
                : 'Select an Assignment'
            }
            onSelect={(eventKey: string | null) => {
              if (!eventKey) return;
              setSelectedAssignment(eventKey);
              updateAssignment('number', eventKey);
            }}
            className={`rounded-0 ${isAssignmentCompleted ? 'bg-secondary bg-opacity-25' : ''}`}
            disabled={isAssignmentCompleted}
          >
            {assignmentEnum?.map(({ assignmentName, assignmentNum }) => (
              <DropdownItem
                key={assignmentNum}
                eventKey={assignmentNum}
                active={
                  selectedAssignment ? assignmentNum === +selectedAssignment : assignmentNum === assignment?.number
                }
                className={styled.dropdownItem}
              >
                {assignmentName}
              </DropdownItem>
            ))}
          </DropdownButton>
        </Col>
      </Form.Group>
      <div>
        <Form.Group as={Row} className='my-3' controlId='formPlaintextGitHubUrl'>
          <Form.Label column sm='3' md='2'>
            GitHub&nbsp;URL:
          </Form.Label>
          <Col sm='9' md='8' lg='6'>
            <Form.Control
              type='url'
              value={assignment?.githubUrl ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateAssignment('githubUrl', e.target.value)}
              placeholder='https://github.com/username/repo-name'
              className='rounded-0'
              disabled={isAssignmentCompleted}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='my-3' controlId='formPlaintextBranch'>
          <Form.Label column sm='3' md='2'>
            Branch:
          </Form.Label>
          <Col sm='9' md='8' lg='6'>
            <Form.Control
              type='text'
              value={assignment?.branch ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateAssignment('branch', e.target.value)}
              placeholder='example-branch-name'
              className='rounded-0'
              disabled={isAssignmentCompleted}
            />
          </Col>
        </Form.Group>
        {isAssignmentCompleted ? (
          <>
            <Form.Group as={Row} className='my-3 d-flex align-items-center' controlId='formPlaintextBranch'>
              <Form.Label column sm='3' md='2'>
                Review Video Url:
              </Form.Label>
              <Col sm='9' md='8' lg='6'>
                <a target={'_blank'} href={assignment?.codeReviewVideoUrl} rel='noreferrer'>
                  {assignment?.codeReviewVideoUrl}
                </a>
              </Col>
            </Form.Group>
            <Col sm='12' md='10' lg='8' className='pe-lg-2 pe-md-1 pe-sm-0'>
              <Container className='m-0 p-0 d-flex justify-content-end'>
                <Button variant='outline-dark' className='px-3  rounded-0' onClick={() => navigate('/dashboard')}>
                  Go Back
                </Button>
              </Container>
            </Col>
          </>
        ) : (
          <Col sm='12' md='10' lg='8' className='pe-lg-2 pe-md-1 pe-sm-0'>
            <Container className='m-0 p-0 d-flex justify-content-end'>
              <Button variant='outline-dark' className='px-3 me-3 rounded-0' onClick={() => navigate('/dashboard')}>
                Go Back
              </Button>

              {assignment?.status === 'Pending Submission' ? (
                <Button variant='dark' className='px-4 rounded-0' onClick={() => save('Submitted')}>
                  Submit Assignment
                </Button>
              ) : (
                <Button variant='dark' className='px-4 rounded-0' onClick={() => save('Resubmitted')}>
                  Resubmit Assignment
                </Button>
              )}
            </Container>
          </Col>
        )}
      </div>
      <Col sm='12' md='10' lg='8' className='pe-lg-2 pe-md-1 pe-sm-0 mt-5'>
        <textarea
          ref={textareaRef}
          className={styled.textArea}
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <div className='d-flex justify-content-end'>
          <Button variant='dark' onClick={() => handleSubmitComment(editingComment)}>
            {!editingComment ? 'Post Comment' : 'Update Comment'}
          </Button>
        </div>
        <div className='comments-container mt-4'>
          {comments.map(comment => (
            <Comment
              deleteComment={handleDeleteComment}
              editComment={handleEditComment}
              comment={comment}
              key={comment.id}
            />
          ))}
        </div>
      </Col>
    </Container>
  );
};

export default AssignmentView;
